<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-6">
      <h2 class="text-2xl font-semibold text-brand-green-1">
        Register Organization User
      </h2>
    </v-row>

    <v-card class="rounded-xl shadow-md border border-gray-200">
      <v-card-text>
        <v-row dense>
          <!-- Username -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.username"
              label="Username"
              required
              variant="outlined"
            />
          </v-col>

          <!-- First Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.firstName"
              label="First Name"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Last Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.lastName"
              label="Last Name"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Gender -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.gender"
              label="Gender"
              :items="['male', 'female', 'other']"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Phone -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.phone"
              label="Phone"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Profession -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.profession"
              label="Profession"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Specialization -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.specialization"
              label="Specialization"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Role -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.role"
              label="Role"
              :items="roles"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Branch Code -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.branchCode"
              label="Branch Code"
              required
              variant="outlined"
            />
          </v-col>

          <!-- Password -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePassword"
              label="Password"
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
          Register User
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

// Reactive form state
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: '',
  branchCode: '',
  firstName: '',
  lastName: '',
  gender: '',
  email: '',
  phone: '',
  profession: '',
  specialization: '',
})

const roles = ['doctor', 'nurse', 'receptionist', 'lab_technician', 'pharmacist', 'admin']
const showPassword = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)
const loading = ref(false)

const rules = {
  password: (v) => v?.length >= 8 || 'Password must be at least 8 characters long.',
  confirmPassword: (v) => v === form.password || 'Passwords do not match.',
}

const submitForm = async () => {
  // Basic validation
  if (
    !form.username ||
    !form.password ||
    !form.confirmPassword ||
    !form.role ||
    !form.branchCode ||
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.phone
  ) {
    snackStore.DISPLAY_SNACK({ text: 'Please fill all required fields.', type: 'error' })
    return
  }

  if (form.password !== form.confirmPassword) {
    snackStore.DISPLAY_SNACK({ text: 'Passwords do not match.', type: 'error' })
    return
  }

  loading.value = true
  uiStore.START_LOADING('orgUser.register')

  const payload = {
    username: form.username,
    password: form.password,
    role: form.role,
    branchCode: form.branchCode,
    firstName: form.firstName,
    lastName: form.lastName,
    gender: form.gender,
    email: form.email,
    phone: form.phone,
    profession: form.profession,
    specialization: form.specialization,
  }

  try {
    const response = await userStore.REGISTER_ORG_USER(payload)

    if (response) {
      snackStore.DISPLAY_SNACK({
        text: 'Organization user registered successfully!',
        type: 'success',
      })
      resetForm()
    }
  } catch (err) {
    console.error('Registration failed:', err)
    snackStore.DISPLAY_SNACK({ text: 'Registration failed.', type: 'error' })
  } finally {
    uiStore.STOP_LOADING('orgUser.register')
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    branchCode: '',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    profession: '',
    specialization: '',
  })
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
