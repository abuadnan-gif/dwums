// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import Icon from './components/Icon.vue'

// Import styles
import './styles/main.css'

// Create app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.component('Icon',Icon)
// Mount app
app.mount('#app')

// Initialize keyboard shortcuts
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
useKeyboardShortcuts()

// Initialize theme
import { useThemeStore } from './stores'
const themeStore = useThemeStore()
themeStore.initializeTheme()