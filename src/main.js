// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import Icon from './components/Icon.vue'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css"
import {can} from '@/stores/permissions'



// Import styles
import './styles/main.css'

// Create app
const app = createApp(App)
app.use(Toast, {
   position: "top-right",
  timeout: 3000,
  maxToasts: 5,
  newestOnTop: true,
  zIndex: 9999999
  // By Tefera
  // containerClassName: "toast-container-custom",
  // toastClassName: "toast-custom",
  // maxToasts: 5,
  // newestOnTop: true,
  // end 

})
// Use plugins
app.use(pinia)
app.use(router)
app.component('Icon',Icon)
// Make $can globally available
app.config.globalProperties.$can = can
// Mount app
app.mount('#app')

// Initialize keyboard shortcuts
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
useKeyboardShortcuts()

// Initialize theme
import { useThemeStore } from './stores'

const themeStore = useThemeStore()
themeStore.initializeTheme()