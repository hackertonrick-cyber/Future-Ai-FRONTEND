import { reactive } from 'vue'
import { io } from 'socket.io-client'
import { useUserStore } from '@/stores/user'

export const socketState = reactive({
  connected: false,
  socketId: '',
  userStatuses: new Map(),
})

const socketOptions = {
  path: '/socket.io',
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  autoConnect: true,
}

export const socket = io(`${import.meta.env.VITE_SOCKET_API_URL}/private`, socketOptions)

socket.on('connect', async () => {
  socketState.connected = true
  socketState.socketId = socket.id

  const userStore = useUserStore()
  console.log(`🟢 Socket connected: ${socket.id}`)

  if (userStore.isLoggedIn && userStore.user?._id) {
    console.log(`🏠 Rejoining room for user ${userStore.user._id}`)
    socket.emit('joinPersonalRoom', {
      user: userStore.user._id,
      socketId: socket.id,
    })
  }
})

socket.on('disconnect', () => {
  socketState.connected = false
  console.log('Socket disconnected')
})

socket.on('userOnlineStatus', async ({ data }) => {
  const { userId, status, lastSeen } = data

  const useSocketStore = await import('@/stores/storeSocket.js')
  const socketStore = useSocketStore.useSocketStore()

  socketStore.SET_USER_STATUS(userId, status)

  if (lastSeen) {
    socketStore.UPDATE_LAST_SEEN(userId, lastSeen)
  }
})

socket.on('logoutUser', async () => {
  const userStore = useUserStore()

  if (userStore.isLoggedIn) {
    userStore.LOGOUT()
  }
})

socket.on('presencePing', async ({ userId, pingId }) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) return

  console.log(`📨 Received presencePing from ${userId}, replying with presencePong ${pingId}`)

  socket.emit('presencePong', {
    sender: userStore.user._id,
    to: userId,
    pingId,
  })
})

socket.on('userNotification', async (data) => {
  const useSnackbarStore = await import('@/stores/snackbar.js')
  const snackStore = useSnackbarStore.useSnackbarStore()
  const userStore = useUserStore()

  try {
    userStore.notifications.notifications.unshift(data)

    if (userStore.notifications.pageInfo) {
      userStore.notifications.pageInfo.total += 1
    }

    snackStore.DISPLAY_SNACK({
      text: payload.subject || 'New Notification',
      type: 'success',
    })
  } catch (err) {
    console.warn('🔴 Failed to process incoming notification:', err)
  }
})

socket.on('presenceRequest', async ({ from, pingId }) => {
  if (!from || !pingId) return
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) return

  console.log(`📥 Received presence ping from ${from} — sending pong`)

  socket.emit('presencePong', {
    sender: userStore.user._id,
    to: from,
    pingId,
  })
})

socket.on('presencePong', async ({ from, pingId }) => {
  const userStore = useUserStore()
  if (!userStore.user?.conversations?.length) {
    console.warn('⚠️ No conversations to update')
    return
  }

  console.log(`📤 Received pong from ${from} (pingId: ${pingId})`)

  userStore.user.conversations = userStore.user.conversations.map((convo) => {
    if (convo.user_id === from) {
      console.log(`✅ Marking user ${from} as online`)
      return { ...convo, online: true }
    }
    return convo
  })

  if (userStore.currentPingId === pingId) {
    userStore.activePresenceReplies[from] = true
  }
})

socket.on('typingStatus', ({ userId, isTyping }) => {
  const userStore = useUserStore()
  const convo = userStore.user.conversations.find((c) => c.user_id === userId)
  if (convo) {
    convo.typing = isTyping
  }
})

socket.on('updateSocketId', (newSocketId) => {
  socketState.socketId = newSocketId.toString()
  console.log('Updated socket ID:', socketState.socketId)
})
