<script setup>
import api from '@/plugins/axios'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
// import Icon from '@/components/Icon.vue'
// import { getColor } from '@/utils/colors';
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from 'vue-toastification'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import Login from '@/views/auth/Login.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const toast = useToast()
const showForm = ref(false)
const loading = ref(false)
const staffs = ref([])
const openDropdown = ref(null)
const error = ref(null)

const roles = ref([])
const departments = ref([])
const branches = ref([])

const showCredentialsModal = ref(false)
const generatedUserCode = ref('')
const generatedPassword = ref('')
const selectedStaffs = ref([])

const showDeleteModal = ref(false)
const staffToDeleteId = ref(null)


const getRowActions = (row) => [
  {
    name: 'Edit',
    icon: 'PencilIcon',
    color: 'info',
    onClick: () => editStaff(row)
  },
  {
    name: row.is_active ? 'Deactivate' : 'Activate',
    icon: row.is_active ? 'XCircleIcon' : 'CheckCircleIcon',
    color: row.is_active ? 'warning' : 'success',
    onClick: () => updateStaffStatus(row.id, row.is_active)
  },
  {
    name: 'Delete',
    icon: 'TrashIcon',
    color: 'critical',
    onClick: () => {
      staffToDeleteId.value = row.id
      showDeleteModal.value = true
    }
  }
]

// Edit modal state
const showEditModal = ref(false)
const editForm = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: '',
  position: '',
  branch_id: '',
  dept_id: '',
  role: '',
  profile: null,
  profile_preview: null,
  is_active: false
})

const editErrors = ref({})
// Edit staff - opens modal with staff data
const editStaff = (staff) => {
  openDropdown.value = null

  // Find the original staff data
  const originalStaff = staffs.value.find((s) => s.id === staff.id)

  // Populate edit form
  editForm.value = {
    id: staff.id,
    first_name: staff.first_name,
    last_name: staff.last_name,
    email: originalStaff?.user?.email || '',
    phone: staff.phone,
    gender: originalStaff?.gender || '',
    position: staff.position,
    branch_id: staff.branch_id,
    dept_id: staff.dept_id,
    role: originalStaff?.user?.roles?.[0]?.name || '',
    profile: null,
    profile_preview: staff.profile_url,
    is_active: staff.is_active
  }

  showEditModal.value = true
}

// Handle edit file change
const handleEditFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    editForm.value.profile = file
    editForm.value.profile_preview = URL.createObjectURL(file)
  }
}

// Remove edit image
const removeEditImage = () => {
  editForm.value.profile = null
  editForm.value.profile_preview = null
}

// Submit edit form
const updateStaff = async () => {
  loading.value = true
  editErrors.value = {}

  const formData = new FormData()
  formData.append('_method', 'PUT') // For Laravel to recognize as PUT
  formData.append('first_name', editForm.value.first_name)
  formData.append('last_name', editForm.value.last_name)
  formData.append('email', editForm.value.email)
  formData.append('phone', editForm.value.phone)
  formData.append('gender', editForm.value.gender)
  formData.append('position', editForm.value.position)
  formData.append('branch_id', editForm.value.branch_id)
  formData.append('dept_id', editForm.value.dept_id)
  formData.append('role', editForm.value.role)
  formData.append('is_active', editForm.value.is_active ? '1' : '0')

  if (editForm.value.profile) {
    formData.append('profile', editForm.value.profile)
  }

  try {
    const response = await api.post(`/staffs/${editForm.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.success) {
      toast.success('Staff updated successfully')
      showEditModal.value = false
      fetchStaffs() // Refresh the list
    } else {
      toast.error(response.data.message || 'Failed to update staff')
    }
  } catch (err) {
    console.error('Update error:', err)
    if (err.response && err.response.status === 422) {
      editErrors.value = err.response.data.errors || {}
      toast.error('Please check the form for errors')
    } else {
      toast.error(err.response?.data?.message || 'Failed to update staff')
    }
  } finally {
    loading.value = false
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

// const userPermissions = ref([])
// const fetchUserPermissions = async () => {
//   try {
//     const res = await api.get('/logedUser')
//     userPermissions.value = res.data.permissions
//   } catch (err) {
//     console.error('Failed to fetch permissions', err)
//   }
// }

const fetchRoles = async () => {
  const res = await api.get('/roles')
  roles.value = res.data.roles
}

const fetchDepartments = async () => {
  const res = await api.get('/departments')
  departments.value = res.data.departments
}

const fetchBranches = async () => {
  const res = await api.get('/branches')
  branches.value = res.data
}

const closeModal = () => {
  showForm.value = false
  resetForm()
}

const toggleDropdown = (userId) => {
  openDropdown.value = openDropdown.value === userId ? null : userId
}

const fetchStaffs = () => {
  loading.value = true
  error.value = null

  api
    .get('/staffs')
    .then((res) => {
      staffs.value = res.data.staffs
    })

    .catch((err) => {
      console.error(err)
      error.value = 'Failed to fetch staffs'
      toast.error('Failed to fetch staffs')
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  // fetchUserPermissions()
  fetchStaffs()
  fetchRoles()
  fetchDepartments()
  fetchBranches()
})

// const staffsFormatted = computed(() => {
//   return staffs.value.map((staff) => {
//     // Find department name from departments array using dept_id
//     const department = departments.value.find(d => d.id === staff.dept_id)
//     const departmentName = department ? department.dept_name : 'N/A'

//     // Find branch name from branches array using branch_id
//     const branch = branches.value.find(b => b.id === staff.branch_id)
//     const branchName = branch ? branch.branch_name : 'N/A'

//     // Get user status from the user object using staff_id
//     // The user object should be included in the staff response from API
//     let isActive = false
//     let userExists = false

//     // Check if user object exists and get is_active value
//     if (staff.user) {
//       userExists = true
//       // is_active could be 0/1 or true/false
//       isActive = staff.user.is_active === true || staff.user.is_active === 1 || staff.user.is_active === '1'
//       console.log(`Staff ${staff.id} - User exists:`, staff.user, 'is_active:', isActive)
//     } else {
//       console.log(`Staff ${staff.id} - No user found`)
//     }

//     return {
//       id: staff.id,
//       first_name: staff.first_name,
//       last_name: staff.last_name,
//       full_name: `${staff.first_name} ${staff.last_name}`,
//       phone: staff.phone,
//       position: staff.position,
//       profile_url: staff.profile ? `http://localhost:8000/storage/${staff.profile}` : null,
//       dept_id: staff.dept_id,
//       department_name: departmentName,
//       branch_id: staff.branch_id,
//       branch_name: branchName,
//       user_id: staff.user?.id || null,
//       is_active: isActive,
//       user_exists: userExists,
//       status: isActive ? 'Active' : (userExists ? 'Inactive' : 'No User Account'),
//       status_color: isActive ? 'success' : (userExists ? 'danger' : 'warning')
//     }
//   })
// })
const staffsFormatted = computed(() => {
  return (staffs.value || []).map((staff) => {
    const departmentName = staff.department?.dept_name || 'N/A'
    const branchName = staff.branch?.branch_name || 'N/A'

    let isActive = false
    let userExists = false

    if (staff.user) {
      userExists = true
      isActive =
        staff.user.is_active === true || staff.user.is_active === 1 || staff.user.is_active === '1'
    }

    return {
      id: staff.id,
      first_name: staff.first_name,
      last_name: staff.last_name,
      full_name: `${staff.first_name} ${staff.last_name}`,
      phone: staff.phone,
      position: staff.position,
      profile_url: staff.profile ? `http://localhost:8000/storage/${staff.profile}` : null,
      dept_id: staff.dept_id,
      department_name: departmentName,
      branch_id: staff.branch_id,
      branch_name: branchName,
      user_id: staff.user?.id || null,
      is_active: isActive,
      user_exists: userExists,
      status: isActive ? 'Active' : userExists ? 'Inactive' : 'No User Account',
      status_color: isActive ? 'success' : userExists ? 'danger' : 'warning'
    }
  })
})

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: '',
  position: '',
  branch_id: '',
  dept_id: '',
  role: '',
  profile: null
})

const resetForm = () => {
  form.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    position: '',
    branch_id: '',
    dept_id: '',
    role: '',
    profile: null
  }
}
// const handleFileChange = (e) => {
//   console.log("FILES:", e.target.files)
//   form.value.profile = e.target.files[0]
// }

const registerStaff = () => {
  loading.value = true

  const formData = new FormData()
  formData.append('first_name', form.value.first_name)
  formData.append('last_name', form.value.last_name)
  formData.append('email', form.value.email)
  formData.append('phone', form.value.phone)
  formData.append('gender', form.value.gender)
  formData.append('branch_id', form.value.branch_id)
  formData.append('dept_id', form.value.dept_id)
  formData.append('position', form.value.position)
  formData.append('role', form.value.role)
  if (form.value.profile) {
    formData.append('profile', form.value.profile)
  }

  api
    .post('/staffs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((res) => {
      if (res.data.status) {
        closeModal()
        // alert(
        //   `Staff registered successfully!\n\nUser Code: ${res.data.user_code}\nPassword: ${res.data.password}`
        // )

        generatedUserCode.value = res.data.user_code
        generatedPassword.value = res.data.password
        showCredentialsModal.value = true

        toast.success('Staff registered successfully')
        fetchStaffs()
      } else {
        toast.error(res.data.message || 'Failed to register staff')
      }
    })
    .catch((err) => {
      console.error(err)
      toast.error('Failed to register staff')
    })
    .finally(() => {
      loading.value = false
    })
}
// Update staff status (activate/deactivate)
const updateStaffStatus = async (staffId, currentStatus) => {
  openDropdown.value = null
  const newStatus = currentStatus ? 'inactive' : 'active'

  try {
    const response = await api.patch(`/staffs/${staffId}/status`, { status: newStatus })

    if (response.data.success) {
      // Update local state
      const staff = staffs.value.find((s) => s.id === staffId)
      if (staff && staff.user) {
        staff.user.is_active = newStatus === 'active'
      } else if (staff) {
        // If user object doesn't exist, create it or refresh the whole list
        fetchStaffs()
      }

      toast.success(`Staff ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    } else {
      toast.error(response.data.message || 'Failed to update status')
    }
  } catch (err) {
    console.error('Failed to update status:', err)
    toast.error(err.response?.data?.message || 'Failed to update status')
  }
}

// Delete staff
const confirmDeleteStaff = async () => {
  if (!staffToDeleteId.value) return
  loading.value = true
  try {
    await api.delete(`/staffs/${staffToDeleteId.value}`)
    toast.success('Staff deleted successfully')
    fetchStaffs()
    showDeleteModal.value = false
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete staff')
  } finally {
    loading.value = false
    staffToDeleteId.value = null
  }
}
const columns = [
  { label: 'Profile', key: 'profile_url' },
  { label: 'First Name', key: 'first_name' },
  { label: 'Last Name', key: 'last_name' },
  { label: 'Phone', key: 'phone' },
  { label: 'Position', key: 'position' },
  { label: 'Department', key: 'department_name' },
  { label: 'Branch', key: 'branch_name' },
  { label: 'Status', key: 'status' }
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]
const branchOptions = computed(() =>
  branches.value.map((b) => ({
    label: b.branch_name,
    value: b.id
  }))
)

const deptOptions = computed(() =>
  departments.value.map((d) => ({
    label: d.dept_name,
    value: d.id
  }))
)

const roleOptions = computed(() =>
  roles.value.map((r) => ({
    label: r.name,
    value: r.name
  }))
)
</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Staffs</h1>
      <BaseButton
        @click="showForm = true"
        class="px-4 py-2 rounded-md font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add Staff
      </BaseButton>
    </div>
  </div>
  <!-- Loading state -->
  <div v-if="loading" class="p-8 text-center">
    <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
    <p class="mt-3 text-gray-500">Loading Staffs...</p>
  </div>
  <!-- Error -->
  <div v-else-if="error" class="text-red-600 text-center py-6">
    {{ error }}
  </div>
  <!-- Empty -->
  <div
    v-else-if="Array.isArray(staffs) && staffs.length === 0"
    class="text-center py-6 text-gray-500"
  >
    No staffs found
  </div>
  <div v-else>
    <BaseTable
      :columns="columns"
      :rows="staffsFormatted"
      selectable
      searchable
      show-toolbar
      :per-page-options="[10, 20, 50, 100]"
      :default-per-page="10"
      :compact="true"
      row-height="50px"
      @update:selected="(val) => (selectedStaffs = val)"
    >
      <!-- Profile Image -->
      <template #cell-profile_url="{ row }">
        <img
          v-if="row.profile_url"
          :src="row.profile_url"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span v-else>-</span>
      </template>

      <!-- Actions -->
      <template #actions="{ row }">
  <ThreeDotsButton
    :actions="getRowActions(row)"
    :is-open="openDropdown === row.id"
    @toggle="toggleDropdown(row.id)"
    @close="openDropdown = null"
  />
</template>
    </BaseTable>
  </div>

  <!-- Registration Modal -->

  <BaseModal
    v-model="showForm"
    title="Register Staff"
    confirmText="Register"
    :loading="loading"
    @close="closeModal"
    @confirm="registerStaff"
  >
    <form class="grid grid-cols-2 gap-4">
      <BaseInput v-model="form.first_name" label="First Name" placeholder="First Name" />

      <BaseInput v-model="form.last_name" label="Last Name" placeholder="Last Name" />

      <BaseInput v-model="form.email" label="Email" type="email" placeholder="Email" />

      <BaseInput v-model="form.phone" label="Phone" placeholder="Phone" />

      <!-- <BaseSelect v-model="form.gender" label="Gender">
          <option disabled value="">-- Select Gender --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </BaseSelect> -->
      <BaseSelect
        v-model="form.gender"
        label="Gender"
        :options="genderOptions"
        placeholder="Select Gender"
        searchable
      />

      <BaseInput v-model="form.position" label="Position" placeholder="Position" />

      <!-- <BaseSelect v-model="form.branch_id" label="Branch">
          <option disabled value="">-- Select Branch --</option>
          <option v-for="branch in branches" :key="branch.id" :value="branch.id">
            {{ branch.branch_name }}
          </option>
        </BaseSelect> -->

      <BaseSelect
        v-model="form.branch_id"
        label="Branch"
        :options="branchOptions"
        placeholder="Select Branch"
        searchable
      />
      <!-- <BaseSelect v-model="form.dept_id" label="Department">
          <option disabled value="">-- Select Department --</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.dept_name }}
          </option>
        </BaseSelect> -->
      <BaseSelect
        v-model="form.dept_id"
        label="Department"
        :options="deptOptions"
        placeholder="Select Department"
        searchable
      />
      <!-- <BaseSelect v-model="form.role" label="Role">
          <option disabled value="">-- Select Role --</option>
          <option v-for="role in roles" :key="role.id" :value="role.name">
            {{ role.name }}
          </option>
        </BaseSelect> -->
      <BaseSelect
        v-model="form.role"
        label="Role"
        :options="roleOptions"
        placeholder="Select Role"
        searchable
      />

      <!-- <BaseInput
    type="file"
    label="Profile Image"
    @change="handleFileChange"
  /> -->
      <BaseInput type="file" label="Profile Image" v-model="form.profile" />
    </form>
  </BaseModal>

  <BaseModal
    v-model="showCredentialsModal"
    title="Login Credentials"
    confirmText="Close"
    @confirm="showCredentialsModal = false"
  >
    <div class="space-y-4">
      <div>
        <label class="font-semibold">User Code:</label>
        <div class="flex gap-2">
          <input :value="generatedUserCode" readonly class="w-full p-2 border rounded" />
          <button class="px-3 py-2 bg-gray-200 rounded" @click="copyToClipboard(generatedUserCode)">
            Copy
          </button>
        </div>
      </div>

      <div>
        <label class="font-semibold">Password:</label>
        <div class="flex gap-2">
          <input :value="generatedPassword" readonly class="w-full p-2 border rounded" />
          <button class="px-3 py-2 bg-gray-200 rounded" @click="copyToClipboard(generatedPassword)">
            Copy
          </button>
        </div>
      </div>

      <p class="text-red-500 text-sm">Please copy this password now. It will not be shown again.</p>
    </div>
  </BaseModal>
  <!-- Edit Staff Modal -->
  <BaseModal
    v-model="showEditModal"
    :title="`Edit Staff: ${editForm.first_name} ${editForm.last_name}`"
    confirmText="Update Staff"
    :showConfirm="true"
    :showCancel="true"
    :loading="loading"
    @close="showEditModal = false"
    @confirm="updateStaff"
  >
    <form class="grid grid-cols-2 gap-4">
      <!-- Profile Image -->
      <div class="col-span-2 mb-2">
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
                editForm.profile_preview !== staffs.find((s) => s.id === editForm.id)?.profile_url
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
            <input
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
        <p v-if="editErrors.profile" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ editErrors.profile[0] }}
        </p>
      </div>

      <!-- First Name -->
      <div>
        <BaseInput
          v-model="editForm.first_name"
          label="First Name"
          placeholder="First Name"
          :error="editErrors.first_name?.[0]"
          required
        />
      </div>

      <!-- Last Name -->
      <div>
        <BaseInput
          v-model="editForm.last_name"
          label="Last Name"
          placeholder="Last Name"
          :error="editErrors.last_name?.[0]"
          required
        />
      </div>

      <!-- Email -->
      <div>
        <BaseInput
          v-model="editForm.email"
          label="Email"
          type="email"
          placeholder="Email"
          :error="editErrors.email?.[0]"
          required
        />
      </div>

      <!-- Phone -->
      <div>
        <BaseInput
          v-model="editForm.phone"
          label="Phone"
          placeholder="Phone"
          :error="editErrors.phone?.[0]"
          required
        />
      </div>

      <!-- Gender -->
      <div>
        <BaseSelect
          v-model="editForm.gender"
          label="Gender"
          :options="genderOptions"
          placeholder="Select Gender"
          :error="editErrors.gender?.[0]"
        />
      </div>

      <!-- Position -->
      <div>
        <BaseInput
          v-model="editForm.position"
          label="Position"
          placeholder="Position"
          :error="editErrors.position?.[0]"
          required
        />
      </div>

      <!-- Branch -->
      <div>
        <BaseSelect
          v-model="editForm.branch_id"
          label="Branch"
          :options="branchOptions"
          placeholder="Select Branch"
          :error="editErrors.branch_id?.[0]"
        />
      </div>

      <!-- Department -->
      <div>
        <BaseSelect
          v-model="editForm.dept_id"
          label="Department"
          :options="deptOptions"
          placeholder="Select Department"
          :error="editErrors.dept_id?.[0]"
        />
      </div>

      <!-- Role -->
      <div>
        <BaseSelect
          v-model="editForm.role"
          label="Role"
          :options="roleOptions"
          placeholder="Select Role"
          :error="editErrors.role?.[0]"
        />
      </div>

      <!-- Active Status -->
      <div class="col-span-2 flex items-center mt-2">
        <input
          v-model="editForm.is_active"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Account Active (affects user login)
        </label>
      </div>
    </form>
  </BaseModal>
  <!-- Delete Staff Modal -->

  <BaseModal
    v-model="showDeleteModal"
    title="Delete Staff"
    confirmText="Yes, Delete"
    :showCancel="true"
    :showConfirm="true"
    :loading="loading"
    @close="staffToDeleteId.value = null"
    @confirm="confirmDeleteStaff"
  >
    <p>Are you sure you want to delete this staff?</p>
  </BaseModal>
</template>
