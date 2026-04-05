<script setup>
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import { ArrowPathIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import api from '@/plugins/axios.js'
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import Kebele from '@/views/administrative/Kebele.vue'

const headers = [
  { label: 'Kebele Name', key: 'kebele_name' },
  { label: 'City', key: 'city' },
  { label: 'Woreda', key: 'woreda' },
  { label: 'Description', key: 'description' },
]

const tableLoading = ref(false)
const kebeles = ref([])
const cities = ref([])
const woredas = ref([])

const showModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const editingKebele = ref(null)
const kebeleToDelete = ref(null)

const kebeleName = ref('')
const selectedCity = ref('')
const selectedWoreda = ref('')
const description = ref('')
const search = ref('')

const statusMessage = ref('')
const status = ref('')
const submitting = ref(false)
const errors = ref({})
const hasSubmitted = ref(false)

function validateForm() {
  const validationErrors = {}

  if (!kebeleName.value.trim()) {
    validationErrors.kebele_name = 'Kebele Name is required.'
  }

  if (!selectedCity.value && !selectedWoreda.value) {
    validationErrors.location = 'Please select either a City or a Woreda.'
  }

  errors.value = validationErrors

  return Object.keys(validationErrors).length === 0
}
const filteredKebeles = computed(() => {
  if (!search.value) return kebeles.value
  const query = search.value.toLowerCase()
  return kebeles.value.filter(k =>
    k.kebele_name.toLowerCase().includes(query) ||
    k.city?.city_name?.toLowerCase().includes(query) ||
    k.woreda?.woreda_name?.toLowerCase().includes(query)
  )
})

const filteredWoredas = computed(() => {
  if (!selectedCity.value) return woredas.value
  return woredas.value.filter(w => w.city_id === selectedCity.value)
})

watch(selectedCity, () => {
  selectedWoreda.value = ''
})
async function fetchCities() { 
  try {
    tableLoading.value= true;
    const res = await api.get("/cities")
    cities.value = res.data.cities
  } catch (error) {
    cities.value= []
  } finally{
    tableLoading.value= false
  }
}
async function fetchKebeles() { 
  try {
    tableLoading.value= true;
    const res = await api.get("/kebeles")
    kebeles.value = res.data
  } catch (error) {
    kebeles.value= []
  } finally{
    tableLoading.value= false
  }
}
async function fetchWoredas() { 
  try {
    tableLoading.value= true;
    const res = await api.get("/woredas")
    woredas.value = res.data
  } catch (error) {
    woredas.value= []
  } finally{
    tableLoading.value= false
  }
}
async function refreshData() {
  tableLoading.value = true
  try {
    await fetchCities()
    await fetchKebeles()
    await fetchWoredas()
  } catch {
    showStatus('Failed to fetch data', 'error')
  } finally {
    tableLoading.value = false
  }
}
function showStatus(message, type = 'success', duration = 3000) {
  statusMessage.value = message
  status.value = type
  setTimeout(() => {
    statusMessage.value = ''
    status.value = ''
  }, duration)
}
function resetForm() {
  kebeleName.value = ''
  selectedCity.value = ''
  selectedWoreda.value = ''
  description.value = ''
  editingKebele.value = null
  errors.value = {}
  hasSubmitted.value = false
}
async function addKebele() {
  hasSubmitted.value = true
   if (!validateForm()) return

  submitting.value = true
  errors.value = {}

  try {
    const payload = {
      kebele_name: kebeleName.value,
      city_id: selectedCity.value || null,
      woreda_id: selectedWoreda.value || null,
      description: description.value || null
    }

    const response = await api.post('/kebeles', payload)
    showStatus(response.data.message, response.data.status)  
    showModal.value= false;  
    resetForm()
    await refreshData()
  } catch (error) {
    errors.value = error.response?.data?.errors || {}
  } finally {
    submitting.value = false
  }
}
function openEdit(kebele) {
  editingKebele.value = kebele
  kebeleName.value = kebele.kebele_name
  selectedCity.value = kebele.city_id
  selectedWoreda.value = kebele.woreda_id
  description.value = kebele.description
  showEditModal.value = true
}
async function updateKebele() {
  hasSubmitted.value = true
   if (!validateForm()) return

  submitting.value = true
  errors.value = {}
  try {
    const payload = {
      kebele_name: kebeleName.value,
      city_id: selectedCity.value || null,
      woreda_id: selectedWoreda.value || null,
      description: description.value || null
    }

    const response = await api.put(`/kebeles/${editingKebele.value.id}`, payload)
    if (response) {
      showEditModal.value = false
    }
    showStatus(response.data.message, response.data.status)
    await refreshData()
  } catch (error) {
    if(error.response?.status === 422) {
      errors.value = error.response?.data?.errors || {}
    } else{
      errors.value = error.response?.data?.errors || {}
    }
    
    
  } finally {
    submitting.value = false
  }
}
function confirmDelete(kebele) {
  kebeleToDelete.value = kebele
  showDeleteModal.value = true
}
async function deleteConfirmed() {
  if (!kebeleToDelete.value) return
  submitting.value = true
  try {
    const response = await api.delete(`/kebeles/${kebeleToDelete.value.id}`)
    showStatus(response.data.message, response.data.status)
    showDeleteModal.value = false
    await refreshData()
  } catch {
    showStatus('Delete failed', 'error')
  } finally {
    submitting.value = false
  }
}
watch([selectedCity, selectedWoreda], () => {
  if (selectedCity.value || selectedWoreda.value) {
    delete errors.value.location
  }
})
watch(kebeleName, (val) => {
  if (val.trim()) {
    delete errors.value.kebele_name
  }
})

watch([selectedCity, selectedWoreda], () => {
  if (selectedCity.value || selectedWoreda.value) {
    delete errors.value.location
  }
})
onMounted(refreshData)
</script>

<template>
<div class="space-y-4 p-4 dark:bg-gray-900">
  <div class="fixed top-10 right-5 z-50">
      <transition name="fade-up">
        <div
          v-if="status === 'success' && statusMessage"
          class="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          {{ statusMessage }}
        </div>
      </transition>
    </div>
  <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-200/50">
    <h2 class="text-xl font-semibold text-indigo-600">Manage Kebeles</h2>
    <BaseButton 
    @click="showModal = true" 
  
    size="sm"
    key="Add kebele"
    className="whitespace-nowrap"> Add kebele </BaseButton>
          
  </div>
  <div v-if="tableLoading">
      <ArrowPathIcon class="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
      <p class="text-center mt-2">Loading {{locationType}}...</p>
    </div>
  <BaseTable
  v-else
    :columns="headers"
    :rows="filteredKebeles"
    searchable
    selectable
    showSearch
    empty-text="No kebeles found"
    :per-page-options="[10, 20, 50, 100]"
    :default-per-page="10"     
    :compact="true" 
    row-height="50px"      
    show-toolbar
    @update:selected="val => selectedLocations = val"
    class="shadow-lg rounded-lg">
     <template #cell-kebele_name="{ row }">
      {{ row?.kebele_name || '-' }}
    </template>
    <template #cell-city="{ row }">
      {{ row.city?.city_name || '-' }}
    </template>
    <template #cell-woreda="{ row }">{{ row.woreda?.woreda_name || '-' }}</template>
    <template #actions="{ row }">
      <ThreeDotsButton
        :actions="[
          { name: 'Edit', icon: PencilSquareIcon, onClick: () => openEdit(row) },
          { name: 'Delete', icon: TrashIcon, onClick: () => confirmDelete(row) }
        ]"
      />
    </template>
  </BaseTable>

  <BaseModal
   v-model="showModal"
   title="Add Kebele"
  iconType="primary"
  size="lg"
  :confirmText="submitting ? 'Saving...' : 'Save Kebele'"
  :confirmDisabled="submitting"
  @confirm="addKebele"
  @close="resetForm"
  :closeDisabled="submitting"
   >
    <form class="space-y-4">
      <div>
        <label class="block text-sm mb-1">Kebele Name</label>
        <BaseInput 
          v-model="kebeleName" 
          placeholder="Enter kebele name"
          :class="[errors.kebele_name ? 'border-red-500' : '']"/>
        <span v-if="errors.kebele_name" class="text-red-500 text-sm">{{ errors.kebele_name }}</span>
      </div>

      <div>
        <label class="block text-sm mb-1">City (Optional)</label>
        <BaseSelect 
        v-model="selectedCity" 
        :class="errors.location ? 'border-red-500' : ''" 
        :clearable = "true"
        :searchable  = "true"
        :options="cities.map(city=>({
          label:city.city_name,
          value:city.id
        }))"
        /> 
      </div>
      <div>
        <label class="block text-sm mb-1">Woreda (Optional)</label>
        <BaseSelect 
        v-model="selectedWoreda" 
        :class="errors.location ? 'border-red-500' : ''" 
        :clearable = "true"
        :searchable  = "true"
        :options="filteredWoredas.map(woreda=>({
          label:woreda.woreda_name,
          value:woreda.id
        }))"
        /> 
      </div>

      <div v-if="hasSubmitted && !selectedCity && !selectedWoreda">
        <p class="text-red-500 text-sm">Please select either a City or a Woreda.</p>
      </div>
      <div>
        <BaseTextarea
        v-model="description"
        label="Description"
        placeholder="Description..."
        class="dark:bg-gray-900"
        showCount
        clearable  />
      </div>
    </form>
  </BaseModal>
  <BaseModal 
  v-model="showEditModal" 
  title="Edit Kebele" 
  iconType="primary" 
  size="lg" 
  :confirmText="submitting ? 'Saving...' : 'Update Kebele'"
  :confirmDisabled="submitting"
  @confirm="updateKebele"
  @close="resetForm">
    <form class="space-y-4">
      <div>

  <BaseInput
    v-model="kebeleName" label="Kebele Name"
    :class="errors.kebele_name ? 'border-red-500' : ''"
  />
  <span v-if="errors.kebele_name" class="text-red-500 text-sm">{{ errors.kebele_name }}</span>
</div>
 <div>
    <label class="block text-sm mb-1">City (Optional)</label>
   <BaseSelect 
        v-model="selectedCity" 
        :class="errors.location ? 'border-red-500' : ''" 
        :clearable = "true"
        :searchable  = "true"
        :options="cities.map(city=>({
          label:city.city_name,
          value:city.id
        }))"
        />
        
      </div>

      <div>
        <label class="block text-sm mb-1">Woreda (Optional)</label>

        <BaseSelect 
        v-model="selectedWoreda" 
        :class="errors.location ? 'border-red-500' : ''" 
        :clearable = "true"
        :searchable  = "true"
        :options="filteredWoredas.map(woreda=>({
          label:woreda.woreda_name,
          value:woreda.id
        }))"
        />
      </div>

      <div v-if="hasSubmitted && !selectedCity && !selectedWoreda">
        <p class="text-red-500 text-sm">Please select either a City or a Woreda.</p>
      </div>

      <div>
      <BaseTextarea
        v-model="description"
        label="Description"
        placeholder="Description..."
        class="dark:bg-gray-900"
        showCount
        clearable  />      
      </div>

      
    </form>
  </BaseModal>
  <BaseModal v-model="showDeleteModal" title="Confirm Delete" iconType="danger" size="sm">
    <div class="space-y-4">
      <p>Are you sure you want to delete <strong>{{ kebeleToDelete?.kebele_name }}</strong>?</p>
      <div class="flex justify-end gap-2">
        <BaseButton @click="showDeleteModal = false" class="px-4 py-2 rounded-lg border border-gray-300">Cancel</BaseButton>
        <BaseButton @click="deleteConfirmed" :disabled="submitting" class="px-4 py-2 rounded-lg bg-red-600 text-white">
          {{ submitting ? 'Deleting...' : 'Delete' }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
  </div>

</template>