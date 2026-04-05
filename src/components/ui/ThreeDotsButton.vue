<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import Icon from '@/components/Icon.vue'

let activeCloser = null

const props = defineProps({
  actions: {
    type: Array,
    required: true
  },
  offset: {
    type: Number,
    default: 10
  }
})

const open = ref(false)
const buttonRef = ref(null)
const dropdownRef = ref(null)
let closeTimeout = null
const theme = ref('light')
const autoPlacement = ref('bottom') // dynamically adjusted

onMounted(() => {
  theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
})

watch(theme, () => {
  if (open.value) nextTick(() => positionDropdown())
})

const openDropdown = async () => {
  clearTimeout(closeTimeout)
  if (activeCloser && activeCloser !== closeDropdown) activeCloser()
  open.value = true
  activeCloser = closeDropdown
  await nextTick()
  positionDropdown()
}

const scheduleClose = () => {
  clearTimeout(closeTimeout)
  closeTimeout = setTimeout(() => closeDropdown(), 150)
}

const closeDropdown = () => {
  clearTimeout(closeTimeout)
  open.value = false
  if (activeCloser === closeDropdown) activeCloser = null
}

const handleClickOutside = (event) => {
  if (!open.value) return
  if (!buttonRef.value?.contains(event.target) && !dropdownRef.value?.contains(event.target)) {
    closeDropdown()
  }
}

/* -------------------------------
   POSITION & AUTO-FLIP
------------------------------- */
const positionDropdown = () => {
  if (!buttonRef.value || !dropdownRef.value) return
  const btn = buttonRef.value.getBoundingClientRect()
  const drop = dropdownRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const el = dropdownRef.value
  el.style.position = 'fixed'
  el.style.zIndex = '99999'

  // Auto-flip logic
  const spaceBelow = viewportHeight - btn.bottom
  const spaceAbove = btn.top

  autoPlacement.value = spaceBelow < drop.height && spaceAbove > drop.height ? 'top' : 'bottom'

  if (autoPlacement.value === 'bottom') {
    el.style.top = `${btn.bottom + props.offset}px`
  } else {
    el.style.top = `${btn.top - drop.height - props.offset}px`
  }

  el.style.left = `${btn.left}px`

  // Keep within viewport horizontally
  const dropdownPos = el.getBoundingClientRect()
  if (dropdownPos.right > window.innerWidth) el.style.left = `${window.innerWidth - drop.width - 16}px`
  if (dropdownPos.left < 0) el.style.left = '16px'
}

/* -------------------------------
   GRADIENT STYLES - 30% opacity
------------------------------- */
const getGradientStyle = (variant = 'primary') => {
  // Return a style object with the appropriate gradient at 30% opacity
  const gradients = {
    primary: 'linear-gradient(135deg, rgba(0, 102, 255, 0.3), rgba(139, 92, 246, 0.3))',
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))',
    warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.3))',
    critical: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))',
    info: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
    secondary: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3))',
    accent: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(219, 39, 119, 0.3))'
  }
  
  return { backgroundImage: gradients[variant] || gradients.primary }
}

const iconClasses = (variant = 'primary') => {
  const colorMap = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    critical: 'text-critical',
    info: 'text-info',
    secondary: 'text-secondary',
    accent: 'text-secondary'
  }
  return `w-5 h-5 ${colorMap[variant] || colorMap.primary} transition-colors duration-300`
}

onMounted(() => document.addEventListener('click', handleClickOutside, true))
onUnmounted(() => document.removeEventListener('click', handleClickOutside, true))
</script>

<template>
  <div
    ref="buttonRef"
    class="relative inline-block"
    @mouseenter="openDropdown"
    @mouseleave="scheduleClose"
  >
    <!-- THREE DOTS BUTTON -->
    <button
      @click.stop="openDropdown"
      class="group flex items-center gap-1.5 px-3 py-2 rounded-xl
             bg-white/80 dark:bg-zinc-800/50 backdrop-blur-xl
             border border-zinc-200 dark:border-zinc-700
             shadow-sm hover:shadow-xl
             transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
      :class="open && 'ring-2 ring-blue-500/40 shadow-xl'"
    >
      <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 transition-transform group-hover:scale-125"></span>
      <span class="h-2.5 w-2.5 rounded-full bg-amber-500 transition-transform group-hover:scale-125"></span>
      <span class="h-2.5 w-2.5 rounded-full bg-rose-500 transition-transform group-hover:scale-125"></span>
    </button>

    <!-- DROPDOWN -->
    <Teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95 -translate-y-2"
        @enter="positionDropdown"
      >
        <div
          v-if="open"
          ref="dropdownRef"
          @mouseenter="openDropdown"
          @mouseleave="scheduleClose"
          class="fixed z-[99999] w-64 rounded-2xl
                 backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60
                 border border-white/30 dark:border-zinc-700/40
                 shadow-2xl overflow-hidden"
        >
          <div class="p-2 space-y-2">
            <button
              v-for="(action, index) in actions"
              :key="index"
              @click="action.onClick(); closeDropdown()"
              class="group flex items-center gap-3 w-full px-4 py-3
                     rounded-xl text-sm font-medium
                     transition-all duration-200 hover:shadow-md hover:scale-105
                     bg-white/0 hover:bg-white/40 dark:hover:bg-zinc-800/60"
            >
              <!-- Icon container with 30% opacity gradient background -->
              <div 
                class="flex items-center justify-center h-10 w-10 rounded-xl shadow-md transition-all duration-300 group-hover:scale-105"
                :style="getGradientStyle(action.variant)"
              >
                <Icon :name="action.icon || 'EllipsisHorizontalIcon'" :class="iconClasses(action.variant)" />
              </div>
              <span class="flex-1 text-left text-zinc-700 dark:text-zinc-200">{{ action.name }}</span>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>