<template>
  <div
    class="base-spinner"
    :class="[size, variant]"
    :style="{
      width: `${computedSize}px`,
      height: `${computedSize}px`
    }"
  >
    <div class="spinner-circle" :style="{ borderWidth: `${borderWidth}px` }"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'muted'].includes(value)
  }
})

const sizeMap = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64
}

const borderWidthMap = {
  xs: 2,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4
}

const computedSize = computed(() => sizeMap[props.size])
const borderWidth = computed(() => borderWidthMap[props.size])
</script>

<style scoped>
.base-spinner {
  display: inline-block;
  position: relative;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-style: solid;
  border-color: currentColor transparent transparent transparent;
  animation: spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
}

/* Variants */
.primary {
  color: var(--color-primary);
}

.secondary {
  color: var(--color-secondary);
}

.white {
  color: #ffffff;
}

.muted {
  color: var(--color-muted-foreground);
  opacity: 0.3;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>