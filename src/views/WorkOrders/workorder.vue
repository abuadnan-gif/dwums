<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/plugins/axios.js'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import workorder from '@/views/WorkOrders/workorder.vue'

import Applicant from '@/views/applicants/Applicant.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import Icon from '@/components/Icon.vue'
import { useToast } from 'vue-toastification'
const toast = useToast()
const workorders = ref([])
const loading = ref(false)
const selectedWorkOrder = ref(null)
const showViewModal = ref(false)
const showMaterialModal = ref(false)

const materialApplicant = ref(null)
const materialSelected = ref([])
const materialWorkOrder = ref(null)

const materialSubmitting = ref(false)
const materialLoading = ref(false)
const materials = ref([])

const materialStatusId = ref(null)
const refreshApplicantStatus = async (applicantId) => {
  try {
    const status = await fetchApplicantStatus(applicantId)
    console.log('Applicant status refreshed:', status)
    // Optionally update workorders in the table
    const index = workorders.value.findIndex((w) => w.applicant?.id === applicantId)
    if (index !== -1) {
      workorders.value[index].status = status.display_name
    }
  } catch (err) {
    console.error('Failed to refresh applicant status:', err)
  }
}
const materialColumns = [
  { key: 'material_name', label: 'Material', sortable: true },
  { key: 'size', label: 'Size', sortable: true },
  { key: 'quantity', label: 'Quantity', sortable: false }
]

const fetchWorkOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/workorders')

    // ✅ Transform data
    workorders.value = res.data.workorders.map((w) => ({
      ...w,

      applicant_name: w.applicant?.full_name || '',
      staff_name: w.staff ? `${w.staff.first_name} ${w.staff.last_name}` : '',
      status: w.status_code?.status_code || '',

      urgent_label: w.is_urgent ? 'Yes' : 'No',
      formatted_date: w.scheduled_date ? new Date(w.scheduled_date).toLocaleDateString() : ''
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
const viewWorkOrder = (row) => {
  selectedWorkOrder.value = row
  showViewModal.value = true
}

const editWorkOrder = (row) => {
  console.log('Edit', row)
}

const deleteWorkOrder = (row) => {
  console.log('Delete', row)
}
const columns = [
  { key: 'order_code', label: 'Order Code' },
  { key: 'applicant_name', label: 'Applicant' },
  { key: 'staff_name', label: 'Staff' },
  { key: 'priority', label: 'Priority', type: 'badge' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'estimated_hours', label: 'Est. Hours' },
  { key: 'urgent_label', label: 'Urgent' },
  { key: 'location_details', label: 'Location' },
  { key: 'formatted_date', label: 'Scheduled Date' }
]

const openMaterialModal = async (row) => {
  materialSelected.value = []

  materialApplicant.value = row.applicant

  const applicantId = row.applicant?.id

  if (!applicantId) {
    console.error('Applicant ID missing in row:', row)
    return
  }

  materialWorkOrder.value = await fetchWorkOrderForApplicant(applicantId)
  showMaterialModal.value = true

  await fetchMaterials()
}

const closeMaterialModal = () => {
  showMaterialModal.value = false
  materialApplicant.value = null
  materialSelected.value = []
  materialWorkOrder.value = null
}

const submitMaterial = async () => {
  if (!materialWorkOrder.value) {
    return toast.warning('Work order is required')
  }

  if (!materialSelected.value.length) {
    return toast.warning('Select at least one material')
  }

  if (!materialStatusId.value) {
    return toast.error('Material status not configured')
  }

  materialSubmitting.value = true

  try {
    const response = await api.post(`/applicants/${materialApplicant.value.id}/materials`, {
      work_order_id: materialWorkOrder.value.id,
      materials: materialSelected.value.map((item) => ({
        material_id: item.id,
        quantity: item.quantity
      }))
    })

    // Update work order status in the current list
    const workOrderIndex = workorders.value.findIndex(w => w.id === materialWorkOrder.value.id)
    if (workOrderIndex !== -1) {
      workorders.value[workOrderIndex].status = response.data.work_order_status || 'materials_assigned'
    }

    // Dispatch custom event for Applicant.vue to update
    window.dispatchEvent(new CustomEvent('status-updated', {
      detail: {
        applicantId: materialApplicant.value.id,
        status: response.data.applicant_status || 'materials_assigned'
      }
    }))

    closeMaterialModal()
    toast.success('Materials assigned successfully')
  } catch (err) {
    console.error('Material error:', err)
    toast.error(
      err.response?.data?.message || err.response?.data?.error || 'Failed to assign materials'
    )
  } finally {
    materialSubmitting.value = false
  }
}

onMounted(() => {
  fetchWorkOrders()
  fetchMaterialStatus()
})

const getRowActions = (row) => {
  return [
    {
      name: 'View',
      icon: 'EyeIcon',
      onClick: () => viewWorkOrder(row)
    },
    {
      name: 'Edit',
      icon: 'PencilIcon',
      onClick: () => editWorkOrder(row)
    },
    {
      name: 'Assign Materials',
      icon: 'CubeIcon',
      onClick: () => openMaterialModal(row),
      class: 'action-material'
    },
    {
      name: 'Create Estimation',
      icon: 'CalculatorIcon',
      onClick: () => createEstimation(row),
      class: 'action-estimation'
    },
    {
      name: 'Delete',
      icon: 'TrashIcon',
      danger: true,
      onClick: () => deleteWorkOrder(row)
    }
  ]
}

const getMaterialQuantity = (id) => {
  const item = materialSelected.value.find((item) => item.id === id)
  return item?.quantity ?? 1
}

const setMaterialQuantity = (id, value) => {
  const item = materialSelected.value.find((item) => item.id === id)
  if (item) {
    const quantity = parseInt(value)
    if (!isNaN(quantity) && quantity >= 1) {
      item.quantity = quantity
    }
  }
}

const validateMaterialQuantity = (id) => {
  const item = materialSelected.value.find((item) => item.id === id)
  if (item && (!item.quantity || item.quantity < 1)) {
    item.quantity = 1
  }
}

const incrementQuantity = (id) => {
  const item = materialSelected.value.find((item) => item.id === id)
  if (item) item.quantity++
}

const decrementQuantity = (id) => {
  const item = materialSelected.value.find((item) => item.id === id)
  if (item && item.quantity > 1) item.quantity--
}

const handleMaterialSelect = (ids) => {
  const map = new Map(materialSelected.value.map((item) => [item.id, item]))
  materialSelected.value = ids
    .map((id) => {
      if (map.has(id)) return map.get(id)
      const material = materials.value.find((m) => m.id === id)
      return material
        ? {
            id: material.id,
            material_name: material.material_name,
            size: material.size,
            quantity: 1
          }
        : null
    })
    .filter(Boolean)
}

const fetchMaterialStatus = async () => {
  try {
    const { data } = await api.get('/status_codes')

    console.log('STATUS API:', data) // 👈 DEBUG

    const list = Array.isArray(data) ? data : []

    const status = list.find(
      (s) => s.entity_type === 'applicant_materials' && s.status_code === 'materials_assigned'
    )
    console.log('FOUND STATUS:', status)
    if (status) {
      materialStatusId.value = status.id
    } else {
      console.warn('Material status not found in list:', list)
    }
  } catch (error) {
    console.error('Failed to fetch material status:', error)
  }
}

const fetchMaterials = async () => {
  materialLoading.value = true
  try {
    const response = await api.get('/materials')

    console.log('MATERIAL API:', response.data) // 👈 DEBUG

    // ✅ FIX: use correct key
    const materialsData = response.data?.materials ?? []

    materials.value = materialsData.map((m) => ({
      id: m.id,
      material_name: m.material_name ?? m.name ?? 'Unknown',
      size: m.size || ''
    }))
  } catch (error) {
    console.error('Failed to load materials:', error)
    toast.error('Failed to load materials')
  } finally {
    materialLoading.value = false
  }
}

const fetchWorkOrderForApplicant = async (applicantId) => {
  try {
    const response = await api.get('/workorders', {
      params: { applicant_id: applicantId, per_page: 1 }
    })

    // ✅ FIX: use correct key
    const workOrders = response.data?.workorders ?? []

    return workOrders.length > 0 ? workOrders[0] : null
  } catch (error) {
    console.error('Fetch workorder error:', error)
    return null
  }
}
const refreshWorkOrderList = async () => {
  try {
    const res = await api.get('/workorders')
    workorders.value = res.data.workorders.map((w) => ({
      ...w,
      applicant_name: w.applicant?.full_name || '',
      staff_name: w.staff ? `${w.staff.first_name} ${w.staff.last_name}` : '',
      status: w.status_code?.status_code || '',
      urgent_label: w.is_urgent ? 'Yes' : 'No',
      formatted_date: w.scheduled_date ? new Date(w.scheduled_date).toLocaleDateString() : ''
    }))
  } catch (err) {
    console.error('Failed to refresh work orders:', err)
  }
}

const fetchApplicantStatus = async (applicantId) => {
  try {
    const materialsResponse = await api
      .get(`/applicants/${applicantId}/materials`)
      .catch(() => ({ data: [] }))

    const materials = materialsResponse.data?.data ?? materialsResponse.data ?? []

    if (materials.length) {
      return {
        id: null,
        status_code: 'materials_assigned',
        display_name: 'Material Assigned',
        color: '#8B5CF6'
      }
    }

    const woResponse = await api.get('/workorders', {
      params: { applicant_id: applicantId, per_page: 1 }
    })
    const workOrders = woResponse.data?.data ?? woResponse.data ?? []

    if (workOrders.length) {
      return {
        id: null,
        status_code: 'workorder_assigned',
        display_name: 'Workorder Assigned',
        color: '#3B82F6'
      }
    }

    return { id: null, status_code: 'pending', display_name: 'Pending', color: '#F59E0B' }
  } catch {
    return { id: null, status_code: 'pending', display_name: 'Pending', color: '#F59E0B' }
  }
}

//Estimation
const createEstimation = async (row) => {
  try {
    if (!row.id) {
      return toast.error('Work order ID missing')
    }

    const payload = {
      work_order_id: row.id,
      date_of_estimation: new Date().toISOString().split('T')[0] // today
    }

    const res = await api.post('/estimations', payload)

    toast.success(res.data.message || 'Estimation created successfully')
  } catch (err) {
    console.error(err)

    toast.error(
      err.response?.data?.message ||
        err.response?.data?.errors?.work_order_id?.[0] ||
        'Failed to create estimation'
    )
  }
}

onMounted(() => {
  fetchWorkOrders()
  fetchMaterialStatus()
  
  // Listen for workorder updates from Applicant.vue
  window.addEventListener('workorder-updated', (event) => {
    const { applicantId, status } = event.detail
    const workOrderIndex = workorders.value.findIndex(w => w.applicant?.id === applicantId)
    if (workOrderIndex !== -1) {
      workorders.value[workOrderIndex].status = status
    }
  })
})

// Clean up
onUnmounted(() => {
  window.removeEventListener('workorder-updated', () => {})
  window.removeEventListener('status-updated', () => {})
})
</script>
<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Work Orders Management</h1>
    </div>
    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
      <p class="mt-3 text-gray-500">Loading work orders...</p>
    </div>
    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center py-6">
      {{ error }}
    </div>
    <!-- Empty -->
    <div v-else-if="workorders.length === 0" class="text-center py-6 text-gray-500">
      No work order found
    </div>

   <div v-else>
  <BaseTable
    :columns="columns"
    :rows="workorders"
    :loading="loading"
    selectable
    searchable
    show-toolbar
    show-page-size
    :per-page-options="[10, 20, 50, 100]"
    :default-per-page="10"
    row-key="id"
    :compact="true"
    :max-height="500"
    empty-text="No work orders found"
    @update:selected="handleWorkorderSelect"
  >
    <!-- Actions Column -->
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

    <!-- Edit User Modal -->

    <!-- modal to add materials -->
    <BaseModal
      v-model="showMaterialModal"
      :title="
        materialApplicant
          ? `Assign Materials - ${materialApplicant.first_name} ${materialApplicant.last_name}`
          : 'Assign Materials'
      "
      size="lg"
      :show-cancel="true"
      confirmText="Assign"
      :loading="materialSubmitting"
      :confirm-disabled="materialSelected.length === 0 || !materialWorkOrder"
      @confirm="submitMaterial"
      @close="closeMaterialModal"
    >
      <div class="space-y-4">
        <div
          v-if="materialWorkOrder"
          class="p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded border border-green-200 dark:border-green-800"
        >
          Work Order: {{ materialWorkOrder.order_code }}
        </div>
        <div
          v-else
          class="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs rounded border border-yellow-200 dark:border-yellow-800"
        >
          No work order found for this applicant
        </div>

        <div v-if="materialLoading" class="py-8 text-center">
          <Icon name="ArrowPathIcon" class="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
          <p class="mt-2 text-sm text-gray-500">Loading materials...</p>
        </div>

        <BaseTable
          v-else-if="materials.length"
          :columns="materialColumns"
          :rows="materials"
          selectable
          searchable
          show-toolbar
          :default-per-page="10"
          :per-page-options="[5, 10, 20, 50]"
          row-key="id"
          :compact="true"
          :max-height="400"
          @update:selected="handleMaterialSelect"
        >
          <template #cell-material_name="{ row, selected }">
            <div class="flex items-center gap-2">
              <span :class="{ 'font-medium': selected }">{{ row.material_name }}</span>
            </div>
          </template>

          <template #cell-size="{ row }">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.size || '—' }}</span>
          </template>

          <template #cell-quantity="{ row, selected }">
            <div v-if="selected" class="flex items-center gap-2">
              <button
                type="button"
                class="w-7 h-7 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                @click.stop="decrementQuantity(row.id)"
                :disabled="getMaterialQuantity(row.id) <= 1"
              >
                <Icon name="MinusIcon" class="w-3 h-3" />
              </button>
              <BaseInput
                type="number"
                :model-value="getMaterialQuantity(row.id)"
                @update:model-value="(value) => setMaterialQuantity(row.id, value)"
                @blur="validateMaterialQuantity(row.id)"
                min="1"
                class="!w-16 text-center"
                size="sm"
              />
              <button
                type="button"
                class="w-7 h-7 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                @click.stop="incrementQuantity(row.id)"
              >
                <Icon name="PlusIcon" class="w-3 h-3" />
              </button>
            </div>
            <span v-else class="text-sm text-gray-400">—</span>
          </template>
        </BaseTable>

        <div v-else class="py-4 text-center text-gray-500">No materials available</div>
      </div>
    </BaseModal>
  </div>
</template>
