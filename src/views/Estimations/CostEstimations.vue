<script setup>
import api from '@/plugins/axios'
import { ref, onMounted, computed } from 'vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from 'vue-toastification'
import BaseTable from '@/components/ui/BaseTable.vue'
import Icon from '@/components/Icon.vue'

const toast = useToast()

const showForm = ref(false)
const loading = ref(false)
const estimations = ref([])
const openDropdown = ref(null)
const error = ref('')

const showMaterialModal = ref(false)
const selectedEstimation = ref(null)
const materials = ref([])

const showChargeModal = ref(false)
const charges = ref([])

const showViewModal = ref(false)

// Data for the modal
const viewData = ref({
  materials: [],
  charges: []
})

// dropdown toggle
const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

// actions
const estimateMaterials = (est) => {
  openDropdown.value = null
  selectedEstimation.value = est
  // showMaterialModal.value = true
  error.value = ''

  api
    .get(`/estimations/${est.id}`)
    .then((res) => {
      materials.value = res.data.materials.map((m) => ({
        work_order_material_id: m.id,
        material_id: m.material_id,
        material_name: m.material.material_name,
        size: m.material.size,
        quantity: m.quantity,
        unit_price: 0,
        total: 0
      }))
      showMaterialModal.value = true
    })
    .catch(() => {
      // error.value = 'Failed to load materials'
      toast.error('Failed to load materials')
    })
}
const addCharges = (est) => {
  openDropdown.value = null
  selectedEstimation.value = est
  error.value = ''
  charges.value = []

  api
    .get(`/other_charges`)
    .then((res) => {
      charges.value = res.data.other_charges.map((c) => ({
        other_charge_id: c.id,
        charge_name: c.charge_name,
        total_price: 0
      }))

      showChargeModal.value = true
    })
    .catch(() => {
      // error.value = 'Failed to load charges'
      toast.error('Failed to load charges')
    })
}

const saveCharges = () => {
  if (!selectedEstimation.value) return

  loading.value = true
  error.value = ''

  // Prepare payload with only needed fields
  const payload = {
    charges: charges.value.map((c) => ({
      other_charge_id: c.other_charge_id,
      total_price: c.total_price
    }))
  }

  // Call the correct API route for OtherChargeEstimationController
  api
    .post(`/estimations/${selectedEstimation.value.id}/other-charge-estimations`, payload)
    .then(() => {
      showChargeModal.value = false
      toast.success('Charges saved successfully!')
      fetchEstimations() // Refresh the estimation table to reflect new total and status
    })
    .catch(() => {
      toast.error('Failed to save charges')
    })
    .finally(() => {
      loading.value = false
    })
}

const calculateLineTotal = (material) => {
  material.total = material.quantity * material.unit_price
}

const saveMaterialEstimation = () => {
  // Ensure an estimation is selected
  if (!selectedEstimation.value) return

  loading.value = true
  error.value = ''

  // Prepare payload: only material_id and unit_price are needed
  const payload = {
    materials: materials.value.map((m) => ({
      material_id: m.material_id, // important
      unit_price: m.unit_price
    }))
  }

  // Send POST request to backend
  api
    .post(`/estimations/${selectedEstimation.value.id}/materials`, payload)
    .then((res) => {
      // Success: close modal
      showMaterialModal.value = false

      // Optional: show success message
      // console.log(res.data.message)
      // toast.success('Materials saved successfully!')
      toast.success(res.data.message)

      // Refresh estimations table to reflect total_material and status
      fetchEstimations()
    })
    .catch(() => {
      // error.value = 'Failed to save estimation materials'

      toast.error('Failed to save estimation materials')
    })
    .finally(() => {
      loading.value = false
    })
}

const editEstimation = (est) => {
  openDropdown.value = null
  console.log('Edit estimation', est)
}

const approveEstimation = (id) => {
  openDropdown.value = null
  api.patch(`/estimations/${id}/approve`).then(fetchEstimations)
}

// fetch estimations
const fetchEstimations = () => {
  loading.value = true
  error.value = ''

  api
    .get('/estimations')
    .then((res) => {
      estimations.value = res.data.estimations || []
    })
    .catch(() => {
      // error.value = 'Failed to load estimations'
      toast.error('Failed to load estimations')
    })
    .finally(() => {
      loading.value = false
    })
}


const handlePrint = () => {
  printEstimation()      // print first
  showViewModal.value = false   // then close modal
}

onMounted(() => {
  fetchEstimations()
})

const getActions = (est) => {
  const actions = []

  if (est.estimation_status === 'draft') {
    actions.push({
      name: 'Estimate Materials',
      icon: 'EyeIcon',
      color: 'info',
      onClick: () => estimateMaterials(est)
    })
  }

  if (est.estimation_status === 'material_added') {
    actions.push({
      name: 'Add Charge',
      icon: 'PencilIcon',
      color: 'warning',
      onClick: () => addCharges(est)
    })
  }

  if (est.estimation_status === 'charged') {
    actions.push({
      name: 'Approved',
      icon: 'CheckCircleIcon',
      color: 'success',
      onClick: () => approveEstimation(est.id)
    })
  }
  if (
    est.estimation_status === 'draft' ||
    est.estimation_status === 'material_added' ||
    est.estimation_status === 'charged'
  ) {
    actions.push({
      name: 'View',
      icon: 'EyeIcon',
      color: 'info',
      onClick: () => viewEstimation(est)
    })
  }

  return actions
}

const viewEstimation = (est) => {
  openDropdown.value = null
  selectedEstimation.value = est
  viewData.value = { materials: [], charges: [] }

  api
    .get(`/estimations/${est.id}/details`)
    .then((res) => {
      // Materials
      viewData.value.materials = res.data.materials.map((material) => ({
        id: material.id,
        material_name: material.material?.name || '',
        size: material.size,
        quantity: material.quantity,
        unit_price: material.unit_price || 0,
        total: (material.quantity || 0) * (material.unit_price || 0)
      }))

      // Charges
      viewData.value.charges = res.data.charges.map((charge) => ({
        id: charge.id,
        charge_name: charge.other_charge?.charge_name || '',
        total_price: charge.total_price || 0
      }))

      showViewModal.value = true
    })
    .catch((err) => {
      console.log(err)
      toast.error('Failed to load estimation details')
    })
}

// Total of all materials
const totalMaterialCost = computed(() =>
  viewData.value.materials.reduce((sum, material) => sum + Number(material.total || 0), 0)
)

// Total of all charges
const totalChargeCost = computed(() =>
  viewData.value.charges.reduce((sum, charge) => sum + Number(charge.total_price || 0), 0)
)

// Grand total (materials + charges)
const grandTotal = computed(() => totalMaterialCost.value + totalChargeCost.value)

const columns = [
  { label: '#', key: 'index' },
  { label: 'Work Order', key: 'work_order_id' },
  { label: 'Applicant', key: 'applicant_name' },
  { label: 'Prepared By', key: 'prepared_name' },
  { label: 'Order Code', key: 'order_code' },
  { label: 'Date of Estimated', key: 'date_of_estimation' },
  { label: 'Total Material Cost', key: 'total_material' },
  { label: 'Other Charges', key: 'other_charges' },
  { label: 'Transport Cost', key: 'tranport_cost' },
  { label: 'Technician Cost', key: 'technical_cost' },
  { label: 'Total Grant Cost', key: 'total_grant' },
  { label: 'Estimation Status', key: 'estimation_status' },
  { label: 'Payment Status', key: 'payment_status' }
]



// const estimationsFormatted = computed(() =>
//   estimations.value.map((est, index) => ({
//     ...est,
//     index: index + 1,
//     applicant_name: est.applicant ? est.applicant.first_name + ' ' + est.applicant.last_name : '-',
//    prepared_name:
//       est.prepared_by && est.prepared_by.staff
//         ? est.prepared_by.staff.first_name + ' ' + est.prepared_by.staff.last_name
//         : '-'
//   }))
// )
// printing
const estimationsFormatted = computed(() =>
  estimations.value.map((est, index) => ({
    ...est,
    index: index + 1,
    applicant_name: est.applicant
      ? est.applicant.first_name + ' ' + est.applicant.last_name
      : '-',
    prepared_name: est.prepared_by && est.prepared_by.staff
      ? est.prepared_by.staff.first_name + ' ' + est.prepared_by.staff.last_name
      : '-'
  }))
)

const printEstimation = () => {
  const content = document.getElementById('printSection').innerHTML
  const printWindow = window.open('', '', 'width=900,height=700')

  printWindow.document.write(`
    <html>
      <head>
        <title>Estimation Print</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f2f2f2; }
          h3 { margin-top: 20px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.print()
}

</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Estimations</h1>
    </div>
    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
      <p class="mt-3 text-gray-500">Loading Estimations...</p>
    </div>
    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center py-6">
      {{ error }}
    </div>
    <!-- Empty -->
    <div v-else-if="estimations.length === 0" class="text-center py-6 text-gray-500">
      No Estimation found
    </div>

    <BaseTable
      v-else
      :columns="columns"
      :rows="estimationsFormatted"
      selectable
      searchable
      show-toolbar
      show-page-size
      :per-page-options="[10, 20, 50, 100]"
      :default-per-page="10"
      row-key="id"
      :compact="true"
      :max-height="500"
      @update:selected="handleEstimationSelect"
      empty-text="No estimations found"
    >
      <!-- Estimation Status Slot -->
      <template #cell-estimation_status="{ row }">
        <span
          class="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
        >
          {{ row.estimation_status }}
        </span>
      </template>

      <!-- Payment Status Slot -->
      <template #cell-payment_status="{ row }">
        <span
          class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
        >
          {{ row.payment_status }}
        </span>
      </template>

      <!-- Actions -->
      <template #actions="{ row }">
        <ThreeDotsButton
          :actions="getActions(row)"
          :is-open="openDropdown === row.id"
          @toggle="toggleDropdown(row.id)"
          @close="openDropdown = null"
        />
      </template>
    </BaseTable>

    <!-- Modal here -->
    <BaseModal
      v-model="showMaterialModal"
      title="Estimate Materials"
      :showCancel="true"
      confirmText="Save Estimation"
      @close="showMaterialModal = false"
      @confirm="saveMaterialEstimation"
    >
      <!-- Modal Body -->
      <div class="p-2 max-h-[400px] overflow-y-auto">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Order {{ selectedEstimation.order_code }} — {{ selectedEstimation?.applicant?.first_name }} {{ selectedEstimation?.applicant?.last_name }}
        </p>

        <table class="w-full text-sm text-left">
          <thead
            class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs"
          >
            <tr>
              <th class="px-4 py-3">Material</th>
              <th class="px-4 py-3">Size</th>
              <th class="px-4 py-3 text-center">Qty</th>
              <th class="px-4 py-3 text-center">Unit Price</th>
              <th class="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="mat in materials"
              :key="mat.work_order_material_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td class="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                {{ mat.material_name }}
              </td>

              <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                {{ mat.size }}
              </td>

              <td class="px-4 py-3 text-center">{{ mat.quantity }}</td>

              <td class="px-4 py-3 text-center">
                <input
                  type="number"
                  v-model="mat.unit_price"
                  @input="calculateLineTotal(mat)"
                  class="w-24 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </td>

              <td class="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">
                {{ mat.total }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Grand Total -->
        <div class="text-lg font-semibold mt-4 text-right text-gray-800 dark:text-gray-100">
          Grand Total:
          <span class="text-blue-600 dark:text-blue-400">
            {{ materials.reduce((sum, m) => sum + Number(m.total || 0), 0) }}
          </span>
        </div>
      </div>
    </BaseModal>

    <!-- Charge Modal -->
    <BaseModal
      v-model="showChargeModal"
      title="Add Other Charges"
      :showCancel="true"
      confirmText="Save Charges"
      :loading="loading"
      @close="showChargeModal = false"
      @confirm="saveCharges"
    >
      <!-- Modal Body -->
      <div class="p-2">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Charge Name</th>
              <th class="px-4 py-3 text-right">Total Price</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="charge in charges" :key="charge.other_charge_id">
              <td class="px-4 py-3">{{ charge.charge_name }}</td>
              <td class="px-4 py-3 text-right">
                <input
                  type="number"
                  v-model="charge.total_price"
                  class="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Total -->
        <div class="text-lg font-semibold mt-4 text-right">
          Total: {{ charges.reduce((sum, c) => sum + Number(c.total_price || 0), 0) }}
        </div>
      </div>
    </BaseModal>

    <!-- View Estimation Modal -->
    <BaseModal
      v-model="showViewModal"
      title="Estimation Details"
      :showCancel="true"
      confirmText="Print"
      @close="showViewModal = false"
     @confirm="handlePrint"
    >
      <div id="printSection" class="p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Order {{ selectedEstimation.order_code }} — {{ selectedEstimation.applicant?.name }}
        </p>

        <!-- Materials -->
        <h3 class="font-semibold mb-2">Materials</h3>
        <table class="w-full text-sm text-left mb-4">
          <thead
            class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs"
          >
            <tr>
              <th class="px-4 py-2">Material</th>
              <th class="px-4 py-2">Size</th>
              <th class="px-4 py-2 text-center">Qty</th>
              <th class="px-4 py-2 text-right">Unit Price</th>
              <th class="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="viewData.materials.length === 0">
              <td colspan="5" class="text-center py-4 text-gray-500 dark:text-gray-400">
                Not Found
              </td>
            </tr>
            <tr v-for="mat in viewData.materials" :key="mat.work_order_material_id">
              <td class="px-4 py-2">{{ mat.material_name }}</td>
              <td class="px-4 py-2">{{ mat.size }}</td>
              <td class="px-4 py-2 text-center">{{ mat.quantity }}</td>
              <td class="px-4 py-2 text-right">{{ mat.unit_price }}</td>
              <td class="px-4 py-2 text-right font-semibold">{{ mat.total }}</td>
            </tr>
          </tbody>
          <tfoot v-if="viewData.materials.length > 0">
            <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
              <td colspan="4" class="px-4 py-2 text-right">Total Material Cost:</td>
              <td class="px-4 py-2 text-right">{{ totalMaterialCost }}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Charges -->
        <h3 class="font-semibold mb-2">Other Charges</h3>
        <table class="w-full text-sm text-left mb-4">
          <thead class="bg-gray-100 dark:bg-gray-800 text-xs uppercase">
            <tr>
              <th class="px-4 py-2">Charge Name</th>
              <th class="px-4 py-2 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="viewData.charges.length === 0">
              <td colspan="2" class="text-center py-4 text-gray-500 dark:text-gray-400">
                Not Found
              </td>
            </tr>
            <tr v-for="c in viewData.charges" :key="c.other_charge_id">
              <td class="px-4 py-2">{{ c.charge_name }}</td>
              <td class="px-4 py-2 text-right">{{ c.total_price }}</td>
            </tr>
          </tbody>
          <tfoot v-if="viewData.charges.length > 0">
            <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
              <td class="px-4 py-2 text-right">Total Charges:</td>
              <td class="px-4 py-2 text-right">{{ totalChargeCost }}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Grand Total -->
        <div class="text-lg font-bold mt-4 text-right text-blue-600 dark:text-blue-400">
          Grand Total: {{ grandTotal }}
        </div>

        <!-- <button
          @click="printEstimation"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print
        </button> -->
      </div>
    </BaseModal>
  </div>
</template>
