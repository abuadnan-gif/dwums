<template>
  <Teleport to="body">
    <Transition
      :name="transition"
      @after-leave="$emit('closed')"
    >
      <div
        v-if="visible"
        class="fixed z-toast"
        :class="positionClasses"
      >
        <div
          class="base-alert"
          :class="[variant, { dismissible }]"
          role="alert"
        >
          <!-- Icon -->
          <div v-if="showIcon" class="alert-icon">
            <component :is="iconComponent" class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h4 v-if="title" class="alert-title">{{ title }}</h4>
            <p class="alert-message"><slot></slot></p>
          </div>

          <!-- Close Button -->
          <button
            v-if="dismissible"
            class="alert-close"
            @click="dismiss"
            aria-label="Close"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>

          <!-- Progress Bar -->
          <div
            v-if="autoDismiss && duration > 0"
            class="alert-progress"
            :style="{ animationDuration: `${duration}ms` }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  title: String,
  dismissible: {
    type: Boolean,
    default: true
  },
  autoDismiss: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 5000
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom'
    ].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  transition: {
    type: String,
    default: 'alert-slide'
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'closed'])

const visible = ref(props.modelValue)
let timeout = null

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[props.variant]
})

const positionClasses = computed(() => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'bottom': 'bottom-4 left-1/2 -translate-x-1/2'
  }
  return positions[props.position]
})

const dismiss = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
}

if (props.autoDismiss) {
  timeout = setTimeout(dismiss, props.duration)
}

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal && props.autoDismiss) {
    timeout = setTimeout(dismiss, props.duration)
  }
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})
</script>

<style scoped>
.base-alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-hard);
  min-width: 320px;
  max-width: 420px;
  border: 1px solid;
}

/* Variants */
.success {
  background: var(--color-success-50);
  border-color: var(--color-success-200);
  color: var(--color-success-700);
}

.dark .success {
  background: var(--color-success-900);
  border-color: var(--color-success-800);
  color: var(--color-success-300);
}

.warning {
  background: var(--color-warning-50);
  border-color: var(--color-warning-200);
  color: var(--color-warning-700);
}

.dark .warning {
  background: var(--color-warning-900);
  border-color: var(--color-warning-800);
  color: var(--color-warning-300);
}

.error {
  background: var(--color-critical-50);
  border-color: var(--color-critical-200);
  color: var(--color-critical-700);
}

.dark .error {
  background: var(--color-critical-900);
  border-color: var(--color-critical-800);
  color: var(--color-critical-300);
}

.info {
  background: var(--color-informational-50);
  border-color: var(--color-informational-200);
  color: var(--color-informational-700);
}

.dark .info {
  background: var(--color-informational-900);
  border-color: var(--color-informational-800);
  color: var(--color-informational-300);
}

/* Alert Elements */
.alert-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.75rem;
  opacity: 0.9;
  line-height: 1.5;
}

.alert-close {
  flex-shrink: 0;
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.alert-close:hover {
  opacity: 1;
}

/* Progress Bar */
.alert-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: progress linear forwards;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Transitions */
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}

.alert-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile */
@media (max-width: 640px) {
  .base-alert {
    min-width: calc(100% - 2rem);
    max-width: calc(100% - 2rem);
  }
}
</style>