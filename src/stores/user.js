// src/stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const permissions = ref([]) // <-- store user permissions

  // Actions
  function setUser(userData) {
    user.value = userData
    permissions.value = userData.permissions || []  // <-- set permissions
    localStorage.setItem('user', JSON.stringify(userData)) // optional persist
  }

  function loadFromLocalStorage() {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      user.value = parsed
      permissions.value = parsed.permissions || []
    }
  }

  // Permission check
  function hasPermission(permissionName) {
    return permissions.value.includes(permissionName)
  }

  // Getters
  const fullName = computed(() => user.value ? `${user.value.first_name} ${user.value.last_name}` : '')
  const initials = computed(() => user.value ? `${user.value.first_name?.[0] || ''}${user.value.last_name?.[0] || ''}` : '')

  return { user, permissions, setUser, loadFromLocalStorage, hasPermission, fullName, initials }
})