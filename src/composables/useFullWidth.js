import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'

export function useFullWidth() {
  const themeStore = useThemeStore()
  
  const sidebarCollapsed = computed(() => themeStore.sidebarCollapsed)
  
  // Calculate content width based on sidebar state
  const contentWidth = computed(() => {
    return sidebarCollapsed.value ? 'calc(100vw - 5rem)' : 'calc(100vw - 16rem)'
  })
  
  // Calculate content margin based on sidebar state
  const contentMargin = computed(() => {
    return sidebarCollapsed.value ? 'ml-20' : 'ml-64'
  })
  
  // Responsive content width for mobile
  const mobileContentWidth = computed(() => {
    return '100vw'
  })
  
  // Get appropriate content class based on screen size
  const getContentClass = (baseClass = '') => {
    return computed(() => {
      return `${baseClass} ${contentMargin.value} w-full transition-all duration-500 ease-in-out`
    })
  }
  
  // Get container class for full-width content
  const getContainerClass = () => {
    return computed(() => {
      return 'w-full max-w-none px-0'
    })
  }
  
  return {
    sidebarCollapsed,
    contentWidth,
    contentMargin,
    mobileContentWidth,
    getContentClass,
    getContainerClass,
  }
}