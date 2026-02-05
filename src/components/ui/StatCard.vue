<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
    <!-- Total Revenue -->
    <div class="metric-card group h-full">
      <!-- Content remains the same but now takes full height -->
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 rounded-xl bg-success-light/10 dark:bg-success-dark/10">
          <svg class="w-6 h-6 text-success-light dark:text-success-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="text-xs font-medium px-3 py-1 rounded-full bg-success-light/10 dark:bg-success-dark/10 text-success-light dark:text-success-dark">
          +12.5%
        </span>
      </div>
      <h3 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₦ 2.41M</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Monthly Revenue</p>
      <div class="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-500 dark:text-neutral-400">Target: ₦ 2.5M</span>
          <span class="font-medium text-success-light dark:text-success-dark">96%</span>
        </div>
        <div class="mt-2 h-1.5 w-full bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-success-light to-success-dark dark:from-success-dark dark:to-success-light rounded-full" style="width: 96%"></div>
        </div>
      </div>
    </div>

    <!-- Active Customers -->
    <div class="metric-card group h-full">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 rounded-xl bg-primary-light/10 dark:bg-primary-dark/10">
          <svg class="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <span class="text-xs font-medium px-3 py-1 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark">
          +8.2%
        </span>
      </div>
      <h3 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">12,847</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Active Customers</p>
      <div class="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
        <div class="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
          <svg class="w-4 h-4 mr-1 text-success-light dark:text-success-dark" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          +245 this month
        </div>
      </div>
    </div>

    <!-- Water Consumption -->
    <div class="metric-card group h-full">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 rounded-xl bg-accent-light/10 dark:bg-accent-dark/10">
          <svg class="w-6 h-6 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
          </svg>
        </div>
        <span class="text-xs font-medium px-3 py-1 rounded-full bg-warning-light/10 dark:bg-warning-dark/10 text-warning-light dark:text-warning-dark">
          -3.2%
        </span>
      </div>
      <h3 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">245,678</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Total Consumption (m³)</p>
      <div class="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-500 dark:text-neutral-400">Daily Avg: 8,189 m³</span>
          <span class="font-medium text-warning-light dark:text-warning-dark">-3.2%</span>
        </div>
      </div>
    </div>

    <!-- System Health -->
    <div class="metric-card group h-full">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 rounded-xl bg-informational-light/10 dark:bg-informational-dark/10">
          <svg class="w-6 h-6 text-informational-light dark:text-informational-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div class="relative">
          <div class="w-10 h-10">
            <svg class="w-10 h-10 text-success-light dark:text-success-dark" viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="2" />
              <path class="circle" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="94, 100" />
              <text x="18" y="20.35" class="percentage font-mono text-[10px] fill-current">94%</text>
            </svg>
          </div>
        </div>
      </div>
      <h3 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">System Health</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Operational Status</p>
      <div class="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
        <div class="flex items-center text-xs text-success-light dark:text-success-dark">
          <div class="w-2 h-2 rounded-full bg-success-light dark:bg-success-dark mr-2 animate-pulse"></div>
          All systems operational
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.circle {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 1s ease;
}
.percentage {
  text-anchor: middle;
  dominant-baseline: central;
  font-weight: 600;
}

/* Ensure full width for grid */
.w-full {
  width: 100%;
}

/* Ensure cards take full height */
.h-full {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.metric-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>