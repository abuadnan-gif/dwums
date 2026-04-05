<script setup>
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import { PlusIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import api from '@/plugins/axios.js'
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseTable from '@/components/ui/BaseTable.vue'

import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import Icon from '@/components/Icon.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const headers = [
  { label: 'Branch Name', key: 'branch_name' },
  { label: 'City', key: 'city' },
  { label: 'Woreda', key: 'woreda' },
  { label: 'Parent', key: 'parent' },
  { label: 'Main', key: 'is_main' },
  { label: 'Description', key: 'description' }
]

const tableLoading = ref(false)
const branches = ref([])
const cities = ref([])
const woredas = ref([])

const showDeleteModal = ref(false)

const editingBranch = ref(null)
const branchToDelete = ref(null)
const errors = ref({})
const hasSubmitted = ref(false)

const branchName = ref('')
const selectedCity = ref('')
const selectedWoreda = ref('')
const selectedParent = ref('')
const isMain = ref(false)
const description = ref('')
const search = ref('')
const showFormModal = ref(false)
const statusMessage = ref('')
const status = ref('')
const submitting = ref(false)

const isEditMode = ref(false)

const filteredBranches = computed(() => {
  if (!search.value) return branches.value
  const query = search.value.toLowerCase()

  return branches.value.filter(
    (b) =>
      (b.branch_name || '').toLowerCase().includes(query) ||
      (b.city?.city_name || '').toLowerCase().includes(query) ||
      (b.woreda?.woreda_name || '').toLowerCase().includes(query)
  )
})

const filteredWoredas = computed(() => {
  if (!selectedCity.value) return woredas.value
  const city = cities.value.find((c) => c.id === selectedCity.value)
  if (!city) return woredas.value
  return woredas.value.filter((w) => w.zone_id === city.zone_id)
})

const cityBranches = computed(() =>
  branches.value.filter(
    (b) => b.city_id === selectedCity.value && b.is_main && b.id !== editingBranch.value?.id
  )
)

watch(isMain, (val) => {
  if (val) selectedParent.value = ''
})

watch(selectedCity, () => {
  selectedParent.value = ''
  selectedWoreda.value = ''
})

async function fetchWoredas() {
  tableLoading.value = true
  try {
    const woredaRes = await api.get('/woredas')
    woredas.value = woredaRes.data
  } catch (error) {
    showStatus('Failed to fetch data', 'error')
  } finally {
    tableLoading.value = false
  }
}
async function fetchCities() {
  tableLoading.value = true

  try {
    const citiesRes = await api.get('/cities')
    cities.value = citiesRes.data.cities
  } catch (error) {
    showStatus('Failed to fetch data', 'error')
  } finally {
    tableLoading.value = false
  }
}
async function fetchBranches() {
  tableLoading.value = true

  try {
    const branchesRes = await api.get('/branches')
    branches.value = branchesRes.data
  } catch (error) {
    showStatus('Failed to fetch data', 'error')
  } finally {
    tableLoading.value = false
  }
}
async function refreshData() {
  fetchCities()
  fetchBranches()
  fetchWoredas()
}
function showStatus(message, type = 'success', duration = 3000) {
  statusMessage.value = message
  status.value = type
  setTimeout(() => {
    statusMessage.value = ''
    status.value = ''
  }, duration)
}

function resetFormData() {
  branchName.value = ''
  selectedCity.value = ''
  selectedWoreda.value = ''
  selectedParent.value = ''
  isMain.value = false
  description.value = ''
  editingBranch.value = null
  branchToDelete.value = null
  errors.value = {}
  isEditMode.value = false
  hasSubmitted.value = false
}

function validateForm() {
  errors.value = {}

  if (!branchName.value) {
    errors.value.branch_name = ['Branch name is required']
  } else if (!/^[\p{L}\s]+$/u.test(branchName.value)) {
    errors.value.branch_name = ['Branch name must contain letters only']
  }

  // if (!selectedCity.value) {
  //   errors.value.city_id = ['City or Woreda is required']
  // }

  if (!selectedCity.value && !selectedWoreda.value) {
    errors.value.location = ['City or Woreda is required']
  }
  if (!isMain.value && !selectedParent.value) {
    errors.value.parent_id = ['Parent branch is required unless it is a main branch']
  }

  return Object.keys(errors.value).length === 0
}

function openAdd() {
  resetFormData()
  showFormModal.value = true
}

function openEdit(branch) {
  editingBranch.value = branch
  branchName.value = branch.branch_name
  selectedCity.value = branch.city_id
  selectedWoreda.value = branch.woreda_id
  selectedParent.value = branch.parent_id
  isMain.value = Boolean(branch.is_main)
  description.value = branch.description
  showFormModal.value = true
  submitting.value = false
  isEditMode.value = true
}

async function editOrAddBranch() {
  if (!validateForm()) return

  submitting.value = true
  hasSubmitted.value = true
  errors.value = {}

  const payload = {
    branch_name: branchName.value,
    city_id: selectedCity.value,
    woreda_id: selectedWoreda.value || null,
    parent_id: selectedParent.value || null,
    is_main: isMain.value,
    description: description.value || null
  }

  try {
    let response

    if (isEditMode.value) {
      response = await api.put(`/branches/${editingBranch.value.id}`, payload)
    } else {
      response = await api.post('/branches', payload)
    }

    showStatus(response.data.message || 'Saved successfully', 'success')

    showFormModal.value = false
    resetFormData()
    await refreshData()
  } catch (error) {
    const err = error.response?.data

    if (error.response?.status === 422) {
      errors.value = err.errors
    } else if (err?.errors) {
      // ✅ show real backend error
      const firstError = Object.values(err.errors)[0][0]
      showStatus(firstError, 'error')
    } else {
      showStatus(err?.message || 'Something went wrong', 'error')
    }
  } finally {
    submitting.value = false
    hasSubmitted.value = false
  }
}

function confirmDeleteBranch(branch) {
  branchToDelete.value = branch
  showDeleteModal.value = true
}

async function deleteBranchConfirmed() {
  if (!branchToDelete.value) return
  submitting.value = true
  hasSubmitted.value = true
  try {
    const response = await api.delete(`/branches/${branchToDelete.value.id}`)
    showStatus(response.data?.message, response.data?.status || 'success')
    if (response.status === 200) {
      showDeleteModal.value = false
      branchToDelete.value = null
      await refreshData()
    }
  } catch (error) {
    showStatus(error.response?.data?.message || 'Something went wrong', 'error')
    showDeleteModal.value = false
    resetFormData
  } finally {
    submitting.value = false
    hasSubmitted.value = false
  }
}

onMounted(() => {
  refreshData()
})
watch([selectedCity, selectedWoreda], () => {
  delete errors.value.city_id
  delete errors.value.location
})
watch(branchName, () => {
  delete errors.value.branch_name
})
watch(selectedParent, () => {
  delete errors.value.parent_id
})
watch(isMain, () => {
  delete errors.value.is_main
})

const cityOptions = computed(() =>
  cities.value.map((c) => ({
    label: c.city_name,
    value: c.id
  }))
)
const woredaOptions = computed(() =>
  woredas.value.map((w) => ({
    label: w.woreda_name,
    value: w.id
  }))
)
</script>

<template>
  <div class="space-y-4 p-4">
    <div class="fixed top-10 right-5 z-50">
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
      <h2 class="text-xl font-semibold text-indigo-600">Manage Branches</h2>

      <BaseButton @click="openAdd"> Add Branch</BaseButton>
    </div>

    <div class="overflow-x-auto bg-white rounded-md shadow-md gap-2 dark:bg-gray-900">
      <div v-if="tableLoading" class="p-8 text-center">
        <Icon name="ArrowPathIcon" class="w-8 h-8 mx-auto animate-spin text-indigo-600" />
        <p class="mt-2 text-gray-500">Loading branches...</p>
      </div>

      <BaseTable
        v-else
        :columns="headers"
        :rows="filteredBranches"
        selectable
        showSearch
        empty-text="No branches found"
        searchable
      >
        <template #cell-branch_name="{ row }">
          {{ row.branch_name }}
        </template>

        <template #cell-city="{ row }">
          {{ row.city?.city_name || '-' }}
        </template>

        <template #cell-woreda="{ row }">
          {{ row.woreda?.woreda_name || '-' }}
        </template>

        <template #cell-parent="{ row }">
          {{ row.parent?.branch_name || '-' }}
        </template>

        <template #cell-is_main="{ row }">
          <td class="px-6 py-3">
            <span v-if="row.is_main" class="text-green-600 font-semibold">Yes</span>
            <span v-else class="text-red-600 font-semibold">No</span>
          </td>
        </template>

        <template #cell-description="{ row }">
          {{ row.description || '-' }}
        </template>

        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              {
                name: 'Edit',
                icon: PencilSquareIcon,
                iconColor: '#3B82F6',
                onClick: () => openEdit(row)
              },
              {
                name: 'Delete',
                icon: TrashIcon,
                iconColor: '#EF4444',
                onClick: () => confirmDeleteBranch(row)
              }
            ]"
          />
        </template>
      </BaseTable>
    </div>
    <BaseModal
      v-model="showFormModal"
      :title="isEditMode ? 'Update Branch' : 'Add Branch'"
      @close="resetFormData"
      :confirmText="isEditMode ? 'Update Branch' : 'Save Branch'"
      @confirm="editOrAddBranch"
    >
      <!-- badge-type="primary"
class="z-50"
:confirmDisabled="hasSubmitted"
:closeDisabled="hasSubmitted" -->

      <form class="space-y-4">
        <div
          v-if="errors.location || errors.status_code || errors.server"
          class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded"
        >
          <p v-if="errors.location">{{ errors.location[0] }}</p>
          <p v-if="errors.status_code">{{ errors.status_code[0] }}</p>
          <p v-if="errors.server">{{ errors.server[0] }}</p>
        </div>

        <div>
          <BaseInput
            type="text"
            v-model="branchName"
            label="Branch Name"
            placeholder="Branch Name"
          />

          <span v-if="errors.branch_name" class="text-red-500 text-sm">
            {{ errors.branch_name[0] }}
          </span>
        </div>

        <div>
          <label class="block text-sm mb-1">City</label>

          <BaseSelect
            v-model="selectedCity"
            :clearable="true"
            :searchable="true"
            :premium="true"
            :options="cityOptions"
            size="md"
            :dropdown-append-to-body="false"
            :close-on-select="true"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Woreda (Optional)</label>
          <BaseSelect
            v-model="selectedWoreda"
            :clearable="true"
            :searchable="true"
            :premium="true"
            :options="woredaOptions"
            size="md"
            :dropdown-append-to-body="false"
            :close-on-select="true"
          />
          <p v-if="errors.city_id" class="text-red-500 text-sm">
            {{ errors.city_id[0] }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">Parent Branch</label>
          <BaseSelect
            v-model="selectedParent"
            :disabled="isMain"
            :clearable="true"
            :searchable="true"
            :premium="true"
            :options="cityBranches.map((b) => ({ value: b.id, label: b.branch_name }))"
            size="md"
            :dropdown-append-to-body="false"
            :close-on-select="true"
          />

          <p v-if="errors.parent_id" class="text-red-500 text-sm">
            {{ errors.parent_id[0] }}
          </p>
        </div>

        <BaseCheckbox v-model="isMain" label="Main Branch" />

        <p v-if="errors.is_main" class="text-red-500 text-sm">
          {{ errors.is_main[0] }}
        </p>

        <BaseTextarea
          v-model="description"
          label="Description"
          placeholder="Description..."
          class="dark:bg-gray-900"
          showCount
          clearable
        />
      </form>
    </BaseModal>

    <BaseModal
      v-model="showDeleteModal"
      title="Confirm Delete"
      iconType="danger"
      size="sm"
      :confirm-text="hasSubmitted ? 'Deleting...' : 'Delete'"
      @confirm="deleteBranchConfirmed"
      @close="resetFormData"
      badge-type="primary"
      class="z-50"
      :closeDisabled="submitting"
    >
      <div class="space-y-4">
        <p>
          Are you sure you want to delete branch
          <strong>{{ branchToDelete?.branch_name }}</strong
          >?
        </p>
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

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
