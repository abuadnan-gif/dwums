<template>
  <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-light via-white to-primary-light/5 dark:from-surface-dark dark:via-neutral-900 dark:to-primary-dark/5 border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-xl transition-all duration-500">
    <!-- Ambient Background -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl
        bg-gradient-to-bl from-primary-light to-accent-light
        dark:from-primary-dark dark:to-accent-dark
        -translate-y-32 translate-x-32"
      />
    </div>

    <div class="relative">
      <!-- Header -->
      <div class="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Revenue Analytics
            </h3>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Monthly revenue trends and projections
            </p>
          </div>

          <span
            class="text-xs font-medium px-3 py-1 rounded-full
            bg-success-light/10 text-success-light
            dark:bg-success-dark/10 dark:text-success-dark"
          >
            +12.5% Growth
          </span>
        </div>
      </div>

      <!-- Chart -->
      <div class="p-6">
        <!-- Controls -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex space-x-4 text-sm">
            <div class="flex items-center">
              <span class="w-3 h-3 rounded-full bg-primary-light dark:bg-primary-dark mr-2"></span>
              Actual
            </div>
            <div class="flex items-center">
              <span class="w-3 h-3 rounded-full bg-accent-light/50 dark:bg-accent-dark/50 mr-2"></span>
              Projected
            </div>
          </div>

          <div class="flex space-x-2">
            <button
              v-for="p in periods"
              :key="p"
              @click="selectedPeriod = p"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedPeriod === p
                  ? 'bg-primary-light text-white dark:bg-primary-dark'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              ]"
            >
              {{ p }}
            </button>
          </div>
        </div>

        <!-- Chart Area -->
        <div class="relative h-64">
          <!-- Grid -->
          <div class="absolute inset-0 flex flex-col justify-between">
            <div v-for="i in 5" :key="i" class="h-px bg-neutral-200/50 dark:bg-neutral-800/50" />
          </div>

          <!-- Bars -->
          <div class="absolute inset-0 left-12 right-4 flex items-end">
            <div
              v-for="(data, i) in chartData"
              :key="i"
              data-bar
              class="relative flex-1 mx-1 group/bar"
            >
              <!-- Tooltip -->
              <div
                class="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0
                group-hover/bar:opacity-100 transition pointer-events-none z-10"
              >
                <div class="rounded-xl p-3 bg-surface-light dark:bg-surface-dark shadow-xl">
                  <p class="text-xs">{{ data.month }}</p>
                  <p class="font-bold">{{ formatCurrency(data.actual) }}</p>
                </div>
              </div>

              <!-- Actual -->
              <div
                class="w-full rounded-t-lg bg-gradient-to-t
                from-primary-light via-accent-light to-secondary-light
                dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark
                transition-all duration-700"
                :style="{ height: `${(data.actual / maxValue) * 90}%` }"
              />

              <!-- Projected -->
              <div
                v-if="data.projected"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3
                rounded-t-lg bg-gradient-to-t from-accent-light/40 to-accent-light/10"
                :style="{ height: `${(data.projected / maxValue) * 90}%` }"
              />

              <div class="absolute -bottom-8 w-full text-center text-xs">
                {{ data.month }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedPeriod = ref('Monthly')
const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly']

const chartData = ref([
  { month: 'Jan', actual: 2100000, projected: 2200000 },
  { month: 'Feb', actual: 1950000, projected: 2100000 },
  { month: 'Mar', actual: 2300000, projected: 2350000 },
  { month: 'Apr', actual: 2250000, projected: 2300000 },
  { month: 'May', actual: 2400000, projected: 2450000 },
  { month: 'Jun', actual: 2410000, projected: 2500000 },
  { month: 'Jul', actual: 2550000, projected: 2600000 },
  { month: 'Aug', actual: 2500000, projected: 2550000 },
  { month: 'Sep', actual: 2650000, projected: 2700000 },
  { month: 'Oct', actual: 2700000, projected: 2750000 },
  { month: 'Nov', actual: 2800000, projected: 2850000 },
  { month: 'Dec', actual: 2900000, projected: 2950000 },
])

const maxValue = computed(() => {
  return Math.max(...chartData.value.map(d => Math.max(d.actual, d.projected || 0)))
})

const totalRevenue = computed(() => {
  return chartData.value.reduce((sum, data) => sum + data.actual, 0)
})

const growthRate = computed(() => {
  const first = chartData.value[0].actual
  const last = chartData.value[chartData.value.length - 1].actual
  return (((last - first) / first) * 100).toFixed(1)
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<style scoped>
/* Bar animation on load */
@keyframes bar-rise {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Fixed: Escape the forward slash in the group selector */
.group\/bar > div:first-child > div:first-child {
  animation: bar-rise 0.8s ease-out;
  animation-fill-mode: both;
}

/* Staggered animation delays - also fixed with escaped slashes */
.group\/bar:nth-child(1) > div:first-child > div:first-child { animation-delay: 0.1s; }
.group\/bar:nth-child(2) > div:first-child > div:first-child { animation-delay: 0.2s; }
.group\/bar:nth-child(3) > div:first-child > div:first-child { animation-delay: 0.3s; }
.group\/bar:nth-child(4) > div:first-child > div:first-child { animation-delay: 0.4s; }
.group\/bar:nth-child(5) > div:first-child > div:first-child { animation-delay: 0.5s; }
.group\/bar:nth-child(6) > div:first-child > div:first-child { animation-delay: 0.6s; }
.group\/bar:nth-child(7) > div:first-child > div:first-child { animation-delay: 0.7s; }
.group\/bar:nth-child(8) > div:first-child > div:first-child { animation-delay: 0.8s; }
.group\/bar:nth-child(9) > div:first-child > div:first-child { animation-delay: 0.9s; }
.group\/bar:nth-child(10) > div:first-child > div:first-child { animation-delay: 1.0s; }
.group\/bar:nth-child(11) > div:first-child > div:first-child { animation-delay: 1.1s; }
.group\/bar:nth-child(12) > div:first-child > div:first-child { animation-delay: 1.2s; }
</style>