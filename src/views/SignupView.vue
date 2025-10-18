<template>
  <div>
    <!-- Background Image Wrapper -->
    <div class="background-image"></div>
    <!-- App Content -->
    <div class="content-overlay">
      <user-signup class="h-screen" />
    </div>
  </div>
</template>

<script setup>
  import UserSignup from '@/components/User/UserSignup.vue'
</script>
<style scoped>
  .background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/image/LG_CAVE.jpg');
    background-size: cover;
    background-position: center;
    z-index: 1; /* Ensure it's behind everything */
  }

  .content-overlay {
    position: relative;
    z-index: 1; /* Content is above the background */
  }
</style>
