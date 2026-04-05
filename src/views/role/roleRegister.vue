<script setup>
import api from '@/plugins/axios'
import axios from 'axios'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

// import Icon from '@/components/Icon.vue'
// import { getColor } from '@/utils/colors';
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from 'vue-toastification'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { computed, onMounted } from 'vue'
import RoleRegister from '@/views/role/roleRegister.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
const toast = useToast()
const showForm = ref(false)
const loading = ref(false)
const roles = ref([])
const openDropdown = ref(null)
const errors = ref({})


const showDeleteModal = ref(false)
const roleToDelete = ref(null)

const showPermissionModal = ref(false)
const selectedRole = ref(null)
const permissions = ref([])
const selectedPermissions = ref([])

const userStore = useUserStore()


const confirmDeleteRole = (role) => {
  roleToDelete.value = role
  showDeleteModal.value = true
  openDropdown.value = null
}

// Edit role modal state
const showEditModal = ref(false)
const editForm = ref({
  id: null,
  name: ''
})
const editErrors = ref({})
// Edit role - opens modal with role data
const editRole = (role) => {
  openDropdown.value = null

  // Populate edit form
  editForm.value = {
    id: role.id,
    name: role.name
  }

  showEditModal.value = true
}

// Update role
const updateRole = async () => {
  loading.value = true
  editErrors.value = {}

  try {
    const response = await api.put(`/roles/${editForm.value.id}`, {
      name: editForm.value.name
    })

    if (response.data.success) {
      toast.success('Role updated successfully')
      showEditModal.value = false
      fetchRoles() // Refresh the list
    } else {
      toast.error(response.data.message || 'Failed to update role')
    }
  } catch (err) {
    console.error('Update error:', err)
    if (err.response && err.response.status === 422) {
      editErrors.value = err.response.data.errors || {}
      toast.error('Please check the form for errors')
    } else {
      toast.error(err.response?.data?.message || 'Failed to update role')
    }
  } finally {
    loading.value = false
  }
}
// Delete role
// Add this function to your script section
const deleteRole = async () => {
  if (!roleToDelete.value) return

  loading.value = true

  try {
    const response = await api.delete(`/roles/${roleToDelete.value.id}`)

    if (response.data.success) {
      toast.success(response.data.message || 'Role deleted successfully')
      fetchRoles()
    } else {
      toast.error(response.data.message || 'Failed to delete role')
    }
  } catch (err) {
    console.error('Delete error:', err)
    if (err.response) {
      if (err.response.status === 400) {
        toast.error(err.response.data.message || 'Cannot delete role assigned to users')
      } else if (err.response.status === 404) {
        toast.error('Role not found')
      } else {
        toast.error(err.response.data?.message || 'Failed to delete role')
      }
    } else {
      toast.error('Network error. Please try again.')
    }
  } finally {
    loading.value = false
    showDeleteModal.value = false
    roleToDelete.value = null
  }
}

const fetchPermissions = async () => {
  try {
    const res = await api.get('/permissions')
    permissions.value = res.data.permissions
  } catch (err) {
    toast.error('Failed to load permissions')
  }
}
const openPermissionModal = async (role) => {
  selectedRole.value = role

  selectedPermissions.value = role.permissions
    ? role.permissions.map((p) => p.name) //  Spatie uses name
    : []

  await fetchPermissions()

  showPermissionModal.value = true
}
const savePermissions = async () => {
  if (!selectedRole.value) return

  loading.value = true

  try {
    await api.post(`/roles/${selectedRole.value.id}/assign-permissions`, {
      permissions: selectedPermissions.value
    })

    toast.success('Permissions assigned successfully')
    if (userStore.user?.role_id === selectedRole.value.id) {
      await userStore.refreshPermissions() // This updates permissions without logout
    }
    showPermissionModal.value = false
    fetchRoles()
  } catch (err) {
    console.log(err.response)
    toast.error('Error assigning permission')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showForm.value = false
  resetForm()
}
const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const error = ref(null)
const form = ref({
  name: ''
})

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Role Name', key: 'name' },
  { label: 'Guard', key: 'guard_name' },
  { label: 'Permissions', key: 'permissions_display' }
]
const rolesFormatted = computed(() =>
  roles.value.map((role) => ({
    ...role,
    permissions_display: role.permissions?.length
      ? role.permissions.map((p) => p.name).join(', ')
      : 'No Permissions'
  }))
)

const fetchRoles = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await api.get('/roles')
    roles.value = res.data.roles
  } catch (err) {
    error.value = 'Failed to load roles'
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchRoles()
})

const registerRole = async () => {
  loading.value = true

  try {
    await api.post('/roles', form.value)

    toast.success('Role created successfully')

    showForm.value = false
    form.value.name = ''
    fetchRoles()
  } catch (err) {
    toast.error('Error creating role')
    showForm.value = false
    form.value.name = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Roles</h1>
      <BaseButton
        @click="showForm = true"
        class="px-4 py-2 rounded-md font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add Role
      </BaseButton>
    </div>
    <!-- Loading state -->
    <!-- <div v-if="loading" class="flex justify-center py-10">
      <div
        class="w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
      ></div>
    </div> -->
    <div v-if="loading" class="p-8 text-center">
      <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
      <p class="mt-3 text-gray-500">Loading Roles...</p>
    </div>
    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center py-6">
      {{ error }}
    </div>
    <!-- Empty -->
    <div v-else-if="roles.length === 0" class="text-center py-6 text-gray-500">No roles found</div>

    <div v-else>
      <BaseTable
        :columns="columns"
        :rows="rolesFormatted"
        selectable
        searchable
        show-toolbar
        :per-page-options="[10, 20, 50, 100]"
        :default-per-page="10"
        row-key="id"
        compact
        class="shadow-lg rounded-lg"
        @update:selected="selectedRoles = $event"
      >
        <!-- Actions -->
        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              {
                name: 'Give Permission',
                icon: 'ShieldCheckIcon',
                color: 'success',
                onClick: () => openPermissionModal(row)
              },
              {
                name: 'Edit',
                icon: 'PencilIcon',
                color: 'info',
                onClick: () => editRole(row)
              },
             {
  name: 'Delete',
  icon: 'TrashIcon',
  color: 'critical',
  onClick: () => confirmDeleteRole(row)
}
            ]"
            :is-open="openDropdown === row.id"
            @toggle="toggleDropdown(row.id)"
            @close="openDropdown = null"
          />
        </template>

        <!-- Example Slot for Role Name -->
        <template #cell-role_name="{ row, selected }">
          <span :class="{ 'font-medium': selected }">{{ row.role_name }}</span>
        </template>

        <!-- Example Slot for Description -->
        <template #cell-description="{ row }">
          {{ row.description || '-' }}
        </template>
      </BaseTable>
    </div>
    <!-- Add User Modal Using Reusable Component -->
    <BaseModal
      v-model="showForm"
      title="Register Role"
      description="Create a new role"
      size="lg"
      confirmText="Register Role"
      :loading="loading"
      :showCancel="true"
      @close="closeModal"
      @confirm="registerRole"
    >
      <!-- FORM CONTENT SLOT -->
      <form class="space-y-4">
        <BaseInput v-model="form.name" label="Role Name" placeholder="Enter Role" />
      </form>
    </BaseModal>

    <BaseModal
      v-model="showPermissionModal"
      :title="`Assign Permissions to ${selectedRole?.name}`"
      confirmText="Save Permissions"
      :loading="loading"
      @confirm="savePermissions"
    >
      <div class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
        <label
          v-for="permission in permissions"
          :key="permission.id"
          class="flex items-center space-x-2"
        >
          <input type="checkbox" :value="permission.name" v-model="selectedPermissions" />
          <span>{{ permission.name }}</span>
        </label>
      </div>
    </BaseModal>
    <!-- Edit Role Modal -->
    <BaseModal
      v-model="showEditModal"
      :title="`Edit Role: ${editForm.name}`"
      confirmText="Update Role"
      :loading="loading"
      @close="showEditModal = false"
      @confirm="updateRole"
    >
      <form class="space-y-4">
        <BaseInput
          v-model="editForm.name"
          label="Role Name"
          placeholder="Enter Role Name"
          :error="editErrors.name?.[0]"
          required
        />
      </form>
    </BaseModal>
    <BaseModal
  v-model="showDeleteModal"
  title="Confirm Delete"
  confirmText="Yes, Delete"
  :loading="loading"
  @confirm="deleteRole"
>
  <p>Are you sure you want to delete role <strong>{{ roleToDelete?.name }}</strong>?</p>
</BaseModal>
  </div>
</template>
