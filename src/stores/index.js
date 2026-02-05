import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

export { useAppStore } from './app.js'
export { useUtilityStore } from './utility.js'
export { useThemeStore } from './theme.js'