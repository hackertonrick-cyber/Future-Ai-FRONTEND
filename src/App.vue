<template>
  <v-app class="app-layout">
    <main-nav />
    <v-main class="flex-grow-1 d-flex flex-column">
      <router-view v-slot="{ Component, route }">
        <transition
          :enter-active-class="route.meta.enterClass"
          :leave-active-class="route.meta.leaveClass"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Global loading overlay -->
    <v-overlay
      :model-value="ui.isLoadingGlobal"
      persistent
      class="d-flex align-center justify-center"
      scrim
      z-index="3000"
    >
      <v-progress-circular
        class="bottom-0 top-0 text-brand-green-3"
        :size="90"
        :width="9"
        indeterminate
      />
    </v-overlay>
  </v-app>
</template>

<script setup>
import MainNav from "@/components/Navigation/MainNav.vue";
import { useUiStore } from "@/stores/ui";
const ui = useUiStore();
</script>
