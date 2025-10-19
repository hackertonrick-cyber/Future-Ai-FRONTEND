<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-6">
      <h2 class="text-2xl font-semibold text-brand-green-1">
        Organization Registration
      </h2>
    </v-row>

    <v-card class="rounded-xl shadow-md border border-gray-200">
      <v-card-text>
        <v-row dense>
          <!-- Branch Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.branchName"
              label="Branch Name"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Address -->
          <v-col cols="12" sm="6">
            <v-textarea
              v-model="form.address"
              label="Address"
              rows="2"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Contact Email -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.contactEmail"
              label="Contact Email"
              type="email"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Admin Email -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.adminEmail"
              label="Admin Email"
              type="email"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Admin Password -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.adminPassword"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePassword"
              label="Admin Password"
              required
              variant="outlined"
              :rules="[rules.password]"
            />
          </v-col>

          <!-- Confirm Password -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePassword"
              label="Confirm Password"
              required
              variant="outlined"
              :rules="[rules.confirmPassword]"
            />
          </v-col>

          <!-- Invite Token -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.inviteToken"
              label="Invite Token"
              required
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end border-t pt-3">
        <v-btn color="grey" variant="text" @click="resetForm">
          Cancel
        </v-btn>
        <v-btn
          color="brand-green-1"
          :loading="loading"
          @click="submitForm"
        >
          Register Organization
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbarStore } from '@/stores/snackbar'
import { useUiStore } from '@/stores/ui'

const userStore = useUserStore()
const uiStore = useUiStore()
const snackStore = useSnackbarStore()

// 🔐 Show/Hide password toggle
const showPassword = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)

// Reactive form data
const form = reactive({
  branchName: '',
  address: '',
  contactEmail: '',
  adminEmail: '',
  adminPassword: '',
  confirmPassword: '',
  inviteToken: '',
})

// Loading state
const loading = ref(false)

// Password validation rules
const rules = {
  password: (v) =>
    v?.length >= 8 ||
    'Password must be at least 8 characters long.',
  confirmPassword: (v) =>
    v === form.adminPassword || 'Passwords do not match.',
}

// ✅ Submit handler
const submitForm = async () => {
  // Manual validation
  if (
    !form.branchName ||
    !form.address ||
    !form.contactEmail ||
    !form.adminEmail ||
    !form.adminPassword ||
    !form.confirmPassword ||
    !form.inviteToken
  ) {
    snackStore.DISPLAY_SNACK({
      text: 'Please fill in all required fields.',
      type: 'error',
    })
    return
  }

  if (form.adminPassword !== form.confirmPassword) {
    snackStore.DISPLAY_SNACK({
      text: 'Passwords do not match.',
      type: 'error',
    })
    return
  }

  loading.value = true
  uiStore.START_LOADING('org.register')

  try {
    const payload = {
      address: form.address,
      contactEmail: form.contactEmail,
      branchName: form.branchName,
      adminEmail: form.adminEmail,
      adminPassword: form.adminPassword,
      inviteToken: form.inviteToken,
    }

    const response = await userStore.REGISTER_ORGANIZATION(payload)

    if (response) {
      snackStore.DISPLAY_SNACK({
        text: 'Organization registered successfully!',
        type: 'success',
      })
      resetForm()
    }
  } catch (err) {
    console.error('Failed to register organization:', err)
    snackStore.DISPLAY_SNACK({
      text: 'Registration failed. Please check your invite token or details.',
      type: 'error',
    })
  } finally {
    uiStore.STOP_LOADING('org.register')
    loading.value = false
  }
}

// Reset form
const resetForm = () => {
  Object.assign(form, {
    branchName: '',
    address: '',
    contactEmail: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    inviteToken: '',
  })
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
