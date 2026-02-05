<template>
  <div 
    :class="[
      'elite-card relative overflow-hidden transition-all duration-300 h-full',
      hoverable && 'hover:shadow-2xl hover:-translate-y-1',
      clickable && 'cursor-pointer hover:border-primary-light/30 dark:hover:border-primary-dark/30',
      padding && `p-${padding}`,
      fullWidth && 'w-full',
      className
    ]"
    @click="handleClick"
  >
    <!-- Glow Effect -->
    <div 
      v-if="glow" 
      class="absolute -inset-1 bg-gradient-to-r from-primary-light/20 to-accent-light/20 dark:from-primary-dark/20 dark:to-accent-dark/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    ></div>
    
    <!-- Header Slot -->
    <div v-if="$slots.header || title" class="mb-4">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div>
            <h3 v-if="title" class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ subtitle }}</p>
          </div>
          <div v-if="$slots['header-action']" class="flex items-center space-x-2">
            <slot name="header-action"></slot>
          </div>
        </div>
      </slot>
    </div>
    
    <!-- Content -->
    <div :class="['flex-1', contentClass]">
      <slot></slot>
    </div>
    
    <!-- Footer Slot -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
      <slot name="footer"></slot>
    </div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-primary-light/30 dark:border-primary-dark/30 border-t-primary-light dark:border-t-primary-dark rounded-full animate-spin"></div>
        <p v-if="loadingText" class="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{{ loadingText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  hoverable: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  },
  glow: {
    type: Boolean,
    default: true
  },
  padding: {
    type: String,
    default: '6'
  },
  loading: Boolean,
  loadingText: String,
  contentClass: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>