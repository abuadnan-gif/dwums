<template>
  <div class="relative w-full h-1 overflow-hidden">
    <!-- Main Gradient Line -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark"></div>
    
    <!-- Animated Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
    
    <!-- Glow Effect -->
    <div class="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-primary-light/20 via-accent-light/20 to-secondary-light/20 dark:from-primary-dark/20 dark:via-accent-dark/20 dark:to-secondary-dark/20 blur-xl opacity-50"></div>
    
    <!-- Dots Pattern -->
    <div class="absolute inset-0 flex items-center justify-between px-4">
      <div v-for="i in 5" :key="i" class="w-1 h-1 rounded-full bg-white dark:bg-surface-dark"></div>
    </div>
  </div>
</template>

<script setup>
// Component for themed horizontal line
</script>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}
</style>