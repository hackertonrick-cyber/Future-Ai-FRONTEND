<template>
  <v-form @submit.prevent="submit" ref="formRef">
    <v-container class="lg:top-1/4">
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" xl="8" lg="8" md="8" sm="10">
          <section
            class="rounded-t-xl border-t text-center border-brand-grey-1 bg-brand-yellow-2 pt-10 pb-10"
          >
            <span class="uppercase lg:text-3xl">
              {{ $t("join_heist_title") }}
            </span>
          </section>
          <v-container
            class="border border-brand-grey-1 bg-black opacity-60 shadow-md lg:mr-20"
          >
            <v-row class="font-semibold">
              <v-col>
                <v-text-field
                  v-model="state.userName"
                  prepend-inner-icon="mdi-account"
                  :placeholder="$t('user_name')"
                  :rules="rules.userName"
                  type="text"
                />
                <v-text-field
                  v-model="state.email"
                  prepend-inner-icon="mdi-email"
                  :placeholder="$t('email')"
                  :rules="rules.email"
                  type="email"
                />
                <v-text-field
                  v-model="state.password"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :placeholder="$t('password')"
                  :rules="rules.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                />
                <v-text-field
                  v-model="state.validatePassword"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showValidatePassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showValidatePassword = !showValidatePassword"
                  :placeholder="$t('validate_password')"
                  :rules="rules.validatePassword"
                  :type="showValidatePassword ? 'text' : 'password'"
                />
                <v-text-field
                  v-model="state.firstName"
                  prepend-inner-icon="mdi-account"
                  :placeholder="$t('first_name')"
                  :rules="rules.firstName"
                  type="text"
                />
                <v-text-field
                  v-model="state.lastName"
                  prepend-inner-icon="mdi-account"
                  :placeholder="$t('last_name')"
                  :rules="rules.lastName"
                  type="text"
                />

                <v-row no-gutters justify="center">
                  <v-col cols="auto">
                    <v-radio-group v-model="state.gender" row :rules="rules.gender">
                      <v-radio
                        v-for="option in ['male', 'female', 'other']"
                        :key="option"
                        :label="$t(option)"
                        :value="option"
                      />
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-container class="pb-0 pt-0">
                  <label for="dob" class="block mb-2 text-sm font-medium">{{
                    $t("dob_label")
                  }}</label>
                  <v-text-field
                    v-model="state.dob"
                    :rules="rules.dob"
                    :label="$t('dob_picker_label')"
                    prepend-icon="mdi-calendar"
                    readonly
                    @click="showDatePicker = true"
                  />
                  <v-dialog v-model="showDatePicker" persistent max-width="350px">
                    <v-card class="items-center">
                      <v-date-picker
                        @update:modelValue="onDateSelected"
                        show-adjacent-months
                        :locale="currentLocale"
                      />
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="showDatePicker = false">{{
                          $t("cancel")
                        }}</v-btn>
                        <v-btn text @click="showDatePicker = false">OK</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-container>
                <v-container class="pb-0 pt0">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <label for="country-select" class="block mb-2 text-sm font-medium">
                        {{ $t("country_label") }}
                      </label>

                      <v-select
                        v-model="state.country"
                        :items="loading ? [] : countryOptions"
                        item-title="description"
                        item-value="_id"
                        :rules="rules.country"
                        variant="outlined"
                        prepend-icon="mdi-earth"
                        :placeholder="$t('country_placeholder')"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-row no-gutters class="lg:text-xl">
                  <v-col cols="12">
                    <v-checkbox
                      v-model="state.termsCondition"
                      :label="$t('terms_agreement')"
                      :rules="rules.termsCondition"
                      class="check-item"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters class="lg:text-xl">
                  <v-col cols="auto">
                    <v-checkbox
                      v-model="state.newsLetters"
                      :label="$t('newsletter_optin')"
                      class="check-item"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <!--  -->

          <section
            class="rounded-b-xl border-t border-brand-grey-1 bg-brand-yellow-2 mb-20"
          >
            <v-container class="lg:text-xl">
              <v-row no-gutters>
                <v-col cols="12">
                  <div type="submit" class="grid">
                    <v-btn type="take-action" class="text-lg" text="register_caps" />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </section>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </v-form>
</template>

<script setup>
import { reactive, computed, onMounted, onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Main/Footer.vue";
import { useUserStore } from "@/stores/user";
import { useCountriesStore } from "@/stores/countries";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
const currentLocale = computed(() => locale.value);
const userStore = useUserStore();
const countriesStore = useCountriesStore();
const formRef = ref(null);
const loading = ref(true);
const formattedDob = ref("");
const showDatePicker = ref(false);
const route = useRoute();
const locationError = ref("");
const locationAllowed = ref(false);
const countryOptions = computed(() => countriesStore.countries);
const showPassword = ref(false);
const showValidatePassword = ref(false);

const state = reactive({
  googleId: "",
  avatar: "",
  email: "",
  password: "",
  validatePassword: "",
  firstName: "",
  lastName: "",
  userName: "",
  gender: "",
  dob: "",
  country: "",
  location: { lng: "", lat: "" },
  termsCondition: false,
  newsLetters: false,
});

const rules = {
  userName: [
    (v) => !!v || t("user_name_required"),
    (v) => (v && v.length >= 6) || t("invalid_user_name"),
  ],
  email: [
    (v) => !!v || t("email_required"),
    (v) => /.+@.+\..+/.test(v) || t("invalid_email"),
  ],
  password: [
    (v) => !!v || t("password_required"),
    (v) => (v && v.length >= 10) || t("invalid_password"),
  ],
  validatePassword: [
    (v) => !!v || t("password_required"),
    (v) => v === state.password || t("password_did_not_match"),
  ],
  firstName: [
    (v) => !!v || t("first_name_required"),
    (v) => (v && v.length >= 3) || t("invalid_first_name"),
  ],
  lastName: [
    (v) => !!v || t("last_name_required"),
    (v) => (v && v.length >= 3) || t("invalid_last_name"),
  ],
  gender: [(v) => !!v || t("gender_required")],
  dob: [(v) => !!v || t("date_of_birth_required")],
  country: [(v) => !!v || t("country_required")],
  termsCondition: [(v) => v === true || t("terms_condition_required")],
};

const onDateSelected = (val) => {
  state.dob = formatDate(val);
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

watch(
  () => state.dob,
  (val) => {
    formattedDob.value = formatDate(val);
  }
);

const requestUserLocation = async (retries = 1) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      locationError.value = "Geolocation is not supported.";
      return reject(new Error("Geolocation unsupported."));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.location.lat = pos.coords.latitude;
        state.location.lng = pos.coords.longitude;
        locationAllowed.value = true;
        locationError.value = "";
        resolve(true);
      },
      async (err) => {
        locationAllowed.value = false;

        if (err.code === err.PERMISSION_DENIED && retries > 0) {
          const retry = confirm(
            "This feature requires your location. Would you like to allow access and try again?"
          );

          if (retry) {
            try {
              await requestUserLocation(retries - 1);
              return resolve(true);
            } catch (e) {
              locationError.value = "Location access denied.";
              return reject(e);
            }
          } else {
            locationError.value = "Location access denied by user.";
            return reject(new Error("User denied location."));
          }
        } else {
          locationError.value = "Failed to get your location.";
          return reject(err);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

onBeforeMount(async () => {
  if (!countriesStore.countries.length) {
    await countriesStore.FETCH_COUNTRIES();
  }
  loading.value = false;
});

onMounted(async () => {
  const token = route.query.token;

  if (token) {
    try {
      const response = await userStore.GET_GOOGLE_SIGNUP_DATA(token, t);
      if (response?.userData) {
        Object.assign(state, response.userData);
      }
    } catch (err) {
      console.error("Google signup data fetch failed:", err);
    }
  }

  try {
    await requestUserLocation(1);
  } catch (e) {
    console.warn("Initial location attempt failed:", e.message);
  }
});

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }
  if (!locationAllowed.value) {
    locationError.value = "You must enable location access to proceed.";
    try {
      await requestUserLocation(1);
    } catch (e) {
      return;
    }
  }

  await userStore.REGISTER({ ...state });
};
</script>

<style lang="postcss" scoped>
.check-item {
  @apply h-full min-w-max accent-brand-green-1 lg:w-5 text-lg font-semibold pl-2;
}

.error {
  @apply grid justify-start text-brand-red-2;
}

.dob-input {
  font-size: 1rem;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9fafb;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

.dob-input:focus {
  border-color: #42a5f5;
}

.dob-input .v-input__icon {
  cursor: pointer;
}
</style>
