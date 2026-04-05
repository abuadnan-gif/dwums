<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'
//here tefe import the ThreeDotsButton for actioncolumn of the table
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import BaseModal from '@/components/ui/BaseModal.vue'
//to confirm delete action
import { confirmAction } from '@/utils/confirm'
import BaseTable from '@/components/ui/BaseTable.vue'
import Icon from '@/components/Icon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const toast = useToast()
const showModal = ref(false)
const loading = ref(false)
const materials = ref([])
const errors = ref({})
//for editing material
const editingMaterialId = ref(null)
// Track which row dropdown action is currently open

// const materialsFormatted = computed(() => {
//   if (!Array.isArray(materials.value)) return []

//   return materials.value.map((material, index) => {
//     return {
//       id: material.id,
//       index: index + 1,
//       material_name: material.material_name,
//       size: material.size
//     }
//   })
// })
const materialsFormatted = computed(() => {
  return materials.value.map((material, index) => ({
    ...material,
    index: index + 1
  }))
})

const openActionId = ref(null)
//for reusable table component
const columns = [
  { label: '#', key: 'index' }, // Custom key for the counter
  { label: 'Material Name', key: 'material_name' },
  { label: 'Size', key: 'size' }
]

const form = ref({
  material_name: '',
  size: ''
})

// Logic
const fetchMaterials = async () => {
  loading.value = true

  try {
    const res = await api.get('/materials')
    materials.value = res.data.materials
  } catch (err) {
    toast.error('Failed to fetch materials')
  } finally {
    loading.value = false
  }
}
// //to three Dots button action column
// //to edit function
// const editMaterial = (id) => {
//   const material = materials.value.find((m) => m.id === id)
//   if (!material) {
//     toast.error('Material not found!')
//     return
//   }
//   form.value.material_name = material.material_name
//   form.value.size = material.size
//   editingMaterialId.value = material.id
//   // Open modal without resetting
//   openModalForEdit()
// }

const editMaterial = (material) => {
  if (!material) {
    toast.error('Material not found!')
    return
  }

  form.value.material_name = material.material_name
  form.value.size = material.size
  editingMaterialId.value = material.id

  openModalForEdit()
}

//to delete function of the action column
const deleteMaterial = async (material) => {
  const materialToDelete = materials.value.find((m) => m.id === material.id)
  if (!materialToDelete) {
    toast.error('Material not found!')

    return
  }
  if (
    !(await confirmAction(
      'Delete this material?',
      'Are you sure you want to delete this material?'
    ))
  )
    return
  await api
    .delete(`/materials/${material.id}`)
    .then(() => {
      toast.success('Material deleted successfully!', 'success')
      fetchMaterials()
    })
    .catch((err) => {
      toast.error('Error deleting material:', err)
      toast.error('Failed to delete material.')
    })
}

// Open modal for creating a new material
const openModalForCreate = () => {
  resetForm() // clear inputs
  editingMaterialId.value = null // no material being edited
  showModal.value = true
}
// Open modal for editing a material
const openModalForEdit = () => {
  showModal.value = true // keep form as-is
}

const closeModal = () => {
  showModal.value = false
}

const resetForm = () => {
  form.value = {
    material_name: '',
    size: ''
  }
  errors.value = {}
}
// Function to toggle dropdown for a row and which row action is open
const toggleDropdown = (id) => {
  openActionId.value = openActionId.value === id ? null : id
}
const saveMaterial = () => {
  loading.value = true
  errors.value = {}

  const payload = {
    material_name: form.value.material_name,
    size: form.value.size
  }
  if (editingMaterialId.value) {
    // Update existing material
    api
      .put(`/materials/${editingMaterialId.value}`, payload)
      .then((res) => {
        toast.success('Material updated successfully!', 'success')

        fetchMaterials()
        closeModal()
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors
        }
      })
      .finally(() => {
        loading.value = false
      })
    return
  }
  api
    .post('/materials', payload)
    .then((res) => {
      toast.success('Material registered successfully!', 'success')
      fetchMaterials()
      closeModal()
    })
    .catch((error) => {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchMaterials()
})
</script>

<template>
 <div class="p-6 text-gray-900 dark:text-gray-100">
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">Material Registration</h1>

    <BaseButton
      @click="openModalForCreate"
      class="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white"
    >
      Add Material
    </BaseButton>
  </div>
</div>
  <div v-if="loading" class="p-8 text-center">
    <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
    <p class="mt-3 text-gray-500">Loading Materials...</p>
  </div>
  <!-- Error -->
  <div v-else-if="error" class="text-red-600 text-center py-6">
    {{ error }}
  </div>
  <!-- Empty -->
  <div
    v-else-if="Array.isArray(materials) && materials.length === 0"
    class="text-center py-6 text-gray-500"
  >
    No Materials found
  </div>
  <div v-else>
    <BaseTable
      :columns="columns"
      :rows="materialsFormatted"
      rowKey="id"
      selectable
      searchable
      show-toolbar
      :per-page-options="[10, 20, 50, 100]"
      :default-per-page="10"
      :compact="true"
      row-height="50px"
      :showPaginationInfo="true"
      empty-text="No materials registered."
    >
      <!-- <template #cell-index="{ row }">
          <span class="text-gray-500">{{ materials.indexOf(row) + 1 }}</span>
        </template> -->
      <template #cell-index="{ row }">
        {{ row.index }}
      </template>

      <template #cell-material_name="{ row }">
        {{ row.material_name }}
      </template>

      <template #cell-size="{ row }">
        {{ row.size }}
      </template>

      <template #actions="{ row }">
      
          <ThreeDotsButton
            :actions="[
              {
                name: 'Edit',
                onClick: () => editMaterial(row),
                class: 'text-blue-600 hover:bg-blue-50'
              },
              {
                name: 'Delete',
                onClick: () => deleteMaterial(row),
                class: 'text-red-600 hover:bg-red-50'
              }
            ]"
            :open="openActionId === row.id"
            @toggle="toggleDropdown(row.id)"
          />
    
      </template>
    </BaseTable>
  </div>
  <!-- ✅ Call Base Modal Here -->
  <BaseModal
    v-model="showModal"
    :title="editingMaterialId ? 'Update Material' : 'Register New Material'"
    :loading="loading"
    size="md"
    @close="closeModal"
  >
    <!-- Modal Body -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Material Name</label>
        <input
          v-model="form.material_name"
          class="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        <p v-if="errors.material_name" class="text-red-500 text-xs mt-1">
          {{ errors.material_name[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Size</label>
        <input
          v-model="form.size"
          class="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        <p v-if="errors.size" class="text-red-500 text-xs mt-1">
          {{ errors.size[0] }}
        </p>
      </div>
    </div>

    <!-- Footer Slot -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 text-gray-600">Cancel</button>
        <button
          @click="saveMaterial"
          :disabled="loading"
          class="px-6 py-2 bg-green-600 text-white rounded-md"
        >
          {{ loading ? 'Saving...' : editingMaterialId ? 'Update' : 'Register' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
