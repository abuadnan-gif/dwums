<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios' // your axios instance
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useToast } from 'vue-toastification'
import Icon from '@/components/Icon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
// import OtherChargesComponent from '@/views/OtherCharges/otherCharges.vue'

const toast = useToast()
const otherCharges = ref([])

const loading = ref(false)
const showModal = ref(false)
const modalMode = ref('add')
const selectedCharge = ref({ charge_name: '', id: null })
const openDropdown = ref(null)
const errors = ref({})

const showDeleteModal = ref(false)
const chargeToDelete = ref(null)

const confirmDelete = (row) => {
  chargeToDelete.value = row
  showDeleteModal.value = true
}


// Fetch charges on mount
const fetchCharges = async () => {
  loading.value = true
  try {
    const response = await api.get('/other_charges')
    otherCharges.value = response.data.other_charges
    loading.value = false
  } catch (error) {
    toast.error(error)
  }
}

onMounted(fetchCharges)

// Open Add Modal
const openAddModal = () => {
  modalMode.value = 'add'
  selectedCharge.value = { charge_name: '', id: null }
  showModal.value = true
}

// Open Edit Modal
const openEditModal = (row) => {
  modalMode.value = 'edit'
  selectedCharge.value = { ...row } // prefill data
  showModal.value = true
}

// Save Charge (Add/Edit)
const saveCharge = async () => {
  loading.value = true
  try {
    if (modalMode.value === 'add') {
      await api.post('/other_charges', {
        charge_name: selectedCharge.value.charge_name
      })

      toast.success('Other Charges saved successfully!')
    } else {
      await api.put(`/other_charges/${selectedCharge.value.id}`, {
        charge_name: selectedCharge.value.charge_name
      })

      toast.success('Other Charges updated successfully!')
    }

    await fetchCharges()
    showModal.value = false
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Better validation message
      const errors = error.response.data.errors
      const firstError = Object.values(errors)[0][0]

      toast.error(firstError)
    } else {
      toast.error('Something went wrong!')
    }
  } finally {
    loading.value = false
  }
}

// Delete Charge
const deleteCharge = async () => {
  if (!chargeToDelete.value) return

  loading.value = true
  try {
    await api.delete(`/other_charges/${chargeToDelete.value.id}`)
    toast.success('Deleted successfully!')
    await fetchCharges()
    showDeleteModal.value = false
    chargeToDelete.value = null
  } catch (error) {
    toast.error('Failed to delete charge')
  } finally {
    loading.value = false
  }
}

// Toggle dropdown
const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const columns = [{ label: 'Charge Name', key: 'charge_name' }]

const handleSelected = (selected) => {
  console.log('Selected Rows:', selected)
}
</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Other Charges</h1>

      <BaseButton
        @click="openAddModal"
        class="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add Charge
      </BaseButton>
    </div>
  </div>
  <div v-if="loading" class="p-8 text-center">
    <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
    <p class="mt-3 text-gray-500">Loading other Charges...</p>
  </div>
  <!-- Error -->
  <div v-else-if="error" class="text-red-600 text-center py-6">
    {{ error }}
  </div>
  <!-- Empty -->
  <div
    v-else-if="Array.isArray(otherCharges) && otherCharges.length === 0"
    class="text-center py-6 text-gray-500"
  >
    No Other Charges found
  </div>
  <div v-else>
    <BaseTable
      :columns="columns"
      :rows="otherCharges"
      :loading="loading"
      selectable
      searchable
      show-toolbar
      row-key="id"
      compact
      @update:selected="handleSelected"
    >
      <!-- Actions Column -->
      <template #actions="{ row }">
        <ThreeDotsButton
          :actions="[
            { name: 'Edit', icon: 'PencilIcon', color: 'info', onClick: () => openEditModal(row) },
            {
              name: 'Delete',
              icon: 'TrashIcon',
              color: 'critical',
              onClick: () => confirmDelete(row)
            }
          ]"
          :is-open="openDropdown === row.id"
          @toggle="toggleDropdown(row.id)"
          @close="openDropdown = null"
        />
      </template>
    </BaseTable>

    <!-- Modal for Add/Edit -->
    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="modalMode === 'add' ? 'Add Charge' : 'Edit Charge'"
      confirmText="Save"
      :loading="loading"
      @confirm="saveCharge"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="block mb-1 font-medium">Charge Name</label>
          <BaseInput type="text" v-model="selectedCharge.charge_name" />
          <p v-if="errors.charge_name" class="text-red-500 text-sm mt-1">
            {{ errors.charge_name[0] }}
          </p>
        </div>
      </div>
    </BaseModal>

    <BaseModal
  v-model="showDeleteModal"
  title="Confirm Delete"
  confirmText="Delete"
  :loading="loading"
  @confirm="deleteCharge"
>
  <p>Are you sure you want to delete <strong>{{ chargeToDelete?.charge_name }}</strong>?</p>
</BaseModal>
  </div>
</template>
