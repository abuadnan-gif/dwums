<template>
  <div class="min-h-screen bg-light-600 dark:bg-gray-900">
    <Navbar />
    <Sidebar />
   <main
  :class="[
    'pt-17 min-h-[calc(100vh-4.25rem)]',
    sidebarCollapsed ? 'ml-20' : 'ml-64'
  ]"
>
  <div class="p-6">
    <router-view />
  </div>
  <Footer />
</main>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import Navbar from './navbar/Navbar.vue'
import Sidebar from './sidebar/Sidebar.vue'
import Footer from './Footer.vue'

const themeStore = useThemeStore()
const sidebarCollapsed = computed(() => themeStore.sidebarCollapsed)

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.loadFromLocalStorage()
</script>