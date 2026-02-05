<template>
  <div class="elite-card hover:shadow-2xl transition-all duration-500">
    <!-- Card Header -->
    <div class="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">System Health Monitor</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Real-time system status and alerts</p>
        </div>
        <div class="relative">
          <div class="w-3 h-3 rounded-full bg-success-light dark:bg-success-dark animate-pulse"></div>
          <div class="absolute inset-0 rounded-full bg-success-light dark:bg-success-dark animate-ping"></div>
        </div>
      </div>
    </div>

    <!-- Main Health Gauge -->
    <div class="p-6">
      <div class="relative mx-auto w-48 h-48">
        <!-- Outer Ring -->
        <svg class="w-full h-full" viewBox="0 0 200 200">
          <!-- Background Circle -->
          <circle cx="100" cy="100" r="90" fill="none" stroke="#E5E7EB" stroke-width="12" class="dark:stroke-neutral-800" />
          
          <!-- Gradient Progress Ring -->
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :stop-color="healthColor.light" />
              <stop offset="100%" :stop-color="healthColor.dark" />
            </linearGradient>
          </defs>
          
          <!-- Progress Circle -->
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="none" 
            stroke="url(#healthGradient)" 
            stroke-width="12" 
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 100 100)"
            class="transition-all duration-1000 ease-out"
          />
          
          <!-- Inner Glow -->
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="none" 
            :stroke="healthColor.light" 
            stroke-width="12" 
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 100 100)"
            class="transition-all duration-1000 ease-out"
            filter="url(#glow)"
          />
          
          <!-- Glow Filter -->
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
        
        <!-- Center Content -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-5xl font-bold" :class="healthColor.text">
            {{ healthScore }}%
          </div>
          <div class="text-sm mt-2 text-neutral-500 dark:text-neutral-400">
            Overall Health
          </div>
          <div class="flex items-center mt-3">
            <div class="w-2 h-2 rounded-full mr-2" :class="healthColor.bg"></div>
            <span class="text-sm font-medium" :class="healthColor.text">
              {{ healthStatus }}
            </span>
          </div>
        </div>
      </div>

      <!-- Health Metrics -->
      <div class="mt-6 space-y-4">
        <div v-for="metric in healthMetrics" :key="metric.id" 
          class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-colors group">
          <div class="flex items-center">
            <div class="relative">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="metric.bgColor">
                <svg class="w-5 h-5" :class="metric.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="metric.icon" />
                </svg>
              </div>
              <div v-if="metric.status === 'warning' || metric.status === 'critical'" 
                class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-critical-light dark:bg-critical-dark animate-pulse">
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ metric.name }}</p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ metric.description }}</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="w-24 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mr-3">
              <div class="h-full rounded-full transition-all duration-500" 
                :style="{ width: `${metric.value}%`, background: metric.color }"></div>
            </div>
            <span class="text-sm font-semibold" :class="metric.textColor">
              {{ metric.value }}%
            </span>
          </div>
        </div>
      </div>

      <!-- System Alerts -->
      <div class="mt-6">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Active Alerts</h4>
          <span class="text-xs text-primary-light dark:text-primary-dark hover:underline cursor-pointer">
            View all
          </span>
        </div>
        
        <div class="space-y-2">
          <div v-for="alert in activeAlerts" :key="alert.id"
            class="p-3 rounded-xl border transition-all duration-300 hover:shadow-md"
            :class="alertClasses[alert.level]">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-1.5 rounded-lg mr-3" :class="alertIconClasses[alert.level]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="alert.level === 'critical' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z' 
                          : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ alert.title }}</p>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ alert.time }}</p>
                </div>
              </div>
              <button class="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
                <svg class="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const healthScore = ref(94)
const radius = 90
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => {
  const progress = healthScore.value / 100
  return circumference * (1 - progress)
})

const healthColor = computed(() => {
  if (healthScore.value >= 90) {
    return {
      light: '#10B981',
      dark: '#34D399',
      text: 'text-success-light dark:text-success-dark',
      bg: 'bg-success-light dark:bg-success-dark'
    }
  } else if (healthScore.value >= 70) {
    return {
      light: '#F59E0B',
      dark: '#FBBF24',
      text: 'text-warning-light dark:text-warning-dark',
      bg: 'bg-warning-light dark:bg-warning-dark'
    }
  } else {
    return {
      light: '#EF4444',
      dark: '#F87171',
      text: 'text-critical-light dark:text-critical-dark',
      bg: 'bg-critical-light dark:bg-critical-dark'
    }
  }
})

const healthStatus = computed(() => {
  if (healthScore.value >= 90) return 'Excellent'
  if (healthScore.value >= 70) return 'Good'
  if (healthScore.value >= 50) return 'Fair'
  return 'Needs Attention'
})

const healthMetrics = ref([
  {
    id: 1,
    name: 'Server Load',
    description: 'CPU & Memory usage',
    value: 78,
    status: 'good',
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
    bgColor: 'bg-primary-light/10 dark:bg-primary-dark/10',
    iconColor: 'text-primary-light dark:text-primary-dark',
    color: 'linear-gradient(to right, #0066FF, #3B82F6)',
    textColor: 'text-primary-light dark:text-primary-dark'
  },
  {
    id: 2,
    name: 'Database',
    description: 'Response time & connections',
    value: 92,
    status: 'excellent',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    bgColor: 'bg-success-light/10 dark:bg-success-dark/10',
    iconColor: 'text-success-light dark:text-success-dark',
    color: 'linear-gradient(to right, #10B981, #34D399)',
    textColor: 'text-success-light dark:text-success-dark'
  },
  {
    id: 3,
    name: 'Network',
    description: 'Latency & throughput',
    value: 85,
    status: 'good',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    bgColor: 'bg-accent-light/10 dark:bg-accent-dark/10',
    iconColor: 'text-accent-light dark:text-accent-dark',
    color: 'linear-gradient(to right, #8B5CF6, #A78BFA)',
    textColor: 'text-accent-light dark:text-accent-dark'
  },
  {
    id: 4,
    name: 'Storage',
    description: 'Disk space & IOPS',
    value: 65,
    status: 'warning',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    bgColor: 'bg-warning-light/10 dark:bg-warning-dark/10',
    iconColor: 'text-warning-light dark:text-warning-dark',
    color: 'linear-gradient(to right, #F59E0B, #FBBF24)',
    textColor: 'text-warning-light dark:text-warning-dark'
  },
])

const activeAlerts = ref([
  {
    id: 1,
    title: 'High memory usage detected on Server-02',
    time: '5 minutes ago',
    level: 'warning'
  },
  {
    id: 2,
    title: 'Backup process completed successfully',
    time: '1 hour ago',
    level: 'info'
  },
  {
    id: 3,
    title: 'Database replication delay',
    time: '2 hours ago',
    level: 'critical'
  }
])

const alertClasses = {
  critical: 'border-critical-light/30 bg-critical-light/5 dark:border-critical-dark/30 dark:bg-critical-dark/5',
  warning: 'border-warning-light/30 bg-warning-light/5 dark:border-warning-dark/30 dark:bg-warning-dark/5',
  info: 'border-primary-light/30 bg-primary-light/5 dark:border-primary-dark/30 dark:bg-primary-dark/5'
}

const alertIconClasses = {
  critical: 'bg-critical-light/20 text-critical-light dark:bg-critical-dark/20 dark:text-critical-dark',
  warning: 'bg-warning-light/20 text-warning-light dark:bg-warning-dark/20 dark:text-warning-dark',
  info: 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark'
}
</script>

<style scoped>
/* Smooth transition for gauge animation */
circle {
  transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pulse animation for critical alerts */
@keyframes critical-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.bg-critical-light, .bg-critical-dark {
  animation: critical-pulse 2s ease-in-out infinite;
}

/* Hover effects for metrics */
.group:hover .transition-all {
  transform: translateX(4px);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, var(--tw-gradient-stops));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>