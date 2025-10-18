<template>
  <v-dialog persistent v-model="open" max-width="600">
    <template #activator="{ props: dialogActivator }">
      <span class="text-brand-grey-1 semi-bold cursor-pointer" v-bind="dialogActivator">
        <template>{{  $t("terms_page.trigger") }}</template>
      </span>
    </template>

    <v-card>
      <v-card-title class="headline">
        <h2>{{  $t("terms_page.dialog_title") }}</h2>
      </v-card-title>

      <v-card-text class="terms-text">
        <div>
          <h4 class="font-bold mb-2">{{ $t("terms_of_service") }}</h4>
          <p>
            <strong>{{  $t("terms_page.effective_date") }}:</strong> 2025
          </p>
          <p>
            {{  $t("terms_page.intro") }}
          </p>
          <p>{{  $t("terms_page.read_carefully") }}</p>

          <v-divider id="section_1" class="my-3"></v-divider>
          <h5>
            <strong>1. {{  $t("terms_page.sections.1.title") }}</strong>
          </h5>
          <p>
            <strong>{{  $t("terms_page.sections.1.to_use_our_app") }}:</strong>
          </p>
          <ul>
            <li>
              {{  $t("terms_page.sections.1.point_1") }}
            </li>
            <li>
              {{  $t("terms_page.sections.1.point_2") }}
            </li>
          </ul>

          <v-divider id="section_2" class="my-3"></v-divider>
          <h5>
            <strong>2. {{  $t("terms_page.sections.2.title") }}</strong>
          </h5>
          <p>{{  $t("terms_page.sections.2.intro") }}:</p>
          <ul>
            <li>
              {{  $t("terms_page.sections.2.point_1") }}
            </li>
            <li>{{  $t("terms_page.sections.2.point_2") }}</li>
            <li>
              {{  $t("terms_page.sections.2.point_3") }}
            </li>
          </ul>
          <p>
            {{  $t("terms_page.sections.2.reminder") }}
          </p>

          <v-divider id="section_3" class="my-3"></v-divider>
          <h5>
            <strong>3. {{  $t("terms_page.sections.3.title") }}</strong>
          </h5>
          <ul>
            <li>
              {{  $t("terms_page.sections.3.point_1") }}
            </li>
            <li>
              {{  $t("terms_page.sections.3.point_2") }}
            </li>
            <li>
              {{  $t("terms_page.sections.3.point_3") }}
            </li>
          </ul>
          <v-divider id="section_4" class="my-3"></v-divider>
          <h5>
            <strong>4. {{  $t("terms_page.sections.4.title") }}</strong>
          </h5>
          <ul>
            <li>
              {{  $t("terms_page.sections.4.point_1") }}
            </li>
            <li>
              {{  $t("terms_page.sections.4.point_2") }}
            </li>
            <li>
              {{  $t("terms_page.sections.4.point_3") }}
            </li>
            <li>
              {{  $t("terms_page.sections.4.point_4") }}
            </li>
            <li>
              {{  $t("terms_page.sections.4.point_5") }}
            </li>
            <li>
              {{  $t("terms_page.sections.4.point_6") }}
            </li>
            <li>
              {{  $t("terms_page.sections.4.point_7") }}
            </li>
          </ul>
          <v-divider id="section_5" class="my-3"></v-divider>
          <h5>
            <strong>5. {{  $t("terms_page.sections.5.title") }}</strong>
          </h5>
          <p>{{  $t("terms_page.sections.5.body") }}</p>
          <v-divider id="section_6" class="my-3"></v-divider>
          <h5>
            <strong>6. {{  $t("terms_page.sections.6.title") }}</strong>
          </h5>
          <p>{{  $t("terms_page.sections.6.intro") }}</p>
          <ul>
            <li>
              {{  $t("terms_page.sections.6.point_1") }}
            </li>
            <li>
              {{  $t("terms_page.sections.6.point_2") }}
            </li>
          </ul>
          <p>
            {{  $t("terms_page.sections.6.note") }}
          </p>
          <v-divider id="section_7" class="my-3"></v-divider>
          <h5>
            <strong>7. {{  $t("terms_page.sections.7.title") }}</strong>
          </h5>
          <ul>
            <li>
              {{  $t("terms_page.sections.7.point_1") }}
            </li>
            <li>
              {{  $t("terms_page.sections.7.point_2") }}
            </li>
            <li>
              {{  $t("terms_page.sections.7.point_3") }}
            </li>
            <li>
              {{  $t("terms_page.sections.7.point_4") }}
            </li>
            <li>
              {{  $t("terms_page.sections.7.point_5") }}
            </li>
          </ul>
          <v-divider id="section_8" class="my-3"></v-divider>
          <h5>
            <strong>8. {{  $t("terms_page.sections.8.title") }}</strong>
          </h5>
          <li>
            {{  $t("terms_page.sections.8.point_1") }}
          </li>
          <li>
            {{  $t("terms_page.sections.8.point_2") }}
          </li>
          <li>
            {{  $t("terms_page.sections.8.point_3") }}
          </li>
          <v-divider id="section_9" class="my-3"></v-divider>
          <h5>
            <strong>9. {{  $t("terms_page.sections.9.title") }}</strong>
          </h5>
          <ul>
            <li>
              {{  $t("terms_page.sections.9.point_1") }}
            </li>
            <li>{{  $t("terms_page.sections.9.point_2") }}</li>
            <li>
              {{  $t("terms_page.sections.9.point_3") }}
            </li>
            <li>
              {{  $t("terms_page.sections.9.point_4") }}
            </li>
          </ul>
          <v-divider id="section_10" class="my-3"></v-divider>
          <h5>
            <strong>10. {{  $t("terms_page.sections.10.title") }}</strong>
          </h5>
          <p>
            {{  $t("terms_page.sections.10.intro") }}
          </p>
          <ul>
            <li>{{  $t("terms_page.sections.10.point_1") }}</li>
            <li>{{  $t("terms_page.sections.10.point_2") }}</li>
            <li>{{  $t("terms_page.sections.10.point_3") }}</li>
          </ul>
          <p>
            {{  $t("terms_page.sections.10.note") }}
          </p>
          <v-divider id="section_11" class="my-3"></v-divider>
          <h5>
            <strong>11. {{  $t("terms_page.sections.11.title") }}</strong>
          </h5>
          <p>{{  $t("terms_page.sections.11.intro") }}</p>
          <ul>
            <li>{{  $t("terms_page.sections.11.point_1") }}</li>
            <li>{{  $t("terms_page.sections.11.point_2") }}</li>
            <li>{{  $t("terms_page.sections.11.point_3") }}</li>
          </ul>
          <p>{{  $t("terms_page.sections.11.note") }}</p>
          <v-divider id="section_12" class="my-3"></v-divider>
          <h5>
            <strong>12. {{  $t("terms_page.sections.12.title") }}</strong>
          </h5>
          <p>
            {{  $t("terms_page.sections.12.body") }}
          </p>
          <v-divider id="section_13" class="my-3"></v-divider>
          <h5>
            <strong>13. {{  $t("terms_page.sections.13.title") }}</strong>
          </h5>
          <p>
            {{  $t("terms_page.sections.13.body") }}
          </p>
          <v-divider id="section_14" class="my-3"></v-divider>
          <h5>
            <strong>14. {{  $t("terms_page.sections.14.title") }}</strong>
          </h5>
          <p>
            {{  $t("terms_page.sections.14.body") }}
            <a :href="'mailto:support@lepgold.com'" class="link">support@dirtylep.com</a>
          </p>
        </div>
        <v-divider id="section_end" class="my-3"></v-divider>
        <p>
          <strong>{{  $t("terms_page.final_notice") }}</strong>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="close">{{ $t("close") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  toggle: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.toggle,
  (newVal) => {
    open.value = newVal;
  }
);
const emit = defineEmits(["close"]);
const open = ref(props.toggle);
const close = () => {
  open.value = false;
  emit("close");
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.link {
  color: blue;
  text-decoration: underline;
}
.terms-text {
  max-height: 500px;
  overflow-y: auto;
  font-size: 0.875rem;
  padding-right: 8px;
}
</style>
