<template>
  <router-link 
    :to="path"
    @click="themeStore.closeMobileSidebar()"
    :class="[
      'group relative flex items-center rounded-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden',
      collapsed ? 'justify-center p-3' : 'px-4 py-3',
      active
        ? isDark
          ? 'bg-gradient-to-r from-primary-dark/30 via-primary-dark/15 to-transparent text-primary-dark shadow-lg'
          : 'bg-gradient-to-r from-primary-light/30 via-primary-light/15 to-transparent text-primary-light shadow-lg'
        : isDark
          ? 'text-white/70 hover:text-white hover:bg-white/5'
          : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
    ]"
  >
    <!-- Icon Container -->
    <div :class="[
      'relative z-10 transition-all duration-300',
      active
        ? isDark
          ? 'text-primary-dark'
          : 'text-primary-light'
        : isDark
          ? 'text-white/70 group-hover:text-white'
          : 'text-neutral-600 group-hover:text-neutral-900',
      collapsed ? '' : 'mr-3'
    ]">
      <!-- Icon Background Glow -->
      <div v-if="active" 
        class="absolute -inset-2 bg-current opacity-10 rounded-xl blur-md"></div>
      
      <!-- Heroicon -->
      <Icon :name="icon" class="w-5 h-5 relative" />
    </div>
    
    <!-- Text Content -->
    <div v-if="!collapsed" class="relative z-10 flex-1 flex items-center justify-between">
      <span class="text-sm font-medium transition-opacity duration-300">
        {{ title }}
      </span>
    </div>
    
    <!-- Active Indicator -->
    <div v-if="active" 
      class="absolute right-3 w-2 h-2 rounded-full animate-ping"
      :class="isDark ? 'bg-primary-light' : 'bg-yellow-700'"></div>
  </router-link>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import Icon from '../../Icon.vue' // Import the Icon component

const themeStore = useThemeStore()

defineProps({
  title: String,
  icon: String,
  active: Boolean,
  collapsed: Boolean,
  isDark: Boolean,
  path: String
})
</script>