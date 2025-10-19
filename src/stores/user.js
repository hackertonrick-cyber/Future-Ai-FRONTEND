import { defineStore } from 'pinia'
import axios from 'axios'
import { socket } from '@/utils/socket.js'
import { withSnackbar } from '@/utils/withSnackbar.js'
import { useUiStore } from './ui'
import i18n from '@/utils/Translation/i18n.js'

// ============================================
// 🔹 AUTHENTICATION & USER MANAGEMENT
// ============================================
export const REGISTER_PATIENT = 'REGISTER_PATIENT'
export const REGISTER_ORG_USER = 'REGISTER_ORG_USER'
export const REGISTER_SUPER_ADMIN = 'REGISTER_SUPER_ADMIN'
export const REGISTER_ORGANIZATION = 'REGISTER_ORGANIZATION'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const PASSWORD_RESET_INIT = 'PASSWORD_RESET_INIT'
export const PASSWORD_RESET = 'PASSWORD_RESET'

// ============================================
// 🔹 ORGANIZATION & PROFILE DATA
// ============================================
export const GET_ORG_USER_PROFILE = 'GET_ORG_USER_PROFILE'
export const GET_PATIENT_PROFILE = 'GET_PATIENT_PROFILE'
export const GET_ORGANIZATIONS_LIST = 'GET_ORGANIZATIONS_LIST'
export const LOGIN_GOOGLE = 'LOGIN_GOOGLE'
export const GET_GOOGLE_AUTH_TEMP_DATA = 'GET_GOOGLE_AUTH_TEMP_DATA'
export const GET_GOOGLE_SIGNUP_DATA = 'GET_GOOGLE_SIGNUP_DATA'
export const JOIN_ROOM = 'JOIN_ROOM'

// ============================================
// 🔹 ORGANIZATION INVITES
// ============================================
export const CREATE_ORGANIZATION_INVITE = 'CREATE_ORGANIZATION_INVITE'

// ============================================
// 🔹 ACCESS REQUESTS & PERMISSIONS
// ============================================
export const REQUEST_ACCESS_FROM_ORGANIZATION = 'REQUEST_ACCESS_FROM_ORGANIZATION'
export const LIST_ACCESS_REQUESTS = 'LIST_ACCESS_REQUESTS'
export const APPROVE_ACCESS_REQUEST = 'APPROVE_ACCESS_REQUEST'
export const DISAPPROVE_ACCESS_REQUEST = 'DISAPPROVE_ACCESS_REQUEST'

// ============================================
// 🔹 NOTIFICATIONS
// ============================================
export const GET_USER_NOTIFICATIONS = 'GET_USER_NOTIFICATIONS'
export const UPDATE_ACTION_TAKEN = 'UPDATE_ACTION_TAKEN'
export const UPDATE_NOTIFICATION_VIEW_STATE = 'UPDATE_NOTIFICATION_VIEW_STATE'
export const SET_LOCAL = 'SET_LOCAL'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 🔹 Auth & Session
    isLoggedIn: false,
    authToken: null,
    userType: null, // 'patient' | 'org' | 'super-admin'
    isLoading: false,
    isLoggingOut: false,

    // 🔹 Core Profiles
    user: {},
    patientProfile: {},
    orgUserProfile: {},

    // 🔹 Access & Permissions
    accessRequests: [],
    pendingAccessCount: 0,

    // 🔹 Notifications
    notifications: {
      list: [],
      unreadCount: 0,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
      },
    },

    // 🔹 UI & Temporary Cache
    uploadProgress: {},
    cachedMedia: [],
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'userStore',
        storage: localStorage,
      },
    ],
  },
  actions: {
    async [GET_USER_NOTIFICATIONS](page = 1, limit = 10) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('user.fetch_notifications')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/user/notifications`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        showSuccess: false,
        errorText: () => 'Could not load notifications.',
        onSuccess: (res) => {
          this.notifications = res.data
          const unviewed =
            Array.isArray(res.data.notifications) &&
            res.data.notifications.some((notif) => notif.status === 'not_viewed')
        },
      })

      uiStore.STOP_LOADING('user.fetch_notifications')
      return !error
    },
    async [LOGIN](credentials) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('user.login')

      try {
        let endpoint = ''

        if (credentials.userType === 'org') {
          endpoint = `${import.meta.env.VITE_API_URL}/auth/org/login`
        } else if (credentials.userType === 'admin') {
          endpoint = `${import.meta.env.VITE_API_URL}/auth/admin/login`
        } else {
          endpoint = `${import.meta.env.VITE_API_URL}/auth/login`
        }

        const response = await axios.post(endpoint, credentials)
        const data = response?.data

        // ✅ Determine which field contains the logged-in user
        const userData = data.patient || data.orgUser || data.admin || data.user || null

        if (!userData || !userData.token) {
          throw new Error('Invalid login response: Missing token or user data')
        }

        // 🔌 Socket and real-time join
        socket.connect()
        this.JOIN_ROOM?.()

        // 🧠 Store token + user in localStorage and state
        localStorage.setItem('token', userData.token)
        this.authToken = userData.token
        this.user = { ...userData }
        this.userType = credentials.userType
        this.isLoggedIn = true

        uiStore.STOP_LOADING('user.login')
        this.$router.push('/')
        this.GET_USER_NOTIFICATIONS?.()

        return data
      } catch (err) {
        console.error('Login Error:', err)
        uiStore.STOP_LOADING('user.login')
        return false
      }
    },
    async [LOGIN_GOOGLE]() {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    },
    async [GET_GOOGLE_AUTH_TEMP_DATA](token) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('user.get_google_auth_temp_data')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/user/get-temp-user-data`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        errorText: (err) => err?.response?.data?.message || 'Could not fetch Google auth data.',
        onSuccess: (res) => {
          const { authData } = res.data.userData || {}

          if (
            !authData?.token ||
            typeof authData.token !== 'string' ||
            authData.token.length < 20
          ) {
            console.warn('SET_LOCAL_USER: Invalid or missing token')
            this.isLoggedIn = false
            this.user = null
            return
          }

          if (!authData || !authData._id || !authData.userName) {
            console.warn('SET_LOCAL_USER: Invalid or incomplete user object')
            this.isLoggedIn = false
            this.user = null
            return
          }

          this.isLoggedIn = true
          this.user = { ...this.user, ...authData }
        },
      })

      uiStore.STOP_LOADING('user.get_google_auth_temp_data')
      return error ? { error } : response
    },
    async [GET_GOOGLE_SIGNUP_DATA](token) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('user.get_google_signup_data')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/user/get-signup-data`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        errorText: (err) => err?.response?.data?.message || 'Failed to fetch signup data.',
      })

      uiStore.STOP_LOADING('user.get_google_signup_data')
      return error ? { error } : response?.data
    },
    async [JOIN_ROOM]() {
      // const useMessageStore = await import('@/stores/message.js')
      // const messageStore = useMessageStore.useMessageStore()

      if (!socket.connected) {
        await new Promise((resolve) => {
          socket.once('connect', resolve)
        })
      }
      // await messageStore.GET_OFFLINE_MESSAGES()
    },
    async [LOGOUT](skipBackup = false) {
      const { useUiStore } = await import('./ui.js')

      const uiStore = useUiStore()
      uiStore.START_LOADING('user.logout')
      this.$reset()

      localStorage.removeItem('token')
      this.$router.push('/login')
      socket.disconnect()
      uiStore.STOP_LOADING('user.logout')
    },
    async [REGISTER_PATIENT](user) {
      const [{ useSnackbarStore }, { useUiStore }] = await Promise.all([
        import('./snackbar.js'),
        import('./ui.js'),
      ])
      const snackStore = useSnackbarStore()
      const uiStore = useUiStore()

      uiStore.START_LOADING('user.register')

      try {
        // 🩺 Register patient via new endpoint
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/patient`, user)

        if (!response?.data?.user) {
          throw new Error('Invalid registration response from server.')
        }

        // 🧠 Update local state
        this.user = { ...response.data.user }
        this.isLoggedIn = true

        // 🔗 Connect socket & join default room
        this.JOIN_ROOM()

        uiStore.STOP_LOADING('user.register')
        this.$router.push('/')

        snackStore.DISPLAY_SNACK({
          text: 'Registration successful. Welcome aboard!',
          type: 'success',
        })

        return response.data
      } catch (error) {
        uiStore.STOP_LOADING('user.register')

        const errMsg =
          error?.response?.data?.message ||
          (error?.request
            ? 'No response from server. Check your connection.'
            : error.message || 'Registration failed.')

        console.error('Registration Error:', errMsg)
        snackStore.DISPLAY_SNACK({ text: errMsg, type: 'error' })

        return false
      }
    },
    async [UPDATE_NOTIFICATION_VIEW_STATE](notification_ids) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('user.change_notification_view_status')
      const promise = axios.put(
        `${import.meta.env.VITE_API_URL}/notification/viewed`,
        { notification_ids: Array.from(notification_ids) },
        { headers: { Authorization: `Bearer ${this.user.token}` } },
      )

      const { response, error } = await withSnackbar(promise, {
        errorText: 'Failed to update notification view status.',
        showSuccess: false,
      })

      if (response) {
        for (const id of notification_ids) {
          const notif = this.user.notifications?.notifications?.find((n) => n._id === id)
          if (notif) notif.status = 'viewed'
        }

        uiStore.STOP_LOADING('user.change_notification_view_status')
        return { success: true }
      } else {
        uiStore.STOP_LOADING('user.change_notification_view_status')
        return { error }
      }
    },
    async [UPDATE_ACTION_TAKEN](action) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('user.update_action_status')
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/notification/action_taken`,
        action,
        { headers: { Authorization: `Bearer ${this.user.token}` } },
      )
      uiStore.STOP_LOADING('user.update_action_status')
      if (data) {
        this.user?.notifications?.notifications?.forEach((notification) => {
          if (notification._id === action.notification_id) {
            notification.action_required = false
            notification.action_taken = action.action_taken
          }
        })
        return data.message
      } else {
        return { error }
      }
    },
    async [SET_LOCAL](local) {
      switch (local) {
        case 'en':
        case 'es':
          i18n.global.locale.value = local
          localStorage.setItem('app_locale', local) // persist
          break
        default:
          break
      }
    },
  },
})
