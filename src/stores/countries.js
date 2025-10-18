import { defineStore } from 'pinia'
import axios from 'axios'
import { withSnackbar } from '@/utils/withSnackbar.js'
import { countries } from '../constants.js'

export const FETCH_COUNTRIES = 'FETCH_COUNTRIES'

export const useCountriesStore = defineStore('countries', {
  state: () => ({
    countries: countries,
  }),
  actions: {
    async [FETCH_COUNTRIES]() {
      const useUiStore = await import('./ui.js')
      const uiStore = useUiStore.useUiStore()

      uiStore.START_LOADING('countries.fetch_countries')
      const promise = axios.get(`${import.meta.env.VITE_API_URL}/countries`)
      const { response, error } = await withSnackbar(promise, {
        errorText: 'Failed to fetch countries.',
        showSuccess: false,
      })

      uiStore.STOP_LOADING('countries.fetch_countries')
      if (response && response.data) {
        this.countries = response.data
        return response.data
      }
      return { error }
    },
  },
})
