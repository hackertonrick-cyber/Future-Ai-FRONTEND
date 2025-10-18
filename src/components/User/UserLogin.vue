<template>
  <form @submit.prevent="submit">
    <v-container class="flex align-center justify-center min-h-screen" fluid>
      <v-row justify="center">
        <v-col lg="5" md="7" sm="7" cols="10">
          <v-row no-gutters class="justify-center pt-20">
            <v-col class="rounded-xl border border-brand-grey-1 shadow-md lg:mr-20">
              <section
                class="rounded-t-xl opacity-85 border-b border-brand-green-1 bg-white pt-5 pb-10 text-brand-green-1"
              >
                <v-card-title
                  class="bg-white border-b text-brand-green-1 text-center text-2xl font-semibold"
                >
                  <span class="border-b-2 border-brand-green-1 px-2">{{
                    $t("auth.sign_in")
                  }}</span>
                  <span
                    class="ml-6 cursor-pointer text-gray-400 hover:text-brand-green-1"
                    @click="signUp"
                  >
                    {{ $t("auth.sign_up") }}
                  </span>
                </v-card-title>
              </section>
              <section
                class="border-b border-brand-grey-1 pt-10 pb-10 bg-black opacity-40"
              >
                <v-row justify="center" no-gutters class="font-semibold">
                  <v-col cols="10">
                    <v-text-field
                      v-model="state.userName"
                      :label="$t('user_name')"
                      :rules="[
                        (v) => {
                          const res = rules.userName(v);
                          return res === true ? true : $t(res);
                        },
                      ]"
                      variant="underlined"
                      density="comfortable"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center" no-gutters class="font-semibold">
                  <v-col cols="10">
                    <v-text-field
                      v-model="state.password"
                      :label="$t('password')"
                      :type="showPassword ? 'text' : 'password'"
                      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showPassword = !showPassword"
                      :rules="[
                        (v) => {
                          const res = rules.password(v);
                          return res === true ? true : $t(res);
                        },
                      ]"
                      variant="underlined"
                      density="comfortable"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </section>
              <section
                class="rounded-b-xl border-t border-brand-grey-1 bg-white opacity-85"
              >
                <v-container class="divide-y-2 lg:text-xl">
                  <v-card-actions class="flex flex-col gap-4 px-6 py-4 bg-white">
                    <v-btn
                      type="take-action"
                      class="text-lg uppercase w-full"
                      text="auth.login"
                    />

                    <div
                      @click="authGoogle"
                      class="flex cursor-pointer items-center justify-center gap-3 rounded-md border p-2 transition hover:bg-gray-100"
                    >
                      <lpg-icon
                        height="25"
                        width="30"
                        icon-name="GoogleIcon"
                        viewBox="0 0 25 26"
                      />
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
                </v-container>
              </section>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </form>
  <Footer />
</template>

<script setup>
import { reactive, computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import Footer from "@/components/Main/Footer.vue";
import PasswordResetModal from "@/components/Shared/PasswordResetModal.vue";

const router = useRouter();
const userStore = useUserStore();
const showPassword = ref(false);

const state = reactive({
  userName: "",
  password: "",
});
const showResetModal = ref(false);

onMounted(() => {
  window.scrollTo(0, 0);
});

const rules = {
  userName: (value) => {
    if (!value) return "userNameRequired";
    return true;
  },
  password: (value) => {
    if (!value) return "passwordRequired";
    return true;
  },
};

const submit = async () => {
  if (state.userName.length && state.password.length >= 8) {
    await userStore.LOGIN({ ...state });
  }
};
const authGoogle = async () => {
  userStore.LOGIN_GOOGLE();
};
const signUp = () => {
  router.push({ name: "Signup" });
};
</script>

<style lang="postcss" scoped>
/* ANIMATIONS */
/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  @apply bg-brand-green-1;
  content: "";
  transition: width 0.3s;
}

.underlineHover:hover:after {
  width: 100%;
}
</style>
