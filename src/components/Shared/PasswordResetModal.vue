<template>
  <v-dialog v-model="isVisible" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ $t("reset_your_password") }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <div v-if="step === 1">
            <v-text-field
              v-model="state.email"
              :label="$t('email')"
              type="email"
              :rules="[rules.email]"
            />
          </div>
          <div v-else>
            <v-text-field v-model="state.code" label="Verification Code" required />
            <v-text-field
              v-model="state.password"
              :label="$t('new_password')"
              type="password"
              :rules="[rules.password]"
            />
            <v-text-field
              v-model="state.passwordMatch"
              :label="$t('retype_password')"
              type="password"
              :rules="[rules.passwordMatch]"
            />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" text @click="close">{{ $t("cancel") }}</v-btn>
        <v-btn
          :disabled="!passedEmail"
          :loading="loading"
          color="primary"
          @click="handleSubmit"
        >
          {{ step === 1 ? $t("send_code") : $t("reset_password") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useUserStore } from "@/stores/user";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:isVisible"]);

const userStore = useUserStore();
const loading = ref(false);
const step = ref(1);
const formRef = ref(null);
const isVisible = ref(props.modelValue);

const state = reactive({
  email: "",
  code: "",
  password: "",
  passwordMatch: "",
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const rules = {
  email: (value) => {
    if (!value) return "emailRequired";
    if (!emailRegex.test(value)) return "invalidEmail";
    return true;
  },
  password: (value) => {
    if (!value) return "passwordRequired";
    if (!passwordRegex.test(value)) {
      return "invalidPassword";
    }
    return true;
  },
  passwordMatch: (value) => {
    if (!value) return "please_confirm_password";
    return value === state.password || "passwordDidNotMatch";
  },
};

const close = () => {
  isVisible.value = false;
  resetForm();
};

const resetForm = () => {
  step.value = 1;
  state.email = "";
  state.code = "";
  state.password = "";
};
const passedEmail = computed(() => {
  if (step.value === 1) {
    return emailRegex.test(state.email);
  }
  if (step.value === 2) {
    return passwordRegex.test(state.password) && state.password === state.passwordMatch;
  }
  return false;
});
const handleSubmit = async () => {
  loading.value = true;
  try {
    if (step.value === 1) {
      if (state.email) {
        const response = await userStore.INITIATE_PASSWORD_RESET(state.email);
        if (!response?.error) step.value = 2;
      }
    } else {
      if (state.password === state.passwordMatch) {
        const response = await userStore.PASSWORD_RESET({
          email: state.email,
          code: state.code,
          password: state.password,
        });
        if (!response?.error) close();
      } else {
        console.warn("password does not match");
      }
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    isVisible.value = val;
  }
);
watch(isVisible, (val) => {
  emit("update:modelValue", val);
});
</script>
