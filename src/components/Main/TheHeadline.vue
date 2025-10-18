<template>
  <section class="w-full text-center bg-brand-grey-2 rounded pt-7" style="height: 230px">
    <transition name="fade" mode="out-in">
      <h1
        :key="action"
        class="text-3xl font-extrabold min-h-25 max-h-25 tracking-tight leading-tight sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl transition-all duration-700 ease-in-out px-5"
      >
        <span :class="['animated-text', actionClasses]">{{ $t(action) }}</span>
      </h1>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import nextElementInList from "@/utils/nextElementInList";

const action = ref("cross_the_line");
const interval = ref(null);

const actionClasses = computed(() => {
  switch (action.value) {
    case "cross":
      return "dare text-outline-gold";
    case "your":
      return "build text-outline-greyrock";
    case "the":
      return "steal text-outline-gold";
    case "cut":
      return "gold text-outline-clover";
    default:
      return "";
  }
});

const changeTitle = () => {
  const actions = ["cross", "your", "the", "cut"];
  interval.value = setInterval(() => {
    action.value = nextElementInList(actions, action.value);
  }, 5000);
};
changeTitle();

onBeforeUnmount(() => clearInterval(interval));
</script>
<style scoped>
.animated-text {
  transition: color 0.5s ease-in-out, transform 0.3s ease;
  will-change: transform, color;
}

/* Font color themes */
.dare {
  color: #303133; /* Blue - Risk */
}
.build {
  color: #34a853; /* Green - Strategy */
}
.steal {
  color: #bd473f; /* Red - Betrayal */
}
.gold {
  color: #f9ab00; /* Gold - Victory */
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
