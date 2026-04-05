<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/plugins/axios'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

import BaseTable from '@/components/ui/BaseTable.vue'


// ---------------- STATE ----------------
const requestTypes = ref([])
const isFormOpen = ref(false)
const isDeleteOpen = ref(false)
const isSubmitting = ref(false)
const isEditMode = ref(false)
const selectedId = ref(null)


const errors = reactive({})

const form = reactive({
  request_name: ''
})

const getRequestTypes = () => api.get('/requesttypes')
const createRequestType = (data) => api.post('/requesttypes', data)
const updateRequestType = (id, data) => api.put(`/requesttypes/${id}`, data)
const deleteRequestType = (id) => api.delete(`/requesttypes/${id}`)

const loadData = async () => {
  try {
    const res = await getRequestTypes()
    requestTypes.value = res.data.data ?? res.data
  } catch (err) {
    console.error('Failed to load request types', err)
  }
}

onMounted(loadData)

const openAddModal = () => {
  form.name = ''
  selectedId.value = null
  isEditMode.value = false
  clearErrors()
  isFormOpen.value = true
}

const openEditModal = (type) => {
  form.name = type.request_name
  selectedId.value = type.id
  isEditMode.value = true
  clearErrors()
  isFormOpen.value = true
}

const openDeleteModal = (type) => {
  selectedId.value = type.id
  isDeleteOpen.value = true
}

const clearErrors = () => {
  Object.keys(errors).forEach((k) => (errors[k] = null))
}

const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  clearErrors()

  try {
    if (isEditMode.value) {
      await updateRequestType(selectedId.value, form)
    } else {
      await createRequestType(form)
      console.log('Create API called')
    }

    isFormOpen.value = false
    await loadData()
    form.name = ''
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
    } else {
      console.error(err)
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async () => {
  if (!selectedId.value) return

  try {
    const { data } = await deleteRequestType(selectedId.value)
    toast.success(data.message)
    requestTypes.value = requestTypes.value.filter(
      item => item.id !== selectedId.value
    )
    closedeleteModal()

  } catch (err) {
    console.error('Delete failed', err)
    toast.error(err.response?.data?.message || "Delete failed")
  }
}


const getRowActions = (doc) => {
  return [
    {
      name: 'Edit',
      icon: 'PencilIcon',
      onClick: () => openEditModal(doc),
      class: 'action-edit'
    },

    {
      name: 'Delete',
      icon: 'TrashIcon',
      onClick: () => openDeleteModal(doc),
      class: 'action-delete',
      danger: true
    }
  ]
}
const closerequestModal = ()=>{
  isFormOpen.value = false
}
const closedeleteModal =()=>{
  isDeleteOpen.value = false
}
</script>

<template>
 <div class="p-6 text-gray-900 dark:text-gray-100">
  <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Request Types Managment</h2>
      <BaseButton @click="openAddModal"
      class="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white"> 
      Add Request Type
     </BaseButton>
    </div>
  </div>
  <div v-if="loading" class="p-8 text-center">
    <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
    <p class="mt-3 text-gray-500">Loading Request types...</p>
  </div>
  <!-- Error -->
  <div v-else-if="error" class="text-red-600 text-center py-6">
    {{ error }}
  </div>
  <!-- Empty -->
  <div
    v-else-if="Array.isArray(requesttypes) && requesttypes.length === 0"
    class="text-center py-6 text-gray-500"
  >
    No Other Charges found
  </div>
  <div v-else>
  
      <BaseTable
        :columns="[
          { key: 'Index', label: 'Index' },
          { key: 'request_name', label: 'Request Type' }
        ]"
        :rows="requestTypes"
        selectable
      >
        <!-- Actions column -->
        <template #actions="{ row }">
          <ThreeDotsButton :actions="getRowActions(row)" :id="`desktop-actions-${row.id}`" />
        </template>
      </BaseTable>
    </div>

    <!-- ================= FORM MODAL ================= -->
    <BaseModal
      v-model="isFormOpen"
      :title="isEditMode ? 'Edit Request Type' : 'Add Request Type'"
      description="Manage system request types"
      icon="M12 4v16m8-8H4"
      iconType="primary"
      :preventClose="isSubmitting"
      @close="isFormOpen = false"
    >
      <BaseInput
        label="Request Type Name"
        v-model="form.request_name"
        :error="errors.request_name"
      />

      <!-- <template #footer>
        <div class="flex justify-end gap-3">
          <Button @click="isFormOpen = false">Cancel</Button>
          <Button :loading="isSubmitting" @click="submitForm" class="btn-elite">
            {{ isEditMode ? 'Update' : 'Save' }}
          </Button>
        </div>
      </template> -->
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="closerequestModal()"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>

          <BaseButton
            @click="submitForm"
            class="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            {{ isEditMode ? 'Update' : 'Save' }}
          </BaseButton>
        </div>
      </template> 
    </BaseModal>

    <!-- ================= DELETE MODAL ================= -->
    <BaseModal
      v-model="isDeleteOpen"
      title="Delete Request Type"
      description="This action cannot be undone."
      icon="M6 18L18 6M6 6l12 12"
      iconType="critical"
      confirmText="Delete"
    
    >
      <p class="text-neutral-600 dark:text-neutral-300">
        Are you sure you want to delete this request type?
      </p>

         <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton
            @click="isDeleteOpen = false"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </BaseButton>

          <BaseButton
            @click="confirmDelete"
            class="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
           Delete
          </BaseButton>
        </div>
      </template>
    </BaseModal>

</template>
