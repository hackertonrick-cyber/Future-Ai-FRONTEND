<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-6">
      <h2 class="text-2xl font-semibold text-brand-green-1">Patient Profile</h2>

      <v-btn color="brand-green-1" prepend-icon="mdi-pencil">Edit Profile</v-btn>
    </v-row>

    <!-- Patient Info Card -->
    <v-card class="rounded-xl shadow-md border border-gray-200 mb-6">
      <v-card-title class="text-lg font-semibold text-brand-green-1 border-b">
        Personal Information
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6"><strong>Username:</strong> {{ user.username }}</v-col>
          <v-col cols="12" sm="6"><strong>Email:</strong> {{ user.email }}</v-col>
          <v-col cols="12" sm="6"><strong>First Name:</strong> {{ user.firstName }}</v-col>
          <v-col cols="12" sm="6"><strong>Last Name:</strong> {{ user.lastName }}</v-col>

          <v-col cols="12" sm="6">
            <strong>Gender:</strong>
            <v-chip :color="user.gender === 'male' ? 'blue' : 'pink'" size="small">
              {{ user.gender }}
            </v-chip>
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Date of Birth:</strong> {{ new Date(user.dob).toLocaleDateString() }}
          </v-col>

          <v-col cols="12" sm="6"><strong>Country:</strong> {{ user.country || 'N/A' }}</v-col>

          <v-col cols="12" sm="6">
            <strong>Consent Given:</strong>
            <v-chip :color="user.consentGiven ? 'green' : 'red'" text-color="white" size="small">
              {{ user.consentGiven ? 'Yes' : 'No' }}
            </v-chip>
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Status:</strong>
            <v-chip :color="user.active ? 'green' : 'grey'" text-color="white" size="small">
              {{ user.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Medical History Dropdown -->
    <v-expansion-panels variant="accordion" class="rounded-xl shadow-md border border-gray-200 mb-6">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon class="mr-2 text-brand-green-1">mdi-folder-account</v-icon>
          View Additional Medical History
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <strong>Known Allergies:</strong>
              <p class="text-gray-600">Penicillin, Dust Mites</p>
            </v-col>
            <v-col cols="12" sm="6">
              <strong>Current Medications:</strong>
              <p class="text-gray-600">Ibuprofen (200mg as needed)</p>
            </v-col>
            <v-col cols="12" sm="6">
              <strong>Chronic Conditions:</strong>
              <p class="text-gray-600">Mild Asthma</p>
            </v-col>
            <v-col cols="12" sm="6">
              <strong>Past Surgeries:</strong>
              <p class="text-gray-600">Appendectomy (2018)</p>
            </v-col>
            <v-col cols="12" sm="6">
              <strong>Primary Physician:</strong>
              <p class="text-gray-600">Dr. Emily Carter</p>
            </v-col>
            <v-col cols="12" sm="6">
              <strong>Last Physical Exam:</strong>
              <p class="text-gray-600">March 2025</p>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Upload Additional Documentation -->
    <v-card class="rounded-xl shadow-md border border-gray-200 mb-6">
      <v-card-title class="text-lg font-semibold text-brand-green-1 border-b">
        Upload Additional Documentation
      </v-card-title>

      <v-card-text>
        <p class="text-sm text-gray-600 mb-3">
          Upload relevant documents such as prescriptions, insurance cards, or test results.
        </p>

        <v-file-input
          v-model="files"
          label="Select files"
          multiple
          prepend-icon="mdi-paperclip"
          variant="outlined"
          accept=".pdf,.png,.jpg,.jpeg"
          density="comfortable"
        />

        <v-btn
          color="brand-green-1"
          class="text-white mt-4"
          :disabled="!files.length || uploading"
          @click="uploadDocuments"
        >
          <v-progress-circular
            v-if="uploading"
            indeterminate
            size="18"
            color="white"
            class="mr-2"
          />
          Upload
        </v-btn>

        <v-list v-if="uploadedDocs.length" class="mt-4 border rounded-xl">
          <v-list-item
            v-for="(doc, i) in uploadedDocs"
            :key="i"
            prepend-icon="mdi-file"
            class="hover:bg-gray-100"
          >
            <v-list-item-title>{{ doc.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ doc.date }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Account Management -->
    <v-card class="rounded-xl shadow-md border border-gray-200 mb-6">
      <v-card-title class="text-lg font-semibold text-brand-green-1 border-b">
        Account Management
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-btn
              color="brand-green-1"

              prepend-icon="mdi-lock-reset"
              @click="openChangePassword"
            >
              Change Password
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6">
            <v-btn
              color="brand-yellow-1"
              class="text-brand-grey-1"
              prepend-icon="mdi-email-check"
              @click="verifyEmail"
            >
              Verify Email
            </v-btn>
          </v-col>
        </v-row>

        <v-alert
          v-if="emailVerified"
          type="success"
          variant="tonal"
          class="mt-4"
        >
          Email verification link sent successfully!
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Account Activity -->
    <v-card class="rounded-xl shadow-md border border-gray-200">
      <v-card-title class="text-lg font-semibold text-brand-green-1 border-b">
        Account Activity
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6"><strong>Last Login:</strong> {{ new Date(user.lastLogin).toLocaleString() }}</v-col>
          <v-col cols="12" sm="6"><strong>Account Created:</strong> {{ new Date(user.accountCreated).toLocaleString() }}</v-col>
          <v-col cols="12" sm="6"><strong>Last Updated:</strong> {{ new Date(user.accountUpdated).toLocaleString() }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Change Password Dialog -->
    <v-dialog v-model="showChangePassword" max-width="450px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-lg font-semibold text-brand-green-1 border-b">
          Change Password
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="passwords.old"
            label="Current Password"
            type="password"
            variant="outlined"
          />
          <v-text-field
            v-model="passwords.new"
            label="New Password"
            type="password"
            variant="outlined"
          />
          <v-text-field
            v-model="passwords.confirm"
            label="Confirm Password"
            type="password"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions class="justify-end border-t pt-3">
          <v-btn text color="grey" @click="showChangePassword = false">Cancel</v-btn>
          <v-btn color="brand-green-1" @click="submitPasswordChange">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.user || {})

// Uploads
const files = ref([])
const uploadedDocs = ref([])
const uploading = ref(false)

// Change Password Dialog
const showChangePassword = ref(false)
const passwords = ref({ old: '', new: '', confirm: '' })

// Email Verification
const emailVerified = ref(false)

const uploadDocuments = async () => {
  if (!files.value.length) return
  uploading.value = true

  // Simulated upload (replace with real API later)
  setTimeout(() => {
    uploadedDocs.value.push(
      ...files.value.map((f) => ({
        name: f.name,
        date: new Date().toLocaleString(),
      }))
    )
    files.value = []
    uploading.value = false
  }, 1500)
}

const openChangePassword = () => (showChangePassword.value = true)

const submitPasswordChange = () => {
  if (passwords.value.new !== passwords.value.confirm) {
    alert('Passwords do not match.')
    return
  }
  showChangePassword.value = false
  alert('Password successfully changed (simulated).')
}

const verifyEmail = () => {
  emailVerified.value = true
  setTimeout(() => (emailVerified.value = false), 4000)
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
