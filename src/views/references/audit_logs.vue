<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/plugins/axios'
import DataTable from '@/components/ui/BaseTable.vue'
import BaseInput from '@/components/ui/baseInput.vue'
import { useToast } from 'vue-toastification'
import { filter } from 'lodash'

const auditlogs = ref([])
const filteractions = ref('')
const toast = useToast()

const actionOptions = [
  { value: 'Updated', label: 'Update' },
  { value: 'Deleted', label: 'Delete' }
]
const fetchauditlogs = async () => {
  try {
    const response = await api.get('/auditlogs', {
      params: { action: filteractions.value }
    }) // Check what the API returns
    auditlogs.value = response.data
  } catch (e) {
    console.error(e)
    toast.error('Error fetching audit logs!')
  }
}

onMounted(() => {
  fetchauditlogs()
})
watch(filteractions, () => {
  fetchauditlogs()
})

const filters = ref({
  action: '',
  user_id: '',
  from: '',
  to: '',
  search: ''
})

const applyFilters = () => {
  fetchauditlogs()
}

const resetFilters = () => {
  filters.value = {
    action: '',
    user_id: '',
    from: '',
    to: '',
    search: ''
  }
  fetchauditlogs()
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h5 class="p-6">Audit Logs Managment</h5>
    </div>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="w-40">
          <BaseInput
            type="select"
            label="Action"
            v-model="filters.action"
            :options="actionOptions"
          />
        </div>
        <div class="w-48">
         <BaseInput
         type="select"
         label="User"
         v-model="filter.user_id"
         :options="userOptions"
         />
        </div >
<!-- From Date -->
    <div class="w-40">
      <BaseInput
        type="date"
        label="From"
        v-model="filters.from"
      />
    </div>

    <!-- To Date -->
    <div class="w-40">
      <BaseInput
        type="date"
        label="To"
        v-model="filters.to"
      />
    </div>
    <!-- Buttons -->
    <div class="flex gap-2">
      <button
        @click="applyFilters"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
      >
        Apply
      </button>

      <button
        @click="resetFilters"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow"
      >
        Reset
      </button>
    </div>
      </div>
    </div>
    <DataTable
      :columns="[
        { key: 'index', label: 'Index' },
        { key: 'action', label: 'Action' },
        { key: 'user_id', label: 'user_id' },
        { key: 'description', label: 'description' },
        { key: 'ip_address', label: 'Ip Address' }
      ]"
      :rows="auditlogs"
      selectable
    >
    </DataTable>
  </div>
</template>
