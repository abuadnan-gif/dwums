<template>
  <label 
    class="base-checkbox" 
    :class="[
      `base-checkbox-${size}`,
      `base-checkbox-${variant}`,
      {
        'base-checkbox-disabled': disabled,
        'base-checkbox-error': error,
        'base-checkbox-success': success,
        'base-checkbox-indeterminate': indeterminate,
        'base-checkbox-animated': animated,
        'base-checkbox-premium': premium,
        'base-checkbox-glow': glow,
        'base-checkbox-no-label': !label && !$slots.default,
        'dark': themeStore.isDark,
        'checked': modelValue
      }
    ]"
    :style="customStyles"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :value="value"
      :name="name"
      :required="required"
      @change="handleChange"
      v-bind="$attrs"
    />
    
<span class="checkmark" :class="{ 'with-ripple': ripple }">
  <!-- Ripple Effect -->
  <span v-if="ripple && !disabled" class="ripple-effect"></span>

  <!-- Icons -->
  <transition name="check-icon" mode="out-in">
    <Icon
      v-if="modelValue"
      key="check"
      name="CheckIcon"
      :size="iconSize"
      class="check-icon"
    />
    <Icon
      v-else-if="indeterminate"
      key="minus"
      name="MinusIcon"
      :size="iconSize"
      class="minus-icon"
    />
  </transition>

  <!-- Pulse Effect -->
  <span v-if="pulse && !disabled" class="pulse-effect"></span>
</span>
    
    <!-- Label with optional description -->
    <span v-if="label || $slots.default" class="label-container">
      <span class="label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" class="description">{{ description }}</span>
    </span>
    
    <!-- Helper Text or Error Message -->
    <span v-if="error && errorMessage" class="helper-text error">{{ errorMessage }}</span>
    <span v-else-if="helperText" class="helper-text">{{ helperText }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  // Value
  modelValue: {
    type: Boolean,
    default: false
  },
  
  // Indeterminate state
  indeterminate: {
    type: Boolean,
    default: false
  },
  
  // Label and content
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: null
  },
  
  // Form attributes
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  
  // Validation states
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  success: {
    type: Boolean,
    default: false
  },
  
  // Helper text
  helperText: {
    type: String,
    default: ''
  },
  
  // Size variants
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Visual variants
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'critical', 'info', 'neutral'].includes(value)
  },
  
  // Premium features
  animated: {
    type: Boolean,
    default: true
  },
  premium: {
    type: Boolean,
    default: false
  },
  glow: {
    type: Boolean,
    default: false
  },
  pulse: {
    type: Boolean,
    default: false
  },
  ripple: {
    type: Boolean,
    default: true
  },
  
  // Custom styling
  customClass: {
    type: String,
    default: ''
  },
  customColor: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const themeStore = useThemeStore()

// Computed icon size based on checkbox size
const iconSize = computed(() => {
  const sizes = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 }
  return sizes[props.size]
})

// Custom styles for premium colors
const customStyles = computed(() => {
  const styles = {}
  if (props.customColor) {
    styles['--checkbox-color'] = props.customColor
    styles['--checkbox-color-rgb'] = hexToRgb(props.customColor)
  }
  return styles
})

// Helper to convert hex to rgb
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '139, 92, 246'
}

const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked)
    emit('change', event.target.checked)
  }
}
</script>

<style scoped>
/* =========================================
   CSS Variables
========================================= */
.base-checkbox {
  --checkbox-color: #8B5CF6;
  --checkbox-color-rgb: 139, 92, 246;
  --checkbox-size: 20px;
  --checkbox-border-color: #E2E8F0;
  --checkbox-hover-color: #7C3AED;
  --checkbox-focus-ring: rgba(139, 92, 246, 0.3);
  --checkbox-disabled-opacity: 0.5;
  --checkbox-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --checkbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --checkbox-glow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.dark .base-checkbox {
  --checkbox-border-color: #4A5568;
}

/* =========================================
   Base Styles
========================================= */
.base-checkbox {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: inherit;
  transition: var(--checkbox-transition);
}

/* Hide native checkbox */
.base-checkbox input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* =========================================
   Checkmark Styles
========================================= */
.checkmark {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  background: white;
  border: 2px solid var(--checkbox-border-color);
  border-radius: 6px;
  transition: var(--checkbox-transition);
  box-shadow: var(--checkbox-shadow);
  flex-shrink: 0;
  overflow: hidden;
}

.dark .checkmark {
  background: #1E293B;
}

/* Checkmark hover effect */
.base-checkbox:hover .checkmark {
  border-color: var(--checkbox-color);
  transform: scale(1.02);
  box-shadow: 0 0 0 2px rgba(var(--checkbox-color-rgb), 0.1);
}

/* Checked state */
.base-checkbox.checked .checkmark {
  background: var(--checkbox-color);
  border-color: var(--checkbox-color);
  color: white;
  animation: checkPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Indeterminate state */
.base-checkbox-indeterminate .checkmark {
  background: var(--checkbox-color);
  border-color: var(--checkbox-color);
  color: white;
}

/* Focus state */
.base-checkbox input:focus-visible + .checkmark {
  outline: none;
  box-shadow: 0 0 0 3px var(--checkbox-focus-ring);
  border-color: var(--checkbox-color);
}

/* Disabled state */
.base-checkbox-disabled {
  opacity: var(--checkbox-disabled-opacity);
  cursor: not-allowed;
  pointer-events: none;
}

.base-checkbox-disabled .checkmark {
  background: #F1F5F9;
  border-color: #CBD5E1;
}

.dark .base-checkbox-disabled .checkmark {
  background: #2D3748;
  border-color: #4A5568;
}

/* Error state */
.base-checkbox-error .checkmark {
  border-color: #EF4444 !important;
  animation: shake 0.3s ease-in-out;
}

.base-checkbox-error.checked .checkmark {
  background: #EF4444;
  border-color: #EF4444;
}

/* Success state */
.base-checkbox-success .checkmark {
  border-color: #10B981;
}

.base-checkbox-success.checked .checkmark {
  background: #10B981;
  border-color: #10B981;
}

/* =========================================
   Icons
========================================= */
.check-icon,
.minus-icon {
  color: white;
  animation: iconAppear 0.2s ease-out;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Icon transitions */
.check-icon-enter-active,
.check-icon-leave-active {
  transition: all 0.2s ease;
}

.check-icon-enter-from,
.check-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* =========================================
   Label Styles
========================================= */
.label-container {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  line-height: 1.4;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0F172A;
  transition: color 0.2s ease;
}

.dark .label {
  color: #F1F5F9;
}

.base-checkbox:hover .label {
  color: var(--checkbox-color);
}

.description {
  font-size: 0.7rem;
  color: #64748B;
  line-height: 1.4;
}

.dark .description {
  color: #94A3B8;
}

/* Helper text */
.helper-text {
  font-size: 0.7rem;
  color: #64748B;
  margin-left: calc(var(--checkbox-size) + 0.75rem);
  margin-top: 0.125rem;
  display: block;
}

.helper-text.error {
  color: #EF4444;
}

/* =========================================
   Ripple Effect
========================================= */
.ripple-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 80%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
  animation: ripple 0.4s ease-out;
}

.base-checkbox:active .ripple-effect {
  animation: ripple 0.3s ease-out;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

/* =========================================
   Pulse Effect
========================================= */
.pulse-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  animation: pulse 2s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--checkbox-color-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--checkbox-color-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--checkbox-color-rgb), 0);
  }
}

/* =========================================
   Glow Effect
========================================= */
.base-checkbox-glow.checked .checkmark {
  animation: glow 2s infinite;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(var(--checkbox-color-rgb), 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(var(--checkbox-color-rgb), 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(var(--checkbox-color-rgb), 0.5);
  }
}

/* =========================================
   Animations
========================================= */
@keyframes checkPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes iconAppear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

/* =========================================
   Size Variants
========================================= */
.base-checkbox-xs {
  --checkbox-size: 14px;
  gap: 0.5rem;
}

.base-checkbox-xs .label {
  font-size: 0.7rem;
}

.base-checkbox-xs .description {
  font-size: 0.6rem;
}

.base-checkbox-sm {
  --checkbox-size: 16px;
  gap: 0.625rem;
}

.base-checkbox-sm .label {
  font-size: 0.75rem;
}

.base-checkbox-sm .description {
  font-size: 0.65rem;
}

.base-checkbox-md {
  --checkbox-size: 20px;
  gap: 0.75rem;
}

.base-checkbox-md .label {
  font-size: 0.875rem;
}

.base-checkbox-md .description {
  font-size: 0.7rem;
}

.base-checkbox-lg {
  --checkbox-size: 24px;
  gap: 0.875rem;
}

.base-checkbox-lg .label {
  font-size: 1rem;
}

.base-checkbox-lg .description {
  font-size: 0.75rem;
}

.base-checkbox-xl {
  --checkbox-size: 28px;
  gap: 1rem;
}

.base-checkbox-xl .label {
  font-size: 1.125rem;
}

.base-checkbox-xl .description {
  font-size: 0.8125rem;
}

/* =========================================
   Color Variants
========================================= */
.base-checkbox-primary {
  --checkbox-color: #8B5CF6;
  --checkbox-color-rgb: 139, 92, 246;
  --checkbox-hover-color: #7C3AED;
  --checkbox-focus-ring: rgba(139, 92, 246, 0.3);
}

.base-checkbox-secondary {
  --checkbox-color: #6B7280;
  --checkbox-color-rgb: 107, 114, 128;
  --checkbox-hover-color: #4B5563;
  --checkbox-focus-ring: rgba(107, 114, 128, 0.3);
}

.base-checkbox-success {
  --checkbox-color: #10B981;
  --checkbox-color-rgb: 16, 185, 129;
  --checkbox-hover-color: #059669;
  --checkbox-focus-ring: rgba(16, 185, 129, 0.3);
}

.base-checkbox-warning {
  --checkbox-color: #F59E0B;
  --checkbox-color-rgb: 245, 158, 11;
  --checkbox-hover-color: #D97706;
  --checkbox-focus-ring: rgba(245, 158, 11, 0.3);
}

.base-checkbox-critical {
  --checkbox-color: #EF4444;
  --checkbox-color-rgb: 239, 68, 68;
  --checkbox-hover-color: #DC2626;
  --checkbox-focus-ring: rgba(239, 68, 68, 0.3);
}

.base-checkbox-info {
  --checkbox-color: #3B82F6;
  --checkbox-color-rgb: 59, 130, 246;
  --checkbox-hover-color: #2563EB;
  --checkbox-focus-ring: rgba(59, 130, 246, 0.3);
}

.base-checkbox-neutral {
  --checkbox-color: #64748B;
  --checkbox-color-rgb: 100, 116, 139;
  --checkbox-hover-color: #475569;
  --checkbox-focus-ring: rgba(100, 116, 139, 0.3);
}

/* =========================================
   Premium Features
========================================= */
.base-checkbox-premium {
  --checkbox-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.base-checkbox-premium .checkmark {
  backdrop-filter: blur(4px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
}

.dark .base-checkbox-premium .checkmark {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.8));
}

.base-checkbox-premium.checked .checkmark {
  background: linear-gradient(135deg, var(--checkbox-color), var(--checkbox-hover-color));
}

/* =========================================
   No Label Style
========================================= */
.base-checkbox-no-label {
  gap: 0;
}

.base-checkbox-no-label .checkmark {
  margin: 0;
}

/* =========================================
   Responsive
========================================= */
@media (max-width: 640px) {
  .base-checkbox-md {
    --checkbox-size: 18px;
    gap: 0.625rem;
  }
  
  .base-checkbox-md .label {
    font-size: 0.8125rem;
  }
  
  .base-checkbox-md .description {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .base-checkbox {
    gap: 0.5rem;
  }
  
  .description {
    font-size: 0.6rem;
  }
}

/* =========================================
   Touch Device Optimizations
========================================= */
@media (hover: none) and (pointer: coarse) {
  .base-checkbox:hover .checkmark {
    transform: none;
  }
  
  .checkmark {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .base-checkbox-no-label .checkmark {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>