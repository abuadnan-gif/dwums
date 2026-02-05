import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'

export const useUserStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const errors = ref(null)

  // Fetch all users
  const fetchUsers = () => {
    loading.value = true
    return api.get('/users')
      .then(res => {
        users.value = res.data.data ?? res.data
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        loading.value = false
      })
  }

  // Register new user
  const registerUser = (formDataObject) => {
    loading.value = true
    errors.value = null

    // Convert object to FormData
    const formData = new FormData()
    Object.keys(formDataObject).forEach(field => {
      formData.append(field, formDataObject[field])
    })

    return api.post('/users', formData)
      .then(res => {
        // Option 1: push new user manually
        // users.value.push(res.data.user)

        // Option 2: re-fetch all users
        return fetchUsers().then(() => res.data)
      })
      .catch(err => {
        if (err.response?.status === 422) {
          errors.value = err.response.data.errors
        }
        throw err
      })
      .finally(() => {
        loading.value = false
      })
  }

  return { users, loading, errors, fetchUsers, registerUser }
})
