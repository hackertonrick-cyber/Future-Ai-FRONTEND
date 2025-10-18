<template>
  <v-container class="border-b border-solid border-brand-grey-1 bg-white lg:h-16">
    <v-row
      v-if="userStore.isLoggedIn"
      no-gutters
      class="h-full items-center justify-start w-full"
    >
      <v-col v-for="coin in user.coins" :key="coin.coin">
        <v-row>
          <v-col
            >{{ $t("balance") }}:
            <span>
              <font-awesome-icon :icon="['fa', 'dollar-sign']" />{{
                Math.round(coin.quantity)
              }}
              {{ coin.coin.name }}</span
            ></v-col
          >
        </v-row>
      </v-col>
      <v-col align="end">
        <v-row justify="end" no-gutters>
          <v-col md="5">
            <router-link to="/deposit" role="link"
              ><span
                ><font-awesome-icon :icon="['fa', 'square-plus']" class="mr-1" />
                {{ $t("deposit") }}</span
              ></router-link
            >
          </v-col>
          <v-col md="5">
            <router-link to="/withdraw" role="link">
              <span
                ><font-awesome-icon :icon="['fa', 'square-minus']" class="mr-1" />{{
                  $t("withdraw")
                }}</span
              ></router-link
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { computed } from "vue";

const userStore = useUserStore();
const user = computed(() => userStore.user);
</script>
