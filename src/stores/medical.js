import { defineStore } from 'pinia'
import axios from 'axios'
import { useUiStore } from './ui'
import { useUserStore } from './user.js'
import { withSnackbar } from '@/utils/withSnackbar.js'

// ============================================
// 🔹 API ACTION CONSTANTS
// ============================================
export const REGISTER_APPOINTMENT = 'REGISTER_APPOINTMENT'
export const GET_APPOINTMENTS = 'GET_APPOINTMENTS'
export const CREATE_ACCESS_REQUEST = 'CREATE_ACCESS_REQUEST'
export const GET_ACCESS_REQUESTS = 'GET_ACCESS_REQUESTS'

// ============================================
// 🔹 MAIN STORE
// ============================================
export const useMedicalStore = defineStore('medical', {
  state: () => ({
    appointments: [],
    accessRequests: [],
    loading: false,
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'medicalStore',
        storage: localStorage,
      },
    ],
  },

  actions: {
    // ============================================
    // 🗓️ Create Appointment
    // ============================================
    async [REGISTER_APPOINTMENT](payload) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('appointment.register')

      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/org/appointment`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        this.appointments.unshift(data)
        uiStore.STOP_LOADING('appointment.register')
        return data
      } catch (err) {
        console.error('Failed to register appointment:', err)
        uiStore.STOP_LOADING('appointment.register')
        return false
      }
    },

    // ============================================
    // 📋 Get Appointments
    // ============================================
async [GET_APPOINTMENTS]() {
  const uiStore = useUiStore()
  const userStore = useUserStore()

  uiStore.START_LOADING('appointment.fetch')

  try {
    const token = userStore.user.token
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/org/appointment`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // ✅ Expect an object with "appointments" array inside
    this.appointments = data
    this.appointmentsTotal = data.total || this.appointments.length

    uiStore.STOP_LOADING('appointment.fetch')
    return data
  } catch (err) {
    console.error('Failed to load appointments:', err)
    uiStore.STOP_LOADING('appointment.fetch')
    return false
  }
}
,

    // ============================================
    // 🔐 Create Access Request
    // ============================================
    async [CREATE_ACCESS_REQUEST](payload) {
      const uiStore = useUiStore()
      uiStore.START_LOADING('accessRequest.create')

      try {
        const token = localStorage.getItem('token')
        const formattedPayload = {
          ...payload,
          requestedCategories: payload.requestedCategories.map((cat) => ({
            category: cat,
            reason: payload.reasonForAccess,
          })),
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/access-request`,
          formattedPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        this.accessRequests.unshift(data.request)
        uiStore.STOP_LOADING('accessRequest.create')
        return data
      } catch (err) {
        console.error('Failed to create access request:', err)
        uiStore.STOP_LOADING('accessRequest.create')
        return false
      }
    },

    // ============================================
    // 📑 Get Access Requests
    // ============================================
    async [GET_ACCESS_REQUESTS]() {
      const uiStore = useUiStore()
      uiStore.START_LOADING('accessRequest.fetch')

      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/access-request`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        this.accessRequests = Array.isArray(data) ? data : []
        uiStore.STOP_LOADING('accessRequest.fetch')
        return data
      } catch (err) {
        console.error('Failed to fetch access requests:', err)
        uiStore.STOP_LOADING('accessRequest.fetch')
        return false
      }
    },
  },
})
