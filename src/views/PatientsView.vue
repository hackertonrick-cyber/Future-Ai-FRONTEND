<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-6">
      <h2 class="text-2xl font-semibold text-brand-green-1">
        Patients ({{ patients.length }})
      </h2>

      <v-btn color="brand-green-1" text-color="black" prepend-icon="mdi-plus">
        Add Patient
      </v-btn>
    </v-row>

    <!-- Patients Table -->
    <v-card class="rounded-xl shadow-md border border-gray-200">
      <v-data-table
        :headers="headers"
        :items="patients"
        class="text-sm"
        :items-per-page="5"
      >
        <!-- Patient Name -->
        <template #item.name="{ item }">
          {{ item.firstName }} {{ item.lastName }}
        </template>

        <!-- DOB -->
        <template #item.dob="{ item }">
          {{ new Date(item.dob).toLocaleDateString() }}
        </template>

        <!-- Gender -->
        <template #item.gender="{ item }">
          <v-chip
            :color="item.gender === 'Female' ? 'pink' : 'blue'"
            size="small"
          >
            {{ item.gender }}
          </v-chip>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'green' : 'grey'"

            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Vitals -->
        <template #item.vitals="{ item }">
          <div class="space-y-1">
            <div><strong>BP:</strong> {{ item.vitals.bloodPressure }}</div>
            <div><strong>HR:</strong> {{ item.vitals.heartRate }} bpm</div>
            <div><strong>Temp:</strong> {{ item.vitals.temperature }}°F</div>
            <div><strong>BMI:</strong> {{ item.vitals.bmi }}</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const patients = ref([
  {
    _id: '1',
    firstName: 'Sakura',
    lastName: 'Tanaka',
    gender: 'Female',
    dob: '1990-06-21',
    email: 'sakura.tanaka@example.jp',
    status: 'active',
    vitals: {
      bloodPressure: '118/76',
      heartRate: 72,
      temperature: 98.4,
      bmi: 22.1,
    },
  },
  {
    _id: '2',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    dob: '1985-03-14',
    email: 'john.doe@example.com',
    status: 'inactive',
    vitals: {
      bloodPressure: '130/85',
      heartRate: 80,
      temperature: 99.0,
      bmi: 27.4,
    },
  },
  {
    _id: '3',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    gender: 'Female',
    dob: '1993-11-10',
    email: 'maria.gonzalez@example.es',
    status: 'active',
    vitals: {
      bloodPressure: '110/70',
      heartRate: 65,
      temperature: 98.2,
      bmi: 21.5,
    },
  },
  {
    _id: '4',
    firstName: 'Aiden',
    lastName: 'Lee',
    gender: 'Male',
    dob: '2000-02-08',
    email: 'aiden.lee@example.ca',
    status: 'active',
    vitals: {
      bloodPressure: '125/79',
      heartRate: 75,
      temperature: 98.6,
      bmi: 24.0,
    },
  },
])

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Gender', key: 'gender' },
  { title: 'DOB', key: 'dob' },
  { title: 'Email', key: 'email' },
  { title: 'Status', key: 'status' },
  { title: 'Vitals', key: 'vitals' },
]
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
.space-y-1 > * + * {
  margin-top: 0.25rem;
}
</style>
