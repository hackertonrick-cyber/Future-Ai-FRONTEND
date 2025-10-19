<template>
  <form @submit.prevent="submit">
    <v-container class="flex align-center justify-center min-h-screen" fluid>
      <v-row justify="center">
        <v-col lg="5" md="7" sm="8" cols="11">
          <v-card class="rounded-xl shadow-md border border-brand-grey-1 overflow-hidden">
            <!-- 🔹 Header -->
            <v-card-title
              class="text-center bg-white text-brand-green-1 text-2xl font-semibold border-b"
            >
              <span class="border-b-2 border-brand-green-1 px-2">
                {{ $t("sign_in") }}
              </span>
              <span
                class="ml-6 cursor-pointer text-gray-400 hover:text-brand-green-1"
                @click="signUp"
              >
                {{ $t("auth.sign_up") }}
              </span>
            </v-card-title>

            <!-- 🔹 Login Form -->
            <section class="bg-white py-10 px-6">
              <v-row justify="center" no-gutters class="font-semibold">
                <!-- Username / Email -->
                <v-col cols="12" class="pb-4">
                  <v-text-field
                    v-model="state.userName"
                    :label="$t('user_name')"
                    :rules="[(v) => rules.userName(v) || $t('userNameRequired')]"
                    variant="underlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                  />
                </v-col>

                <!-- Password -->
                <v-col cols="12" class="pb-4">
                  <v-text-field
                    v-model="state.password"
                    :label="$t('password')"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="[(v) => rules.password(v) || $t('passwordRequired')]"
                    variant="underlined"
                    density="comfortable"
                    hide-details="auto"
                  />
                </v-col>

                <!-- Toggle: Company Mode -->
                <v-col cols="12" class="pt-3">
                  <v-switch
                    v-model="state.isCompany"
                    inset
                    color="brand-green-1"
                    hide-details
                    class="font-semibold"
                    :label="$t('auth.login_as_company')"
                  />
                </v-col>

                <!-- Company Code Field (conditionally shown) -->
                <v-col v-if="state.isCompany" cols="12" class="pt-2">
                  <v-text-field
                    v-model="state.companyCode"
                    :label="$t('organization_code')"
                    :rules="[(v) => rules.companyCode(v) || $t('organizationCodeRequired')]"
                    variant="underlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                  />
                </v-col>
              </v-row>
            </section>

            <!-- 🔹 Actions -->
            <section class="bg-gray-50 border-t py-6 px-6">
              <v-card-actions class="flex flex-col gap-4">
                <v-btn
                  type="submit"
                  color="brand-green-1"
                  class="text-lg uppercase w-full"
                >
                  {{ $t("auth.login") }}
                </v-btn>

                <div
                  @click="authGoogle"
                  class="flex cursor-pointer items-center justify-center gap-3 rounded-md border p-2 transition hover:bg-gray-100 w-full"
                >
                  <span class="text-sm text-brand-grey-3">{{
                    $t("auth.google_continue")
                  }}</span>
                </div>

                <PasswordResetModal v-model="showResetModal" />
                <div
                  @click="showResetModal = true"
                  class="cursor-pointer text-center text-sm text-brand-grey-3 transition hover:text-brand-green-1"
                >
                  {{ $t("auth.forgot_password") }}
                </div>
              </v-card-actions>
            </section>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import PasswordResetModal from "@/components/Shared/PasswordResetModal.vue"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const showPassword = ref(false)
const showResetModal = ref(false)

const state = reactive({
  userName: "",
  password: "",
  companyCode: "",
  isCompany: false,
  isSuperAdmin: false,
})

// 🧭 Detect login mode from URL
onMounted(() => {
  const queryType = route.query.type?.toLowerCase()
  if (queryType === "admin") state.isSuperAdmin = true
  else if (queryType === "org") state.isCompany = true

  window.scrollTo(0, 0)
})

const rules = {
  userName: (v) => !!v || "userNameRequired",
  password: (v) => !!v || "passwordRequired",
  companyCode: (v) => !!v || "organizationCodeRequired",
}

const submit = async () => {
  if (!state.userName || state.password.length < 8) return

  const base = {
    username: state.userName,
    password: state.password,
  }

  if (state.isSuperAdmin) {
    await userStore.LOGIN({ ...base, userType: "admin" })
  } else if (state.isCompany) {
    await userStore.LOGIN({ ...base, userType: "org", companyCode: state.companyCode })
  } else {
    await userStore.LOGIN({ ...base, userType: "patient" })
  }
}

const authGoogle = () => userStore.LOGIN_GOOGLE()
const signUp = () => {
  if (state.isCompany) {
    // 👇 Redirect company sign-ups to the organization registration page
    router.push({ name: "TheCompanyRegistration" })
  } else {
    // 👇 Otherwise go to the normal signup flow
    router.push({ name: "Signup" })
  }
}
</script>

<style scoped>
.v-card {
  @apply overflow-hidden;
}
</style>
