<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row class="mb-6" align="center" justify="space-between">
      <h2 class="text-2xl font-semibold text-brand-green-1">Notifications</h2>
      <v-btn color="brand-green-1" variant="flat" @click="markAllRead">
        Mark All as Read
      </v-btn>
    </v-row>

    <!-- Notifications List -->
    <v-card class="rounded-xl shadow-md border border-gray-200">
      <v-list>
        <v-list-item
          v-for="(n, i) in notifications"
          :key="i"
          :class="['py-3', !n.read ? 'bg-yellow-50' : '']"
        >
          <template #prepend>
            <v-avatar size="36" color="brand-green-1" class="text-white">
              <v-icon>mdi-bell</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-semibold">
            {{ n.title }}
          </v-list-item-title>

          <v-list-item-subtitle class="text-gray-600">
            {{ n.message }}
          </v-list-item-subtitle>

          <template #append>
            <v-chip
              size="small"
              :color="n.read ? 'grey' : 'green'"
              text-color="white"
            >
              {{ n.read ? 'Read' : 'New' }}
            </v-chip>
          </template>
        </v-list-item>

        <v-divider v-if="i < notifications.length - 1" />
      </v-list>

      <v-card-text v-if="notifications.length === 0" class="text-center text-gray-500">
        No notifications at this time.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const notifications = ref([
  {
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Carter is scheduled for Oct 25, 2025 at 3:30 PM.",
    read: false,
  },
  {
    title: "Access Request Received",
    message: "A healthcare provider requested access to your medical records.",
    read: false,
  },
  {
    title: "HealthComm Update",
    message: "Your account has been verified. You now have full access to patient tools.",
    read: true,
  },
  {
    title: "New Message",
    message: "Dr. Parker left a note on your latest lab results.",
    read: false,
  },
])

const markAllRead = () => {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
}
</script>

<style scoped>
.bg-yellow-50 {
  background-color: #fffbea;
}
</style>
