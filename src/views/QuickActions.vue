<template>
  <div class="min-h-screen pt-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Quick Actions</h1>
        <p class="text-neutral-500 dark:text-neutral-400">Instant access to frequently used operations</p>
      </div>

      <!-- All Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="action in allQuickActions"
          :key="action.id"
          @click="handleAction(action)"
          class="elite-card p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 rounded-xl" :class="action.iconBg">
              <svg class="w-6 h-6" :class="action.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="action.icon" />
              </svg>
            </div>
            <span v-if="action.badge" class="text-xs px-2 py-1 rounded-md" :class="action.badgeClass">
              {{ action.badge }}
            </span>
          </div>
          
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {{ action.title }}
          </h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            {{ action.description }}
          </p>
          
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
            <span class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ action.category }}
            </span>
            <svg class="w-4 h-4 text-neutral-400 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Recent Actions -->
      <div class="mt-12">
        <h2 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Recently Used</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="action in recentActions"
            :key="action.id"
            @click="handleAction(action)"
            class="flex items-center p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light/30 dark:hover:border-primary-dark/30 hover:bg-white/50 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <div class="p-2 rounded-lg mr-4" :class="action.iconBg">
              <svg class="w-5 h-5" :class="action.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="action.icon" />
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-neutral-900 dark:text-neutral-100">{{ action.title }}</h4>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ action.description }}</p>
            </div>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ action.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const allQuickActions = ref([
  {
    id: 1,
    title: 'New Customer Registration',
    description: 'Register new water utility customer',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    category: 'Customers',
    iconBg: 'bg-primary-light/10 dark:bg-primary-dark/10',
    iconColor: 'text-primary-light dark:text-primary-dark',
    badge: 'Popular',
    badgeClass: 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark',
    route: '/customers/new'
  },
  {
    id: 2,
    title: 'Meter Reading Submission',
    description: 'Submit water meter readings',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    category: 'Meters',
    iconBg: 'bg-success-light/10 dark:bg-success-dark/10',
    iconColor: 'text-success-light dark:text-success-dark',
    badge: null,
    route: '/billing/readings'
  },
  {
    id: 3,
    title: 'Invoice Generation',
    description: 'Generate monthly utility bills',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    category: 'Billing',
    iconBg: 'bg-accent-light/10 dark:bg-accent-dark/10',
    iconColor: 'text-accent-light dark:text-accent-dark',
    badge: '12 pending',
    badgeClass: 'bg-accent-light/10 text-accent-light dark:bg-accent-dark/10 dark:text-accent-dark',
    route: '/billing/generate'
  },
  {
    id: 4,
    title: 'System Health Check',
    description: 'Run system diagnostics',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    category: 'System',
    iconBg: 'bg-warning-light/10 dark:bg-warning-dark/10',
    iconColor: 'text-warning-light dark:text-warning-dark',
    badge: null,
    route: '/system/health'
  },
  {
    id: 5,
    title: 'Data Export',
    description: 'Export system data in multiple formats',
    icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    category: 'Reports',
    iconBg: 'bg-secondary-light/10 dark:bg-secondary-dark/10',
    iconColor: 'text-secondary-light dark:text-secondary-dark',
    badge: 'CSV/Excel',
    badgeClass: 'bg-secondary-light/10 text-secondary-light dark:bg-secondary-dark/10 dark:text-secondary-dark',
    route: '/reports/export'
  },
  {
    id: 6,
    title: 'Quick Analytics',
    description: 'Generate instant analytics report',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    category: 'Analytics',
    iconBg: 'bg-info-light/10 dark:bg-info-dark/10',
    iconColor: 'text-info-light dark:text-info-dark',
    badge: 'New',
    badgeClass: 'bg-info-light/10 text-info-light dark:bg-info-dark/10 dark:text-info-dark',
    route: '/reports/analytics'
  },
  {
    id: 7,
    title: 'Send Broadcast',
    description: 'Send notifications to all customers',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    category: 'Communication',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/10',
    iconColor: 'text-purple-500 dark:text-purple-400',
    badge: 'Bulk',
    badgeClass: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400',
    route: '/communication/broadcast'
  },
  {
    id: 8,
    title: 'Backup Database',
    description: 'Create system backup',
    icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    category: 'System',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/10',
    iconColor: 'text-amber-500 dark:text-amber-400',
    badge: 'Critical',
    badgeClass: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400',
    route: '/system/backup'
  },
])

const recentActions = ref([
  {
    id: 1,
    title: 'Meter Reading',
    description: 'Submitted readings for Zone 4',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    time: '10 min ago',
    iconBg: 'bg-success-light/10 dark:bg-success-dark/10',
    iconColor: 'text-success-light dark:text-success-dark',
    route: '/billing/readings'
  },
  {
    id: 2,
    title: 'Bill Generation',
    description: 'Generated invoices for January',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    time: '1 hour ago',
    iconBg: 'bg-accent-light/10 dark:bg-accent-dark/10',
    iconColor: 'text-accent-light dark:text-accent-dark',
    route: '/billing/bills'
  },
  {
    id: 3,
    title: 'New Customer',
    description: 'Registered customer #12848',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    time: '2 hours ago',
    iconBg: 'bg-primary-light/10 dark:bg-primary-dark/10',
    iconColor: 'text-primary-light dark:text-primary-dark',
    route: '/customers/new'
  },
  {
    id: 4,
    title: 'System Alert',
    description: 'Sent maintenance notification',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    time: '3 hours ago',
    iconBg: 'bg-warning-light/10 dark:bg-warning-dark/10',
    iconColor: 'text-warning-light dark:text-warning-dark',
    route: '/system/alerts'
  },
])

const handleAction = (action) => {
  if (action.route) {
    router.push(action.route)
  }
}
</script>