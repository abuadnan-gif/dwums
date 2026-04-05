<template>
  <div
    class="w-full font-sans relative"
    :class="[
      size === 'sm' && 'text-sm',
      size === 'lg' && 'text-lg',
      disabled && 'opacity-50 pointer-events-none',
      error && 'base-select-error',
      success && 'base-select-success',
      themeStore.isDark && 'dark'
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    ref="wrapperRef"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5"
      :class="{ 'after:content-[\'*\'] after:text-red-500 after:ml-1': required }"
    >
      {{ label }}
      <span v-if="hint" class="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">{{
        hint
      }}</span>
    </label>

    <!-- Select Container -->
    <div
      ref="selectRef"
      class="relative flex items-center w-full min-h-[42px] px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      :class="[
        size === 'sm' && 'min-h-[36px] px-3 text-sm',
        size === 'lg' && 'min-h-[48px] px-5 text-base',
        (isFocused || isOpen) &&
          'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/10',
        error && 'border-red-500 dark:border-red-400',
        success && 'border-green-500 dark:border-green-400',
        premium && 'shadow-lg shadow-purple-500/10',
        glass &&
          'bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/10 text-white'
      ]"
      @click="handleContainerClick"
      @focus="isFocused = true"
      @blur="handleBlur"
      @keydown="handleKeyDown"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
    >
      <!-- Left Icon -->
      <Icon v-if="leftIcon" :name="leftIcon" :size="iconSize" class="text-gray-400 mr-2" />

      <!-- Selected Value -->
      <div class="flex-1 truncate" :class="{ 'text-gray-400': !selectedLabel }">
        {{ selectedLabel || placeholder || 'Select an option' }}
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        class="flex items-center justify-center p-1 mr-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
        @click.stop="clearValue"
        tabindex="-1"
      >
        <Icon name="XMarkIcon" :size="iconSize" />
      </button>

      <!-- Arrow Icon -->
      <Icon
        name="ChevronDownIcon"
        :size="iconSize"
        class="text-gray-400 transition-transform duration-300"
        :class="{ 'rotate-180 text-purple-500': isOpen }"
      />
    </div>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
      @before-enter="positionDropdown"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
        :style="dropdownStyles"
        ref="dropdownRef"
        @mouseenter="mouseInDropdown = true"
        @mouseleave="mouseInDropdown = false"
      >
        <!-- Search -->
        <div v-if="searchable" class="p-3 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size="{16}"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              :placeholder="searchPlaceholder || 'Search...'"
              @click.stop
              @keydown.esc="closeDropdown"
              @keydown.down.prevent="navigateOptions(1)"
              @keydown.up.prevent="navigateOptions(-1)"
              @keydown.enter.prevent="selectFocusedOption"
            />
          </div>
        </div>

        <!-- Options -->
        <div class="overflow-y-auto max-h-[250px] p-1" ref="optionsRef">
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="flex items-center justify-between px-3 py-2 my-0.5 rounded-lg text-sm cursor-pointer transition-colors"
            :class="[
              option.disabled && 'opacity-50 cursor-not-allowed',
              isSelected(option) &&
                'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-medium',
              focusedOption === option.value && 'bg-purple-500/10 ring-2 ring-purple-500/20',
              !isSelected(option) && !option.disabled && 'hover:bg-purple-500/5'
            ]"
            @click.stop="selectOption(option)"
            @mouseenter="focusedOption = option.value"
            :data-value="option.value"
            role="option"
            :aria-selected="isSelected(option)"
          >
            <div class="flex items-center gap-2">
              <Icon v-if="option.icon" :name="option.icon" size="{16}" class="text-gray-500" />
              <span>{{ option.label }}</span>
            </div>
            <Icon v-if="isSelected(option)" name="CheckIcon" size="{16}" class="text-purple-500" />
          </div>

          <!-- Empty state -->
          <div
            v-if="filteredOptions.length === 0"
            class="flex flex-col items-center justify-center py-8 px-4 text-gray-400"
          >
            <Icon name="InboxIcon" size="{24}" class="mb-2 opacity-50" />
            <p class="text-sm">No options found</p>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="showActions"
          class="flex justify-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            @click.stop="clearValue"
          >
            Clear
          </button>
          <button
            class="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
            @click.stop="closeDropdown"
          >
            Done
          </button>
        </div>
      </div>
    </transition>

    <!-- Error Message -->
    <transition enter-active-class="animate-slideIn">
      <p v-if="error" class="flex items-center gap-1 mt-1.5 text-xs text-red-500">
        <Icon name="ExclamationTriangleIcon" size="{14}" />
        {{ error }}
      </p>
    </transition>

    <!-- Help Text -->
    <p v-if="helpText && !error" class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Icon from '@/components/Icon.vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  modelValue: [String, Number, Array],
 // options: { type: Array, required: true },
 options: {
  type: Array,
  default: () => []
},
  label: String,
  placeholder: String,
  hint: String,
  leftIcon: String,
  multiple: Boolean,
  searchable: Boolean,
  clearable: Boolean,
  showActions: Boolean,
  hoverMode: { type: Boolean, default: true },
  clickMode: { type: Boolean, default: true },
  hoverDelay: { type: Number, default: 300 },
  searchPlaceholder: String,
  filterFunction: Function,
  disabled: Boolean,
  required: Boolean,
  error: [String, Boolean],
  success: Boolean,
  size: { type: String, default: 'md' },
  premium: Boolean,
  glass: Boolean,
  id: { type: String, default: () => `select-${Math.random().toString(36).substr(2, 9)}` },
  helpText: String,
  dropdownPlacement: { type: String, default: 'bottom' }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus', 'clear'])
const themeStore = useThemeStore()

// Refs
const wrapperRef = ref(null)
const selectRef = ref(null)
const dropdownRef = ref(null)
const optionsRef = ref(null)
const searchInput = ref(null)

// State
const isOpen = ref(false)
const isFocused = ref(false)
const searchQuery = ref('')
const focusedOption = ref(null)
const dropdownStyles = ref({})
const hoverTimeout = ref(null)
const mouseInDropdown = ref(false)
const clickOpen = ref(false)

// Computed
const iconSize = computed(() => ({ sm: 16, md: 18, lg: 20 })[props.size])

const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const selected = props.options.filter((opt) => props.modelValue.includes(opt.value))
    return selected.length === 0
      ? null
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} items selected`
  }
  //return props.options.find((opt) => opt.value === props.modelValue)?.label || null
  return (props.options || []).find((opt) => opt.value === props.modelValue)?.label || null
})

const filteredOptions = computed(() => {
 // if (!props.searchable || !searchQuery.value) return props.options
 if (!props.searchable || !searchQuery.value) return props.options || []
  if (props.filterFunction)
    return props.options.filter((opt) => props.filterFunction(opt, searchQuery.value))

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(query) || opt.searchText?.toLowerCase().includes(query)
  )
})

// Methods
const handleMouseEnter = () => {
  if (props.disabled || !props.hoverMode) return
  clearTimeout(hoverTimeout.value)
  hoverTimeout.value = setTimeout(() => {
    if (!props.disabled) {
      isOpen.value = true
      positionDropdown()
    }
  }, props.hoverDelay)
}

const handleMouseLeave = () => {
  clearTimeout(hoverTimeout.value)
  setTimeout(() => {
    if (!mouseInDropdown.value && !clickOpen.value) {
      isOpen.value = false
    }
  }, 100)
}

const handleContainerClick = () => {
  if (props.disabled || !props.clickMode) return
  clickOpen.value = !clickOpen.value
  isOpen.value = clickOpen.value
  if (isOpen.value) {
    positionDropdown()
    nextTick(() => props.searchable && searchInput.value?.focus())
  }
}

const handleBlur = () => {
  isFocused.value = false
  if (!isOpen.value) emit('blur')
}

const handleKeyDown = (e) => {
  if (props.disabled) return
  const actions = {
    Enter: () => !isOpen.value && (clickOpen.value = isOpen.value = true) && positionDropdown(),
    Space: () => !isOpen.value && (clickOpen.value = isOpen.value = true) && positionDropdown(),
    Escape: () => isOpen.value && closeDropdown(),
    Tab: () => isOpen.value && closeDropdown(),
    ArrowDown: () =>
      isOpen.value
        ? navigateOptions(1)
        : (clickOpen.value = isOpen.value = true) && positionDropdown(),
    ArrowUp: () =>
      isOpen.value
        ? navigateOptions(-1)
        : (clickOpen.value = isOpen.value = true) && positionDropdown()
  }
  actions[e.key]?.()
  if (actions[e.key]) e.preventDefault()
}

const navigateOptions = (direction) => {
  const options = filteredOptions.value.filter((opt) => !opt.disabled)
  if (!options.length) return

  let index = options.findIndex((opt) => opt.value === focusedOption.value)
  index = index === -1 ? (direction > 0 ? -1 : options.length) : index
  const nextIndex = index + direction

  if (nextIndex >= 0 && nextIndex < options.length) {
    focusedOption.value = options[nextIndex].value
    nextTick(() => {
      const el = optionsRef.value?.querySelector(`[data-value="${focusedOption.value}"]`)
      el?.scrollIntoView({ block: 'nearest' })
    })
  }
}

const selectFocusedOption = () => {
  const option = filteredOptions.value.find((opt) => opt.value === focusedOption.value)
  if (option) selectOption(option)
}

const selectOption = (option) => {
  if (option.disabled) return

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(option.value)
    index === -1 ? current.push(option.value) : current.splice(index, 1)
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    if (clickOpen.value) closeDropdown()
  }
}

const isSelected = (option) => {
  return props.multiple && Array.isArray(props.modelValue)
    ? props.modelValue.includes(option.value)
    : props.modelValue === option.value
}

const clearValue = () => {
  emit('update:modelValue', props.multiple ? [] : null)
  emit('change', props.multiple ? [] : null)
  emit('clear')
  selectRef.value?.focus()
}

const closeDropdown = () => {
  clickOpen.value = false
  isOpen.value = false
  searchQuery.value = ''
  focusedOption.value = null
  selectRef.value?.focus()
}

const positionDropdown = () => {
  if (!selectRef.value) return
  const rect = selectRef.value.getBoundingClientRect()
  
  // Always open below
  dropdownStyles.value = {
    top: 'calc(100% + 4px)',
    left: '0',
    width: `${rect.width}px`,
    maxHeight: '250px' // Fixed max height or calculate based on available space
  }
}

const handleClickOutside = (e) => {
  if (
    !wrapperRef.value?.contains(e.target) &&
    !dropdownRef.value?.contains(e.target) &&
    isOpen.value
  ) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  window.addEventListener('resize', positionDropdown)
  window.addEventListener('scroll', positionDropdown, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  window.removeEventListener('resize', positionDropdown)
  window.removeEventListener('scroll', positionDropdown, true)
  clearTimeout(hoverTimeout.value)
})

// Watches
watch(isOpen, (open) => {
  if (open) {
    positionDropdown()
    focusedOption.value = props.modelValue || filteredOptions.value[0]?.value
  } else {
    searchQuery.value = ''
    focusedOption.value = null
  }
})

// Expose
defineExpose({
  open: () => {
    clickOpen.value = isOpen.value = true
    positionDropdown()
  },
  close: closeDropdown,
  toggle: () =>
    isOpen.value ? closeDropdown() : (clickOpen.value = isOpen.value = true) && positionDropdown()
})
</script>

<style>
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
.animate-slideIn {
  animation: slideIn 0.2s ease;
}
</style>
