<template>
  <div class="h-full w-full">
    <!-- Dashboard Header -->
    <div class="px-6 py-8 border-b" :class="isDark ? 'border-white/10' : 'border-neutral-200/50'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Utility Command Center</h1>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white">
              LIVE
            </span>
          </div>
          <p class="text-neutral-500 dark:text-neutral-400">Real-time monitoring and management of national water utility operations</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-neutral-200 hover:bg-black/5'">
            <svg class="w-5 h-5" :class="isDark ? 'text-white/80' : 'text-neutral-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-neutral-900'">Export</span>
          </button>
          <button class="btn-elite flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Report</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="p-6 h-[calc(100vh-12rem)] overflow-y-auto">
      <!-- Stats Grid - Full Width -->
      <div class="mb-8">
        <StatsGrid />
      </div>

      <!-- Charts Section - Full Width -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Revenue Chart -->
        <div class="h-96">
          <RevenueChart />
        </div>
        
        <!-- Map View -->
        <div class="h-96">
          <MapView />
        </div>
      </div>

      <!-- Activity Feed & Quick Actions - Full Width -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import StatsGrid from './StatsGrid.vue'
import ActivityFeed from './ActivityFeed.vue'
import RevenueChart from './RevenueChart.vue'
//import MapView from './MapView.vue'
import QuickActions from './QuickActions.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>

<style scoped>
/* Ensure full height for dashboard */
.h-full {
  height: 100%;
}

/* Custom scrollbar for content area */
.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar {
  width: 6px;
}

.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-track {
  background: transparent;
}

.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.dark .h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.dark .h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>