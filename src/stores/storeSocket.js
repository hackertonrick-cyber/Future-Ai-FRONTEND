import { defineStore } from 'pinia'

export const SET_USER_STATUS = 'SET_USER_STATUS'
export const UPDATE_LAST_SEEN = 'UPDATE_LAST_SEEN'
export const useSocketStore = defineStore('socket', {
  state: () => ({
    userStatuses: new Map(), 
    lastSeenMap: new Map(), 
  }),
  actions: {
    async [SET_USER_STATUS](userId, status) {
      this.userStatuses.set(userId, status)
    },
    async [UPDATE_LAST_SEEN](userId, timestamp) {
      this.lastSeenMap.set(userId, timestamp)
    },
  },
})
