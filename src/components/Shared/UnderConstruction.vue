<template>
  <div
    class="mt-20 grid pt-20 text-center text-4xl font-bold text-brand-red-2 lg:text-7xl"
  >
    <v-container>
      <v-col>
        <v-row justify="center" class="uppercase"> {{ $t("under_construction") }}</v-row>
        <v-row justify="center">
          <img
            src="../../assets/image/construction.gif"
            class=""
            alt="lg-cave"
            @contextmenu.prevent
            draggable="false"
          />
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>
