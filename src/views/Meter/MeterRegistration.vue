<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { onMounted } from 'vue'
import api from '@/plugins/axios';
const showModal = ref(false)
const loading = ref(false)
const meters = ref([])

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
  meter_size: '',
  status: ''
})
const errors = ref({})
const fetchMeters = () => {
  api.get('/meters')
    .then(res => {
      meters.value = res.data
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
  form.status=''
  // Object.keys(errors).forEach(k => delete errors[k])
}
const saveMeter = () => {
  loading.value = true
   errors.value = {}
  // Object.keys(errors).forEach(k => delete errors[k])
const data = new FormData()
  data.append('meter_number', form.value.meter_number)
  data.append('meter_size', form.value.meter_size)
  data.append('status', form.value.status)
  

  api.post('/meters', data)
    .then((res) => {
      alert(
        `Meter created!`
      )
      fetchMeters()
      showForm.value = false
      closeModal()
    })
    .catch(error => {
      if (error.res?.data?.errors) {
        Object.assign(errors, error.res.data.errors)
      }
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
   fetchMeters()
})
</script>

<template>

  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Meters</h1>
      <button @click="openModal" class="px-4 py-2 rounded-md font-semibold transition-colors duration-300
               bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
        Add Meter
      </button>

    </div>
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-200 dark:border-gray-900">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">#</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Meter Number</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Meter Size</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Status</th>

            <th class="p-3 border border-gray-200 dark:border-gray-700 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
            <tr
            v-for="(meter, index) in meters"
            :key="meter.id"
            class="hover:bg-gray-50"
          >



            <td class="p-3 border">{{ index + 1 }}</td>
            <td class="p-3 border">{{ meter.meter_number }}</td>
            <td class="p-3 border">{{ meter.meter_size }}</td>


            <td class="p-3 border relative">
              <!-- Dropdown button -->
              <!-- <button @click="toggleDropdown(meter.id)"
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
                Actions ▾
              </button> -->

              <!-- Dropdown menu -->
              <!-- <div v-if="openDropdown === meter.id"
                class="absolute right-3 mt-2 w-32 bg-white dark:bg-gray-700 border rounded shadow-lg z-50">
                <button @click="editMeter(meter)"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                  Edit
                </button>

                <button @click="updateStatus(meter.id, 'assigned')"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-green-600">
                  Assigned
                </button>

                <button @click="updateStatus(meter.id, 'unassigned')"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600">
                  Not Assigned
                </button>
              </div> -->
            </td>

          </tr>
          <tr v-if="meters.length === 0">
            <td colspan="4" class="text-center p-4 text-gray-500">
              No meters registered
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">

        <h2 class="text-lg font-semibold mb-4">
          Register Meter
        </h2>

        <!-- Meter Number -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">
            Meter Number
          </label>
          <input v-model="form.meter_number" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          <p v-if="errors.meter_number" class="text-red-500 text-sm">
            {{ errors.meter_number[0] }}
          </p>
        </div>

        <!-- Meter Size -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Meter Size
          </label>
          <input v-model="form.meter_size" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />

          <p v-if="errors.meter_size" class="text-red-500 text-sm">
            {{ errors.meter_size[0] }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 border rounded" @click="closeModal">
            Cancel
          </button>

          <button class="px-4 py-2 bg-green-600 text-white rounded" :disabled="loading" @click="saveMeter">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
         
        </div>
        
      </div>
    </div>
  </div>
</template>