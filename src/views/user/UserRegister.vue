<script setup>
import api from '@/plugins/axios'
import axios from 'axios'
import { ref } from 'vue'
import { onMounted } from 'vue'
// import Icon from '@/components/Icon.vue'
// import { getColor } from '@/utils/colors';

import { useToast } from 'vue-toastification'
import BaseTable from '@/components/ui/BaseTable.vue'

import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'

const toast = useToast()
const showForm = ref(false)
const loading = ref(false)
const users = ref([])
const openDropdown = ref(null)
const errors = ref({})
const roles = ref([])

// Modal state
const showEditModal = ref(false)
const selectedUsers = ref([])

// Edit form data
const editForm = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  is_active: true,
  profile: null,
  profile_preview: null
})

const closeModal = () => {
  showForm.value = false
  resetForm()
}

// Toggle dropdown per row
const toggleDropdown = (userId) => {
  openDropdown.value = openDropdown.value === userId ? null : userId
}

// Edit action
const editUser = (user) => {
  openDropdown.value = null
  // console.log('Edit user:', user)
  // open edit modal OR navigate
  // selectedUser.value=user
  editForm.value = {
    id: user.id,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    is_active: user.is_active || false,
    profile: null,
    profile_preview: user.profile_url || null
  }
  showEditModal.value = true
}
const handleEditFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    editForm.value.profile = file
    editForm.value.profile_preview = URL.createObjectURL(file)
  }
}
// Remove selected image from edit form
const removeEditImage = () => {
  editForm.value.profile = null
  editForm.value.profile_preview = selectedUser.value?.profile_url || null
}
// Submit edit form
const submitEditForm = async () => {
  loading.value = true
  errors.value = {}

  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('first_name', editForm.value.first_name)
  formData.append('last_name', editForm.value.last_name)
  formData.append('email', editForm.value.email)
  formData.append('phone', editForm.value.phone)
  formData.append('is_active', editForm.value.is_active ? '1' : '0')

  if (editForm.value.profile) {
    formData.append('profile', editForm.value.profile)
  }

  try {
    const response = await api.post(`/users/${editForm.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      toast.success('User updated successfully')

      // Update the user in the users array
      const index = users.value.findIndex((u) => u.id === editForm.value.id)
      if (index !== -1) {
        users.value[index] = response.data.user
      }

      // Close modal
      showEditModal.value = false

      // Reset edit form
      editForm.value = {
        id: null,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        is_active: true,
        profile: null,
        profile_preview: null
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 422) {
      errors.value = err.response.data.errors || {}
      toast.error('Please check the form for errors')
    } else {
      console.error('Update error:', err)
      toast.error('Failed to update user')
    }
  } finally {
    loading.value = false
  }
}

// Activate / Inactivate
const updateStatus = (userId, currentStatus) => {
  openDropdown.value = null
  const newStatus = currentStatus ? 'inactive' : 'active'

  api
    .patch(`/users/${userId}/status`, {
      status: newStatus
    })
    .then(() => {
      const user = users.value.find((u) => u.id === userId)
      if (user) {
        user.is_active = newStatus === 'active'
      }
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    })
    .catch((err) => {
      console.error(err)
      toast.error('Failed to update status')
    })
}
// Delete user
const deleteUser = (userId) => {
  openDropdown.value = null

  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }
 
  api
    .delete(`/users/${userId}`)
    .then(() => {
      users.value = users.value.filter((u) => u.id !== userId)
      toast.success('User deleted successfully')
    })
    .catch((err) => {
      console.error(err)
      toast.error('Failed to delete user')
    })
}
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
  profile: null
})

const handleFileChange = (e) => {
  form.value.profile = e.target.files[0]
}

// const error = ref('')

const fetchUsers = () => {
  loading.value = true
  // error.value = ''

  api
    .get('/users')
    .then((res) => {
      users.value = res.data.users
    })
    .catch(() => {
      // error.value = 'Failed to load users'
      toast.error('Failed to load users')
    })
    .finally(() => {
      loading.value = false
      // }, 2000)
    })
}
const fetchRoles = () => {
  api
    .get('/roles')
    .then((res) => {
      roles.value = res.data.roles
    })
    .catch((err) => {
      // console.error('Failed to fetch roles', err)
      toast.error('Failed to fetch roles')
    })
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})

// const registerUser = () => {
//   if (loading.value) return
//   loading.value = true
//   errors.value = {}

//   const data = new FormData()
//   data.append('first_name', form.value.first_name)
//   data.append('last_name', form.value.last_name)
//   data.append('email', form.value.email)
//   data.append('phone', form.value.phone)
//   data.append('role', form.value.role)

//   if (form.value.profile) {
//     data.append('profile', form.value.profile)
//   }
//   api
//     .post('/users', data, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     .then((res) => {
//       alert(`User created!\nUser Code: ${res.data.user_code}\nPassword: ${res.data.password}`)
//       toast.success('User registerd Successfully!!')

//       fetchUsers()
//       resetForm()

//       showForm.value = false
//     })
//     .catch((err) => {
//       if (err.response && err.response.status === 422) {
//         errors.value = err.response.data.errors
//       } else {
//         // alert('Something went wrong. Please try again.')
//         toast.error('Something went wrong. Please try again.')
//       }
//     })
//     .finally(() => {
//       loading.value = false
//     })
// }

// const resetForm = () => {
//   form.value.first_name = ''
//   form.value.last_name = ''
//   form.value.email = ''
//   form.value.phone = ''
//   form.value.role = ''
//   form.value.profile = null
// }

const columns = [
  { label: 'Profile', key: 'profile_url' },
  { label: 'Name', key: 'full_name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Role', key: 'role' }
]
import { computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const usersFormatted = computed(() =>
  users.value.map((user) => ({
    ...user,
    full_name: user.full_name || `${user.first_name} ${user.last_name}`,
    profile_url: user.profile ? `http://localhost:8000/storage/${user.profile}` : null
  }))
)
</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">System login Users</h1>
      <!-- <button
        @click="showForm = true"
        class="px-4 py-2 rounded-md font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"

      >
        Add User
      </button> -->
    </div>
    <!-- Loading state -->
     <div v-if="loading" class="p-8 text-center">
          <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
          <p class="mt-3 text-gray-500">Loading Users...</p>
        </div>
    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center py-6">
      {{ error }}
    </div>
    <!-- Empty -->
    <div v-else-if="users.length === 0" class="text-center py-6 text-gray-500">No users found</div>

    <div v-else>
      <BaseTable 
      :columns="columns" 
      :rows="usersFormatted"
      selectable
  searchable
  show-toolbar
  :per-page-options="[10, 20, 50, 100]"
  :default-per-page="10"
  :compact="true"
  row-height="50px"
  @update:selected="val => selectedUsers = val"
  >

        <!-- Profile Image Column -->
        <template #cell-profile_url="{ row }">
          <img
            v-if="row.profile_url"
            :src="row.profile_url"
            class="w-10 h-10 rounded-full object-cover"
          />
          <span v-else>-</span>
        </template>
        <!-- Status Column -->
        <template #cell-status="{ row }">
          <span
            :class="{
              'px-2 py-1 rounded-full text-xs font-medium': true,
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': row.is_active,
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !row.is_active
            }"
          >
            {{ row.status }}
          </span>
        </template>

        <!-- Actions -->
        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              {
                name: 'Edit',
                icon: 'PencilIcon',
                color: 'info',
                onClick: () => editUser(row)
              },
              {
                name: row.is_active ? 'Deactivate' : 'Activate',
                icon: row.is_active ? 'XCircleIcon' : 'CheckCircleIcon',
                color: row.is_active ? 'warning' : 'success',
                onClick: () => updateStatus(row.id, row.is_active)
              },
              // {
              //   name: 'Inactive',
              //   icon: 'XCircleIcon',
              //   color: 'warning',
              //   onClick: () => updateStatus(row.id, 'inactive')
              // },
              {
                name: 'Delete',
                icon: 'TrashIcon',
                color: 'critical',
                onClick: () => deleteUser(row.id)
              }
            ]"
            :is-open="openDropdown === row.id"
            @toggle="toggleDropdown(row.id)"
            @close="openDropdown = null"
          />
        </template>
      </BaseTable>
    </div>

    <!-- Edit User Modal -->

    <!-- Edit User Modal - Using BaseModal -->
<BaseModal
  v-model="showEditModal"
  :title="`Edit User: ${editForm.first_name} ${editForm.last_name}`"
  size="lg"
  :close-on-click-outside="false"
  :loading="loading"
  gradient-title
  @close="showEditModal = false"
>
  <!-- Form -->
  <form @submit.prevent="submitEditForm" class="space-y-4">
    <!-- Profile Image -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Profile Image
      </label>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <div
            class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600"
          >
            <img
              v-if="editForm.profile_preview"
              :src="editForm.profile_preview"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
            >
              <span class="text-2xl font-semibold">{{
                editForm.first_name?.charAt(0) || '?'
              }}</span>
            </div>
          </div>
          <button
            v-if="
              editForm.profile_preview &&
              editForm.profile_preview !== selectedUser?.profile_url
            "
            type="button"
            @click="removeEditImage"
            class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
            title="Remove image"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>
          <BaseInput
            type="file"
            @change="handleEditFileChange"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg"
            class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 cursor-pointer"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG, GIF, SVG up to 2MB
          </p>
        </div>
      </div>
      <p v-if="errors.profile" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.profile[0] }}
      </p>
    </div>

    <!-- First Name -->
    <div>
      <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        First Name
      </label> -->
      <BaseInput
        v-model="editForm.first_name" label=""First Name  placeholder="Enter first name"/>
      <p v-if="errors.first_name" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.first_name[0] }}
      </p>
    </div>

    <!-- Last Name -->
    <div>
     
      <BaseInput
        v-model="editForm.last_name" label="Last Name" placeholder="Enter last name"
      />
      <p v-if="errors.last_name" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.last_name[0] }}
      </p>
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email
      </label>
      <BaseInput
        v-model="editForm.email" label="Email" palceholder="Enetre valid email address"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.email[0] }}
      </p>
    </div>

    <!-- Phone -->
    <div>

      <BaseInput
        v-model="editForm.phone" label="Phone" placeholder="Enter valid phone number"
      />
      <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors.phone[0] }}
      </p>
    </div>

    <!-- Active Status -->
    <div class="flex items-center">
      <input
        v-model="editForm.is_active"
        type="checkbox"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300"> Active </label>
    </div>
  </form>

  <!-- Footer with buttons -->
  <!-- <template #footer>
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="showEditModal = false"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="submitEditForm"
        :disabled="loading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <svg
          v-if="loading"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </template> -->
</BaseModal>
  </div>
</template>
