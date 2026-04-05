<!-- views/Dashboard.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'
import { getWidgetsByRole } from '@/utils/dashboardWidgets'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userRoles = user.roles || ['Customer-Service']
const userPermissions = user.permissions || []
const primaryRole = user.primary_role || userRoles[0]

// Get widgets for this role
const roleWidgets = computed(() => getWidgetsByRole(primaryRole))

// Store widget data
const widgetData = ref({})
const loading = ref(true)

// Fetch data for all widgets
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const response = await api.get('/dashboard/stats')
    widgetData.value = response.data
  } catch (error) {
    console.error('Failed to load dashboard data', error)
  } finally {
    loading.value = false
  }
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ getGreeting() }}, {{ user.first_name }}!
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Role: <span class="font-semibold text-blue-600">{{ primaryRole }}</span>
      </p>
    </div>

    <!-- Quick Actions Component -->
    <QuickActions :role="primaryRole" :permissions="userPermissions" />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <Icon name="ArrowPathIcon" class="w-10 h-10 text-blue-600 animate-spin" />
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div v-if="roleWidgets.stats && roleWidgets.stats.length > 0" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          v-for="stat in roleWidgets.stats"
          :key="stat.key"
          :title="stat.title"
          :value="widgetData[stat.key] || 0"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>

      <!-- Charts Section -->
      <div v-if="roleWidgets.charts && roleWidgets.charts.length > 0" 
           class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Placeholder for charts - you can add Chart.js or other chart library -->
        <div v-for="chart in roleWidgets.charts" :key="chart.key" 
             class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">{{ chart.title }}</h3>
          <div class="h-64 flex items-center justify-center text-gray-500">
            Chart: {{ chart.title }} (Coming Soon)
          </div>
        </div>
      </div>

      <!-- Tables Section -->
      <div v-if="roleWidgets.tables && roleWidgets.tables.length > 0" 
           class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="table in roleWidgets.tables" :key="table.key" 
             class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold">{{ table.title }}</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-500 text-center">Data will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>