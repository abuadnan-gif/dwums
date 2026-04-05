<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'
import api from '@/plugins/axios'
import { watch } from 'vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

import BaseTable from '@/components/ui/BaseTable.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'

import BaseButton from '@/components/ui/BaseButton.vue'

const showModal = ref(false)
const loading = ref(false)
const meters = ref([])
const errors = ref({})
const openDropdown = ref(null)

watch(showModal, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

const toggleDropdown = (meterId) => {
  openDropdown.value = openDropdown.value === meterId ? null : meterId
}

// const openDropdown = ref(null)

// Toggle dropdown per row
// const toggleDropdown = (userId) => {
//   openDropdown.value = openDropdown.value === meterId ? null : meterId
// }
// Edit action
// const editMeter = (meter) => {
//   openDropdown.value = null
//   console.log('Edit Meter:', meter)

// }

const form = ref({
  meter_number: '',
  meter_size: ''
  // status: ''
})
const error = ref('')

const fetchMeters = () => {
  loading.value = true
  error.value = ''
  api
    .get('/meters')
    .then((res) => {
      meters.value = res.data.meters
    })
    .catch(() => {
      error.value = 'Failed to load meters'
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 2000)
    })
}
const openModal = () => {
  resetForm()
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

const resetForm = () => {
  form.meter_number = ''
  form.meter_size = ''
  // form.status=''
  // Object.keys(errors).forEach(k => delete errors[k])
}
const saveMeter = () => {
  loading.value = true
  errors.value = {}
  // Object.keys(errors).forEach(k => delete errors[k])
  const data = new FormData()
  data.append('meter_number', form.value.meter_number)
  data.append('meter_size', form.value.meter_size)
  // data.append('status', form.value.status)

  api
    .post('/meters', data)
    .then((res) => {
      alert(`Meter created!`)
      fetchMeters()
      resetForm()
      closeModal()
    })
    .catch((error) => {
      error.value = 'Failed to load meters'
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 2000)
    })
}
onMounted(() => {
  fetchMeters()
})

const columns = [
  { label: '#', key: 'index' },
  { label: 'Meter Number', key: 'meter_number' },
  { label: 'Meter Size', key: 'meter_size' }
]

const metersWithIndex = computed(() =>
  meters.value.map((meter, index) => ({
    ...meter,
    index: index + 1
  }))
)
</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Meters</h1>
      <BaseButton
        @click="openModal"
        class="px-4 py-2 rounded-md font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add Meter
      </BaseButton>
    </div>
    <!-- Loading state -->
   <div v-if="loading" class="p-8 text-center">
          <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
          <p class="mt-3 text-gray-500">Loading Meters...</p>
        </div>
    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-center py-6">
      {{ error }}
    </div>
    <!-- Empty -->
    <div v-else-if="meters.length === 0" class="text-center py-6 text-gray-500">
      No meters found
    </div>

    <div v-else>
      <BaseTable :columns="columns" :rows="metersWithIndex">
        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              {
                name: 'Edit',
                icon: 'PencilIcon',
                color: 'info',
                onClick: () => editMeter(row)
              },
            
              {
                name: 'Delete',
                icon: 'TrashIcon',
                color: 'critical',
                onClick: () => deleteMeter(row.id)
              }
            ]"
            :is-open="openDropdown === row.id"
            @toggle="toggleDropdown(row.id)"
            @close="openDropdown = null"
          />
        </template>
      </BaseTable>
    </div>
    <!-- Mter Modal -->
    <BaseModal v-model="showModal" title="Register Meter" :loading="loading">
      <div class="space-y-4">
        <BaseInput
          v-model="form.meter_number"
          label="Meter Number"
          placeholder="Enter meter number"
        />

        <BaseInput v-model="form.meter_size" label="Meter Size" placeholder="Enter meter size" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 rounded bg-gray-500 text-white">
            Cancel
          </button>

          <button
            @click="saveMeter"
            class="px-4 py-2 rounded bg-blue-600 text-white"
            :disabled="loading"
          >
            Save
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
