// src/composables/useKeyboardShortcuts.js
import { onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts() {
  const handleKeyDown = (event) => {
    // Ctrl/Cmd + B to toggle sidebar
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault()
      
      // Find sidebar component and toggle it
      const sidebar = document.querySelector('aside[class*="fixed left-0"]')
      if (sidebar) {
        const toggleBtn = sidebar.querySelector('button[aria-label="Toggle sidebar"]')
        if (toggleBtn) {
          toggleBtn.click()
        }
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}