<template>
  <v-container
    class="d-flex flex-column align-center justify-center min-h-screen font-poppins text-brand-yellow-1"
    fluid
  >
    <v-row class="justify-center">
      <h1 class="text-4xl md:text-7xl font-bold text-brand-red-1 mb-6 animate__animated animate__shakeX">
        404
      </h1>
    </v-row>
    <v-row class="justify-center mb-6">
      <h2 class="text-xl md:text-3xl uppercase">
        {{ $t('not_found_title', 'Page Not Found') }}
      </h2>
    </v-row>
    <v-row class="justify-center mb-4">
      <p class="text-brand-grey-3 text-base md:text-lg text-center">
        {{ $t('not_found_desc', 'Sorry, the page you are looking for does not exist or has been moved.') }}
      </p>
    </v-row>
    <v-row class="justify-center mt-8">
      <router-link :to="{ name: 'Home' }">
        <v-btn color="brand-blue-1" size="large" class="rounded-2xl shadow-xl px-8 py-4 text-lg font-semibold">
          {{ $t('go_home', 'Back to Home') }}
        </v-btn>
      </router-link>
    </v-row>
  </v-container>
</template>