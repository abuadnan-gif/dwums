<template>
  <Card title="Recent Activities" subtitle="Latest system activities and updates" glow>
    <div class="space-y-4">
      <div v-for="activity in activities" :key="activity.id" class="flex items-start space-x-3 group">
        <!-- Timeline dot -->
        <div class="relative">
          <div :class="[
            'w-3 h-3 rounded-full mt-1',
            getActivityColor(activity.type)
          ]"></div>
          <div v-if="!activity.read" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-light dark:bg-primary-dark animate-pulse"></div>
        </div>
        
        <!-- Activity content -->
        <div class="flex-1">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-neutral-900 dark:text-neutral-100">
                <span class="font-medium">{{ activity.user }}</span> {{ activity.action }}
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{{ activity.time }}</p>
            </div>
            <button v-if="!activity.read" class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
              <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-between items-center">
        <button class="text-sm text-primary-light dark:text-primary-dark hover:underline">
          View all activities
        </button>
        <button class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from '../ui/Card.vue'
import { useAppStore } from '../../stores'

const appStore = useAppStore()
const activities = appStore.recentActivities

const getActivityColor = (type) => {
  const colors = {
    success: 'bg-success-light dark:bg-success-dark',
    warning: 'bg-warning-light dark:bg-warning-dark',
    info: 'bg-informational-light dark:bg-informational-dark',
    critical: 'bg-critical-light dark:bg-critical-dark',
  }
  return colors[type] || 'bg-neutral-300 dark:bg-neutral-700'
}
</script>