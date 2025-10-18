<template>
  <v-dialog persistent v-model="open" max-width="600">
    <v-card>
      <v-card-title class="headline">
        <h2>{{  $t("privacy_page.title") }}</h2>
      </v-card-title>

      <v-card-text class="terms-text">
        <p>
          <strong>{{  $t("privacy_page.effective_date") }}</strong> 2025
        </p>
        <v-divider class="my-3"></v-divider>
        <p>
          {{  $t("privacy_page.intro") }}
        </p>
        <v-divider id="section_1" class="my-3"></v-divider>
        <p>
          <strong>1.{{  $t("privacy_page.sections.1.title") }}</strong>
        </p>
        <p>{{  $t("privacy_page.sections.1.intro") }}</p>
        <ul>
          <li>
            {{  $t("privacy_page.sections.1.point_1") }}
          </li>
          <li>
            {{  $t("privacy_page.sections.1.point_2") }}
          </li>
          <li>
            {{  $t("privacy_page.sections.1.point_3") }}
          </li>
          <li>
            {{  $t("privacy_page.sections.1.point_4") }}
          </li>
          <li>
            {{  $t("privacy_page.sections.1.point_5") }}
          </li>
          <li>
            {{  $t("privacy_page.sections.1.point_6") }}
          </li>
        </ul>
        <p>
          {{  $t("privacy_page.sections.1.summary") }}
        </p>

        <v-divider id="section_2" class="my-3"></v-divider>
        <p>
          <strong>2.{{  $t("privacy_page.sections.2.title") }}</strong>
        </p>
        <p>{{  $t("privacy_page.sections.2.intro") }}</p>
        <ul>
          <li>{{  $t("privacy_page.sections.2.point_1") }}</li>
          <li>
            {{  $t("privacy_page.sections.2.point_2") }}
          </li>
          <li>{{  $t("privacy_page.sections.2.point_3") }}</li>
          <li>{{  $t("privacy_page.sections.2.point_4") }}</li>
          <li>{{  $t("privacy_page.sections.2.point_5") }}</li>
        </ul>

        <v-divider id="section_3" class="my-3"></v-divider>
        <p>
          <strong>3. {{  $t("privacy_page.sections.3.title") }}</strong>
        </p>
        <p>{{  $t("privacy_page.sections.3.intro") }}</p>
        <ul>
          <li>
            {{  $t("privacy_page.sections.3.point_1") }}
          </li>
          <li>{{  $t("privacy_page.sections.3.point_2") }}</li>
          <li>
            {{  $t("privacy_page.sections.3.point_3") }}
          </li>
        </ul>
        <p>
          {{  $t("privacy_page.sections.3.summary") }}
        </p>

        <v-divider id="section_4" class="my-3"></v-divider>
        <p>
          <strong>4. {{  $t("privacy_page.sections.4.title") }}</strong>
        </p>
        <p>
          {{  $t("privacy_page.sections.4.content") }}
        </p>

        <v-divider id="section_5" class="my-3"></v-divider>
        <p>
          <strong>5. {{  $t("privacy_page.sections.5.title") }}</strong>
        </p>
        <p>{{  $t("privacy_page.sections.5.intro") }}</p>
        <ul>
          <li>
            {{  $t("privacy_page.sections.5.point_1") }}
          </li>
          <li>{{  $t("privacy_page.sections.5.point_2") }}</li>
          <li>{{  $t("privacy_page.sections.5.point_3") }}</li>
        </ul>
        <p>
          {{  $t("privacy_page.sections.5.summary") }}
        </p>

        <v-divider id="section_6" class="my-3"></v-divider>
        <p>
          <strong>6. {{  $t("privacy_page.sections.6.title") }}</strong>
        </p>
        <p>{{  $t("privacy_page.sections.6.intro") }}</p>
        <ul>
          <li>{{  $t("privacy_page.sections.6.point_1") }}</li>
          <li>{{  $t("privacy_page.sections.6.point_2") }}</li>
          <li>{{  $t("privacy_page.sections.6.point_3") }}</li>
        </ul>
        <p>{{  $t("privacy_page.sections.6.summary") }}</p>

        <v-divider id="section_7" class="my-3"></v-divider>
        <p>
          <strong>7. {{  $t("privacy_page.sections.7.title") }}</strong>
        </p>
        <p>{{  $t("privacy_page.sections.7.intro") }}</p>
        <ul>
          <li>{{  $t("privacy_page.sections.7.point_1") }}</li>
          <li>{{  $t("privacy_page.sections.7.point_2") }}</li>
        </ul>
        <p>{{  $t("privacy_page.sections.7.summary") }}</p>

        <v-divider id="section_8" class="my-3"></v-divider>
        <p>
          <strong>8. {{  $t("privacy_page.sections.8.title") }}</strong>
        </p>
        <p>
          {{  $t("privacy_page.sections.8.content") }}
        </p>

        <v-divider id="section_9" class="my-3"></v-divider>
        <p>
          <strong>9. {{  $t("privacy_page.sections.9.title") }}</strong>
        </p>
        <p>
          {{  $t("privacy_page.sections.9.content") }}
        </p>

        <v-divider id="section_10" class="my-3"></v-divider>
        <p>
          <strong>10. {{  $t("privacy_page.sections.10.title") }}</strong>
        </p>
        <p>
          {{  $t("privacy_page.sections.10.content")
          }}<a :href="'mailto:support@lepgold.com'" class="link">support@dirtylep.com</a>
        </p>
        <v-divider id="section_end" class="my-3"></v-divider>
        <p>
          <strong> {{  $t("privacy_page.footer") }}</strong>
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
