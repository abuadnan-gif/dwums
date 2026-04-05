<script setup>
import api from '@/plugins/axios.js'
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import Input from '@/components/ui/BaseInput.vue'
import {ArrowPathIcon} from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import is from 'date-fns/esm/locale/is/index.js'

const tableLoading = ref(false)
const showStatusModal = ref(false)
const showEditStatusModal = ref(false)
const showDeleteModal = ref(false)
const statusToDelete = ref(null)
const isEditing = ref(false)
const statusName = ref('')
const description = ref('')
const entity_type = ref('')
const is_active = ref(true)
const is_default = ref(false)
const editingStatus = ref(null)

const statusMessage = ref('')
const statusType = ref('')
const errors= ref({})

const statusCodes = ref([])
const entityOptions = ref([])
const search = ref('')
const submitting = ref(false)



const columns = [
  { label: 'Status Name', key: 'status_code' },
  { label: 'Entity Type', key: 'entity_type' },
  { label: 'Active', key: 'is_active' },
  { label: 'Default', key: 'is_default' },
]

async function fetchStatusCodes() {
  try {
    tableLoading.value = true
    const response = await api.get('/status_codes')
    statusCodes.value = response.data
  } catch (error) {
    statusCodes.value= null
  } finally{
    tableLoading.value= false;
  }

}


async function fetchEntityOptions() {
  try {
    const response = await api.get('/status-entities')

    entityOptions.value = Object.entries(response.data).map(([key, value]) => ({
      value: key,
      label: value
    }))

  } catch (error) {
    entityOptions.value = []
  }
}
function validateData() {
  const validationErrors ={}
  if (!statusName.value) {
    validationErrors.statusName = 'Status Name is required'
  }
  if (!entity_type.value) {
    validationErrors.entity_type = 'Please Select the Entity Type'
  }
   errors.value = validationErrors
  return Object.keys(validationErrors).length === 0
}
function showStatusMessage(message, type= 'success',duration= 2000){
  statusMessage.value = message
  statusType.value = type
  setTimeout(()=>{
    statusMessage.value= ''
    statusType.value= ''
  },duration)
}
async function saveStatusCode() {
  if (submitting.value) return
  if (!validateData()) return

  submitting.value = true
  try {
    const response = await api.post('/status_codes', {
      status_code: statusName.value,
      description: description.value,
      entity_type: entity_type.value,
      is_active: Boolean(is_active.value),
      is_default: Boolean(is_default.value)
    })
    if (response.status === 200 || response.status === 201){
      showStatusMessage(response.data?.message || 'Successfully Done', response.data?.status || 'success' )
    }
    resetModal()
    fetchStatusCodes()
  } catch (error) {
    if (error.response.status === 422) {
      errors.value = error.response?.data?.errors
    } else{
      showStatusMessage('server error','error')
    }
    submitting.value = false
  } finally {
  submitting.value = false
  }
}

async function updateStatusCode() {
  if (submitting.value) return
  if (!validateData()) return

  submitting.value = true

  try {
    const response = await api.put(`/status_codes/${editingStatus.value.id}`, {
      status_code: statusName.value,
      description: description.value,
      entity_type: entity_type.value,
      is_active: Boolean(is_active.value),
      is_default: Boolean(is_default.value)
    })
    showStatusMessage(response.data.message,'success')
    resetModal()
    fetchStatusCodes()
  } catch (error) {
    if (error.response.status === 422) {
      errors.value = error.response?.data?.errors
    }
    submitting.value = false
  } finally {
    submitting.value = false   
  }
}

function editStatus(row) {
  editingStatus.value = row
  isEditing.value= true
  statusName.value = row.status_code
  description.value = row.description || ''
  entity_type.value = row.entity_type
  is_active.value = row.is_active
  is_default.value = row.is_default
  showStatusModal.value = true
  isEditing.value=true
}
function confirmDeleteStatus(row) {
  statusToDelete.value = row
  showDeleteModal.value = true
}
async function deleteStatusConfirmed() {
  if (!statusToDelete.value) return

  submitting.value = true
  try {
    const response = await api.delete(`/status_codes/${statusToDelete.value.id}`)
    statusMessage.value = response.data.message
    statusType.value = 'success'
  } catch (error) {
    if (error.response.status === 422) {
      errors.value = error.response?.data?.errors
    }
    else{
      showStatusMessage('server error','error')
    }
    submitting.value = false
  } finally {
    submitting.value = false
    showDeleteModal.value = false
    statusToDelete.value = null
    fetchStatusCodes()
  }
}

function resetModal() {
  showStatusModal.value = false
  showEditStatusModal.value = false
  editingStatus.value = null
  errors.value= {}
  statusName.value = ''
  description.value = ''
  entity_type.value = ''
  is_active.value = true
  is_default.value = false
  isEditing.value = false

  showDeleteModal.value = false
  statusToDelete.value = null
}
const filteredStatusCodes = computed(() => {
  if (!search.value) return statusCodes.value

  return statusCodes.value.filter(s =>
    s.status_code?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const booleanOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' }
]

onMounted(() => {
  fetchStatusCodes()
  fetchEntityOptions()
})
watch(statusName || errors.value.status_code,()=>{
  errors.value.statusName = ''
  errors.value.status_code = ''
})

watch(entity_type,()=>{
  errors.value.entity_type = ''
})
watch(is_default,()=>{
  errors.value.is_default = ''
})
watch(showStatusModal, showEditStatusModal,()=>{
  errors.value = {}
})
</script>

<template>
<div class="px-6 py-6 space-y-4">

  <div class="fixed top-10 right-5 z-50">
    <transition name="fade-up">
      <div v-if="statusType === 'success' && statusMessage"
           class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        {{ statusMessage }}
      </div>
    </transition>

    <transition name="fade-up">
      <div v-if="statusType === 'error' && statusMessage"
           class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
        {{ statusMessage }}
      </div>
    </transition>
  </div>

  <div class="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold text-indigo-600">Manage Status Codes</h2>
    <BaseButton
      @click="showStatusModal = true; isEditing=false"
      size="md"
      class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
    >
      Add Status
    </BaseButton>
  </div>
  <div v-if="tableLoading" class="p-8 text-center">
    <ArrowPathIcon class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
    <p class="mt-3 text-gray-500">Loading materials...</p>
  </div>

  <BaseTable
  v-else
  :columns="columns"
  :rows="filteredStatusCodes"
  searchable
  selectable
  :per-page-options="[10,20,50]"
  :default-per-page="20"    
  :compact="true" 
  row-height="50px"
  show-toolbar
  @update:selected="val => selectedLocations = val"
  class="shadow-lg rounded-lg"
>
  <template #cell-status_code="{ row }">
    {{ row.status_code }}
  </template>

  <template #cell-entity_type="{ row }">
    {{ row.entity_type }}
  </template>

  <template #cell-is_active="{ row }">
    <span :class="row.is_active ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs' : 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs'">
      {{ row.is_active ? 'Active' : 'Inactive' }} 
    </span>
    
  </template>

  <template #cell-is_default="{ row }">
    <span 
    :class="row.is_default 
       ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs'
       : 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs'"
>
  {{ row.is_default ? 'Yes' : 'No' }}
</span>
  </template>

  <template #actions="{ row }">
    <ThreeDotsButton
      :actions="[
        { name: 'Edit', icon: 'PencilIcon', onClick: () => editStatus(row) },
        { name: 'Delete', icon: 'TrashIcon', onClick: () => confirmDeleteStatus(row), danger: true }
      ]"
    />
  </template>
</BaseTable>
 <BaseModal
  v-model="showStatusModal"
  :title="isEditing ? 'Edit Status Code' : 'Add Status Code'"
  :icon="isEditing ? 'PencilIcon' : modalIcon"
  size="lg"
  :confirmText="submitting ? 'Submitting...' : isEditing ? 'Update' : 'Save'"
  :badge-type="isEditing ? 'info' : modalBadge"
  class="z-50"
  :confirmDisabled="submitting"
  :closeDisabled="submitting"
  @confirm="isEditing ? updateStatusCode() : saveStatusCode()"
  @close="resetModal"
>
  <form class="space-y-4">

    <BaseInput  type="text" class="rounded-lg dark:bg-gray-900 dark:text-white" v-model="statusName" label="Status Name" placeholder="Status Code Name"
    />
    <div v-if="errors.statusName || errors.status_code" class="text-red-500 text-sm">
      {{ errors.statusName || errors.status_code }}
    </div>
    <BaseSelect
      v-model="entity_type"
      label="Entity Type"
      :searchable="true"
      :options="entityOptions"
      :clearable="true"
      size="md"
      :dropdown-append-to-body="false"
      :close-on-select="true"
    />
    <div v-if="errors.entity_type" class="text-red-500 text-sm">
      {{ errors.entity_type }}
    </div>
    <BaseSelect v-model="is_active"   label="Active"  :options="booleanOptions"  size="md" 
      :clearable="false"
    />
    <BaseSelect v-model="is_default" label="Set as Default"   :options="booleanOptions"  size="md" :clearable="false" />
    <div v-if="errors.is_default" class="text-red-500 text-sm">
      {{ errors.is_default }}
    </div>
    <BaseTextarea v-model="description" label="Description"  placeholder="Description..."  class="dark:bg-gray-900"   showCount  clearable/>
  </form>
</BaseModal>
<BaseModal
  v-model="showDeleteModal"
  title="Confirm Delete"
  :icon="'TrashIcon'"
  :badge-type="'danger'"
  size="sm"
  :confirmDisabled="submitting"
  :closeDisabled="submitting"
  :confirm-text = "submitting ? 'Deleting...':'Delete'"
  @confirm="deleteStatusConfirmed"
  @close="resetModal"
>
  <div class="space-y-4">
    <p>Are you sure you want to delete status <strong>{{ statusToDelete?.status_code }}</strong>?</p>

    <div class="flex justify-end space-x-2">
    </div>
  </div>
</BaseModal>
</div>
</template>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active { transition: all 0.4s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(15px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-15px); }
</style>