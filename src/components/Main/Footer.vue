<template>
  <v-footer class="mt-5">
    <v-row no-gutters class="text-center w-100" justify="center">
      <v-col cols="auto" class="text-body-2 pr-1">
        &copy; {{ new Date().getFullYear() }} {{ $t("dirty_lep_all_rights_reserved") }}
      </v-col>
      <v-col cols="auto" class="text-body-2">
        <span
          @click="termsDialog = true"
          class="underline text-brand-green-2 dark:text-brand-green-3"
          >{{ $t("terms") }}</span
        >
        {{ $t("and") }}
        <span
          @click="privacyDialog = true"
          class="underline text-brand-green-2 dark:text-brand-green-3"
          >{{ $t("privacy") }}</span
        >
      </v-col>
    </v-row>
    <Terms @close="closeDialog" :toggle="termsDialog" />
    <Privacy @close="closeDialog" :toggle="privacyDialog" />
  </v-footer>
</template>

<script setup>
import Terms from "@/components/Shared/Terms.vue";
import Privacy from "@/components/Shared/Privacy.vue";
import { ref } from "vue";

const termsDialog = ref(false);
const privacyDialog = ref(false);

const closeDialog = () => {
  termsDialog.value = false;
  privacyDialog.value = false;
};
</script>
