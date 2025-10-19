<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-6">
      <h2 class="text-2xl font-semibold text-brand-green-1">
        Appointments ({{
          medicalStore.appointmentsTotal || medicalStore.appointments.length
        }})
      </h2>

      <v-btn
        color="brand-green-1"
        class="text-white"
        prepend-icon="mdi-plus"
        @click="showDialog = true"
      >
        Create Appointment
      </v-btn>
    </v-row>

    <!-- Appointment Cards -->
    <v-row dense>
      <v-col
        v-for="(appt, i) in medicalStore.appointments.appointments"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <v-card-title class="bg-brand-green-1 text-white text-lg">
            {{ appt?.patientId?.firstName || "Unknown" }}
            {{ appt?.patientId?.lastName || "" }}
          </v-card-title>

          <v-card-text class="py-3">
            <p class="text-sm text-gray-600 mb-1">
              <strong>Doctor:</strong>
              {{ appt?.doctorId?.firstName || "N/A" }}
              {{ appt?.doctorId?.lastName || "" }}
            </p>
            <p class="text-sm text-gray-600 mb-1">
              <strong>Date:</strong>
              {{
                appt?.appointmentDate
                  ? new Date(appt.appointmentDate).toLocaleString()
                  : "N/A"
              }}
            </p>
            <p class="text-sm text-gray-600 mb-1">
              <strong>Reason:</strong>
              {{ appt?.reasonForVisit || "N/A" }}
            </p>
            <p class="text-sm text-gray-600 mb-1">
              <strong>Priority:</strong>
              <v-chip
                :color="getPriorityColor(appt?.priority)"
                size="small"
                text-color="white"
              >
                {{ appt?.priority || "normal" }}
              </v-chip>
            </p>
            <p class="text-sm text-gray-600">
              <strong>Status:</strong>
              <v-chip
                :color="getStatusColor(appt?.status)"
                size="small"
                text-color="white"
              >
                {{ appt?.status || "unknown" }}
              </v-chip>
            </p>
          </v-card-text>

          <v-card-actions class="border-t flex justify-between px-3">
            <span class="text-xs text-gray-500">
              Created by: {{ appt?.createdBy?.username || "System" }}
            </span>
            <v-btn
              size="small"
              color="brand-green-1"
              variant="tonal"
              @click="openDetails(appt)"
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Appointments -->
    <v-alert
      v-if="!medicalStore.appointments.appointments.length"
      type="info"
      variant="outlined"
      border="start"
      class="mt-6"
    >
      No appointments found.
    </v-alert>

    <!-- Create Appointment Dialog -->
    <v-dialog v-model="showDialog" max-width="600px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-lg font-semibold text-brand-green-1">
          Create Appointment
        </v-card-title>
        <v-card-text>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.patientId"
                  label="Patient ID"
                  required
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.doctorId"
                  label="Doctor ID"
                  required
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.appointmentDate"
                  label="Appointment Date"
                  type="datetime-local"
                  required
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.priority"
                  :items="['normal', 'urgent', 'emergency']"
                  label="Priority"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.reasonForVisit"
                  label="Reason for Visit"
                  rows="2"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card-text>
        <v-card-actions class="justify-end border-t pt-3">
          <v-btn text color="grey" @click="resetDialog">Cancel</v-btn>
          <v-btn color="brand-green-1" class="text-white" @click="createAppointment">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Appointment Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="text-lg font-semibold text-brand-green-1">
          Appointment Details
        </v-card-title>

        <v-card-text v-if="selectedAppointment" class="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Patient:</strong>
            {{ selectedAppointment?.patientId?.firstName || "Unknown" }}
            {{ selectedAppointment?.patientId?.lastName || "" }}
          </p>
          <p>
            <strong>Doctor:</strong>
            {{ selectedAppointment?.doctorId?.firstName || "N/A" }}
            {{ selectedAppointment?.doctorId?.lastName || "" }}
          </p>
          <p>
            <strong>Date:</strong>
            {{ new Date(selectedAppointment?.appointmentDate).toLocaleString() }}
          </p>
          <p>
            <strong>Reason:</strong> {{ selectedAppointment?.reasonForVisit || "N/A" }}
          </p>
          <p>
            <strong>Priority:</strong> {{ selectedAppointment?.priority || "normal" }}
          </p>
          <p><strong>Status:</strong> {{ selectedAppointment?.status || "unknown" }}</p>
          <p>
            <strong>Created By:</strong>
            {{ selectedAppointment?.createdBy?.username || "System" }}
          </p>
        </v-card-text>

        <v-card-actions class="justify-end border-t pt-3">
          <v-btn color="grey" variant="text" @click="showDetailsDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useMedicalStore } from "@/stores/medical";
const medicalStore = useMedicalStore();

const showDialog = ref(false);
const showDetailsDialog = ref(false);
const selectedAppointment = ref(null);

const form = reactive({
  patientId: "",
  doctorId: "",
  appointmentDate: "",
  reasonForVisit: "",
  priority: "normal",
});

const getStatusColor = (status) => {
  switch (status) {
    case "scheduled":
      return "blue";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "grey";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent":
      return "orange";
    case "emergency":
      return "red";
    default:
      return "blue";
  }
};

const openDetails = (appt) => {
  selectedAppointment.value = appt;
  showDetailsDialog.value = true;
};

onMounted(async () => {
  await medicalStore.GET_APPOINTMENTS();
});

const createAppointment = async () => {
  await medicalStore.REGISTER_APPOINTMENT(form);
  resetDialog();
};

const resetDialog = () => {
  Object.assign(form, {
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    reasonForVisit: "",
    priority: "normal",
  });
  showDialog.value = false;
};
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
