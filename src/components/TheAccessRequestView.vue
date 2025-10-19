<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-4">
      <h2 class="text-2xl font-semibold text-brand-green-1">
        Access Requests
      </h2>

      <v-btn
        color="brand-green-1"
        class="text-white"
        prepend-icon="mdi-plus"
        @click="showDialog = true"
      >
        New Request
      </v-btn>
    </v-row>

    <!-- Access Requests Table -->
    <v-card class="rounded-xl shadow-md border border-gray-200">
      <v-data-table
        :headers="headers"
        :items="requests"
        class="text-sm"
        :loading="loading"
        loading-text="Loading access requests..."
      >
        <template #item.patient="{ item }">
          {{ item.patientId?.firstName || 'N/A' }} {{ item.patientId?.lastName || '' }}
        </template>
        <template #item.targetOrg="{ item }">
          {{ item.targetOrgCode || 'N/A' }}
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            text-color="white"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.priority="{ item }">
          <v-chip
            :color="getPriorityColor(item.priority)"
            text-color="white"
            size="small"
          >
            {{ item.priority }}
          </v-chip>
        </template>
        <template #item.requestedAt="{ item }">
          {{ new Date(item.requestedAt).toLocaleString() }}
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Access Request Dialog -->
    <v-dialog v-model="showDialog" max-width="650px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-lg font-semibold text-brand-green-1">
          New Access Request
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="createAccessRequest">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.patientId"
                  label="Patient ID"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.targetOrgCode"
                  label="Target Organization Code"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="form.requestedCategories"
                  label="Requested Data Categories"
                  multiple
                  chips
                  clearable
                  variant="outlined"
                  density="comfortable"
                  :items="categoryOptions"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.reasonForAccess"
                  label="Reason for Access"
                  required
                  rows="2"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.priority"
                  :items="['normal', 'urgent', 'emergency']"
                  label="Priority"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end border-t pt-3">
          <v-btn text color="grey" @click="resetDialog">Cancel</v-btn>
          <v-btn
            color="brand-green-1"
            class="text-white"
            @click="createAccessRequest"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const showDialog = ref(false)
const loading = ref(false)
const requests = ref([])

const form = reactive({
  patientId: '',
  targetOrgCode: '',
  requestedCategories: [],
  reasonForAccess: '',
  priority: 'normal',
})

const headers = [
  { title: 'Patient', key: 'patient' },
  { title: 'Target Organization', key: 'targetOrg' },
  { title: 'Priority', key: 'priority' },
  { title: 'Status', key: 'status' },
  { title: 'Requested At', key: 'requestedAt' },
]

const categoryOptions = [
  'visits',
  'vitals',
  'diagnosis',
  'prescriptions',
  'labResults',
  'imaging',
  'notes',
]

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'blue'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    case 'revoked':
      return 'orange'
    default:
      return 'grey'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'orange'
    case 'emergency':
      return 'red'
    default:
      return 'grey'
  }
}

onMounted(async () => {
  await fetchAccessRequests()
})

const fetchAccessRequests = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/access-request`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    requests.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Failed to fetch access requests:', err)
  } finally {
    loading.value = false
  }
}

const createAccessRequest = async () => {
  try {
    const token = localStorage.getItem('token')
    const payload = {
      ...form,
      requestedCategories: form.requestedCategories.map((cat) => ({
        category: cat,
        reason: form.reasonForAccess,
      })),
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/access-request`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetchAccessRequests()
    resetDialog()
  } catch (err) {
    console.error('Failed to create access request:', err)
  }
}

const resetDialog = () => {
  Object.assign(form, {
    patientId: '',
    targetOrgCode: '',
    requestedCategories: [],
    reasonForAccess: '',
    priority: 'normal',
  })
  showDialog.value = false
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
