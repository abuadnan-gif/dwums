import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const notifications = ref([
    {
      id: 1,
      type: 'critical',
      title: 'Pressure Drop Alert',
      message: 'Critical pressure drop detected in Zone 4',
      time: '2 minutes ago',
      read: false,
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    },
    {
      id: 2,
      type: 'info',
      title: 'Report Generated',
      message: 'Monthly revenue report generated successfully',
      time: '1 hour ago',
      read: true,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Maintenance Required',
      message: 'Scheduled maintenance for Meter #4567',
      time: '3 hours ago',
      read: true,
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ])

  const user = ref({
    name: 'Admin User',
    email: 'admin@waterutility.et',
    role: 'System Administrator',
    avatar: 'AU',
    status: 'online',
  })

  const stats = ref({
    totalRevenue: 2410000,
    activeCustomers: 12847,
    totalConsumption: 245678,
    systemHealth: 94,
    pendingApplications: 156,
    overdueBills: 324,
  })

  const regions = ref([
    { id: 1, name: 'Amhara National Regional State', code: 'ET-AM', customers: 3847 },
    { id: 2, name: 'Oromia Region', code: 'ET-OR', customers: 5123 },
    { id: 3, name: 'Southern Nations', code: 'ET-SN', customers: 2789 },
    { id: 4, name: 'Tigray Region', code: 'ET-TI', customers: 1892 },
  ])

  const recentActivities = ref([
    { id: 1, user: 'System', action: 'Monthly billing completed', time: 'Just now', type: 'success' },
    { id: 2, user: 'Field Agent #12', action: 'Meter reading submitted', time: '5 minutes ago', type: 'info' },
    { id: 3, user: 'Customer Service', action: 'New connection approved', time: '15 minutes ago', type: 'success' },
    { id: 4, user: 'System', action: 'Pressure anomaly detected', time: '30 minutes ago', type: 'warning' },
    { id: 5, user: 'Finance Dept', action: 'Payment processed', time: '1 hour ago', type: 'info' },
  ])

  // Getters
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const revenueGrowth = computed(() => 12.5) // percentage

  const formattedRevenue = computed(() => 
    new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(stats.value.totalRevenue)
  )

  // Actions
  function markNotificationAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllNotificationsAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      ...notification,
    })
  }

  function updateUserProfile(profile) {
    user.value = { ...user.value, ...profile }
  }

  function updateStats(newStats) {
    stats.value = { ...stats.value, ...newStats }
  }

  return {
    // State
    notifications,
    user,
    stats,
    regions,
    recentActivities,
    
    // Getters
    unreadNotifications,
    revenueGrowth,
    formattedRevenue,
    
    // Actions
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    updateUserProfile,
    updateStats,
  }
})