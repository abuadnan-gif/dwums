<script setup>
import api from '@/plugins/axios.js'
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

import Icon from '@/components/Icon.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'

import BaseTable from '@/components/ui/BaseTable.vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Branch', key: 'branch' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Price', key: 'price' }
]

const newOrstored = ref(false)
const SelectMaterialNameStatus = computed(() => !newOrstored.value)

const selectedMaterial = ref([])
const materials = ref([])
const branches = ref([])

const tableLoading = ref(true)
const branchFilter = ref('')
const search = ref('')

const showFormModal = ref(false)
const isEditMode = ref(false)
const currentMaterial = ref(null)

const selectedBranch = ref('')
const materialName = ref('')
const unitPrice = ref(0)
const quantity = ref(0)
const description = ref('')
const loading = ref(false)

const showDeleteModal = ref(false)
const materialToDelete = ref(null)
const deleteLoading = ref(false)

const statusMessage = ref('')
const status = ref('')
const selectedMaterials = ref([])
const validation = ref({
  materialName: '',
  selectedBranch: '',
  unitPrice: '',
  quantity: ''
})

function showStatus(message, type) {
  statusMessage.value = message
  status.value = type
  setTimeout(() => {
    statusMessage.value = ''
    status.value = ''
  }, 2000)
}

function resetValidation() {
  validation.value = {
    materialName: '',
    selectedBranch: '',
    unitPrice: '',
    quantity: ''
  }
}

function resetFormData() {
  materialName.value = ''
  unitPrice.value = 0
  quantity.value = 0
  description.value = ''
  selectedBranch.value = ''
  currentMaterial.value = null
  newOrstored.value = false
  resetValidation()
}

function openAddModal() {
  resetFormData()
  isEditMode.value = false
  showFormModal.value = true
}

function openMaterial(material) {
  isEditMode.value = true
  currentMaterial.value = material

  selectedBranch.value = material.branch_id
  materialName.value = material.material?.material_name || ''
  unitPrice.value = material.unit_price
  quantity.value = material.quantity
  description.value = material.description

  newOrstored.value = false

  resetValidation()
  showFormModal.value = true
}

function validateForm() {
  resetValidation()
  let isValid = true

  if (!materialName.value) {
    validation.value.materialName = 'Material name is required'
    isValid = false
  }

  if (!selectedBranch.value) {
    validation.value.selectedBranch = 'Branch is required'
    isValid = false
  }

  if (unitPrice.value === null || unitPrice.value < 0) {
    validation.value.unitPrice = 'Unit price must be 0 or more'
    isValid = false
  }

  if (quantity.value === null || quantity.value < 0) {
    validation.value.quantity = 'Quantity must be 0 or more'
    isValid = false
  }

  return isValid
}

async function saveMaterial() {
  if (loading.value) return
  if (!validateForm()) return

  try {
    loading.value = true
    let response

    const payload = {
      branch_id: selectedBranch.value,
      material_name: materialName.value,
      unit_price: unitPrice.value,
      quantity: quantity.value,
      description: description.value
    }

    if (isEditMode.value) {
      response = await api.put(`/branch_materials/${currentMaterial.value.id}`, payload)
    } else {
      response = await api.post('/branch_materials', payload)
    }

    showStatus(response.data.message, response.data.status)
    showFormModal.value = false
    resetFormData()
    fetchBranchMaterials()
  } catch (error) {
    const msg = error.response?.data?.message || 'Something went wrong!'
    showStatus(msg, 'error')
  } finally {
    loading.value = false
  }
}

async function fetchBranchMaterials() {
  try {
    tableLoading.value = true
    const response = await api.get('/branch_materials')
    materials.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

async function fetchBranches() {
  try {
    const response = await api.get('/branches')
    branches.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function fetchMaterials() {
  try {
    const response = await api.get('/materials')
    selectedMaterial.value = response.data.materials
  } catch (error) {
    console.error(error)
  }
}

function openDeleteModal(material) {
  materialToDelete.value = material
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!materialToDelete.value) return

  try {
    deleteLoading.value = true
    const response = await api.delete(`/branch_materials/${materialToDelete.value.id}`)
    showStatus(response.data.message, response.data.status)

    showDeleteModal.value = false
    materialToDelete.value = null
    fetchBranchMaterials()
  } catch {
    showStatus('Failed to delete material', 'error')
  } finally {
    deleteLoading.value = false
  }
}

// ✅ filtering
const filteredMaterials = computed(() => {
  return materials.value.filter((m) => {
    const matchesSearch =
      !search.value ||
      m.material?.material_name?.toLowerCase().includes(search.value.toLowerCase()) ||
      m.branch?.branch_name?.toLowerCase().includes(search.value.toLowerCase())

    const matchesBranch = !branchFilter.value || m.branch_id === branchFilter.value

    return matchesSearch && matchesBranch
  })
})

const materialsRows = computed(() => filteredMaterials.value)

onMounted(() => {
  fetchBranchMaterials()
  fetchBranches()
  fetchMaterials()
})
//  FOR CLEARING
const clearFilters = () => {
  branchFilter.value = ''
  search.value = ''
}
</script>

<template>
  <div class="space-y-4 p-4">
    <div class="fixed top-10 right-5 z-50 fade-up">
      <transition name="fade-up">
        <div
          v-if="status === 'success' && statusMessage"
          class="bg-green-400 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {{ statusMessage }}
        </div>
      </transition>

      <transition name="fade-up">
        <div
          v-if="status === 'error' && statusMessage"
          class="bg-red-400 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {{ statusMessage }}
        </div>
      </transition>
    </div>

    <div class="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold text-indigo-600">Manage Material</h2>
      <BaseButton
        @click="openAddModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
      >
        Add Material
      </BaseButton>
    </div>

    <div class="overflow-x-auto bg-white rounded-md shadow-md dark:bg-gray-900">
      <div class="flex w-1/2 gap-4 mb-4">
        <BaseSelect
          v-model="branchFilter"
          placeholder="Filter materials..."
          :options="
            branches.map((b) => ({
              label: b.branch_name,
              value: b.id
            }))
          "
          searchable
          clearable
          :loading="branches.length === 0"
        />
        <!-- <Button
  @click="branchFilter = ''; search = ''"
  class="px-3 py-2 bg-red-900 text-white rounded-lg"
>
  Clear
</Button>  ERROR WHEN FORMAT DOCUMENT-->
        <!-- SOLUTION  USE COMPUTED-->
        <BaseButton @click="clearFilters" class="px-3 py-2 bg-red-900 text-white rounded-lg">
          Clear
        </BaseButton>
      </div>

      <div v-if="tableLoading" class="p-8 text-center">
        <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
        <p class="mt-3 text-gray-500">Loading materials...</p>
      </div>

      <BaseTable
        v-else
        :columns="headers"
        :rows="materialsRows"
        selectable
        searchable
        show-toolbar
        :per-page-options="[10, 20, 50, 100]"
        :default-per-page="10"
        :compact="true"
        row-height="50px"
        @update:selected="(val) => (selectedMaterials = val)"
      >
        <template #cell-name="{ row }">
          {{ row.material?.material_name || '-' }}
        </template>

        <template #cell-branch="{ row }">
          {{ row.branch?.branch_name }}
        </template>

        <template #cell-quantity="{ row }">
          {{ row.quantity }}
        </template>

        <template #cell-price="{ row }">
          {{ row.unit_price }}
        </template>

        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              {
                name: 'Edit',
                icon: PencilSquareIcon,
                iconColor: '#3B82F6',
                onClick: () => openMaterial(row)
              },
              {
                name: 'Delete',
                icon: TrashIcon,
                iconColor: '#EF4444',
                onClick: () => openDeleteModal(row)
              }
            ]"
          />
        </template>
      </BaseTable>
    </div>

    <!-- DELETE MODAL -->
    <BaseModal
      v-model="showDeleteModal"
      title="Delete Material"
      badge-type="danger"
      :confirm-text="deleteLoading ? 'Deleting...' : 'Delete'"
      @confirm="confirmDelete"
    >
      <p>
        Are you sure you want to delete
        <strong class="text-red-600">{{ materialToDelete?.material?.material_name }}</strong> ?
      </p>
    </BaseModal>

    <!-- FORM MODAL -->
    <BaseModal
      v-model="showFormModal"
      :title="isEditMode ? 'Edit Material' : 'Add Material'"
      :confirmText="loading ? 'Saving...' : 'Save'"
      @confirm="saveMaterial"
    >
      <div class="space-y-4">
        <div
          v-if="!isEditMode"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
        >
          <div>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Material Type</p>
            <p class="text-xs text-gray-500">
              {{ newOrstored ? 'Creating new material' : 'Using existing material' }}
            </p>
          </div>

          <button
            type="button"
            @click="newOrstored = !newOrstored"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition"
            :class="newOrstored ? 'bg-indigo-600' : 'bg-gray-300'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
              :class="newOrstored ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <BaseInput
          v-if="isEditMode"
          v-model="materialName"
          label="Material Name"
          placeholder="Material Name"
        />

        <template v-else>
          <BaseSelect
            v-if="SelectMaterialNameStatus"
            v-model="materialName"
            label="Select Material"
            placeholder="Search or select material..."
            :options="
              selectedMaterial.map((m) => ({
                label: m.material_name,
                value: m.material_name
              }))
            "
            searchable
            clearable
          />

          <BaseInput
            v-else
            v-model="materialName"
            label="Material Name"
            placeholder="Enter new material"
          />
        </template>

        <p v-if="validation.materialName" class="text-red-600 text-sm">
          {{ validation.materialName }}
        </p>
        <BaseSelect
          v-model="selectedBranch"
          label="Branch"
          placeholder="Choose branch..."
          :options="
            branches.map((b) => ({
              label: b.branch_name,
              value: b.id
            }))
          "
          searchable
          clearable
          :loading="branches.length === 0"
          no-options-text="No branches available"
          class="transition-all"
        />
        <p v-if="validation.selectedBranch" class="text-red-600 text-sm">
          {{ validation.selectedBranch }}
        </p>

        <BaseInput v-model="unitPrice" label="Unit Price" type="number" />
        <p v-if="validation.unitPrice" class="text-red-600 text-sm">{{ validation.unitPrice }}</p>

        <BaseInput v-model="quantity" label="Quantity" type="number" />
        <p v-if="validation.quantity" class="text-red-600 text-sm">{{ validation.quantity }}</p>

        <BaseTextarea v-model="description" label="Description" />
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
