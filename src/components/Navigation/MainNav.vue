<template>
  <header :class="['w-full z-10', headerHeightClass]">
    <div class="fixed left-0 top-0 h-16 w-full bg-brand-green-1 lg:h-20 shadow-sm">
      <!-- ✅ Global Snackbar -->
      <v-snackbar
        v-model="snack"
        :color="snackbarStore.snack.type"
        timeout="-1"
        location="top right"
        elevation="4"
      >
        {{ snackbarStore.snack.text }}
        <template #actions>
          <v-btn variant="text" @click="snackbarStore.CLOSE_SNACK()">{{
            $t("close")
          }}</v-btn>
        </template>
      </v-snackbar>

      <!-- ✅ Nav Container -->
      <v-container class="flex items-center justify-between h-full px-4 lg:px-10">
        <!-- 🔹 Logo / Brand -->
        <router-link
          :to="{ name: 'Home' }"
          class="flex items-center text-white font-bold tracking-wide text-lg lg:text-2xl"
        >
          <span class="text-brand-yellow-3 mr-1">Health</span>Comm
        </router-link>

        <!-- 🔹 Menu Items -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="menuItem in state.menuItems"
            :key="menuItem.text"
            :to="menuItem.url"
            class="text-white hover:text-brand-yellow-3 transition-colors duration-200 text-sm font-medium"
          >
            {{ $t(menuItem.text) }}
          </router-link>
        </nav>

        <!-- 🔹 Right Controls -->
        <div class="flex items-center space-x-4">
          <!-- 🌐 Language Picker -->
          <v-menu
            v-model="state.showTranslator"
            location="bottom end"
            transition="scale-transition"
            :offset="[0, 8]"
            :close-on-content-click="true"
            :z-index="4000"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                class="text-white hover:text-brand-yellow-3"
                title="Change Language"
              >
                <v-icon>mdi-translate</v-icon>
              </v-btn>
            </template>

            <v-list density="compact" class="local-menu w-24">
              <v-list-item @click="translate('en')">
                <v-list-item-title>English</v-list-item-title>
              </v-list-item>
              <v-list-item @click="translate('es')">
                <v-list-item-title>Español</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- 👤 Profile / Auth -->
          <div class="flex items-center">
            <v-btn
              v-if="!isLoggedIn"
              color="white"
              variant="outlined"
              class="capitalize"
              @click="authForm"
            >
              {{ $t("login") }}
            </v-btn>
          </div>

          <!-- ☰ Mobile Menu -->
          <v-btn
            v-if="isLoggedIn"
            icon
            variant="text"
            class="md:hidden text-white hover:text-brand-yellow-3"
            @click="openMenu"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>
      </v-container>

      <!-- 🔹 Mobile Drawer -->
      <the-menu-nav v-model:openDrawer="state.open" />
    </div>
  </header>
</template>

<script setup>
import { computed, reactive, ref, watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";

import ProfileImage from "@/components/Shared/ProfileImage.vue";
import TheMenuNav from "./TheMenuNav.vue";

const router = useRouter();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();

const user = computed(() => userStore.user);
const isLoggedIn = computed(() => userStore.isLoggedIn);

const hasNewNotification = computed(() => {
  const list = userStore.notifications?.notifications ?? [];
  return list.some(
    (n) =>
      ["not_viewed", "unread", "new", "pending"].includes(
        (n?.status ?? "").toLowerCase()
      ) || n?.viewed === false
  );
});

const snack = computed({
  get: () => Boolean(snackbarStore.snack?.visible),
  set: (val) => !val && snackbarStore.CLOSE_SNACK(),
});

const state = reactive({
  menuItems: [
    { text: "home", url: "/" },
    { text: "services", url: "/services" },
    { text: "about", url: "/about" },
    { text: "contact", url: "/contact" },
  ],
  showTranslator: false,
  open: false,
});

const headerHeightClass = computed(() => ({
  "h-20": !state.open,
  "h-34": userStore.isLoggedIn,
}));

const avatarVersion = ref(0);
watch(
  () => user.value?.avatar,
  () => avatarVersion.value++,
  { immediate: true }
);
const avatarImage = computed(() =>
  user.value?.avatar ? `${user.value.avatar}?v=${avatarVersion.value}` : null
);

const translate = (locale) => {
  userStore.SET_LOCAL(locale);
  state.showTranslator = false;
};

const authForm = () => router.push({ name: "Login" });
const openMenu = () => (state.open = true);

// Background scroll lock logic
const closeOnBackgroundScroll = (e) => {
  const target = e.target;
  if (target?.closest(".drawer-container") || target?.closest(".v-navigation-drawer"))
    return;
  state.open = false;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
};

watch(
  () => state.open,
  (isOpen) => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    document.body.style.overflow = isOpen ? "hidden" : "";
    const fn = isOpen ? "addEventListener" : "removeEventListener";
    window[fn]("wheel", closeOnBackgroundScroll, true);
    window[fn]("touchmove", closeOnBackgroundScroll, true);
  },
  { flush: "post" }
);

onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  window.removeEventListener("wheel", closeOnBackgroundScroll, true);
  window.removeEventListener("touchmove", closeOnBackgroundScroll, true);
});
</script>

<style scoped>
.local-menu {
  @apply bg-white border border-brand-green-2 shadow-md;
}
.local-menu .v-list-item:hover {
  @apply bg-brand-green-1 text-white;
}
</style>
