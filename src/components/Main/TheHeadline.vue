<template>
  <div class="headline-container">
    <h1 class="headline-title">
      <slot name="title">Your Health, Our Priority</slot>
    </h1>

    <p v-if="$slots.subtitle" class="headline-subtitle">
      <slot name="subtitle"></slot>
    </p>

    <div v-if="$slots.actions" class="headline-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.headline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

.headline-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0d1b2a;
  margin-bottom: 0.5rem;
}

.headline-subtitle {
  font-size: 1rem;
  color: #4a5568;
  max-width: 600px;
  line-height: 1.5;
}

.headline-actions {
  margin-top: 1.5rem;
}
</style>
