<template>
  <div>
     <the-hero />
    <div class="background-image"></div>
  </div>


</template>

<script setup>
import TheHero from "@/components/Main/TheHero.vue";
</script>

<style scoped>
.background-image {
  background-image: url('@/assets/image/healthcom2.png');
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 1; /* Ensure it's behind everything */
}

</style>
