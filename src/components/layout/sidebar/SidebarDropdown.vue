<template>
  <div class="relative">
    <!-- Dropdown Header -->
    <button
      @click="toggleDropdown"
      :class="[
        'group w-full flex items-center rounded-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden',
        collapsed ? 'justify-center p-3' : 'px-4 py-3',
        isActive
          ? isDark
            ? 'bg-gradient-to-r from-primary-dark/30 via-primary-dark/15 to-transparent text-primary-dark shadow-lg'
            : 'bg-gradient-to-r from-primary-light/30 via-primary-light/15 to-transparent text-primary-light shadow-lg'
          : isDark
            ? 'text-white/70 hover:text-white hover:bg-white/5'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
      ]"
      :aria-expanded="isOpen"
      :aria-label="`${title} menu`"
    >
      
      <!-- Icon Container -->
      <div :class="[
        'relative z-10 transition-all duration-300',
        isActive
          ? isDark
            ? 'text-primary-dark'
            : 'text-primary-light'
          : isDark
            ? 'text-white/70 group-hover:text-white'
            : 'text-neutral-600 group-hover:text-neutral-900',
        collapsed ? '' : 'mr-3'
      ]">
        <!-- Icon Background Glow -->
        <div v-if="isActive" 
          class="absolute -inset-2 bg-current opacity-10 rounded-xl blur-md"></div>
        
        <!-- Heroicon -->
        <Icon :name="icon" class="w-5 h-5 relative" />
      </div>
      
      <!-- Content (when expanded) -->
      <div v-if="!collapsed" class="relative z-10 flex-1 flex items-center justify-between">
        <span class="text-sm font-medium transition-opacity duration-300">
          {{ title }}
        </span>
        
        <!-- Use Icon component for ChevronDownIcon -->
        <Icon
          name="ChevronDownIcon"
          class="w-5 h-5 transition-transform duration-500"
          :class="[
            isOpen ? 'rotate-180' : '',
            isDark ? 'text-white/60' : 'text-neutral-500'
          ]"
        />
      </div>
      
      <!-- Active Indicator -->
      <div v-if="isActive && !isOpen" 
        class="absolute right-3 w-2 h-2 rounded-full animate-ping"
        :class="isDark ? 'bg-primary-dark' : 'bg-primary-light'"></div>
      
      <!-- Tooltip for Collapsed State -->
      <div v-if="collapsed" 
        class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50"
        :class="[
          'premium-tooltip',
          isDark ? 'dark-tooltip' : 'light-tooltip'
        ]">
        {{ title }}
        <div v-if="isOpen" class="mt-1 space-y-1">
          <div v-for="item in items" :key="item.path" 
            class="flex items-center justify-between py-1 px-2 rounded hover:bg-white/10">
            <span>{{ item.name }}</span>
            <span v-if="item.badge" class="ml-1 text-xs font-bold px-1.5 rounded bg-primary-dark/20 text-primary-dark">
              {{ item.badge }}
            </span>
          </div>
        </div>
      </div>
    </button>

    <!-- Dropdown Content -->
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="transform opacity-0 -translate-y-4 scale-95"
      enter-to-class="transform opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="transform opacity-100 translate-y-0 scale-100"
      leave-to-class="transform opacity-0 -translate-y-4 scale-95"
    >
      <div v-show="isOpen && !collapsed" 
        class="ml-4 mt-1 space-y-1 relative">
        
        <!-- Animated Border Line -->
        <div class="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
          :class="isDark ? 'bg-gradient-to-b from-primary-dark/50 to-accent-dark/50' : 'bg-gradient-to-b from-primary-light/50 to-accent-light/50'"></div>
        
        <!-- Dropdown Items -->
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          @click="handleItemClick"
          :class="[
            'group relative flex items-center rounded-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden',
            $route.path === item.path
              ? isDark
                ? 'bg-white/5 text-primary-dark'
                : 'bg-black/5 text-primary-light'
              : isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5',
            'px-4 py-2.5 ml-2'
          ]"
        >
          <!-- Background Glow for Active Item -->
          <div v-if="$route.path === item.path" 
            class="absolute inset-0 bg-gradient-to-r from-primary-light/10 to-accent-light/10 dark:from-primary-dark/10 dark:to-accent-dark/10"></div>
          
          <!-- Shine Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <!-- Item Icon -->
          <div :class="[
            'relative z-10 transition-all duration-300 mr-3',
            $route.path === item.path
              ? isDark
                ? 'text-primary-dark'
                : 'text-primary-light'
              : isDark
                ? 'text-white/50 group-hover:text-white/70'
                : 'text-neutral-500 group-hover:text-neutral-700'
          ]">
            <Icon :name="item.icon" class="w-5 h-5 relative" />
          </div>
          
          <!-- Item Content -->
          <div class="relative z-10 flex-1 flex items-center justify-between">
            <span class="text-xs font-medium transition-opacity duration-300">
              {{ item.name }}
            </span>
            
            <!-- Badge -->
            <span v-if="item.badge" 
              class="ml-2 px-2 py-1 text-xs rounded-lg font-bold min-w-[24px] text-center animate-pulse-subtle"
              :class="[
                'premium-badge',
                $route.path === item.path
                  ? isDark
                    ? 'bg-primary-dark/30 text-primary-dark border border-primary-dark/30'
                    : 'bg-primary-light/30 text-primary-light border border-primary-light/30'
                  : isDark
                    ? 'bg-white/10 text-white/90 border border-white/10'
                    : 'bg-black/10 text-neutral-700 border border-neutral-200'
              ]">
              {{ item.badge }}
            </span>
          </div>
          
          <!-- Active Indicator -->
          <div v-if="$route.path === item.path" 
           class="absolute right-3 w-2 h-2 rounded-full animate-ping"
      :class="isDark ? 'bg-primary-light' : 'bg-yellow-700'"></div>
      

        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import Icon from '../../Icon.vue'

const themeStore = useThemeStore()

const props = defineProps({
  title: String,
  icon: String,
  items: Array,
  isActive: Boolean,
  collapsed: Boolean,
  isDark: Boolean,
  isOpen: Boolean // Controlled prop from parent
})

const emit = defineEmits(['toggle'])

const route = useRoute()

// Computed property for dropdown open state
const isOpen = computed(() => props.isOpen)

// Handle dropdown toggle
const toggleDropdown = () => {
  if (props.collapsed) {
    return
  }
  emit('toggle') // Emit event to parent to handle exclusive expansion
}

// Handle item click
const handleItemClick = () => {
  themeStore.closeMobileSidebar()
}

// Watch for route changes to auto-open the active section
watch(() => route.path, (newPath) => {
  const isActive = props.items.some(item => newPath === item.path)
  if (isActive) {
    // Emit to parent that this dropdown should be opened
    // The parent will handle exclusive expansion
    if (!isOpen.value) {
      emit('toggle')
    }
  }
}, { immediate: true })
</script>