<template>
  <Card title="Quick Actions" subtitle="Frequently used operations" glow>
    <div class="space-y-3">
      <button
        v-for="action in actions"
        :key="action.id"
        @click="handleAction(action.id)"
        class="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light/30 dark:hover:border-primary-dark/30 hover:bg-white/50 dark:hover:bg-white/5 transition-all group"
      >
        <div class="flex items-center">
          <div :class="['p-2 rounded-lg mr-3', action.bgColor]">
            <svg class="w-5 h-5" :class="action.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
            </svg>
          </div>
          <div class="text-left">
            <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ action.title }}</p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ action.description }}</p>
          </div>
        </div>
        <svg class="w-5 h-5 text-neutral-400 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <!-- System Status -->
    <div class="mt-6 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
      <h4 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">System Status</h4>
      <div class="space-y-3">
        <div v-for="status in systemStatus" :key="status.id" class="flex items-center justify-between">
          <div class="flex items-center">
            <div :class="['w-2 h-2 rounded-full mr-2', status.active ? 'bg-success-light dark:bg-success-dark animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700']"></div>
            <span class="text-sm text-neutral-700 dark:text-neutral-300">{{ status.name }}</span>
          </div>
          <span :class="['text-xs px-2 py-1 rounded', status.active ? 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400']">
            {{ status.status }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from '../ui/Card.vue'
import { ref } from 'vue'

const actions = [
  {
    id: 1,
    title: 'New Connection',
    description: 'Register new applicant',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    bgColor: 'bg-primary-light/10 dark:bg-primary-dark/10',
    iconColor: 'text-primary-light dark:text-primary-dark',
  },
  {
    id: 2,
    title: 'Record Reading',
    description: 'Submit meter reading',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    bgColor: 'bg-success-light/10 dark:bg-success-dark/10',
    iconColor: 'text-success-light dark:text-success-dark',
  },
  {
    id: 3,
    title: 'Generate Bill',
    description: 'Create monthly invoice',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    bgColor: 'bg-accent-light/10 dark:bg-accent-dark/10',
    iconColor: 'text-accent-light dark:text-accent-dark',
  },
  {
    id: 4,
    title: 'Issue Alert',
    description: 'Send system notification',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    bgColor: 'bg-warning-light/10 dark:bg-warning-dark/10',
    iconColor: 'text-warning-light dark:text-warning-dark',
  },
]

const systemStatus = [
  { id: 1, name: 'Billing System', status: 'Active', active: true },
  { id: 2, name: 'Payment Gateway', status: 'Active', active: true },
  { id: 3, name: 'Meter Reading API', status: 'Active', active: true },
  { id: 4, name: 'SMS Gateway', status: 'Active', active: true },
  { id: 5, name: 'Database Replica', status: 'Syncing', active: true },
]

const handleAction = (id) => {
  // Handle action based on id
  console.log('Action triggered:', id)
}
</script>