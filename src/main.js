import './style.css'
import 'vuetify/dist/vuetify.css'

import { createApp, markRaw } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'animate.css'
import 'plyr/dist/plyr.css'

import router from './router'

import i18n from './utils/Translation/i18n.js'

import {} from '@fortawesome/free-solid-svg-icons'

const myTheme = {
  dark: false,
  colors: {
    primary: '#cea643', // Change primary color
    secondary: '#FFFFFF',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      myTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

pinia.use((context) => {
  if (context.store.$id !== 'snackbar') {
    const storeId = context.store.$id

    const serializer = {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }

    const fromStorage = serializer.deserialize(window.localStorage.getItem(storeId))
    if (fromStorage) context.store.$patch(fromStorage)
    context.store.$subscribe((mutation, state) => {
      window.localStorage.setItem(storeId, serializer.serialize(state))
    })
  }
})

library.add()

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
