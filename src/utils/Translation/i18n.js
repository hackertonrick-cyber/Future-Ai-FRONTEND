import { createI18n } from 'vue-i18n'
import messages from './messages.js'

const browserLang = navigator.language.split('-')[0] // "en", "es"
const savedLocale = localStorage.getItem('app_locale') || (['en','es'].includes(browserLang) ? browserLang : 'en')
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
})

export default i18n
