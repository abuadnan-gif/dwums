<template>
  <div class="base-textarea-wrapper" :class="[
    `base-textarea-${size}`,
    {
      'base-textarea-disabled': disabled,
      'base-textarea-readonly': readonly,
      'base-textarea-error': error,
      'base-textarea-success': success,
      'base-textarea-filled': modelValue,
      'base-textarea-focused': isFocused,
      'base-textarea-premium': premium,
      'base-textarea-glass': glass,
      'dark': themeStore.isDark
    }
  ]">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="id" 
      class="base-textarea-label"
      :class="{ 'required': required }"
    >
      {{ label }}
      <span v-if="hint" class="base-textarea-hint">{{ hint }}</span>
    </label>

    <!-- Textarea Container -->
    <div class="base-textarea-container" @click="focusTextarea">
      <!-- Left Icon -->
      <span v-if="leftIcon" class="base-textarea-icon left">
        <Icon :name="leftIcon" :size="iconSize" />
      </span>

      <!-- Textarea -->
      <textarea
        :id="id"
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :rows="rows"
        :class="[
          'base-textarea-field',
          {
            'has-left-icon': leftIcon,
            'has-right-icon': rightIcon || clearable || showCount
          }
        ]"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
        v-bind="$attrs"
      />

      <!-- Right Icon -->
      <span v-if="rightIcon" class="base-textarea-icon right">
        <Icon :name="rightIcon" :size="iconSize" />
      </span>

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="base-textarea-clear"
        @click="clearTextarea"
        @mousedown.prevent
      >
        <Icon name="XMarkIcon" :size="iconSize" />
      </button>

      <!-- Character Counter -->
      <span v-if="showCount && maxlength" class="base-textarea-counter">
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </span>

      <!-- Loading Spinner -->
      <span v-if="loading" class="base-textarea-loading">
        <span class="spinner"></span>
      </span>

      <!-- Success Icon -->
      <span v-if="success && !loading" class="base-textarea-status success">
        <Icon name="CheckCircleIcon" :size="iconSize" />
      </span>

      <!-- Error Icon -->
      <span v-if="error && !loading" class="base-textarea-status error">
        <Icon name="ExclamationCircleIcon" :size="iconSize" />
      </span>
    </div>

    <!-- Error Message -->
    <transition name="slide-fade">
      <p v-if="error" class="base-textarea-error-message">
        <Icon name="ExclamationTriangleIcon" size="14" />
        {{ typeof error === 'string' ? error : 'Invalid input' }}
      </p>
    </transition>

    <!-- Help Text -->
    <p v-if="helpText && !error" class="base-textarea-help-text">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Icon from '@/components/Icon.vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  // Value
  modelValue: {
    type: [String, Number],
    default: ''
  },

  // Labels and placeholders
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },

  // Icons
  leftIcon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },

  // Textarea attributes
  rows: {
    type: [Number, String],
    default: 3
  },
  maxlength: {
    type: [Number, String],
    default: null
  },

  // States
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },

  // Validation
  error: {
    type: [String, Boolean],
    default: false
  },
  success: {
    type: Boolean,
    default: false
  },

  // Features
  clearable: {
    type: Boolean,
    default: false
  },
  showCount: {
    type: Boolean,
    default: false
  },
  autoResize: {
    type: Boolean,
    default: true
  },

  // Sizes
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  // Premium features
  premium: {
    type: Boolean,
    default: false
  },
  glass: {
    type: Boolean,
    default: false
  },

  // HTML attributes
  id: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
  },
  name: {
    type: String,
    default: ''
  },

  // Help text
  helpText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus', 'clear'])

const themeStore = useThemeStore()
const textareaRef = ref(null)
const isFocused = ref(false)

const iconSize = computed(() => {
  const sizes = { sm: 16, md: 18, lg: 20 }
  return sizes[props.size]
})

// Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  if (props.autoResize) {
    autoResizeTextarea()
  }
}

const handleChange = (event) => {
  emit('change', event.target.value)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const clearTextarea = () => {
  emit('update:modelValue', '')
  emit('clear')
  focusTextarea()
}

const focusTextarea = () => {
  if (!props.disabled && !props.readonly) {
    textareaRef.value?.focus()
  }
}

const autoResizeTextarea = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

// Watch for value changes to auto-resize
watch(() => props.modelValue, () => {
  if (props.autoResize) {
    nextTick(() => {
      autoResizeTextarea()
    })
  }
}, { immediate: true })
</script>

<style scoped>
.base-textarea-wrapper {
  width: 100%;
  font-family: inherit;
}

/* Label */
.base-textarea-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0F172A;
  margin-bottom: 0.375rem;
  transition: color 0.2s ease;
}

.dark .base-textarea-label {
  color: #F1F5F9;
}

.base-textarea-label.required::after {
  content: '*';
  color: #EF4444;
  margin-left: 0.25rem;
}

.base-textarea-hint {
  font-size: 0.75rem;
  color: #64748B;
  margin-left: 0.5rem;
  font-weight: normal;
}

/* Textarea Container */
.base-textarea-container {
  position: relative;
  display: flex;
  width: 100%;
  background: white;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.dark .base-textarea-container {
  background: #1E293B;
  border-color: #334155;
}

/* Focus state */
.base-textarea-focused .base-textarea-container {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.dark .base-textarea-focused .base-textarea-container {
  border-color: #A78BFA;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
}

/* Error state */
.base-textarea-error .base-textarea-container {
  border-color: #EF4444;
  background: rgba(239, 68, 68, 0.02);
}

.base-textarea-error .base-textarea-label {
  color: #EF4444;
}

/* Success state */
.base-textarea-success .base-textarea-container {
  border-color: #10B981;
}

/* Disabled state */
.base-textarea-disabled .base-textarea-container {
  background: #F1F5F9;
  border-color: #E2E8F0;
  opacity: 0.6;
  cursor: not-allowed;
}

.dark .base-textarea-disabled .base-textarea-container {
  background: #0F172A;
  border-color: #334155;
}

/* Readonly state */
.base-textarea-readonly .base-textarea-container {
  background: #F8FAFC;
  border-color: #E2E8F0;
}

.dark .base-textarea-readonly .base-textarea-container {
  background: #0F172A;
}

/* Filled state */
.base-textarea-filled .base-textarea-container {
  background: white;
}

/* Premium styles */
.base-textarea-premium .base-textarea-container {
  box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.1);
}

.base-textarea-premium.base-textarea-focused .base-textarea-container {
  box-shadow: 0 8px 20px -5px rgba(139, 92, 246, 0.3);
}

/* Glass effect */
.base-textarea-glass .base-textarea-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .base-textarea-glass .base-textarea-container {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.base-textarea-glass .base-textarea-field {
  color: white;
}

.base-textarea-glass .base-textarea-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Textarea field */
.base-textarea-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #0F172A;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  resize: vertical;
  line-height: 1.6;
  min-height: 80px;
}

.dark .base-textarea-field {
  color: #F1F5F9;
}

.base-textarea-field::placeholder {
  color: #94A3B8;
}

.base-textarea-field.has-left-icon {
  padding-left: 2.5rem;
}

.base-textarea-field.has-right-icon {
  padding-right: 2.5rem;
}

/* Sizes */
.base-textarea-sm .base-textarea-field {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  min-height: 60px;
}

.base-textarea-sm .base-textarea-field.has-left-icon {
  padding-left: 2rem;
}

.base-textarea-sm .base-textarea-field.has-right-icon {
  padding-right: 2rem;
}

.base-textarea-lg .base-textarea-field {
  padding: 1rem 1.25rem;
  font-size: 1rem;
  min-height: 100px;
}

.base-textarea-lg .base-textarea-field.has-left-icon {
  padding-left: 3rem;
}

.base-textarea-lg .base-textarea-field.has-right-icon {
  padding-right: 3rem;
}

/* Icons */
.base-textarea-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  transition: color 0.2s ease;
  top: 0.75rem;
}

.base-textarea-icon.left {
  left: 1rem;
}

.base-textarea-icon.right {
  right: 1rem;
}

.base-textarea-sm .base-textarea-icon {
  top: 0.5rem;
}

.base-textarea-sm .base-textarea-icon.left {
  left: 0.75rem;
}

.base-textarea-sm .base-textarea-icon.right {
  right: 0.75rem;
}

.base-textarea-lg .base-textarea-icon {
  top: 1rem;
}

.base-textarea-lg .base-textarea-icon.left {
  left: 1.25rem;
}

.base-textarea-lg .base-textarea-icon.right {
  right: 1.25rem;
}

.base-textarea-focused .base-textarea-icon {
  color: #8B5CF6;
}

/* Clear button */
.base-textarea-clear {
  position: absolute;
  right: 2.5rem;
  top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-textarea-clear:hover {
  background: #F1F5F9;
  color: #EF4444;
}

.dark .base-textarea-clear:hover {
  background: #334155;
}

.base-textarea-sm .base-textarea-clear {
  top: 0.5rem;
  right: 2rem;
}

.base-textarea-lg .base-textarea-clear {
  top: 1rem;
  right: 3rem;
}

/* Counter */
.base-textarea-counter {
  position: absolute;
  right: 1rem;
  bottom: 0.5rem;
  font-size: 0.7rem;
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.dark .base-textarea-counter {
  background: rgba(0, 0, 0, 0.5);
}

/* Loading spinner */
.base-textarea-loading {
  position: absolute;
  right: 1rem;
  top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #8B5CF6;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Status icons */
.base-textarea-status {
  position: absolute;
  right: 1rem;
  top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-textarea-status.success {
  color: #10B981;
}

.base-textarea-status.error {
  color: #EF4444;
}

/* Error message */
.base-textarea-error-message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #EF4444;
  animation: slideIn 0.2s ease;
}

/* Help text */
.base-textarea-help-text {
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #64748B;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-fade-enter-active {
  animation: slideIn 0.2s ease;
}

.slide-fade-leave-active {
  animation: slideIn 0.2s ease reverse;
}

/* Responsive */
@media (max-width: 640px) {
  .base-textarea-label {
    font-size: 0.8125rem;
  }

  .base-textarea-field {
    font-size: 0.8125rem;
  }

  .base-textarea-md .base-textarea-field {
    padding: 0.625rem 0.875rem;
  }
}
</style>