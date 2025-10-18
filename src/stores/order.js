import { defineStore } from 'pinia'
import axios from 'axios'
import { withSnackbar } from '@/utils/withSnackbar.js'

export const FETCH_ORDER_TYPES = 'FETCH_ORDER_TYPES'
export const PLACE_ORDER = 'PLACE_ORDER'
export const REQUEST_WITHDRAWAL = 'REQUEST_WITHDRAWAL'
export const FETCH_WITHDRAWALS = 'FETCH_WITHDRAWALS'
export const CONFIRM_ORDER = 'CONFIRM_ORDER'
export const CANCEL_ORDER = 'CANCEL_ORDER'
export const IS_LOADING = 'IS_LOADING'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderTypes: [],
    order: {},
    withdrawals: [],
  }),
  actions: {
    async [FETCH_ORDER_TYPES]() {
      const [{ useUserStore }, { useUiStore }] = await Promise.all([
        import('./user.js'),
        import('./ui.js'),
      ])
      const userStore = useUserStore()
      const uiStore = useUiStore()

      uiStore.START_LOADING('message.fetch_order_type')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/order-types`, {
        headers: { Authorization: `Bearer ${userStore.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        errorText: 'Failed to fetch order types.',
        showSuccess: false,
      })
      uiStore.STOP_LOADING('message.fetch_order_type')
      if (response && response.data) {
        this.orderTypes = response.data
        return response.data
      }
      return { error }
    },
    async [PLACE_ORDER](data) {
      const [{ useUserStore }, { useUiStore }] = await Promise.all([
        import('./user.js'),
        import('./ui.js'),
      ])
      const userStore = useUserStore()
      const uiStore = useUiStore()

      uiStore.START_LOADING('message.place_order')
      const stripeWindow = window.open('', '_blank', 'width=500,height=800')

      const promise = axios.post(`${import.meta.env.VITE_API_URL}/order/`, data, {
        headers: { Authorization: `Bearer ${userStore.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        successText: false,
        errorText: (err) => err?.response?.data?.message || 'Failed to initiate Stripe session.',
      })

      uiStore.STOP_LOADING('message.place_order')
      if (error || !response?.data?.url) {
        stripeWindow.close()
        return
      }

      const { url, newOrder } = response.data
      this.order = newOrder
      stripeWindow.location.href = url

      const interval = setInterval(() => {
        if (stripeWindow.closed) {
          clearInterval(interval)
        }
      }, 1000)
    },
    async [CANCEL_ORDER]() {
      const [{ useUserStore }, { useUiStore }] = await Promise.all([
        import('./user.js'),
        import('./ui.js'),
      ])
      const userStore = useUserStore()
      const uiStore = useUiStore()

      uiStore.START_LOADING('message.cancel_order')
      const promise = axios.put(`${import.meta.env.VITE_API_URL}/order/cancel`, this.order, {
        headers: { Authorization: `Bearer ${userStore.user.token}` },
      })

      const { response, error } = await withSnackbar(promise, {
        successText: 'Order canceled successfully.',
        errorText: (err) => err?.response?.data?.message || 'Failed to cancel order.',
        onSuccess: () => {
          this.order = {}
        },
      })

      uiStore.STOP_LOADING('message.cancel_order')
      return error ? { error } : 'canceled'
    },
  },
})
