<template>
  <v-container class="py-10">
    <!-- Header -->
    <v-row class="mb-8" justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-4xl font-bold text-brand-green-1 mb-4">
          About HealthComm
        </h1>
        <p class="text-gray-600 text-lg">
          Empowering patients, doctors, and healthcare organizations through secure communication, transparent access, and modern data protection.
        </p>
      </v-col>
    </v-row>

    <!-- Mission -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-md border border-gray-200">
          <v-card-title class="text-xl font-semibold text-brand-green-1 border-b">
            Our Mission
          </v-card-title>
          <v-card-text class="text-gray-700 leading-relaxed">
            HealthComm is built around one clear promise — that healthcare data belongs to the patient.
            Our mission is to modernize the way information moves across hospitals, clinics, and individuals,
            ensuring that access is fast, compliant, and always under the patient’s control.
            <p class="mt-4">
              With global data laws like the <strong>Data Protection Act</strong> and <strong>GDPR</strong> now
              recognizing a user’s right to request, view, and delete their personal data, HealthComm was designed to
              make those rights practical and easy to exercise. Every part of our system is engineered to support patient
              autonomy while maintaining the strictest security standards.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- What We’re Building -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-md border border-gray-200">
          <v-card-title class="text-xl font-semibold text-brand-green-1 border-b">
            What We’re Building
          </v-card-title>
          <v-card-text class="text-gray-700 leading-relaxed">
            We are developing a next-generation healthcare ecosystem that prioritizes transparency, accessibility, and
            legal compliance. HealthComm brings together:
            <ul class="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Patient Portals</strong> — allowing individuals to securely view, download, and manage their
                health information.
              </li>
              <li>
                <strong>Access Request Systems</strong> — enabling organizations to handle patient data requests in full
                alignment with modern data protection laws.
              </li>
              <li>
                <strong>Appointment & Medical Record Management</strong> — simplifying collaboration between patients and
                professionals through a unified interface.
              </li>
              <li>
                <strong>Secure Document Storage</strong> — empowering users to upload, share, and retrieve their medical
                documents safely.
              </li>
            </ul>
            <p class="mt-4">
              Our focus is not just on technology, but on <strong>trust</strong> — ensuring patients know their data is
              never misused, sold, or accessed without consent.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Protection and Privacy -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-md border border-gray-200">
          <v-card-title class="text-xl font-semibold text-brand-green-1 border-b">
            Data Protection & Patient Rights
          </v-card-title>
          <v-card-text class="text-gray-700 leading-relaxed">
            HealthComm operates in full compliance with the <strong>Data Protection Act</strong> and related global
            privacy frameworks. We believe that data protection is not just a legal requirement, but a moral one.
            <ul class="list-disc pl-6 mt-3 space-y-2">
              <li>Patients have the right to <strong>access</strong> their records at any time.</li>
              <li>Patients can <strong>request correction or deletion</strong> of their data.</li>
              <li>All activity involving patient data is <strong>logged, encrypted, and auditable</strong>.</li>
              <li>No information is shared externally without <strong>explicit consent</strong>.</li>
            </ul>
            <p class="mt-4">
              We aim to redefine how privacy, accountability, and convenience coexist in healthcare — giving control
              back to the people who matter most: the patients.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Technology Stack -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-md border border-gray-200">
          <v-card-title class="text-xl font-semibold text-brand-green-1 border-b">
            Technology We Trust
          </v-card-title>
          <v-card-text class="text-gray-700 leading-relaxed">
            Our platform is powered by technologies that prioritize both security and scalability:
            <ul class="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Frontend:</strong> Vue 3 + Vuetify for a responsive, accessible UI</li>
              <li><strong>Backend:</strong> Node.js + Express + MongoDB for secure and flexible data handling</li>
              <li><strong>Storage:</strong> Wasabi & Google Cloud with encrypted uploads and presigned URLs</li>
              <li><strong>Security:</strong> JWT authentication, rate limiting, and full audit logging</li>
            </ul>
            <p class="mt-4">
              From encryption to compliance checks, every interaction is designed to meet — and exceed —
              international data security standards.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Our Commitment -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-md border border-gray-200">
          <v-card-title class="text-xl font-semibold text-brand-green-1 border-b">
            Our Commitment
          </v-card-title>
          <v-card-text class="text-gray-700 leading-relaxed">
            HealthComm stands at the intersection of technology, privacy, and human care.
            We’re not just building another medical system — we’re building a foundation of
            <strong>digital trust</strong> that protects users and empowers healthcare providers.
            <p class="mt-4">
              As governments strengthen patient rights through legislation, we’re ensuring that technology stays one step ahead —
              making compliance effortless, transparency automatic, and security uncompromising.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
