<template>
  <v-dialog v-model="isVisible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ $t("report_content") }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef" lazy-validation>
          <v-select
            v-model="state.type"
            :items="reportTypes"
            item-title="value"
            item-value="id"
            :label="$t('reason_for_report')"
            return-object
            single-line
            :rules="[rules.required]"
          />

          <v-textarea
            v-model="state.description"
            :label="$t('additional_detail_optional')"
            auto-grow
            rows="3"
            clearable
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="grey" @click="close">Cancel</v-btn>
        <v-btn
          color="error"
          :loading="ui.isLoadingGlobal"
          :disabled="!state.type"
          @click="handleSubmit"
        >
          {{ $t("submit_report") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useReportStore } from "@/stores/report.js";
import { useUiStore } from '@/stores/ui'
import { reportTypes } from "@/constants.js";

const ui = useUiStore()
const reportStore = useReportStore();
const props = defineProps({
  modelValue: Boolean,
  userReported: String,
  mediaId: String,
  messageId: String,
  commentId: String,
  contentRef: {
    type: String,
    required: true,
    validator: (val) =>
      [
        "media",
        "message",
        "comment",
        "profile",
        "story",
        "voice_message",
        "external_link",
        "avatar",
        "reply",
      ].includes(val),
  },
});
const emit = defineEmits(["update:modelValue", "submitted"]);

const isVisible = ref(props.modelValue);
const formRef = ref(null);

const state = reactive({
  type: null,
  description: "",
});

const rules = {
  required: (v) => !!v || "field_required",
};

const close = () => {
  resetForm();
  isVisible.value = false;
};

const resetForm = () => {
  state.type = "";
  state.description = "";
};

const handleSubmit = async () => {
  await reportStore.SUBMIT_REPORT({
    contentRef: props.contentRef,
    userReported: props.userReported,
    mediaId: props.mediaId,
    messageId: props.messageId,
    commentId: props.commentId,
    type: state.type.id,
    description: state.description,
  });
  close();
};

watch(
  () => props.modelValue,
  (val) => (isVisible.value = val)
);
watch(isVisible, (val) => emit("update:modelValue", val));
</script>
