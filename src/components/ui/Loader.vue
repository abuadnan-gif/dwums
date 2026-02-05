<template>
  <div :class="[
    'flex items-center justify-center',
    fullscreen && 'fixed inset-0 z-[999] bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm'
  ]">
    <div class="text-center">
      <!-- Spinner -->
      <div class="relative">
        <div :class="[
          'rounded-full border-4 border-transparent',
          size === 'xs' && 'w-8 h-8',
          size === 'sm' && 'w-12 h-12',
          size === 'md' && 'w-16 h-16',
          size === 'lg' && 'w-20 h-20',
          size === 'xl' && 'w-24 h-24',
        ]">
          <!-- Outer ring -->
          <div :class="[
            'absolute inset-0 rounded-full border-4 animate-spin',
            color === 'primary' && 'border-primary-light/30 dark:border-primary-dark/30 border-t-primary-light dark:border-t-primary-dark',
            color === 'white' && 'border-white/30 border-t-white',
            color === 'success' && 'border-success-light/30 dark:border-success-dark/30 border-t-success-light dark:border-t-success-dark',
            color === 'warning' && 'border-warning-light/30 dark:border-warning-dark/30 border-t-warning-light dark:border-t-warning-dark',
            color === 'critical' && 'border-critical-light/30 dark:border-critical-dark/30 border-t-critical-light dark:border-t-critical-dark',
          ]"></div>
          
          <!-- Inner ring for larger sizes -->
          <div v-if="size === 'lg' || size === 'xl'" :class="[
            'absolute inset-4 rounded-full border-2 animate-spin [animation-direction:reverse]',
            color === 'primary' && 'border-accent-light/30 dark:border-accent-dark/30 border-t-accent-light dark:border-t-accent-dark',
            color === 'white' && 'border-white/20 border-t-white',
            color === 'success' && 'border-green-400/30 dark:border-green-500/30 border-t-green-400 dark:border-t-green-500',
            color === 'warning' && 'border-yellow-400/30 dark:border-yellow-500/30 border-t-yellow-400 dark:border-t-yellow-500',
            color === 'critical' && 'border-red-400/30 dark:border-red-500/30 border-t-red-400 dark:border-t-red-500',
          ]"></div>
        </div>
        
        <!-- Center dot for larger sizes -->
        <div v-if="size === 'lg' || size === 'xl'" :class="[
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse',
          size === 'lg' && 'w-2 h-2',
          size === 'xl' && 'w-3 h-3',
          color === 'primary' && 'bg-primary-light dark:bg-primary-dark',
          color === 'white' && 'bg-white',
          color === 'success' && 'bg-success-light dark:bg-success-dark',
          color === 'warning' && 'bg-warning-light dark:bg-warning-dark',
          color === 'critical' && 'bg-critical-light dark:bg-critical-dark',
        ]"></div>
      </div>
      
      <!-- Text -->
      <div v-if="text || $slots.default" class="mt-4">
        <slot>
          <p :class="[
            'font-medium',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl',
            color === 'primary' && 'text-primary-light dark:text-primary-dark',
            color === 'white' && 'text-white',
            color === 'success' && 'text-success-light dark:text-success-dark',
            color === 'warning' && 'text-warning-light dark:text-warning-dark',
            color === 'critical' && 'text-critical-light dark:text-critical-dark',
          ]">{{ text }}</p>
        </slot>
      </div>
      
      <!-- Subtext -->
      <p v-if="subtext" class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {{ subtext }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'white', 'success', 'warning', 'critical'].includes(value)
  },
  text: String,
  subtext: String,
  fullscreen: Boolean
})
</script>