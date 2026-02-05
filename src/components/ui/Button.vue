<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative overflow-hidden transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      rounded ? 'rounded-full' : 'rounded-xl',
      getSizeClasses,
      getVariantClasses,
      fullWidth && 'w-full justify-center',
      className,
      'group'
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-inherit">
      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
    
    <!-- Gradient Overlay on Hover -->
    <div v-if="variant.includes('gradient')" class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :class="gradientOverlayClass"></div>
    
    <!-- Shine Effect -->
    <div v-if="shine && !disabled && !loading" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine"></div>
    
    <!-- Content -->
    <span :class="['relative z-10 flex items-center justify-center', loading && 'opacity-0']">
      <!-- Left Icon -->
      <slot name="icon-left">
        <svg v-if="iconLeft" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconLeft" />
        </svg>
      </slot>
      
      <!-- Text -->
      <span><slot></slot></span>
      
      <!-- Right Icon -->
      <slot name="icon-right">
        <svg v-if="iconRight" class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconRight" />
        </svg>
      </slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary-gradient',
    validator: (value) => [
      'primary-gradient', 'secondary-gradient', 'accent-gradient',
      'success-gradient', 'warning-gradient', 'critical-gradient',
      'primary', 'secondary', 'accent', 'success', 'warning', 'critical',
      'outline', 'ghost', 'light'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  disabled: Boolean,
  loading: Boolean,
  rounded: Boolean,
  fullWidth: Boolean,
  shine: {
    type: Boolean,
    default: true
  },
  iconLeft: String,
  iconRight: String,
  className: String
})

const emit = defineEmits(['click'])

const getSizeClasses = computed(() => {
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }
  return sizes[props.size]
})

const getVariantClasses = computed(() => {
  const baseClasses = {
    // Gradient Variants
    'primary-gradient': 'bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-primary-light/50 dark:focus:ring-primary-dark/50',
    'secondary-gradient': 'bg-gradient-to-r from-secondary-light to-green-400 dark:from-secondary-dark dark:to-green-500 text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-secondary-light/50 dark:focus:ring-secondary-dark/50',
    'accent-gradient': 'bg-gradient-to-r from-accent-light to-purple-400 dark:from-accent-dark dark:to-purple-500 text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-accent-light/50 dark:focus:ring-accent-dark/50',
    'success-gradient': 'bg-gradient-to-r from-success-light to-green-400 dark:from-success-dark dark:to-green-500 text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-success-light/50 dark:focus:ring-success-dark/50',
    'warning-gradient': 'bg-gradient-to-r from-warning-light to-yellow-400 dark:from-warning-dark dark:to-yellow-500 text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-warning-light/50 dark:focus:ring-warning-dark/50',
    'critical-gradient': 'bg-gradient-to-r from-critical-light to-red-400 dark:from-critical-dark dark:to-red-500 text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-critical-light/50 dark:focus:ring-critical-dark/50',
    
    // Solid Variants
    'primary': 'bg-primary-light dark:bg-primary-dark text-white hover:bg-primary-light/90 dark:hover:bg-primary-dark/90 hover:shadow-md focus:ring-primary-light/50 dark:focus:ring-primary-dark/50',
    'secondary': 'bg-secondary-light dark:bg-secondary-dark text-white hover:bg-secondary-light/90 dark:hover:bg-secondary-dark/90 hover:shadow-md focus:ring-secondary-light/50 dark:focus:ring-secondary-dark/50',
    'accent': 'bg-accent-light dark:bg-accent-dark text-white hover:bg-accent-light/90 dark:hover:bg-accent-dark/90 hover:shadow-md focus:ring-accent-light/50 dark:focus:ring-accent-dark/50',
    'success': 'bg-success-light dark:bg-success-dark text-white hover:bg-success-light/90 dark:hover:bg-success-dark/90 hover:shadow-md focus:ring-success-light/50 dark:focus:ring-success-dark/50',
    'warning': 'bg-warning-light dark:bg-warning-dark text-white hover:bg-warning-light/90 dark:hover:bg-warning-dark/90 hover:shadow-md focus:ring-warning-light/50 dark:focus:ring-warning-dark/50',
    'critical': 'bg-critical-light dark:bg-critical-dark text-white hover:bg-critical-light/90 dark:hover:bg-critical-dark/90 hover:shadow-md focus:ring-critical-light/50 dark:focus:ring-critical-dark/50',
    
    // Outline Variants
    'outline': 'border-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 focus:ring-primary-light/50 dark:focus:ring-primary-dark/50',
    'ghost': 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-neutral-400',
    'light': 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-neutral-400'
  }
  
  return baseClasses[props.variant]
})

const gradientOverlayClass = computed(() => {
  if (!props.variant.includes('gradient')) return ''
  
  const overlays = {
    'primary-gradient': 'bg-gradient-to-r from-accent-light to-primary-light dark:from-accent-dark dark:to-primary-dark',
    'secondary-gradient': 'bg-gradient-to-r from-green-400 to-secondary-light dark:from-green-500 dark:to-secondary-dark',
    'accent-gradient': 'bg-gradient-to-r from-purple-400 to-accent-light dark:from-purple-500 dark:to-accent-dark',
    'success-gradient': 'bg-gradient-to-r from-green-400 to-success-light dark:from-green-500 dark:to-success-dark',
    'warning-gradient': 'bg-gradient-to-r from-yellow-400 to-warning-light dark:from-yellow-500 dark:to-warning-dark',
    'critical-gradient': 'bg-gradient-to-r from-red-400 to-critical-light dark:from-red-500 dark:to-critical-dark'
  }
  
  return overlays[props.variant] || ''
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
@keyframes shine {
  100% { transform: translateX(100%); }
}

.animate-shine {
  animation: shine 2s infinite;
}

/* Scale transition for gradient buttons */
.bg-gradient-to-r {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced focus states */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Smooth hover transitions */
button:not(:disabled):hover {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>