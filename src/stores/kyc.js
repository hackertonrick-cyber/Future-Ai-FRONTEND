// stores/kyc.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const START = 'START'
export const REFRESH = 'REFRESH'
export const GET_KYC_STATUS = 'GET_KYC_STATUS'
export const APPLY_SOCKET = 'APPLY_SOCKET'

const TERMINAL = new Set(['verified', 'failed', 'canceled', 'expired'])
const PROGRESS = new Set(['pending', 'user_in_progress', 'needs_review', 'created'])
const RESTART_ELIGIBLE = new Set(['pending', 'user_in_progress', 'needs_review'])

const normalize = (s) => {
  const v = String(s || '').toLowerCase()
  if (['created', 'not started', 'unknown'].includes(v)) return 'pending'
  if (['in progress', 'started', 'user_in_progress'].includes(v)) return 'user_in_progress'
  if (['in review', 'review', 'needs_review'].includes(v)) return 'needs_review'
  if (['approved', 'verified', 'completed', 'success'].includes(v)) return 'verified'
  if (['declined', 'rejected', 'failed', 'error'].includes(v)) return 'failed'
  if (['canceled', 'cancelled', 'abandoned'].includes(v)) return 'canceled'
  if (['expired', 'timeout'].includes(v)) return 'expired'
  return 'pending'
}

export const useKycStore = defineStore('kyc', {
  state: () => ({
    sessionId: null, // our DB id
    diditSessionId: null, // provider id
    status: null,
    hostedUrl: null,
    checks: {},

    retriesUsed: 0,
    retriesAllowed: 4,
    summary: null,
  }),
  actions: {
    async [GET_KYC_STATUS]() {
      const [{ useUserStore }, { useUiStore }] = await Promise.all([
        import('./user.js'),
        import('./ui.js'),
      ])
      const userStore = useUserStore()
      const uiStore = useUiStore()
      uiStore.START_LOADING('kyc.get_kyc_status')
      try {
        this.retriesUsed += 1
        this.retriesAllowed -= 1
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/kyc`, {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
          },
        })

        if (data) {
          this.sessionId = data.sessionId || data._id || null
          this.diditSessionId = data.audit?.diditSessionId || data.diditSessionId || null
          this.status = normalize(data.status || data.outcome?.status)
          this.checks = data.checks || {}
          this.retriesUsed = data.retriesUsed ?? 0
          this.retriesAllowed = data.retriesAllowed ?? 2
          this.summary = data.outcome?.summary || null
        }
      } finally {
        uiStore.STOP_LOADING('kyc.get_kyc_status')
      }
    },
    async [START](mode = 'hosted') {
      const [{ useUserStore }, { useUiStore }] = await Promise.all([
        import('./user.js'),
        import('./ui.js'),
      ])
      const userStore = useUserStore()
      const uiStore = useUiStore()

      uiStore.START_LOADING('kyc.start')
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/kyc/`,
          { mode },
          {
            headers: {
              Authorization: `Bearer ${userStore.user.token}`,
            },
          },
        )

        this.sessionId = data.sessionId
        this.diditSessionId = data.diditSessionId || null
        this.hostedUrl = data.hostedUrl || null
        this.status = normalize(data.status)
        this.checks = data.checks || {}

        if (data.hostedUrl) {
          window.open(data.hostedUrl, '_blank', 'noopener,noreferrer')
        }
        return data
      } catch (err) {
        if (err?.response?.data?.message === 'Invalid credentials!!!') {
          userStore.LOGOUT(true)
        }
        return err
      } finally {
        uiStore.STOP_LOADING('kyc.start')
      }
    },
    async [REFRESH]() {
      const { useUserStore } = await import('./user.js')
      const userStore = useUserStore()

      if (this.sessionId) {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/kyc/${this.sessionId}`, {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
          },
        })

        this.status = normalize(data?.status || data?.outcome?.status)
        this.checks = data?.checks || this.checks
        this.summary = data?.outcome?.summary || this.summary
        this.retriesUsed = data?.retriesUsed ?? this.retriesUsed
        this.retriesAllowed = data?.retriesAllowed ?? this.retriesAllowed
        return
      }
      if (this.diditSessionId) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/kyc/${this.diditSessionId}/decision`,
          {
            headers: {
              Authorization: `Bearer ${userStore.user.token}`,
            },
          },
        )

        this.status = normalize(data?.status)
        // map a light checks preview if you want
        this.checks = {
          id_verification: data?.id_verification?.status || null,
          nfc: data?.nfc?.status || null,
          liveness: data?.liveness?.status || null,
          face_match: data?.face_match?.status || null,
          aml: data?.aml?.status || null,
          poa: data?.poa?.status || null,
        }
      }
    },
    async [APPLY_SOCKET](evt) {
      // evt = { session_id, status, webhook_type }
      if (!this.diditSessionId) {
        // cold store: learn the current KYC before filtering
        try {
          await this.GET_KYC_STATUS()
        } catch {}
      }
      if (this.diditSessionId && evt.session_id !== this.diditSessionId) return

      const mapped = normalize(evt.status)
      this.status = mapped

      // Optional UX niceties:
      // if (mapped === 'verified') withSnackbar?.success?.('KYC verified.')
      // if (mapped === 'failed')   withSnackbar?.error?.('KYC failed. You can try again.')

      if (TERMINAL.has(mapped)) {
        try {
          await this.REFRESH()
        } catch {}
      }
    },
    async RETRY() {
      if (!this.canRetry) return
      return await this.START('hosted')
    },
  },
  getters: {
    inProgress: (s) => PROGRESS.has(s.status),
    isTerminal: (s) => TERMINAL.has(s.status),
    canForceRestart: (s) => RESTART_ELIGIBLE.has(s.status) && s.retriesUsed < s.retriesAllowed,
    canRetry: (s) =>
      (s.status === 'failed' || s.status === 'expired' || s.status === 'canceled') &&
      s.retriesUsed < s.retriesAllowed,
  },
})
