import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAppStore } from '../stores/app'

export function useHeader() {
  const themeStore = useThemeStore()
  const appStore = useAppStore()

  // State
  const isScrolled = ref(false)
  const showNotifications = ref(false)
  const showUserMenu = ref(false)
  const showQuickActions = ref(false)
  const showMobileSearch = ref(false)
  const searchQuery = ref('')

  // Computed
  const isDark = computed(() => themeStore.isDark)
  const notifications = computed(() => appStore.notifications)
  const unreadNotifications = computed(() => appStore.unreadNotifications)

  // Main navigation
  const mainNavigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Customers', path: '/customers/all' },
    { name: 'Billing', path: '/billing/bills' },
    { name: 'Reports', path: '/reports/revenue' },
    { name: 'System', path: '/system/settings' },
  ]

  // Quick stats
  const quickStats = [
    { label: 'Revenue', value: '₦2.4M', trend: 12.5 },
    { label: 'Customers', value: '12.8K', trend: 8.2 },
    { label: 'Consumption', value: '246K m³', trend: -3.2 },
  ]

  // User menu
  const userMenuItems = [
    { label: 'My Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Account Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { label: 'Security', path: '/security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'Help Center', path: '/help', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  // Quick actions
  const quickActions = [
    {
      label: 'New Customer',
      description: 'Register new',
      action: 'new-customer',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      bgColor: 'bg-primary-light/10 dark:bg-primary-dark/10',
      iconColor: 'text-primary-light dark:text-primary-dark',
    },
    {
      label: 'Record Reading',
      description: 'Meter reading',
      action: 'record-reading',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-success-light/10 dark:bg-success-dark/10',
      iconColor: 'text-success-light dark:text-success-dark',
    },
    {
      label: 'Generate Bill',
      description: 'Create invoice',
      action: 'generate-bill',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      bgColor: 'bg-accent-light/10 dark:bg-accent-dark/10',
      iconColor: 'text-accent-light dark:text-accent-dark',
    },
    {
      label: 'Issue Alert',
      description: 'Send notification',
      action: 'issue-alert',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z',
      bgColor: 'bg-warning-light/10 dark:bg-warning-dark/10',
      iconColor: 'text-warning-light dark:text-warning-dark',
    },
  ]

  // Methods
  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }

  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
    showUserMenu.value = false
    showQuickActions.value = false
  }

  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
    showNotifications.value = false
    showQuickActions.value = false
  }

  const toggleQuickActions = () => {
    showQuickActions.value = !showQuickActions.value
    showNotifications.value = false
    showUserMenu.value = false
  }

  const toggleMobileSearch = () => {
    showMobileSearch.value = !showMobileSearch.value
  }

  const markAllAsRead = () => {
    appStore.markAllNotificationsAsRead()
  }

  const markAsRead = (id) => {
    appStore.markNotificationAsRead(id)
  }

  const handleQuickAction = (action) => {
    console.log('Quick action:', action)
    showQuickActions.value = false
  }

  const handleLogout = () => {
    console.log('Logout')
    showUserMenu.value = false
  }

  // Notification styling
  const getNotificationIconClass = (type) => {
    const classes = {
      critical: 'bg-critical-light/10 dark:bg-critical-dark/10',
      warning: 'bg-warning-light/10 dark:bg-warning-dark/10',
      success: 'bg-success-light/10 dark:bg-success-dark/10',
      info: 'bg-primary-light/10 dark:bg-primary-dark/10',
    }
    return classes[type] || 'bg-neutral-100 dark:bg-neutral-800'
  }

  const getNotificationBadgeClass = (type) => {
    const classes = {
      critical: 'bg-critical-light/10 text-critical-light dark:bg-critical-dark/10 dark:text-critical-dark',
      warning: 'bg-warning-light/10 text-warning-light dark:bg-warning-dark/10 dark:text-warning-dark',
      success: 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark',
      info: 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark',
    }
    return classes[type] || 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
  }

  // Event handlers
  const onClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      showNotifications.value = false
      showUserMenu.value = false
      showQuickActions.value = false
    }
  }

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      showNotifications.value = false
      showUserMenu.value = false
      showQuickActions.value = false
      showMobileSearch.value = false
    }
  }

  // Lifecycle
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleEscape)
    document.addEventListener('click', onClickOutside)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', handleEscape)
    document.removeEventListener('click', onClickOutside)
  })

  return {
    // State
    isScrolled,
    showNotifications,
    showUserMenu,
    showQuickActions,
    showMobileSearch,
    searchQuery,
    
    // Computed
    isDark,
    notifications,
    unreadNotifications,
    
    // Data
    mainNavigation,
    quickStats,
    userMenuItems,
    quickActions,
    
    // Methods
    toggleTheme,
    toggleNotifications,
    toggleUserMenu,
    toggleQuickActions,
    toggleMobileSearch,
    markAllAsRead,
    markAsRead,
    handleQuickAction,
    handleLogout,
    getNotificationIconClass,
    getNotificationBadgeClass,
  }
}