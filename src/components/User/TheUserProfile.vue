<template>
  <v-container class="py-10">
    <v-card class="rounded-xl shadow-md border border-brand-grey-1">
      <v-card-title class="text-xl font-semibold text-brand-green-1 border-b pb-3">
        Organization User Profile
      </v-card-title>

      <v-card-text class="py-6">
        <v-row>
          <!-- Left Column -->
          <v-col cols="12" md="6">
            <h3 class="text-lg font-semibold mb-3">Account Information</h3>

            <v-text-field
              v-model="profile.username"
              label="Username"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.companyCode"
              label="Company Code"
              readonly
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.branchCode"
              label="Branch Code"
              readonly
              variant="outlined"
              density="comfortable"
            />

            <v-select
              v-model="profile.role"
              :items="roles"
              label="Role"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-switch
              v-model="profile.active"
              :disabled="!editMode"
              color="brand-green-1"
              label="Active Account"
            />
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="6">
            <h3 class="text-lg font-semibold mb-3">Professional Details</h3>

            <v-text-field
              v-model="profile.professionalProfile.firstName"
              label="First Name"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.professionalProfile.lastName"
              label="Last Name"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-select
              v-model="profile.professionalProfile.profession"
              :items="professions"
              label="Profession"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.professionalProfile.specialization"
              label="Specialization"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.professionalProfile.licenseNumber"
              label="License Number"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.professionalProfile.yearsOfExperience"
              label="Years of Experience"
              type="number"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.professionalProfile.email"
              label="Email"
              type="email"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              v-model="profile.professionalProfile.phone"
              label="Phone"
              :readonly="!editMode"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end p-4">
        <v-btn
          v-if="!editMode"
          color="brand-green-1"
          class="text-white"
          @click="editMode = true"
        >
          Edit
        </v-btn>

        <v-btn
          v-else
          color="brand-green-1"
          class="text-white"
          @click="updateProfile"
        >
          Save
        </v-btn>

        <v-btn
          v-if="editMode"
          variant="outlined"
          color="grey"
          @click="cancelEdit"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const profile = reactive({
  username: '',
  companyCode: '',
  branchCode: '',
  role: '',
  active: false,
  professionalProfile: {
    firstName: '',
    lastName: '',
    profession: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    email: '',
    phone: '',
  },
})

const editMode = ref(false)
const roles = ['admin', 'doctor', 'nurse', 'technician']
const professions = ['doctor', 'nurse', 'technician', 'therapist', 'pharmacist', 'admin']

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/org/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Object.assign(profile, data)
  } catch (error) {
    console.error('Error fetching org user profile:', error)
  }
})

const cancelEdit = () => {
  editMode.value = false
  window.location.reload()
}

const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `${import.meta.env.VITE_API_URL}/org/profile`,
      profile,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    editMode.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
