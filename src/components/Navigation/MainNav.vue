<template>
  <header :class="['w-full', 'text-sm lg:text-sm md:text-sm z-10', headerHeightClass]">
    <div class="fixed left-0 top-0 h-16 w-full bg-brand-green-1 lg:h-20">
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
      <v-container
        justify-center
        align-center
        class="w-full h-full flex-nowrap border-brand-grey-1 px-2 lg:px-8"
      >
        <v-row no-gutters align="center">
          <v-col cols="auto" class="mr-3">
            <router-link
              :to="{ name: 'Home' }"
              role="link"
              class="items-center text-brand-grey-1 text-xl lg:text-2xl md:text-sm font-bold tracking-wide"
              >{{ $t("leprechauns_gold") }}</router-link
            >
          </v-col>

          <v-col cols="auto" v-for="menuItem in state.menuItems" :key="menuItem.text">
            <nav>
              <v-row no-gutters>
                <v-divider vertical></v-divider>
                <v-col
                  class="ml-2 first:ml-0 lg:ml-7 text-xs lg:text-lg d-flex align-center"
                >
                  <router-link :to="menuItem.url" role="link" class="items-center"
                    >{{ $t(menuItem.text) }} <v-divider class="mx-2" vertical></v-divider
                  ></router-link>
                </v-col>
              </v-row>
            </nav>
          </v-col>
          <v-col> </v-col>
          <v-menu
            v-model="state.showTranslator"
            location="bottom end"
            transition="scale-transition"
            :offset="[0, 8]"
            :close-on-content-click="true"
            :z-index="4000"
          >
            <template #activator="{ props }">
              <!-- Wrap the custom icon in a plain div so v-menu can attach events reliably -->
              <div v-bind="props" class="inline-flex items-center">
                <!-- <v-icon
                  height="25"
                  width="30"
                  class="cursor-pointer text-brand-grey-2"
                  icon-name="TranslateIcon"
                  view-box="3 0 30 30"
                /> -->
                trans
              </div>
            </template>

            <v-list
              density="compact"
              class="local-menu overflow-hidden"
              style="width: 70%"
            >
              <v-list-item @click="translate('en')">
                <v-list-item-title>En</v-list-item-title>
              </v-list-item>
              <v-list-item @click="translate('es')">
                <v-list-item-title>Es</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-col cols="auto" class="pl-3">
            <div class="flex h-full items-center">
              <profile-image v-if="isLoggedIn" :avatar="avatarImage" @click="openMenu" />
              <v-btn
                v-else
                type="take-action"
                class="px-1 lg:px-2"
                text="login"
                @click="authForm"
              />
              <span v-if="hasNewNotification" class="align-top text-xl text-brand-red-1"
                >!</span
              >
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-row no-gutter>
        <v-col>
          <the-subnav v-if="isLoggedIn" />
        </v-col>
        <the-menu-nav v-model:openDrawer="state.open" />
      </v-row>
    </div>
  </header>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";

import ProfileImage from "@/components/Shared/ProfileImage.vue";
import TheSubnav from "./TheSubnav.vue";
import TheMenuNav from "./TheMenuNav.vue";

const router = useRouter();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();

const user = computed(() => userStore.user);
const isLoggedIn = computed(() => userStore.isLoggedIn);

const hasNewNotification = computed(() => {
  const list = userStore.notifications?.notifications ?? [];
  if (!Array.isArray(list) || list.length === 0) return false;

  const isUnviewed = (n) => {
    const status = String(n?.status ?? "").toLowerCase();
    if (["not_viewed", "unread", "new", "pending"].includes(status)) return true;
    if (n?.viewed === false) return true;
    if (n?.viewedAt == null && status !== "viewed") return true;
    return false;
  };

  return list.some(isUnviewed);
});

// ✅ Snackbar v-model with get/set (so the close action still works)
const snack = computed({
  get: () => Boolean(snackbarStore.snack?.visible),
  set: (val) => {
    if (!val) snackbarStore.CLOSE_SNACK();
  },
});

const state = reactive({
  menuItems: [
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
  () => {
    avatarVersion.value++;
  },
  { immediate: true }
);
const avatarImage = computed(() => {
  const src = user.value?.avatar;
  if (!src) return null;
  return `${src}?v=${avatarVersion.value}`;
});

// Translator/menu logic
const openTranslator = () => {
  state.showTranslator = !state.showTranslator;
};
const translate = (locale) => {
  userStore.SET_LOCAL(locale);
  state.showTranslator = false;
};
const authForm = () => {
  router.push({ name: "Login" });
};
const openMenu = () => {
  state.open = true;
};

const closeOnBackgroundScroll = (e) => {
  // Let the drawer handle its own scroll; we only care about background/page scroll.
  // If the target lives inside the drawer, TheMenuNav will stop propagation, so this won't fire.
  const target = e.target;
  if (
    target &&
    (target.closest(".drawer-container") || target.closest(".v-navigation-drawer"))
  ) {
    return; // let the drawer scroll normally
  }
  state.open = false;
  // allow page to scroll again
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";

  window.removeEventListener("wheel", closeOnBackgroundScroll, { passive: true });
  window.removeEventListener("touchmove", closeOnBackgroundScroll, { passive: true });
};

// Lock/unlock background scroll when drawer toggles
watch(
  () => state.open,
  (isOpen) => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.addEventListener("wheel", closeOnBackgroundScroll, true); // capture
      document.addEventListener("touchmove", closeOnBackgroundScroll, true); // capture
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("wheel", closeOnBackgroundScroll, true);
      document.removeEventListener("touchmove", closeOnBackgroundScroll, true);
    }
  },
  { flush: "post" }
);
// Safety: cleanup on unmount
onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  window.removeEventListener("wheel", closeOnBackgroundScroll, { passive: true });
  window.removeEventListener("touchmove", closeOnBackgroundScroll, { passive: true });
});
</script>

<style scoped>
.local-menu {
  /* Your existing look, now on the teleported menu surface */
  @apply border bg-brand-grey-2 shadow-md shadow-brand-green-3 hover:bg-brand-yellow-3 hover:bg-gradient-to-b hover:from-brand-green-3 hover:to-brand-green-1 hover:text-brand-grey-2;
}
.local-menu .v-list-item:hover {
  @apply bg-brand-yellow-3 text-brand-grey-2;
}
.local-picker {
}
</style>
