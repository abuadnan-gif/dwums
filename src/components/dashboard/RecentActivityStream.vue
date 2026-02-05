<template>
  <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-light via-white to-accent-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-accent-dark/5 border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-xl transition-all duration-500">
    <!-- Card Header -->
    <div class="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recent Activity Stream</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Latest system activities and updates</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <div class="w-2 h-2 rounded-full bg-success-light dark:bg-success-dark animate-pulse"></div>
            <div class="absolute inset-0 rounded-full bg-success-light dark:bg-success-dark animate-ping"></div>
          </div>
          <span class="text-sm text-success-light dark:text-success-dark">Live</span>
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="p-6">
      <div class="space-y-4">
        <!-- Activity Item -->
        <div v-for="activity in activities" :key="activity.id" 
          class="group/item relative flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-surface-light via-white to-neutral-50 dark:from-surface-dark dark:via-neutral-900 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-300 hover:-translate-y-0.5">
          
          <!-- Timeline Indicator -->
          <div class="relative">
            <div :class="[
              'w-3 h-3 rounded-full mt-1',
              getActivityColor(activity.type)
            ]"></div>
            <div v-if="!activity.read" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-light dark:bg-primary-dark animate-pulse"></div>
            
            <!-- Timeline Line -->
            <div v-if="!activity.last" class="absolute top-6 left-1/2 transform -translate-x-1/2 w-px h-10 bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
          
          <!-- Activity Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm text-neutral-900 dark:text-neutral-100">
                  <span class="font-medium text-primary-light dark:text-primary-dark">{{ activity.user }}</span> {{ activity.action }}
                </p>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{{ activity.time }}</p>
                
                <!-- Additional Info -->
                <div v-if="activity.details" class="mt-2 p-2 rounded-lg bg-primary-light/5 dark:bg-primary-dark/5">
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">{{ activity.details }}</p>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <button v-if="!activity.read" @click="markAsRead(activity)" 
                  class="p-1.5 rounded-lg hover:bg-success-light/10 dark:hover:bg-success-dark/10 transition-colors"
                  title="Mark as read">
                  <svg class="w-4 h-4 text-success-light dark:text-success-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                
                <button @click="viewDetails(activity)"
                  class="p-1.5 rounded-lg hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors"
                  title="View details">
                  <svg class="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Status Badge -->
            <div v-if="activity.status" class="mt-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                activity.status === 'completed' ? 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark' :
                activity.status === 'in-progress' ? 'bg-warning-light/10 text-warning-light dark:bg-warning-dark/10 dark:text-warning-dark' :
                activity.status === 'pending' ? 'bg-informational-light/10 text-informational-light dark:bg-informational-dark/10 dark:text-informational-dark' :
                'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
              ]">
                {{ activity.status.charAt(0).toUpperCase() + activity.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Load More -->
      <div class="mt-6 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 text-center">
        <button @click="loadMoreActivities" 
          class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
          Load More Activities
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activities = ref([
  {
    id: 1,
    user: 'System',
    action: 'completed monthly billing for 12,847 customers',
    time: 'Just now',
    type: 'success',
    status: 'completed',
    details: 'Total revenue: ₦2.41M | Success rate: 99.8%',
    read: false,
    last: false
  },
  {
    id: 2,
    user: 'Field Agent #12',
    action: 'submitted meter readings for Zone 4',
    time: '5 minutes ago',
    type: 'info',
    status: 'completed',
    details: '125 meters read | Avg consumption: 8,189 m³',
    read: true,
    last: false
  },
  {
    id: 3,
    user: 'Customer Service',
    action: 'approved new connection request for Kebele 01',
    time: '15 minutes ago',
    type: 'success',
    status: 'completed',
    details: 'Customer: Tewodros Alemu | Connection fee: ₦5,000',
    read: true,
    last: false
  },
  {
    id: 4,
    user: 'System',
    action: 'detected pressure anomaly in distribution line B',
    time: '30 minutes ago',
    type: 'warning',
    status: 'in-progress',
    details: 'Location: Zone 3 | Alert level: Medium',
    read: true,
    last: false
  },
  {
    id: 5,
    user: 'Finance Dept',
    action: 'processed 245 customer payments',
    time: '1 hour ago',
    type: 'info',
    status: 'completed',
    details: 'Total processed: ₦1.2M | Success rate: 98.5%',
    read: true,
    last: true
  }
])

const getActivityColor = (type) => {
  const colors = {
    success: 'bg-success-light dark:bg-success-dark',
    warning: 'bg-warning-light dark:bg-warning-dark',
    info: 'bg-informational-light dark:bg-informational-dark',
    critical: 'bg-critical-light dark:bg-critical-dark',
  }
  return colors[type] || 'bg-neutral-300 dark:bg-neutral-700'
}

const markAsRead = (activity) => {
  activity.read = true
}

const viewDetails = (activity) => {
  console.log('View activity details:', activity)
  // Implement view details logic
}

const loadMoreActivities = () => {
  // Implement load more logic
  console.log('Load more activities')
}
</script>

<style scoped>
/* Fade-in animation for new activities */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group\/item {
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

/* Staggered animation delays */
.group\/item:nth-child(1) { animation-delay: 0.1s; }
.group\/item:nth-child(2) { animation-delay: 0.2s; }
.group\/item:nth-child(3) { animation-delay: 0.3s; }
.group\/item:nth-child(4) { animation-delay: 0.4s; }
.group\/item:nth-child(5) { animation-delay: 0.5s; }

/* Hover effect enhancement */
.group\/item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Timeline dot animation */
.w-3.h-3.rounded-full {
  position: relative;
}

.w-3.h-3.rounded-full::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1px solid currentColor;
  opacity: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.5);
  }
}
</style>