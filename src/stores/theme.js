// src/stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark

      document.documentElement.classList.toggle('dark', this.isDark)

      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      this.isDark = savedTheme
        ? savedTheme === 'dark'
        : prefersDark

      document.documentElement.classList.toggle('dark', this.isDark)
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    toggleMobileSidebar() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen
    },

    closeMobileSidebar() {
      this.sidebarMobileOpen = false
    }
  },
})
