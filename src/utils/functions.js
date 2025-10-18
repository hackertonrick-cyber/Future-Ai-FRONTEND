import { format } from 'date-fns'
import axios from 'axios'
import { enUS, es } from 'date-fns/locale'

export const translateItems = async (items, title, t) => {
  const translatedList = []

  if (Array.isArray(items)) {
    for (const item of items) {
      if (typeof item === 'string') {
        const translatedItem = {
          id: item,
          translatedTitle: t(item),
        }
        translatedList.push(translatedItem)
      } else if (typeof item === 'object') {
        const translatedItem = {
          ...item,
          translatedTitle: t(item[title] || item.title || ''),
        }
        translatedList.push(translatedItem)
      }
    }
  } else if (typeof items === 'object') {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const translatedItem = {
          id: key,
          translatedTitle: t(items[key]),
        }
        translatedList.push(translatedItem)
      }
    }
  } else if (typeof items === 'string') {
    const translatedItem = {
      id: items,
      translatedTitle: t(items),
    }
    translatedList.push(translatedItem)
  }

  return translatedList
}

export const generateTimestamp = () => {
  return new Date().toISOString()
}

export const generateMongoDBObjectId = () => {
  // Generate a 4-byte timestamp (seconds since the Unix epoch)
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')

  // Generate 5 bytes of random values (machine identifier / random value)
  const randomBytes = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0'),
  ).join('')

  // Generate 3 bytes of a counter (unique value per ObjectId)
  const counter = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')

  return `${timestamp}${randomBytes}${counter}`
}

export const generateRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort()
  return sortedIds.join('')
}

const localeMap = {
  en: enUS,
  es: es,
}

export const formatDate = (date, localeCode = 'en') => {
  const formattedDate = new Date(date)
  const dateFnsLocale = localeMap[localeCode] || enUS

  return format(formattedDate, 'MMMM dd, yyyy h:mm a', {
    locale: dateFnsLocale,
  })
}

export const openCenteredPopup = (url, title = 'Identity Verification', w = 520, h = 760) => {
  const dualLeft = window.screenLeft ?? window.screenX
  const dualTop = window.screenTop ?? window.screenY
  const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width
  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height
  const left = Math.max(0, dualLeft + (width - w) / 2)
  const top = Math.max(0, dualTop + (height - h) / 2)

  const features = [
    'scrollbars=yes',
    'resizable=yes',
    `width=${w}`,
    `height=${h}`,
    `top=${Math.round(top)}`,
    `left=${Math.round(left)}`,
  ].join(',')

  // Important: must be called directly from a user gesture (e.g., button click)
  return window.open(url, 'diditKyc', features)
}

export const launchKycHosted = async ({ startEndpoint = '/api/kyc' } = {}) => {
  // 1) Create session on your backend
  const { data: d } = await axios.post(startEndpoint, { mode: 'hosted' })
  if (!d?.hostedUrl) throw new Error('No hostedUrl returned from KYC start')

  // 2) Try popup first
  let popup = openCenteredPopup(d.hostedUrl)
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Popup blocked — open in a new tab
    const win = window.open(d.hostedUrl, '_blank', 'noopener,noreferrer')
    if (!win) {
      // Still blocked — fall back to same-tab navigation
      window.location.assign(d.hostedUrl)
      return
    }
    popup = win
  }

  // 3) Listen for success/cancel postMessage (from your success/cancel pages)
  const stop = { done: false }
  const onMsg = (e) => {
    // Only accept messages from your own origin
    if (e.origin !== window.location.origin) return
    if (e.data?.type === 'kyc:success' || e.data?.type === 'kyc:cancel') {
      stop.done = true
      window.removeEventListener('message', onMsg)
      try {
        popup?.close()
      } catch {}
      // Optional: route user now based on e.data.type
      // e.g., router.push("/kyc/success") or show a snackbar
    }
  }
  window.addEventListener('message', onMsg)

  // 4) Poll backend for status in case user closes popup without redirect
  const terminal = new Set(['approved', 'rejected', 'canceled'])
  const poll = setInterval(async () => {
    if (stop.done) {
      clearInterval(poll)
      return
    }
    try {
      const { data: s } = await axios.get(`/api/kyc/${d.sessionId}`)
      if (terminal.has(String(s?.status))) {
        clearInterval(poll)
        try {
          popup?.close()
        } catch {}
        // route based on s.status if you want
        // router.push(s.status === "approved" ? "/kyc/success" : "/kyc/failed")
      }
    } catch {
      /* ignore transient failures */
    }
    // Stop if user manually closed the popup
    if (popup?.closed) {
      clearInterval(poll)
    }
  }, 2500)
}

// Human day headers ("Today", "Yesterday", else locale date)
export const formatDayHeaderDate = (key, t) => {
  const d = new Date(key)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const kd = new Date(d)
  kd.setHours(0, 0, 0, 0)
  const diff = (today - kd) / 86400000
  if (diff === 0) return t('today')
  if (diff === 1) return t('yesterday')
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}
