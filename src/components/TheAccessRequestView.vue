<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-4">
      <h2 class="text-2xl font-semibold text-brand-green-1">
        Access Requests ({{ medicalStore.accessRequests.count || 0 }})
      </h2>

      <v-btn color="brand-green-1" prepend-icon="mdi-plus" @click="showDialog = true">
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
        <!-- Patient Name -->
        <template #item.patient="{ item }">
          {{ item.patientId?.firstName || "N/A" }}
          {{ item.patientId?.lastName || "" }}
        </template>

        <!-- Target Organization -->
        <template #item.targetOrg="{ item }">
          {{ item.targetOrgCode || "N/A" }}
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" text-color="white" size="small">
            {{ item.status || "unknown" }}
          </v-chip>
        </template>

        <!-- Priority -->
        <template #item.priority="{ item }">
          <v-chip
            :color="getPriorityColor(item.priority)"
            text-color="white"
            size="small"
          >
            {{ item.priority || "normal" }}
          </v-chip>
        </template>

        <!-- Requested Date -->
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
        </v-card-text>

        <v-card-actions class="justify-end border-t pt-3">
          <v-btn text color="grey" @click="resetDialog">Cancel</v-btn>
          <v-btn color="brand-green-1" @click="createAccessRequest"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/user";
import { useMedicalStore } from "../stores/medical";

const userStore = useUserStore();
const medicalStore = useMedicalStore();

const showDialog = ref(false);
const loading = ref(false);

const form = reactive({
  patientId: "",
  targetOrgCode: "",
  requestedCategories: [],
  reasonForAccess: "",
  priority: "normal",
});

/* ✅ COMPUTED: reactive table data directly from the store */
const requests = computed(() => medicalStore.accessRequests.requests || []);

const headers = [
  { title: "Patient", key: "patient" },
  { title: "Target Organization", key: "targetOrg" },
  { title: "Priority", key: "priority" },
  { title: "Status", key: "status" },
  { title: "Requested At", key: "requestedAt" },
];

const categoryOptions = [
  "visits",
  "vitals",
  "diagnosis",
  "prescriptions",
  "labResults",
  "imaging",
  "notes",
];

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "blue";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "revoked":
      return "orange";
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
      return "grey";
  }
};

/* ✅ On mount: fetch requests */
onMounted(async () => {
  loading.value = true;
  await medicalStore.GET_ACCESS_REQUESTS();
  loading.value = false;
});

/* ✅ Submit handler */
const createAccessRequest = async () => {
  const payload = {
    ...form,
    requestedCategories: form.requestedCategories.map((cat) => ({
      category: cat,
      reason: form.reasonForAccess,
    })),
  };

  await medicalStore.CREATE_ACCESS_REQUEST(payload); // Refresh table data
  resetDialog();
};

/* ✅ Dialog reset */
const resetDialog = () => {
  Object.assign(form, {
    patientId: "",
    targetOrgCode: "",
    requestedCategories: [],
    reasonForAccess: "",
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
