<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Dropdown from './SidebarDropdown.vue'
import SidebarItem from './SidebarItem.vue'
import { useThemeStore } from '@/stores/theme'
import { getFilteredSidebar } from '@/utils/sidebarConfig'

const route = useRoute()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const sidebarCollapsed = computed(() => themeStore.sidebarCollapsed)

// Get user roles and permissions from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userRoles = user.roles || ['Customer-Service']
const userPermissions = user.permissions || []

// Get filtered sidebar based on user role
const filteredSidebar = computed(() => {
  return getFilteredSidebar(userRoles, userPermissions)
})

const expandedDropdown = ref(null)

const handleDropdownToggle = (dropdownTitle) => {
  if (expandedDropdown.value === dropdownTitle) {
    expandedDropdown.value = null
  } else {
    expandedDropdown.value = dropdownTitle
  }
}

// Watch for route changes to auto-open the relevant dropdown
watch(
  () => route.path,
  (newPath) => {
    expandedDropdown.value = null
    for (const dropdown of filteredSidebar.value.dropdowns) {
      if (dropdown.items.some(item => newPath === item.path)) {
        expandedDropdown.value = dropdown.title
        break
      }
    }
  },
  { immediate: true }
)

const toggleSidebar = () => {
  themeStore.toggleSidebar()
}
</script>

<template>
  <aside
    :class="[
      'fixed top-16 h-[calc(100vh-4rem)] z-50 transition-transform duration-300',
      'lg:translate-x-0',
      themeStore.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full',
      sidebarCollapsed ? 'w-20 lg:w-20' : 'w-64 lg:w-64'
    ]"
  >
    <!-- Background Gradient -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-dark/10 via-accent-dark/10 to-transparent dark:from-primary-dark/20 dark:via-accent-dark/20 blur-3xl opacity-60"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary-dark/10 via-primary-dark/10 to-transparent dark:from-secondary-dark/20 dark:via-primary-dark/20 blur-3xl opacity-60"></div>
    </div>

    <!-- Glass Morphism Overlay -->
    <div class="absolute inset-0 backdrop-blur-xl bg-gradient-to-b from-white/80 to-white/60 dark:from-surface-dark/90 dark:to-surface-dark/80"></div>
    <div class="absolute inset-0 border-r border-gray-300 dark:border-white/10"></div>

    <div class="relative h-full flex flex-col">
      <!-- Sidebar Toggle Button -->
      <div class="p-4 border-b border-white/10 dark:border-white/5 relative">
        <button
          @click="toggleSidebar"
          class="w-full group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95"
          :class="[
            'sidebar-toggle-btn',
            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
          ]"
        >
          <div class="p-3 flex items-center justify-center">
            <Icon
              :name="sidebarCollapsed ? 'ArrowRightCircleIcon' : 'ArrowLeftCircleIcon'"
              class="w-6 h-6 transition-transform duration-500"
              :class="isDark ? 'text-white/80' : 'text-neutral-600'"
            />
            <transition
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="transform opacity-0 -translate-x-4"
              enter-to-class="transform opacity-100 translate-x-0"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="transform opacity-100 translate-x-0"
              leave-to-class="transform opacity-0 -translate-x-4"
            >
              <span v-if="!sidebarCollapsed" class="ml-3 text-sm font-medium" :class="isDark ? 'text-white/80' : 'text-neutral-700'">
                Collapse
              </span>
            </transition>
          </div>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <div class="space-y-2">
          <!-- Dashboard -->
          <SidebarItem
            :title="filteredSidebar.dashboard.title"
            :icon="filteredSidebar.dashboard.icon"
            :active="$route.path === filteredSidebar.dashboard.path"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :badge="null"
            :path="filteredSidebar.dashboard.path"
          />

          <!-- Dynamic Dropdowns based on role -->
          <Dropdown
            v-for="dropdown in filteredSidebar.dropdowns"
            :key="dropdown.title"
            :title="dropdown.title"
            :icon="dropdown.icon"
            :items="dropdown.items"
            :is-active="expandedDropdown === dropdown.title"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === dropdown.title"
            @toggle="handleDropdownToggle(dropdown.title)"
          />
        </div>
      </nav>

      <!-- Sidebar Footer with Role Info -->
      <div class="p-4 border-t border-white/10 dark:border-white/5 relative">
        <div :class="['flex items-center', sidebarCollapsed ? 'justify-center' : 'justify-between']">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark flex items-center justify-center">
                <span class="text-white text-sm font-semibold">
                  {{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}
                </span>
              </div>
            </div>
            <div v-if="!sidebarCollapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ user.first_name }} {{ user.last_name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user.primary_role || userRoles[0] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>