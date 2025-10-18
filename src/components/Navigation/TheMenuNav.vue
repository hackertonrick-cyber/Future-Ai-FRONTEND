<template>
  <div class="relative h-50 w-full p-0">
    <v-navigation-drawer
      v-model="drawerModel"
      :location="$vuetify.display.mobile ? 'bottom' : 'left'"
      class="drawer-container text-white overflow-hidden"
      temporary
      :scrim="true"
      @click:outside="closeDrawer"
      @keydown.esc="closeDrawer"
      @wheel.capture.stop
      @touchmove.capture.stop
    >
      <!-- Scrollable Content -->
      <div class="flex-grow overflow-auto">
        <v-list density="compact" nav>
          <!-- Notifications -->
          <v-list-item
            class="cursor-pointer bg-brand-yellow-1 text-lg text-brand-grey-1 hover:bg-brand-yellow-1"
            @click="openNotifications"
            :to="{ name: 'Notifications' }"
            link
          >
            <template #prepend>
              <lpg-icon
                v-if="!userHasNotification"
                height="25"
                width="25"
                icon-name="NoNotificationIcon"
                view-box="3 -1 24 22"
              />
              <lpg-icon
                v-else
                height="25"
                width="25"
                class="text-brand-red-3"
                icon-name="NotificationIcon"
                view-box="3 -1 24 22"
              />
            </template>
            <v-list-item-title>{{ $t("notifications") }}</v-list-item-title>
          </v-list-item>

          <!-- Dynamic Menu -->
          <v-list-item
            v-for="item in safeMenuItems"
            :key="item.text"
            class="bg-brand-yellow-1 text-lg text-brand-grey-1 hover:bg-brand-yellow-1"
            :to="item.to"
            link
          >
            <template #prepend>
              <lpg-icon
                height="22"
                width="25"
                :icon-name="item.icon"
                view-box="3 -1 24 22"
              />
            </template>
            <v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- Sticky Footer -->
      <v-divider class="mx-2 my-2"></v-divider>
      <div
        class="mt-auto text-center py-3 bg-brand-green-1 cursor-pointer"
        @click="logout"
      >
        <font-awesome-icon class="rounded-md pr-2" :icon="['fa', 'right-from-bracket']" />
        <span class="text-white text-lg pb-20">{{ $t("sign_out") }}</span>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/user";

const props = defineProps({
  openDrawer: { type: Boolean, required: true, default: false },
});
const emit = defineEmits(["closeDrawer", "update:openDrawer"]);

const userStore = useUserStore();
const display = useDisplay();

// v-model proxy for the drawer
const drawerModel = computed({
  get: () => props.openDrawer,
  set: (v) => emit("update:openDrawer", v),
});

// Notification badge logic (robust/unviewed)
const userHasNotification = computed(() => {
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

// Menu items computed so it reacts to user changes
const safeMenuItems = computed(() => {
  const uid = userStore.user?._id;
  return [
    // Only show Gallery when user exists
    ...(uid
      ? [
          {
            link: "Gallery",
            text: "gallery",
            icon: "GalleryIcon",
            to: { name: "Gallery", params: { userId: uid } },
          },
        ]
      : []),
    { link: "KYC", text: "kyc", icon: "FootprintIcon", to: { name: "KYC" } },
  ];
});

const closeDrawer = () => {
  emit("update:openDrawer", false);
};

const openNotifications = () => {
  closeDrawer();
};

const logout = () => {
  userStore.LOGOUT();
  closeDrawer();
};
</script>

<style scoped>
.drawer-container {
  background: linear-gradient(0deg, rgba(252, 238, 33, 1) 25%, rgba(46, 152, 19, 1) 74%);
}
</style>
