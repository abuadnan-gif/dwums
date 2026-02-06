<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <!-- Mobile Overlay -->
    <div
      v-if="themeStore.sidebarMobileOpen"
      @click="themeStore.closeMobileSidebar()"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    />

    <div class="flex flex-1 pt-16">
      <!-- Sidebar (desktop + mobile) -->
      <Sidebar />

      <!-- Main -->
      <main
        class="flex-1 transition-all duration-300 overflow-x-auto"
        :class="{
          'lg:ml-20': themeStore.sidebarCollapsed,
          'lg:ml-64': !themeStore.sidebarCollapsed
        }"
      >
        <router-view />
        <Footer/>
      </main>
      
    </div>
  </div>
</template>

<script setup>
import Footer from './components/layout/Footer.vue';
import Navbar from './components/layout/navbar/Navbar.vue';
import Sidebar from './components/layout/sidebar/Sidebar.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>
