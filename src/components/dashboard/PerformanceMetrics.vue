<template>
  <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-light via-white to-secondary-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-secondary-dark/5 border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-xl transition-all duration-500">
    <!-- Card Header -->
    <div class="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Performance Metrics</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Key performance indicators across regions</p>
        </div>
        <div class="flex items-center space-x-2">
          <button v-for="tab in tabs" :key="tab" 
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab 
                ? 'bg-primary-light text-white dark:bg-primary-dark shadow-sm' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            ]">
            {{ tab }}
          </button>
        </div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Metric 1: System Uptime -->
        <div class="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-light via-white to-success-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-success-dark/5 p-5 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-success-light/30 dark:hover:border-success-dark/30 transition-all duration-300 hover:-translate-y-1">
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-success-light/10 via-transparent to-green-400/10 dark:from-success-dark/10 dark:to-green-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 rounded-lg bg-success-light/10 dark:bg-success-dark/10">
                <svg class="w-5 h-5 text-success-light dark:text-success-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="relative">
                <div class="w-10 h-10">
                  <svg class="w-10 h-10 text-success-light dark:text-success-dark" viewBox="0 0 36 36">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="2" />
                    <path class="circle" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="98, 100" />
                  </svg>
                </div>
                <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-success-light dark:text-success-dark">
                  98%
                </span>
              </div>
            </div>
            
            <h4 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">System Uptime</h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Monthly availability</p>
            
            <div class="mt-4 flex items-center text-sm">
              <span class="text-success-light dark:text-success-dark flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +0.5%
              </span>
              <span class="text-neutral-500 dark:text-neutral-400 ml-2">from last month</span>
            </div>
          </div>
        </div>

        <!-- Metric 2: Revenue Growth -->
        <div class="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-light via-white to-primary-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-primary-dark/5 p-5 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-light/10 via-transparent to-accent-light/10 dark:from-primary-dark/10 dark:to-accent-dark/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10">
                <svg class="w-5 h-5 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div class="text-2xl font-bold text-primary-light dark:text-primary-dark">
                12.5%
              </div>
            </div>
            
            <h4 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Revenue Growth</h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Quarter over quarter</p>
            
            <div class="mt-4">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-neutral-500 dark:text-neutral-400">Target: 10%</span>
                <span class="font-semibold text-success-light dark:text-success-dark">125%</span>
              </div>
              <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-full" style="width: 125%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Metric 3: Data Security -->
        <div class="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-light via-white to-accent-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-accent-dark/5 p-5 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-accent-light/30 dark:hover:border-accent-dark/30 transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-accent-light/10 via-transparent to-purple-400/10 dark:from-accent-dark/10 dark:to-purple-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 rounded-lg bg-accent-light/10 dark:bg-accent-dark/10">
                <svg class="w-5 h-5 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="flex items-center">
                <div class="relative">
                  <div class="w-10 h-10">
                    <svg class="w-10 h-10 text-success-light dark:text-success-dark" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-opacity="0.3" stroke-width="4" fill="none" />
                      <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="4" fill="none" 
                        stroke-dasharray="113" stroke-dashoffset="20" transform="rotate(-90 20 20)" />
                    </svg>
                  </div>
                  <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-success-light dark:text-success-dark">
                    99%
                  </span>
                </div>
              </div>
            </div>
            
            <h4 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Data Security</h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Encryption compliance</p>
            
            <div class="mt-4 flex items-center text-sm">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-success-light dark:bg-success-dark mr-2"></div>
                <span class="text-neutral-700 dark:text-neutral-300">Fully Compliant</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Metric 4: Response Time -->
        <div class="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-light via-white to-warning-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-warning-dark/5 p-5 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-warning-light/30 dark:hover:border-warning-dark/30 transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-warning-light/10 via-transparent to-yellow-400/10 dark:from-warning-dark/10 dark:to-yellow-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 rounded-lg bg-warning-light/10 dark:bg-warning-dark/10">
                <svg class="w-5 h-5 text-warning-light dark:text-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-2xl font-bold text-warning-light dark:text-warning-dark">
                1.2s
              </div>
            </div>
            
            <h4 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Avg Response Time</h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">API response latency</p>
            
            <div class="mt-4">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-neutral-500 dark:text-neutral-400">Target: 2s</span>
                <span class="font-semibold text-success-light dark:text-success-dark">40% faster</span>
              </div>
              <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-success-light to-green-400 dark:from-success-dark dark:to-green-500 rounded-full" style="width: 60%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Trends -->
      <div class="mt-8">
        <h4 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Performance Trends</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="trend in performanceTrends" :key="trend.id"
            class="group/trend relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-light via-white to-neutral-100 dark:from-surface-dark dark:via-neutral-900 dark:to-neutral-800 p-4 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-300 hover:-translate-y-0.5">
            
            <div class="relative">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-neutral-600 dark:text-neutral-300">{{ trend.label }}</span>
                <span :class="[
                  'text-xs font-medium px-2 py-1 rounded-full transition-all',
                  trend.change > 0 
                    ? 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark group-hover/trend:bg-success-light/20 dark:group-hover/trend:bg-success-dark/20'
                    : 'bg-critical-light/10 text-critical-light dark:bg-critical-dark/10 dark:text-critical-dark group-hover/trend:bg-critical-light/20 dark:group-hover/trend:bg-critical-dark/20'
                ]">
                  {{ trend.change > 0 ? '+' : '' }}{{ trend.change }}%
                </span>
              </div>
              
              <div class="flex items-end justify-between">
                <p class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ trend.value }}</p>
                <div class="w-12 h-8 flex items-end">
                  <div v-for="(bar, index) in trend.bars" :key="index"
                    class="flex-1 mx-0.5 rounded-t transition-all duration-300 group-hover/trend:opacity-80"
                    :style="{
                      height: `${bar}%`,
                      background: trend.change > 0 
                        ? 'linear-gradient(to top, #10B981, #34D399)'
                        : 'linear-gradient(to top, #EF4444, #F87171)'
                    }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('Overview')
const tabs = ['Overview', 'Technical', 'Financial', 'Operational']

const performanceTrends = ref([
  { id: 1, label: 'Customer Satisfaction', value: '94%', change: 2.5, bars: [65, 75, 80, 85, 94] },
  { id: 2, label: 'Billing Accuracy', value: '99.8%', change: 0.3, bars: [98, 99, 99.5, 99.7, 99.8] },
  { id: 3, label: 'Issue Resolution', value: '97%', change: 1.2, bars: [90, 92, 94, 96, 97] },
  { id: 4, label: 'System Reliability', value: '99.9%', change: 0.1, bars: [99.5, 99.6, 99.7, 99.8, 99.9] },
])
</script>

<style scoped>
.circle {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 1s ease;
}

/* Card hover effects */
.group\/card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Smooth transitions */
.group\/card, .group\/trend {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient text effect */
.text-gradient {
  background: linear-gradient(135deg, var(--tw-gradient-stops));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>