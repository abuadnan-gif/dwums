<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[100] overflow-y-auto"
      @click.self="handleClose"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- Modal Panel -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="isOpen"
            class="relative w-full max-w-2xl rounded-2xl bg-surface-light dark:bg-surface-dark border border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl overflow-hidden"
            :class="sizeClasses"
          >
            <!-- Decorative Elements -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark"></div>
            
            <!-- Close Button -->
            <button
              @click="handleClose"
              class="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
            >
              <svg class="w-5 h-5 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Modal Header -->
            <div v-if="title" class="px-6 pt-6 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
              <div class="flex items-center space-x-3">
                <div v-if="icon" class="p-2 rounded-lg" :class="iconBgClass">
                  <slot name="icon">
                    <svg class="w-5 h-5" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
                    </svg>
                  </slot>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ title }}</h3>
                  <p v-if="description" class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ description }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="px-6 py-4">
              <slot></slot>
            </div>

            <!-- Modal Footer -->
            <div v-if="showFooter || $slots.footer" class="px-6 py-4 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50">
              <slot name="footer">
                <div class="flex justify-end space-x-3">
                  <button
                    v-if="showCancel"
                    @click="handleClose"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    v-if="confirmText"
                    @click="handleConfirm"
                    class="btn-elite text-sm"
                  >
                    {{ confirmText }}
                  </button>
                </div>
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  title: String,
  description: String,
  icon: String,
  iconType: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'critical', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  preventClose: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  }
  return sizes[props.size]
})

const iconBgClass = computed(() => {
  const classes = {
    primary: 'bg-primary-light/10 dark:bg-primary-dark/10',
    success: 'bg-success-light/10 dark:bg-success-dark/10',
    warning: 'bg-warning-light/10 dark:bg-warning-dark/10',
    critical: 'bg-critical-light/10 dark:bg-critical-dark/10',
    info: 'bg-informational-light/10 dark:bg-informational-dark/10',
  }
  return classes[props.iconType]
})

const iconColorClass = computed(() => {
  const classes = {
    primary: 'text-primary-light dark:text-primary-dark',
    success: 'text-success-light dark:text-success-dark',
    warning: 'text-warning-light dark:text-warning-dark',
    critical: 'text-critical-light dark:text-critical-dark',
    info: 'text-informational-light dark:text-informational-dark',
  }
  return classes[props.iconType]
})

const handleClose = () => {
  if (!props.preventClose) {
    emit('close')
  }
}

const handleConfirm = () => {
  emit('confirm')
}

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen && !props.preventClose) {
    handleClose()
  }
}

// Add event listener
onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>