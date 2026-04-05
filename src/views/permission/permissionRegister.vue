<script setup>
import api from '@/plugins/axios'
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useToast } from 'vue-toastification'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const toast = useToast()
const showForm = ref(false)
const loading = ref(false)
const permissions = ref([])
const error = ref(null)

const editingPermissionId = ref(null)
const openDropdown = ref(null)

const showDeleteModal = ref(false)
const permissionToDelete = ref(null)

const editPermission = (permission) => {
  form.value.name = permission.name
  editingPermissionId.value = permission.id
  showForm.value = true
}

const updatePermission = async () => {
  loading.value = true

  try {
    await api.put(`/permissions/${editingPermissionId.value}`, form.value)

    toast.success('Permission updated successfully')

    showForm.value = false
    form.value.name = ''
    editingPermissionId.value = null

    fetchPermissions()
  } catch (err) {
    toast.error('Error updating permission')
  } finally {
    loading.value = false
  }
}

const confirmDeletePermission = (permission) => {
  permissionToDelete.value = permission
  showDeleteModal.value = true
}
const deletePermissionConfirmed = async () => {
  if (!permissionToDelete.value) return

  loading.value = true
  try {
    await api.delete(`/permissions/${permissionToDelete.value.id}`)
    toast.success('Permission deleted successfully')
    fetchPermissions()
    showDeleteModal.value = false
    permissionToDelete.value = null
  } catch (err) {
    toast.error('Error deleting permission')
  } finally {
    loading.value = false
  }
}

const form = ref({
  name: ''
})

const columns = [{ label: 'Permission Name', key: 'name' }]

const permissionsFormatted = computed(() => permissions.value.map((p) => ({ ...p })))

const fetchPermissions = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/permissions')
    permissions.value = res.data.permissions
  } catch (err) {
    error.value = 'Failed to load permissions'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPermissions()
})

const registerPermission = async () => {
  loading.value = true
  try {
    await api.post('/permissions', form.value)

    toast.success('Permission created successfully')

    showForm.value = false
    form.value.name = ''
    fetchPermissions()
  } catch (err) {
    toast.error('Error creating permission')
    showForm.value = false
    form.value.name = ''
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="p-6">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold">Permissions</h1>
      <BaseButton @click="showForm = true" class="px-4 py-2 bg-blue-600 text-white rounded-md">
        Add Permission
      </BaseButton>
    </div>
    <div v-if="loading" class="p-8 text-center">
      <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
      <p class="mt-3 text-gray-500">Loading Permissions...</p>
    </div>
    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center py-6">
      {{ error }}
    </div>
    <!-- Empty -->
    <div v-else-if="permissions.length === 0" class="text-center py-6 text-gray-500">
      No permissions found
    </div>

    <div v-else>
      <BaseTable
        :columns="columns"
        :rows="permissionsFormatted"
        selectable
        searchable
        show-toolbar
        :per-page-options="[10, 20, 50, 100]"
        :default-per-page="10"
        row-key="id"
        compact
        class="shadow-lg rounded-lg"
        @update:selected="selectedPermissions = $event"
      >
        <!-- Actions Column -->
        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              {
                name: 'Edit',
                icon: 'PencilIcon',
                color: 'info',
                onClick: () => editPermission(row)
              },
              {
                name: 'Delete',
                icon: 'TrashIcon',
                color: 'critical',
                onClick: () => confirmDeletePermission(row)
              }
            ]"
            :is-open="openDropdown === row.id"
            @toggle="toggleDropdown(row.id)"
            @close="openDropdown = null"
          />
        </template>

        <!-- Example slot for Permission Name -->
        <template #cell-permission_name="{ row, selected }">
          <span :class="{ 'font-medium': selected }">{{ row.permission_name }}</span>
        </template>

        <!-- Example slot for Description -->
        <template #cell-description="{ row }">
          {{ row.description || '-' }}
        </template>
      </BaseTable>
    </div>

    <BaseModal
      v-model="showForm"
      title="Register Permission"
      confirmText="Register Permission"
      :loading="loading"
      @confirm="editingPermissionId ? updatePermission() : registerPermission()"
    >
      <form class="space-y-4">
        <BaseInput v-model="form.name" label="Permission Name" placeholder="Enter Permission" />
      </form>
    </BaseModal>
    <BaseModal
  v-model="showDeleteModal"
  title="Confirm Delete"
  confirmText="Yes, Delete"
  :loading="loading"
  @confirm="deletePermissionConfirmed"
>
  <p>Are you sure you want to delete <strong>{{ permissionToDelete?.name }}</strong>?</p>
</BaseModal>


  </div>
</template>
