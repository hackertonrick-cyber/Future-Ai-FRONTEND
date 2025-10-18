import { defineStore } from 'pinia'

export const START_LOADING = 'START_LOADING'
export const STOP_LOADING = 'STOP_LOADING'

let debounceTimer = null
export const useUiStore = defineStore('ui', {
  state: () => ({
    // counts per action: { 'user.login': 2, 'heist.save': 1 }
    loadingCounts: {},
    _visible: false, // debounced global visibility (prevents flicker)
  }),

  getters: {
    isLoadingGlobal: (state) => state._visible,
    isLoading: (state) => (action) => (state.loadingCounts[action] || 0) > 0,
    _anyActive: (state) =>
      Object.values(state.loadingCounts).some((n) => n > 0),
  },

  actions: {
    async [START_LOADING](action = 'global') {
      this.loadingCounts[action] = (this.loadingCounts[action] || 0) + 1
      this._scheduleShow()
    },

    async [STOP_LOADING](action = 'global') {
      const next = (this.loadingCounts[action] || 0) - 1
      if (next <= 0) delete this.loadingCounts[action]
      else this.loadingCounts[action] = next
      this._scheduleHide()
    },

    // Debounce show/hide to avoid flicker on ultra-fast requests
    _scheduleShow(delay = 120) {
      if (this._visible) return
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(() => {
        this._visible = this._anyActive
        debounceTimer = null
      }, delay)
    },

    _scheduleHide(delay = 120) {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(() => {
        this._visible = this._anyActive
        debounceTimer = null
      }, delay)
    },

    // optional panic button during dev
    reset() {
      this.loadingCounts = {}
      this._visible = false
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = null
    },
  },
})
