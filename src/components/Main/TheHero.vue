<template>
  <main class="mt-10">
    <v-container>
      <v-row no-gutters>
        <v-col>
          <the-headline />
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import TheHeadline from "@/components/Main/TheHeadline.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  const token = route.query.token;

  if (token) {
    try {
      userStore.GET_GOOGLE_AUTH_TEMP_DATA(token);
    } catch (error) {
      console.error("Failed to login", error);
      router.push("/login");
    }
  }
});
</script>
<style scoped>
.header {
  position: relative;
  z-index: 10; /* Lower than the nav menu */
}
.bg-brand-green-1-translucent {
  background-color: rgba(77, 167, 54); /* Replace with appropriate RGBA color */
}
</style>
