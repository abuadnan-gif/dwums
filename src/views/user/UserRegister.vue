<script setup>
import api from '@/plugins/axios'
import axios from 'axios'
import { ref } from 'vue'
import { onMounted } from 'vue'
import Icon from '@/components/Icon.vue'
import { PenSquareIcon } from 'lucide-vue-next'

const showForm = ref(false)
const loading = ref(false)
const users = ref([])
const openDropdown = ref(null)

// Toggle dropdown per row
const toggleDropdown = (userId) => {
  openDropdown.value = openDropdown.value === userId ? null : userId
}

// Edit action
const editUser = (user) => {
  openDropdown.value = null
  console.log('Edit user:', user)
  // open edit modal OR navigate
}

// Activate / Inactivate
const updateStatus = (userId, status) => {
  openDropdown.value = null

  axios
    .patch(`http://localhost:8000/api/users/${userId}/status`, {
      status: status,
    })
    .then(() => {
      const user = users.value.find(u => u.id === userId)
      if (user) user.status = status
    })
    .catch(err => {
      console.error(err)
    })
}
const form = ref(
  {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    profile: null,

  })


const errors = ref({})

const handleFileChange = (e) => {
  form.value.profile = e.target.files[0]
}


const fetchUsers = () => {

  api.get('/users')
    .then((res) => {
      users.value = res.data
    })
    .catch(() => {
      alert('Failed to load users')
    })
}
onMounted(() => {
  fetchUsers()
})

const registerUser = () => {
  loading.value = true
  errors.value = {}


  const data = new FormData()
  data.append('first_name', form.value.first_name)
  data.append('last_name', form.value.last_name)
  data.append('email', form.value.email)
  data.append('phone', form.value.phone)
  data.append('role', form.value.role)

  if (form.value.profile) {
    data.append('profile', form.value.profile)
  }
  api.post('/users', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then((res) => {
      alert(
        `User created!\nUser Code: ${res.data.user_code}\nPassword: ${res.data.password}`
      )
      fetchUsers()
      showForm.value = false
    })
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        errors.value = err.response.data.errors
      } else {
        alert('Something went wrong. Please try again.')
      }
    })
    .finally(() => {
      loading.value = false
    })

}
</script>

<template>
  <div class=" p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Users</h1>
      <button @click="showForm = true" class="px-4 py-2 rounded-md font-semibold transition-colors duration-300
               bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
        Add User
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-200 dark:border-gray-900">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Profile</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Name</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Email</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Phone</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Role</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
        
            <td class="p-3 border">
              <img v-if="user.profile" :src="`http://localhost:8000/storage/${user.profile}`"
                class="w-10 h-10 rounded-full object-cover" />
              <span v-else>-</span>
            </td>


            <td class="p-3 border border-gray-200 dark:border-gray-700">
              {{ user.first_name }} {{ user.last_name }}
            </td>

            <td class="p-3 border border-gray-200 dark:border-gray-700">{{ user.email }}</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700">{{ user.phone }}</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700">{{ user.role }}</td>

     <td>
      <ThreeDotsButton
        :actions="[
          { 
            name: 'Edit', 
            icon:PenSquareIcon,
           
          },
           { 
            name: 'Active',
            icon: 'CheckCircleIcon',
           
           },
            { 
            name: 'Inactive',
            icon: 'XCircleIcon',
            
           },

          { 
            name: 'Delete',
            icon: 'TrashIcon',
           
           },

        ]"
      />
    </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Registration Modal -->
    <div v-if="showForm" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <!-- Close Button -->
        <button @click="showForm = false"
          class="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
          ✕
        </button>

        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Register User</h2>

        <form @submit.prevent="registerUser" class="space-y-4">
          <input v-model="form.first_name" placeholder="First Name"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />

          <input v-model="form.last_name" placeholder="Last Name"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          <input v-model="form.email" placeholder="Email"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          <!-- <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          /> -->
          <input v-model="form.phone" placeholder="Phone"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />


          <select v-model="form.role"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option disabled value="">
              -- Select Role --
            </option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="reader">Reader</option>
            <option value="manager">Manager</option>
          </select>

          <input type="file" @change="handleFileChange" accept="image/*"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />

          <button type="submit" :disabled="loading"
            class="w-full px-4 py-2 rounded-md font-semibold bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 transition-colors">
            {{ loading ? 'Registering...' : 'Register User' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
