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
