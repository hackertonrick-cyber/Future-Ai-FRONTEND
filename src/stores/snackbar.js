import { defineStore } from 'pinia'

export const DISPLAY_SNACK = 'DISPLAY_SNACK'
export const CLOSE_SNACK = 'CLOSE_SNACK'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    snack: {
      text: '',
      type: 'success',
      visible: false,
    },
    timeoutId: null,
  }),

  actions: {
    [DISPLAY_SNACK]({ text = '', type = 'success', duration = 7000 }) {
      this.snack.text = text
      this.snack.type = type
      this.snack.visible = true

      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }

      this.timeoutId = setTimeout(() => {
        this.CLOSE_SNACK()
      }, duration)
    },

    [CLOSE_SNACK]() {
      this.snack.visible = false
      this.snack.text = ''
      this.timeoutId = null
    },
  },
})
