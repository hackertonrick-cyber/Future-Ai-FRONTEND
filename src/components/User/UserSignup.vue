<template>
  <v-form ref="formRef" @submit.prevent="submit">
    <v-container class="py-10">
      <v-row justify="center">
        <v-col lg="6" md="8" sm="10" cols="12">
          <v-card class="rounded-xl border border-brand-grey-1 shadow-md overflow-hidden">
            <!-- 🔹 Header -->
            <v-card-title
              class="text-center text-brand-green-1 text-2xl font-semibold border-b bg-white"
            >
              {{ $t("patient_registration") }}
            </v-card-title>

            <!-- 🔹 Form Body -->
            <v-card-text class="bg-white py-8 px-6">
              <v-row dense>
                <!-- Username -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="state.username"
                    :label="$t('user_name')"
                    prepend-inner-icon="mdi-account"
                    :rules="rules.username"
                    required
                  />
                </v-col>

                <!-- Email -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="state.email"
                    :label="$t('email')"
                    prepend-inner-icon="mdi-email"
                    :rules="rules.email"
                    type="email"
                    required
                  />
                </v-col>

                <!-- Password -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="state.password"
                    :label="$t('password')"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="rules.password"
                    autocomplete="new-password"
                    required
                  />
                </v-col>

                <!-- Confirm Password -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="state.confirmPassword"
                    :label="$t('validate_password')"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirm = !showConfirm"
                    :type="showConfirm ? 'text' : 'password'"
                    :rules="rules.confirmPassword"
                    autocomplete="new-password"
                  />
                </v-col>

                <!-- First / Last Name -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="state.firstName"
                    :label="$t('first_name')"
                    prepend-inner-icon="mdi-account"
                    :rules="rules.firstName"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="state.lastName"
                    :label="$t('last_name')"
                    prepend-inner-icon="mdi-account"
                    :rules="rules.lastName"
                  />
                </v-col>

                <!-- Gender -->
                <v-col cols="12">
                  <v-radio-group
                    v-model="state.gender"
                    row
                    :rules="rules.gender"
                    class="pt-2"
                    label="Gender"
                  >
                    <v-radio value="male" :label="$t('male')" />
                    <v-radio value="female" :label="$t('female')" />
                    <v-radio value="other" :label="$t('other')" />
                  </v-radio-group>
                </v-col>

                <!-- Date of Birth -->
                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="showDatePicker"
                    transition="scale-transition"
                    offset-y
                    :close-on-content-click="false"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="state.dob"
                        :label="$t('date_of_birth')"
                        prepend-icon="mdi-calendar"
                        readonly
                        :rules="rules.dob"
                      />
                    </template>

                    <v-date-picker
                      v-model="state.dob"
                      @update:modelValue="showDatePicker = false"
                      show-adjacent-months
                    />
                  </v-menu>
                </v-col>

                <!-- Country -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="state.country"
                    :items="countryOptions"
                    item-title="description"
                    item-value="_id"
                    :label="$t('country')"
                    prepend-icon="mdi-earth"
                    :rules="rules.country"
                  />
                </v-col>

                <!-- Terms & Newsletter -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="state.termsCondition"
                    :label="$t('terms_agreement')"
                    :rules="rules.termsCondition"
                    color="brand-green-1"
                  />
                </v-col>

                <v-col cols="12">
                  <v-checkbox
                    v-model="state.newsLetters"
                    :label="$t('newsletter_optin')"
                    color="brand-green-1"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <!-- 🔹 Submit -->
            <v-card-actions class="bg-brand-green-1 justify-center py-6">
              <v-btn type="submit" color="white" class="text-brand-green-1 font-bold text-lg">
                {{ $t("register_caps") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useUserStore } from "@/stores/user"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const userStore = useUserStore()
const formRef = ref(null)
const showPassword = ref(false)
const showConfirm = ref(false)
const showDatePicker = ref(false)

// ✅ Static country list for MVP
const countryOptions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Jamaica",
  "Mexico",
  "Brazil",
  "Germany",
  "France",
  "India",
  "Nigeria",
  "South Africa",
]

const state = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  country: "",
  termsCondition: false,
  newsLetters: false,
  location: { lat: "", lng: "" },
})

const rules = {
  username: [(v) => !!v || t("user_name_required")],
  email: [
    (v) => !!v || t("email_required"),
    (v) => /.+@.+\..+/.test(v) || t("invalid_email"),
  ],
  password: [
    (v) => !!v || t("password_required"),
    (v) => v.length >= 8 || t("invalid_password"),
  ],
  confirmPassword: [(v) => v === state.password || t("password_did_not_match")],
  firstName: [(v) => !!v || t("first_name_required")],
  lastName: [(v) => !!v || t("last_name_required")],
  gender: [(v) => !!v || t("gender_required")],
  dob: [(v) => !!v || t("date_of_birth_required")],
  country: [(v) => !!v || t("country_required")],
  termsCondition: [(v) => v || t("terms_condition_required")],
}

const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // capture geolocation (optional MVP)
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve(p.coords),
        (err) => reject(err),
        { enableHighAccuracy: true }
      )
    })
    state.location.lat = pos.latitude
    state.location.lng = pos.longitude
  } catch {
    console.warn("Location access denied or unavailable.")
  }

  await userStore.REGISTER_PATIENT({ ...state })
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
