<template>
  <main class="mt-10">
    <v-container>
      <v-row no-gutters>
        <v-col>
          <the-headline />
          <v-container
            class="mt-10 rounded-lg border border-brand-grey-1 bg-white p-10 shadow-md lg:mt-20"
          >
            <v-row no-gutters="">
              <v-col>
                <h1
                  class="pt-2 pb-5 lg:pt-5 lg:text-3xl text-center font-bold border text-brand-grey-4 rounded-lg bg-brand-green-1-translucent text-outline-greyrock"
                >
                  {{ $t("time_estimate") }}
                </h1>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import Footer from "@/components/Main/Footer.vue";
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
