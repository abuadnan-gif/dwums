<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = () => {
  loading.value = true
  error.value = ''

  api.post('/login', {
    email: email.value,
    password: password.value
  })
  .then((response) => {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push('/admin/dashboard')
  })
  .catch((err) => {
    error.value = err.response?.data?.message || 'Login failed'
  })
  .finally(() => {
    loading.value = false
  })
}

</script>

<template>
  <div class="w-96 bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Login Page</h2>

    <div v-if="error" class="text-red-500 mb-3">
      {{ error }}
    </div>

    <BaseInput
      v-model="email"
      type="email"
      placeholder="Email"
      class=" p-2 mb-2"
    />

    <BaseInput
      v-model="password"
      type="password"
      placeholder="Password"
      class="  p-2 mb-2"
    />

    <BaseButton
      @click="login"
      class="w-full bg-blue-600 text-white p-2"
      :disabled="loading"
    >
      {{ loading ? 'Logging in...' : 'Login' }}
    </BaseButton>
  </div>
</template>
