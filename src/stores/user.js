import { defineStore } from 'pinia'
import axios from 'axios'
import { socket } from '@/utils/socket.js'
import { withSnackbar } from '@/utils/withSnackbar.js'
import { differenceInCalendarYears, parse } from 'date-fns'
import i18n from '@/utils/Translation/i18n.js'
import { generateMongoDBObjectId } from '../utils/functions.js'

export const LOGIN = 'LOGIN'
export const LOGIN_GOOGLE = 'LOGIN_GOOGLE'
export const CHECK_ONLINE_STATUS = 'CHECK_ONLINE_STATUS'
export const GET_GOOGLE_AUTH_TEMP_DATA = 'GET_GOOGLE_AUTH_TEMP_DATA'
export const GET_GOOGLE_SIGNUP_DATA = 'GET_GOOGLE_SIGNUP_DATA'
export const JOIN_ROOM = 'JOIN_ROOM'
export const LOGOUT = 'LOGOUT'
export const REGISTER = 'REGISTER'
export const UPDATE_DIRTY_LEP = 'UPDATE_DIRTY_LEP'
export const SET_DIRTY_LEP = 'SET_DIRTY_LEP'
export const FINALIZE_PROFILE_IMAGE = 'FINALIZE_PROFILE_IMAGE'
export const FETCH_AUTH_DATA = 'FETCH_AUTH_DATA'
export const SUBMIT_KYC = 'SUBMIT_KYC'
export const GENERATE_VERIFICATION_CODE = 'GENERATE_VERIFICATION_CODE'
export const VERIFY_VERIFICATION_CODE = 'VERIFY_VERIFICATION_CODE'
export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS'
export const UPDATE_USER = 'UPDATE_USER'
export const FETCH_SIGNED_URL = 'FETCH_SIGNED_URL'
export const UPLOAD_PROFILE_IMAGE = 'UPLOAD_PROFILE_IMAGE'
export const FINALIZE_MEDIA_FILES = 'FINALIZE_MEDIA_FILES'
export const SET_LOCAL_USER = 'SET_LOCAL_USER'
export const PAY_TO_UNLOCK_GALLERY_MEDIA = 'PAY_TO_UNLOCK_GALLERY_MEDIA'
export const TOGGLE_LIKE_MEDIA = 'TOGGLE_LIKE_MEDIA'
export const TIP_GALLERY_MEDIA = 'TIP_GALLERY_MEDIA'
export const TIP_MESSAGE_MEDIA = 'TIP_MESSAGE_MEDIA'
export const CHANGE_NOTIFICATIONS_VIEW_STATUS = 'CHANGE_NOTIFICATIONS_VIEW_STATUS'
export const PAY_TO_UNLOCK_MEDIA = 'PAY_TO_UNLOCK_MEDIA'
export const MESSAGE_PAY_TO_UNLOCK_MEDIA = 'MESSAGE_PAY_TO_UNLOCK_MEDIA'
export const UPDATE_ACTION_STATUS = 'UPDATE_ACTION_STATUS'
export const SET_LOCAL = 'SET_LOCAL'
export const IS_LOADING = 'IS_LOADING'
export const STOP_LOADING = 'STOP_LOADING'
export const UPLOAD_MEDIA_FILES = 'UPLOAD_MEDIA_FILES'
export const GET_DIRTY_LEP_SIGNED_MEDIA = 'GET_DIRTY_LEP_SIGNED_MEDIA'
export const UPDATE_CONVERSATIONS = 'UPDATE_CONVERSATIONS'
export const UPDATE_MEDIA_CAP = 'UPDATE_MEDIA_CAP'
export const DELETE_MEDIAS = 'DELETE_MEDIAS'
export const UPDATE_STORE_MEDIA = 'UPDATE_STORE_MEDIA'
export const UPDATE_LIKED_STATE = 'UPDATE_LIKED_STATE'
export const PUSH_NEW_CONVERSATION = 'PUSH_NEW_CONVERSATION'
export const GET_ALL_KYC = 'GET_ALL_KYC'
export const REVIEW_KYC = 'REVIEW_KYC'
export const UPDATE_KYC_VERIFICATION_STATUS = 'UPDATE_KYC_VERIFICATION_STATUS'

export const INITIATE_PASSWORD_RESET = 'INITIATE_PASSWORD_RESET'
export const PASSWORD_RESET = 'PASSWORD_RESET'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    user: {},
    kycDocuments: [],
    notifications: {
      notifications: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
      },
    },
    activePresenceReplies: {},
    currentPingId: null,
    cachedMedia: [],
    uploadProgress: {},
    isLoggingOut: true,
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
    async [FETCH_AUTH_DATA](token) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.fetch_auth_data')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/auth/auth-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const { response, error } = await withSnackbar(promise, {
        successText: 'Authentication loaded!',
        errorText: 'Failed to fetch authentication data.',
        showSuccess: false,
        showError: true,
      })

      if (response) {
        this.user = { ...this.user, ...response.data }
        localStorage.setItem('token', token)
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }

      uiStore.STOP_LOADING('user.fetch_auth_data')
    },
    async [FETCH_SIGNED_URL](fileName, type, action, mime) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.fetch_signed_url')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/user/media/signed-url`, {
        params: { fileName, type, action, mime },
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        showSuccess: false,
        errorText: 'Could not generate signed URL. Try again.',
        showError: true,
      })

      uiStore.STOP_LOADING('user.fetch_signed_url')
      return response.data
    },
    async [FETCH_NOTIFICATIONS](page = 1, limit = 10) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

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
    async [GENERATE_VERIFICATION_CODE](data) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.generate_verification_code')
      const promise = axios.post(
        `${import.meta.env.VITE_API_URL}/user/send-verification-otp`,
        data,
        { headers: { Authorization: `Bearer ${this.user.token}` } },
      )

      const { response, error } = await withSnackbar(promise, {
        successText: (res) => res?.data?.message || 'OTP sent to your email!',
        errorText: (err) => err?.response?.data?.message || 'Could not send verification code.',
      })

      uiStore.STOP_LOADING('user.generate_verification_code')
      return error ? { error } : response
    },
    async [VERIFY_VERIFICATION_CODE](data) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.verify_verification_code')
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/user/verify-otp`, data, {
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        successText: (res) => res?.data?.message || 'Verification successful!',
        errorText: (err) => err?.response?.data?.message || 'Invalid or expired code.',
        onSuccess: (res) => {
          if (res.data.user) this.user = { ...this.user, ...res.data.user }
        },
      })

      uiStore.STOP_LOADING('user.verify_verification_code')
      return error ? { error } : response
    },
    async [LOGIN](user) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore()

      uiStore.START_LOADING('user.login')
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, user)

      const { response, error } = await withSnackbar(promise, {
        showSuccess: false,
        errorText: (err) =>
          err?.response?.data?.message ||
          (err?.request ? 'No response received from server.' : 'Login failed.'),
        onSuccess: (res) => {
          if (!res.data?.authData?.token) throw new Error('Invalid login response')

          socket.connect()
          this.JOIN_ROOM()
          localStorage.setItem('token', res.data.authData.token)

          this.user = { ...this.user, ...res.data.authData }
          this.isLoggedIn = true
          uiStore.STOP_LOADING('user.login')
          this.$router.push('/')

          this.FETCH_NOTIFICATIONS()
        },
      })

      uiStore.STOP_LOADING('user.login')
      return !error ? response?.data : false
    },
    async [LOGIN_GOOGLE]() {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    },
    async [GET_GOOGLE_AUTH_TEMP_DATA](token) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

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
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

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
    async [CHECK_ONLINE_STATUS]() {
      if (!this.user?._id || !this.user?.conversations?.length) {
        console.warn('❌ Cannot emit status — missing user or conversations')
        return
      }

      const convoIds = this.user.conversations.map((convo) => convo.user_id)

      convoIds.map((userId) => {
        socket.emit('checkIfOnline', userId, (isOnline) => {
          if (!isOnline) {
            return markUserOffline(userId)
          }

          const pingId = generateMongoDBObjectId()
          this.activePresenceReplies = {}
          this.currentPingId = pingId

          socket.emit('presencePing', {
            userId: this.user._id,
            to: [userId],
            pingId,
          })

          setTimeout(() => {
            if (this.currentPingId !== pingId) return

            this.user.conversations = this.user.conversations.map((convo) => {
              const wasSeen = this.activePresenceReplies[convo.user_id] === true
              console.log(`⏱ Timeout check — user ${convo.user_id} online?`, wasSeen)
              return { ...convo, online: wasSeen }
            })

            this.activePresenceReplies = {}
            this.currentPingId = null
          }, 5000)
        })
      })

      const markUserOffline = (userId) => {
        this.user.conversations = this.user.conversations.map((convo) => {
          if (convo.user_id === userId) {
            return { ...convo, online: false }
          }
          return convo
        })
      }
    },
    async [LOGOUT](skipBackup = false) {
      const [{ useUiStore }, { useKycStore }] = await Promise.all([
        import('./ui.js'),
        import('./kyc.js'),
      ])

      const uiStore = useUiStore()
      const kycStore = useKycStore()
      uiStore.START_LOADING('user.logout')

      kycStore.$reset()
      this.$reset()

      localStorage.removeItem('token')
      this.$router.push('/login')
      socket.disconnect()
      uiStore.STOP_LOADING('user.logout')
    },
    async [REGISTER](user) {
      const [{ useSnackbarStore }, { useUiStore }] = await Promise.all([
        import('./snackbar.js'),
        import('./ui.js'),
      ])
      const snackStore = useSnackbarStore()
      const uiStore = useUiStore()

      uiStore.START_LOADING('user.register')
      const date = parse(user.dob, 'yyyy-MM-dd', new Date())
      const age = differenceInCalendarYears(new Date(), date)

      if (age < 16) {
        uiStore.STOP_LOADING('user.register')
        snackStore.DISPLAY_SNACK({
          text: 'STOP!!! you must be 16 or older.',
          type: 'warning',
        })
        return true
      } else {
        const response = await axios
          .post(`${import.meta.env.VITE_API_URL}/user/`, user)
          .catch(function (error) {
            if (error.response) {
              if (error.response.data.message == undefined) {
                return { error: 'please check network connection' }
              } else {
                return { error: error.response.data.message }
              }
            } else if (error.request) {
              return { error: response }
            } else {
              console.log('Error', error.message)
            }
          })

        uiStore.STOP_LOADING('user.register')
        if (response.error) {
          snackStore.DISPLAY_SNACK({ text: response.error, type: 'warning' })
          return response
        } else {
          this.user = { ...this.user, ...response.data.user }
          this.isLoggedIn = true
          uiStore.STOP_LOADING('user.register')
          this.JOIN_ROOM()
          this.$router.push('/')
        }
      }
    },
    async [UPDATE_USER](user) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.update_user')
      const date = parse(user.dob, 'yyyy-MM-dd', new Date())
      const age = differenceInCalendarYears(new Date(), date)
      if (age < 16) {
        uiStore.STOP_LOADING('user.update_user')
        return { error: 'STOP!!! you must be 16 or older.' }
      }
      const promise = axios.put(`${import.meta.env.VITE_API_URL}/user/`, user, {
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        successText: 'User update success.',
        errorText: (err) => err?.response?.data?.message || 'Update failed.',
        onSuccess: (res) => {
          this.user = { ...this.user, ...res.data }
        },
      })
      uiStore.STOP_LOADING('user.update_user')
      return error ? { error } : 'User update success.'
    },
    async [UPDATE_CONVERSATIONS](conversationId, unreadCount) {
      const conversation = this.user.conversations.find(
        (chat) => chat.conversationId === conversationId,
      )

      if (conversation) {
        conversation.unreadCount = unreadCount
      } else {
        console.warn(`Conversation with conversationId ${conversationId} not found`)
      }
    },
    async [UPLOAD_PROFILE_IMAGE](image) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.upload_profile_image')
      const formData = new FormData()
      formData.append('image', image)

      const promise = axios.post(`${import.meta.env.VITE_API_URL}/user/profile_image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.user.token}`,
        },
      })

      const { response, error } = await withSnackbar(promise, {
        successText: 'Profile image update success.',
        errorText: (err) => err?.response?.data?.message || 'Upload failed.',
        onSuccess: (res) => {
          this.user = { ...this.user, ...res.data }
        },
      })
      uiStore.STOP_LOADING('user.upload_profile_image')

      return error ? { error } : true
    },
    async [UPLOAD_MEDIA_FILES](signedUrl, file) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.upload_media_files')
      this.uploadProgress[file.name] = 0

      try {
        await axios.put(signedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.uploadProgress[file.name] = percentCompleted
          },
        })

        const { useSnackbarStore } = await import('./snackbar.js')
        const snackStore = useSnackbarStore()
        snackStore.DISPLAY_SNACK({
          text: `${file.name} submitted successfully.`,
          type: 'success',
        })

        uiStore.STOP_LOADING('user.upload_media_files')
        return true
      } catch (error) {
        const { useSnackbarStore } = await import('./snackbar.js')
        const snackStore = useSnackbarStore()
        const errorMsg = error?.response?.data?.message || error?.message || 'Upload failed.'
        snackStore.DISPLAY_SNACK({ text: errorMsg, type: 'warning' })

        return { error: errorMsg }
      } finally {
        uiStore.STOP_LOADING('user.upload_media_files')
        delete this.uploadProgress[file.name]
      }
    },
    async [FINALIZE_MEDIA_FILES](mediaItems) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.finalize_media_files')
      const promise = axios.post(
        `${import.meta.env.VITE_API_URL}/media-finalize`,
        { mediaItems },
        { headers: { Authorization: `Bearer ${this.user.token}` } },
      )

      const { response, error } = await withSnackbar(promise, {
        successText: (res) => 'Media finalized successfully.',
        errorText: 'Error finalizing media files.',
        onSuccess: (res) => {
          console.log('success')
        },
      })

      uiStore.STOP_LOADING('user.finalize_media_files')
      if (response && Array.isArray(response.data?.newMedia)) {
        return response.data.newMedia
      }
      return error ? { error } : []
    },
    async [SUBMIT_KYC](state) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.submit_kyc')
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/user/kyc`, state, {
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        successText:
          'KYC submitted successfully. A notification of each status update will be sent to your registered email.',
        errorText: 'Failed to submit KYC.',
        onSuccess: (res) => {
          this.user.kycVerification = res.data.kycVerification
        },
      })

      uiStore.STOP_LOADING('user.submit_kyc')
      if (error) return { error }
    },
    async [UPDATE_KYC_VERIFICATION_STATUS](state) {
      this.user.kycVerification = state
    },
    async [GET_ALL_KYC]() {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.get_all_kyc')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/user/admin/kyc`, {
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        errorText: 'Failed to fetch KYC documents.',
        showSuccess: false,
      })

      uiStore.STOP_LOADING('user.get_all_kyc')
      if (response && response.data) {
        this.kycDocuments = response.data
        return response.data
      }
      return { error }
    },
    async [REVIEW_KYC](state) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.review_kyc')
      const promise = axios.put(`${import.meta.env.VITE_API_URL}/user/admin/kyc`, state, {
        headers: { Authorization: `Bearer ${this.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        successText: `KYC ${state.action} successfully. A notification will be sent to the registered email.`,
        errorText: 'Failed to review KYC.',
        onSuccess: () => {
          const updatedDocId = state.kycId
          const index = this.kycDocuments.data?.findIndex((doc) => doc._id === updatedDocId)
          if (index !== -1) {
            this.kycDocuments.data[index].status = state.action
          }
        },
      })

      uiStore.STOP_LOADING('user.review_kyc')
      if (error) return { error }
    },
    async [CHANGE_NOTIFICATIONS_VIEW_STATUS](notification_ids) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

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
    async [UPDATE_ACTION_STATUS](action) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

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
    async [INITIATE_PASSWORD_RESET](email) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.initiate_password_reset')
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/user/password-reset-init`, {
        email,
      })

      const { response, error } = await withSnackbar(promise, {
        successText: (res) => res?.data?.message || 'Reset email sent successfully.',
        errorText: 'Failed to initiate password reset.',
      })

      uiStore.STOP_LOADING('user.initiate_password_reset')
      if (error) return { error }
    },
    async [PASSWORD_RESET](data) {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('user.password_reset')
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/user/password-reset`, data)

      const { response, error } = await withSnackbar(promise, {
        successText: (res) => res?.data?.message || 'Password has been reset.',
        errorText: 'Failed to reset password.',
      })

      uiStore.STOP_LOADING('user.password_reset')
      if (error) return { error }
    },
    async [SET_LOCAL_USER](user) {
      this.user = { ...this.user, ...user }
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
