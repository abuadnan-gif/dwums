<script setup>
import api from '@/plugins/axios';
import { ref, computed, watch } from 'vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseTable from '@/components/ui/BaseTable.vue';
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue';
import Icon from '@/components/Icon.vue'

import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import { sub } from 'date-fns';
import BaseButton from '@/components/ui/BaseButton.vue'

const filterRegion = ref('');
const filterZone = ref('');
const tableLoading = ref(false)
const locationToDelete = ref(null)
const showDeleteModal = ref(false) 

const errors = ref({})
const hasSubmitted = ref(false)

const submitting = ref(false);
const locationType = ref('regions');
const showLocationModal = ref(false);
const isEditing = ref(false);
const selectedRow = ref(null);
const selectedLocations = ref([])
const RegionCode= ref()
const regionLocations = ref([]);
const zoneLocations = ref([]);
const woredaLocations = ref([]);
const cityLocations = ref([]);
const statusMessage= ref()
const status= ref()
const actionType= ref(false)
const locationDescription  = ref('')

const filteredTableRows = computed(() => {
  let rows = tableRows.value;
  if (filterRegion.value) rows = rows.filter(row => row.region_id == filterRegion.value);
  if ((locationType.value === 'woredas' || locationType.value === 'cities') && filterZone.value) {
    rows = rows.filter(row => row.zone_id == filterZone.value);
  }
  return rows;
});
function resetFilters() {
  filterRegion.value = '';
  filterZone.value = '';
}
const labelMap = {
  regions: 'Region',
  zones: 'Zone',
  woredas: 'Woreda',
  cities: 'City'
}

const childLocationTypes = computed(() => {
  switch (locationType.value) {
    case 'regions': return ['regions','zones', 'woredas', 'cities']
    case 'zones': return ['zones','woredas', 'cities']
    case 'woredas': return ['woredas']
    case 'cities': return ['cities']
    default: return []
  }
})

function openAddChildModal(type) {
  locationType.value = type
  openAddModal()
}
const form = ref({
  name: '',
  region_id: '',
  zone_id: ''
});

function validateForm() {
  const validationErrors = {}

  if (!form.value.name?.trim()) {
    
    validationErrors.name = `${locationType.value.slice(0,-1)} name is required`
  }
   else if (!/^[\p{L}\s]+$/u.test(form.value.name.trim())) {
  
  validationErrors.name = `${locationType.value.slice(0,-1)} name must contain letters only`
}

  if (locationType.value !== 'regions' && !form.value.region_id) {
    
    validationErrors.region_id = 'Region is required'
  }

  if (
    (locationType.value === 'woredas' || locationType.value === 'cities') &&
    !form.value.zone_id
  ) {
    validationErrors.zone_id = 'Zone is required' 
  
  }

  errors.value = validationErrors
 
  return Object.keys(validationErrors).length === 0
}
const tableColumns = computed(() => {
  switch (locationType.value) {
    case 'regions':
      return [
        { key: 'name', label: 'Region Name', sortable: true },
        { key: 'region_code', label: 'Region Code', sortable: true },
        { key: 'description', label: 'Description', sortable: true }
        
      ];
    case 'zones':
      return [
        { key: 'name', label: 'Zone Name', sortable: true },
        { key: 'region_name', label: 'Region', sortable: true },
        
      ];
    case 'woredas':
      return [
        { key: 'name', label: 'Woreda Name', sortable: true },
        { key: 'zone_name', label: 'Zone', sortable: true },
        { key: 'region_name', label: 'Region', sortable: true },
      
      ];
    case 'cities':
      return [
        { key: 'name', label: 'City Name', sortable: true },
        { key: 'zone_name', label: 'Zone', sortable: true },
        { key: 'region_name', label: 'Region', sortable: true },
  
      ];
    default:
      return [];
  }
});

const tableRows = computed(() => {
  switch (locationType.value) {
    case 'regions':
      return regionLocations.value.map(r => ({
        id: r.id,
        name: r.region_name,
        region_code: r.region_code,
        description: r.description
      }));

    case 'zones':
      return zoneLocations.value.map(z => ({
        id: z.id,
        name: z.zone_name,
        region_name: z.region?.region_name || '—',
        region_id: z.region_id,
        description: z.description
      }));

    case 'woredas':
      return woredaLocations.value.map(w => ({
        id: w.id,
        name: w.woreda_name,
        zone_name: w.zone?.zone_name || '—',
        region_name: w.region?.region_name || '—',
        region_id: w.region_id,
        zone_id: w.zone_id,
        description: w.description
      }));

    case 'cities':
      return cityLocations.value.map(c => ({
        id: c.id,
        name: c.city_name,
        zone_name: c.zone?.zone_name || '—',
        region_name: c.region?.region_name || '—',
        region_id: c.region_id,
        zone_id: c.zone_id,
        description: c.description
      }));

    default:
      return [];
  }
});

const totalItems = computed(() => tableRows.value.length);

const modalTitle = computed(() => isEditing.value ? `Update ${locationType.value.slice(0, -1)}` : `New ${locationType.value.slice(0, -1)}`);
const modalIcon = computed(() => isEditing.value ? 'PencilIcon' : 'PlusIcon');
const modalBadge = computed(() => isEditing.value ? 'info' : 'success');


function openAddModal() {
  resetForm();
  errors.value = {}
  hasSubmitted.value = false
  isEditing.value = false
  selectedRow.value = null
  showLocationModal.value = true
}
function saveLocation(){
   hasSubmitted.value = true
   submitting.value= false
  if (!validateForm()){ return 
  } 
  if (isEditing.value) {
    updateLocation();
  } else {
    addLocation();
  }
}

async function openEditLocation(row) {
  if (!row) return;

  isEditing.value = true;
  errors.value = {}
  selectedRow.value = row;
  submitting.value = false;

  form.value.name = row.zone_name || row.woreda_name || row.city_name || row.region_name || '';
  form.value.region_id = row.region_id || row.region?.id || '';
  form.value.zone_id = row.zone_id || row.zone?.id || '';
  locationDescription.value = row.description || '';

  if ((locationType.value === 'woredas' || locationType.value === 'cities') && form.value.region_id) {
    try {
      const response = await api.get(`/zones?region_id=${form.value.region_id}`);
      zoneLocations.value = response.data;

      const currentZoneExists = zoneLocations.value.some(z => z.id === form.value.zone_id);
      if (!currentZoneExists && form.value.zone_id) {
       
        const zoneResponse = await api.get(`/zones/${form.value.zone_id}`);
        zoneLocations.value.push(zoneResponse.data);
      }
    } catch (error) {
      zoneLocations.value = [];
    }
  }

  showLocationModal.value = true;
}


  function resetForm() {
  form.value = {
    name: '',
    region_id: '',
    zone_id: ''
  }
  locationDescription.value = ''
  locationToDelete.value= ''
  RegionCode.value = ''
  errors.value = {}
  hasSubmitted.value = false
  submitting.value = false
  selectedRow.value = null
  isEditing.value = false
}
function openDeleteLocation(row) {
  locationToDelete.value = row
  showDeleteModal.value = true
}
async function deleteLocation(row) {
    try { 
      hasSubmitted.value= true
     if (locationType.value==='regions') {
        const response = await api.delete(`/regions/${row.id}`)
        if(response){
          showDeleteModal.value= false
        }
        statusMessage.value= response.data.message;
        status.value =response.data.status;

      }
      else if (locationType.value==='zones') {
         const response = await api.delete(`/zones/${row.id}`)
         if(response){
          showDeleteModal.value= false
        }
        statusMessage.value= response.data.message;
        status.value =response.data.status;
      }
      else if (locationType.value==='woredas') {
        const response = await api.delete(`/woredas/${row.id}`)
         if(response){
          showDeleteModal.value= false
        }
        statusMessage.value= response.data?.message;
        status.value =response.data?.status;
      }
      else if (locationType.value==='cities') {
        const response = await api.delete(`/cities/${row.id}`)
         if(response){
          showDeleteModal.value= false
        }
        statusMessage.value= response.data.message;
        status.value =response.data.status;
      }
    

  } catch (error) {
    if (error.response?.data?.errors) {
      const errors = error.response?.data.errors;
      statusMessage.value = Object.values(errors).flat().join(', ');
      status.value = "error"
    } else {
     statusMessage.value =  error.response?.data?.message;
     status.value = "error"
    }
  }
  finally{
   if (locationType.value === 'regions') fetchRegions()
   if (locationType.value === 'zones') fetchZones()
   if (locationType.value === 'woredas') fetchWoredas()
   if (locationType.value === 'cities') fetchCities()
    resetForm()
  hasSubmitted.value= false
  locationToDelete.value = null
    setTimeout(()=>{
      statusMessage.value= ''
      status.value = ''
    },2000)
  }
  
}


async function addLocation() {
   if (submitting.value) 
    return; 
  submitting.value = true;
  
    try {
      if (locationType.value==='regions') {
        const response = await api.post('/regions', {
          region_name: form.value.name,
          regionCode: RegionCode.value,
          description: locationDescription.value})
          if (response) {
            showStatus(response.data?.message,response.data?.status)
          }
      }
      else if (locationType.value==='zones') {
           const response = await api.post('/zones', {
          region_id: form.value.region_id,
          zone_name:form.value.name,
          description: locationDescription.value})
          if (response) {
            showStatus(response.data?.message,response.data?.status)
          }
      }
      else if (locationType.value==='woredas') {
         const response = await api.post('/woredas', {
          region_id: form.value.region_id,
          zone_id: form.value.zone_id,
          woreda_name: form.value.name,
          description: locationDescription.value})
         if (response) {
            showStatus(response.data?.message,response.data?.status)
          }
      }
      else if (locationType.value==='cities') {
         const response = await api.post('/cities', {
          region_id: form.value.region_id,
          zone_id: form.value.zone_id,
          city_name: form.value.name,
          description: locationDescription.value})
        if (response) {
            showStatus(response.data?.message,response.data?.status)
          }
      }
      showLocationModal.value= false;
      await fetchData(locationType.value)
    
  } catch (error) {
    if (error.response?.status===422) {
      errors.value  = error.response?.data?.errors;
    }
    submitting.value = false
    hasSubmitted.value= false;
  }
  finally{
   hasSubmitted.value= false
    
  }
}
function showStatus(message,type='success',duration=3000) {
  statusMessage.value= message;
  status.value= type;
  setTimeout(()=>{
    statusMessage.value= '';
    status.value= '';
  },duration)
}
async function updateLocation() {
    if (submitting.value) {
      return;
    }
    submitting.value= true;
    try {
      if (locationType.value==='regions') {
        const response = await api.put(`/regions/${selectedRow.value.id}`, {
          region_name: form.value.name,
          description: locationDescription.value})
          if (response) {
            showLocationModal.value= false;
            showStatus(response.data?.message || 'sucessfully Done', response.data?.status || 'sucess' )
          }
        }
      else if (locationType.value==='zones') {
         const response = await api.put(`/zones/${selectedRow.value.id}`, {
          region_id: form.value.region_id,
          zone_name:form.value.name,
          description: locationDescription.value})
        if (response) {
          showLocationModal.value= false;
            showStatus(response.data?.message || 'sucessfully Done', response.data?.status || 'success' )
          }
      }
      else if (locationType.value==='woredas') {
           const response = await api.put(`/woredas/${selectedRow.value.id}`, {
          region_id: form.value.region_id,
          zone_id:form.value.zone_id,
          woreda_name : form.value.name,
          description: locationDescription.value})
       if (response) {
        showLocationModal.value= false;
        showStatus(response.data?.message || 'sucessfully Done', response.data?.status || 'success' )
        }
      }
      else if (locationType.value==='cities') {
         const response = await api.put(`/cities/${selectedRow.value.id}`, {
          region_id: form.value.region_id,
          zone_id: form.value.zone_id,
          city_name: form.value.name,
          description: locationDescription.value})
          if (response) {
            showLocationModal.value= false;
            showStatus(response.data?.message || 'sucessfully Done', response.data?.status || 'success' )
          }
      }
      await fetchData(locationType.value)
      resetForm()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    }
    
  }
  finally{
    hasSubmitted.value= false; 
  }
}

function changeLocation(type) {
  locationType.value = type;
}
async function fetchRegions() { 
  try {
    tableLoading.value= true
   const response = await api.get('/regions'); 
   regionLocations.value = response.data;
  } catch (error) {
    regionLocations.value = []
  } finally{
    tableLoading.value = false
  }
}
async function fetchZones() { 
 try {
   tableLoading.value = true;
  const response = await api.get('/zones'); 
  zoneLocations.value = response.data;
 } catch (error) {
  zoneLocations.value = []
 } finally{
  tableLoading.value = false
 }

}
async function fetchWoredas() { 
  try {
    tableLoading.value= true
    
     const response = await api.get('/woredas')
    woredaLocations.value = response.data
  } catch (error) {
    woredaLocations.value = []
  } finally{
    tableLoading.value= false
  }
}
async function fetchCities() { 
  try {
    tableLoading.value= true
     const response = await api.get('/cities')
    cityLocations.value = response.data .cities
  } catch (_) {
    cityLocations.value = []
  } finally{
    tableLoading.value= false
  }
}
function getFullRow(id) {
  switch (locationType.value) {
    case 'regions': return regionLocations.value.find(r => r.id === id);
    case 'zones':   return zoneLocations.value.find(z => z.id === id);
    case 'woredas': return woredaLocations.value.find(w => w.id === id);
    case 'cities':  return cityLocations.value.find(c => c.id === id);
  }
}
async function fetchData(type) {
  switch (type) {
    case 'regions': await fetchRegions(); break;
    case 'zones': await fetchZones(); break;
    case 'woredas': await fetchWoredas(); break;
    case 'cities': await fetchCities(); break;
  }
}

watch(locationType, async (type) => {
  if (!tableRows.value.length) await fetchData(type);
}, { immediate: true });

watch(
  () => form.value.name,
  (newName) => {
    if (locationType.value !== 'regions') {
      RegionCode.value = '';
      return;
    }

    if (!newName) {
      RegionCode.value = '';
      return;
    }
    const commonWords = [
      'of', 'the', 'and', 'a', 'an', 'in', 'on', 'for', 'with', 
      'at', 'by', 'to', 'from', 'as', 'is', 'are', 'or', 'but', 
      'about', 'into', 'over', 'after', 'up', 'out', 'if', 'then'
    ];

    const words = newName.trim().split(/\s+/);
    const letters = words
      .filter(w => !commonWords.includes(w.toLowerCase()))
      .map(w => w.charAt(0).toUpperCase())
      .join('');

   
    let seqNumber = '001'; 
    if (selectedRow.value && selectedRow.value.id) {
      seqNumber = String(selectedRow.value.id).padStart(3, '0');
    } else {
      const maxId = regionLocations.value.length
        ? Math.max(...regionLocations.value.map(r => r.id))
        : 0;
      seqNumber = String(maxId + 1).padStart(3, '0');
    }

    RegionCode.value = `${letters}${seqNumber}`;
  }
);
watch(
  () => form.value.region_id,
  async (newRegionId) => {
    if (locationType.value !== 'woredas' && locationType.value !== 'cities') return;

    if (!isEditing.value) form.value.zone_id = ''; 
    zoneLocations.value = [];

    if (!newRegionId) return;

    try {
      const response = await api.get(`/zones?region_id=${newRegionId}`);
      zoneLocations.value = response.data;

      if (isEditing.value && selectedRow.value?.zone_id) {
        const exists = zoneLocations.value.some(z => z.id === selectedRow.value.zone_id);
        if (exists) form.value.zone_id = selectedRow.value.zone_id;
      }
    } catch (error) {
      zoneLocations.value = [];
    }
  }
);
watch(() => form.value.name, (val) => {
  if (val?.trim()) delete errors.value.name
})

watch(() => form.value.region_id, (val) => {
  if (val) delete errors.value.region_id
})

watch(() => form.value.zone_id, (val) => {
  if (val) delete errors.value.zone_id
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6">
    
    <div class="fixed top-10 right-5 z-50">
      <transition name="fade-up">
        <div
          v-if="status === 'success' && statusMessage"
          class="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          {{ statusMessage }}
        </div>
      </transition>
      <transition name="fade-up">
        <div
          v-if="status === 'error' && statusMessage"
          class="bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          {{ statusMessage }}
        </div>
      </transition>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-semibold text-indigo-600 hover:text-indigo-700 capitalize">
            {{ locationType }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-300 hover:text-indigo-700">
            {{ totalItems }} total
          </p>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
      <BaseButton
       v-for="childType in childLocationTypes"
        :key="childType"
     
        size="sm"
        className="flex-1 sm:flex-auto whitespace-nowrap"
        @click="openAddChildModal(childType)"
        >
        <template #icon-left>
              <Icon name="PlusIcon" class="w-4 h-4" />
        </template>
          New {{ labelMap[childType] }}
        </BaseButton>
      </div>
      </div>

      <div class="hidden sm:flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          v-for="type in ['regions','zones','woredas','cities']"
          :key="type"
          @click="changeLocation(type)"
          class="px-4 py-2 text-sm font-medium transition border-b-2 -mb-px"
          :class="locationType === type
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'"
        >
          {{ type }}
        </button>
      </div>

  
      <div v-if="locationType !== 'regions'" class="flex flex-wrap gap-4 mb-4">
      
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white">Filter by Region</label>
        
          <BaseSelect
           v-model="filterRegion"
           :options="regionLocations.map(region => ({ value: region.id, label: region.region_name }))"
           placeholder="Select region"
           :clearable = "true"
           :searchable  = "true"/>
        </div>

        <div v-if="locationType === 'woredas' || locationType === 'cities'">
          <label class="block text-sm font-medium text-gray-700 dark:text-white">Filter by Zone</label>
          <BaseSelect
           v-model="filterZone"
           :options="zoneLocations.map(z => ({ value: z.id, label: z.zone_name }))"
           placeholder="Select Zone"
           :clearable = "true"
           size="lg"
           :searchable  = "true"/>
        </div>
         <button @click="resetFilters()"
            class="mt-6 bg-red-900 dark:bg-gray-700 hover:bg-brown-300 dark:hover:bg-gray-600 text-white dark:text-white text-sm font-medium px-4 py-2 rounded-lg transition"> Reset Filters</button>
      </div>

      <div class="sm:hidden mb-6">
        <BaseSelect 
        v-model="locationType"
          :options="[
                { value: 'regions', label: 'Regions' },
                { value: 'zones', label: 'Zones' },
                { value: 'woredas', label: 'Woredas' },
                { value: 'cities', label: 'Cities' }
                ]"
           placeholder="Select Location Type"
           class="w-full"
           size="lg"
           :clearable = "true"
           :searchable  = "true"/>
      </div>

    <div v-if="tableLoading">
      <Icon name="ArrowPathIcon" class="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
      <p class="text-center mt-2">Loading {{locationType}}...</p>
    </div>
      <BaseTable
       v-else
        :columns="tableColumns"
        :rows="filteredTableRows"
       
        searchable
      
        selectable
       
        :confirmDisabled="hasSubmitted"
         @update:selected="val => selectedLocations = val"
         class="shadow-lg rounded-lg"
      >
        <template  #cell-name="{ row }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm">
              {{ row.name?.charAt(0) }}
            </div>
            <div class="flex flex-col">
              <span class="font-medium dark:text-white">{{ row.name }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-300 sm:hidden">
                {{ row.region_name || row.zone_name || '' }}
              </span>
            </div>
          </div>
        </template>

        <template #cell-region_code="{ row }">
          <span>{{ row.region_code }}</span>
        </template>
        <template #cell-description="{ row }">
          <span v-if="row.description" class="text-gray-900 dark:text-gray-100">{{ row.description }}</span>
          <span v-else class="text-red-600 dark:text-red-400">empty</span>
        </template>
        <template #cell-region="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ row.region_name || '—' }}</span>
        </template>
        <template #cell-zone="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ row.zone?.zone_name || '—' }}</span>
        </template>

        <template #actions="{ row }">
          <ThreeDotsButton
            :actions="[
              { name: 'Edit', icon: 'PencilIcon', onClick: () => openEditLocation(getFullRow(row.id)) },
              { name: 'Delete', icon: 'TrashIcon', danger: true, onClick: () => openDeleteLocation(row) }
            ]"
          />
        </template>
      </BaseTable>
    </div>

    <BaseModal
     v-model="showLocationModal"
     :title="modalTitle"
     :icon="modalIcon"
     :confirmText="submitting
    ? `Submitting ${locationType.slice(0,-1)}...`
    : isEditing
      ? 'Update'
      : 'Save'"
     :badge-type="modalBadge"
     size="lg"
     class="z-50"
     :confirmDisabled="submitting"
     :closeDisabled="submitting"
     @confirm="saveLocation"
     @close="resetForm">
  
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-white capitalize">
        {{ locationType.slice(0,-1) }} Name
      </label>
      <BaseInput
        v-model="form.name"
        type="text"
        :placeholder="`Write ${locationType}`"
      />
      <span v-if="errors.region_name || errors.name || errors.zone_name || errors.woreda_name || errors.city_name" class="text-red-500 text-sm">
        {{ errors.region_name || errors.zone_name || errors.name || errors.woreda_name || errors.city_name }}
      </span>
      <div v-if="RegionCode" class="mt-2 text-gray-500 dark:text-gray-300">
        {{ `Region Code: ${RegionCode}` }}
      </div>
    </div>

    
    <div v-if="['zones', 'woredas', 'cities'].includes(locationType)">
      <label class="block text-sm font-medium text-gray-700 dark:text-white capitalize">Region</label>
      <BaseSelect
        v-model="form.region_id"
        :options="regionLocations.map(region => ({ value: region.id, label: region.region_name }))"
        :clearable="true"
        :searchable="true"
        :premium="true"
        size="md"
        :dropdown-append-to-body="false"
        :close-on-select="true"
      />
      <span v-if="hasSubmitted && errors.region_id" class="text-red-500 text-sm">
        {{ errors.region_id }}
      </span>
    </div>

   
    <div v-if="['woredas', 'cities'].includes(locationType)">
      <label class="block text-sm font-medium text-gray-700 dark:text-white">Zone</label>
      <BaseSelect
        v-model="form.zone_id"
        :options="zoneLocations.map(z => ({ value: z.id, label: z.zone_name }))"
        placeholder="Select Zone"
        size="sm"
        :clearable="true"
        :premium="true"
        :searchable="true"
        :dropdown-append-to-body="true"
        class="mt-1 w-full"
        :closeDisabled="submitting"
      />
      <span v-if="hasSubmitted && errors.zone_id" class="text-red-500 text-sm">
        {{ errors.zone_id }}
      </span>
    </div>
    <div>
       <BaseTextarea
        v-model="locationDescription"
        label="Description"
        placeholder="Description..."
        class="dark:bg-gray-900"
        showCount
        clearable  />
    </div>
  </BaseModal>
  <BaseModal
  v-model="showDeleteModal"
  title="Confirm Delete"
  iconType="danger"
  size="sm"
  class="z-50"
  :confirmText="hasSubmitted ? 'Deleting...' : 'Delete'"
  :closeText="'Cancel'"
  :confirmDisabled="hasSubmitted" 
  @confirm="deleteLocation(locationToDelete)"
>
  <div class="space-y-4">
    <p>
      Are you sure you want to delete a
      <strong class="text-blue-900">
        {{ locationType.slice(0,-1) }}
      </strong>
      <strong>{{ locationToDelete?.name }}</strong>?
    </p>
  </div>
</BaseModal>
  </div>
</template>

