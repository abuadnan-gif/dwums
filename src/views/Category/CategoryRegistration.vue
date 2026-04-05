<script setup>
import { ref, onMounted,onUnmounted,nextTick,computed } from 'vue'
import api from '@/plugins/axios'
import BaseTable from '@/components/ui/BaseTable.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseActions from '@/components/ui/BaseActions.vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

//to import confirm dialog
import { confirmAction } from '@/utils/confirm'
import BaseSelect from '@/components/ui/BaseSelect.vue'
// import Button from '@/components/ui/Button.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// this is for tariff modal page
const loading = ref(false)
const showTariffModal = ref(false)
const showTariffForm = ref(false) // For the "Add Tariff" inner modal/form
const selectedCategory = ref(null)
const tariffs = ref([]) // This would be fetched based on selectedCategory.id
const showModal = ref(false)
const categories = ref([]) // Standardized spelling
const errors = ref({})
const toast = useToast()
const editingCategoryId = ref(null)
const openActionId = ref(null)
//for tariff block related modal
const showTariffBlockModal = ref(false)
const showTariffBlockForm = ref(false)
const selectedTariff = ref(null)
const tariffBlocks = ref([])
const editingTariffBlockId = ref(null)
//for back to catagory page from modal
const router = useRouter()

// Bulk delete state
const selectedCategories = ref([])
const selectedTariffs = ref([])
const selectedTariffBlocks = ref([])

// Filter state for tariffs
const statusFilter = ref(null)
const yearFromFilter = ref(null)
const yearToFilter = ref(null)



// State for "Save & Add Another" functionality in Tariff Block form
const saveAndAddAnother = ref(false)
const firstInput = ref(null) // To focus the first input after saving when "Save & Add Another" is checked
// Form state for both creating and editing tariffs
const tariffForm = ref({
  category_id: null,
  from_year: new Date().getFullYear(),
  to_year: new Date().getFullYear() + 1,
  status_id: null
})
//here is to reset the tariffblock form after saving
const resetTariffBlockForm = () => {
  tariffBlockForm.value = {
    tariff_id: selectedTariff.value.id , //correct FK
    block_number: '',
    from_m3: '',
    to_m3: '',
    price_per_m3: ''
  }
  errors.value = {}
  saveAndAddAnother.value = false // Reset the checkbox after use
}
//here is for tariff block form
const tariffBlockForm = ref({
  tariff_id: null,
  block_number: '',
  from_m3: '',
  to_m3: '',
  price_per_m3: ''
})
//here is to open block modal
const openTariffBlockModal = (tariff) => {
  selectedTariff.value = tariff
  showTariffBlockModal.value = true
  fetchTariffBlocks(tariff.id ?? tariff.tariff_id)
}
//to fetch tariff blocks for specfic tariff

const fetchTariffBlocks = async (tariffId) => {
  loading.value = true
  try {
    const response = await api.get(`/tariffs/${tariffId}/blocks`)
    // Ensure response.data is always an array
    tariffBlocks.value = response.data;
  } catch (error) {
    console.error('Error fetching tariff blocks:', error)
    tariffBlocks.value = [] // Set to empty array on error
    toast.error('Failed to fetch tariff blocks')
  } finally {
    loading.value = false
  }
}
//to open add block form
const openAddTariffBlockForm = () => {
  if (!selectedTariff.value) {
    toast.error('No tariff selected.')
    return
  }

  editingTariffBlockId.value = null

  tariffBlockForm.value = {
    tariff_id: selectedTariff.value.id, //correct FK
    block_number: '',
    from_m3: '',
    to_m3: '',
    price_per_m3: ''
  }

  errors.value = {}
  showTariffBlockForm.value = true
}
//to edit block form
const editTariffBlock = (block) => {
  editingTariffBlockId.value = block.id
  tariffBlockForm.value = { ...block }
  showTariffBlockForm.value = true
}
//to save blocks or to update blocks
const saveTariffBlock = async () => {
  loading.value = true;

  const blockNumber = parseInt(tariffBlockForm.value.block_number);
  const fromM3 = parseFloat(tariffBlockForm.value.from_m3);
  const toM3 = parseFloat(tariffBlockForm.value.to_m3);

  // Get all other blocks (exclude current when editing)
  const otherBlocks = tariffBlocks.value
    .filter(b => !(editingTariffBlockId.value && b.id === editingTariffBlockId.value))
    .sort((a, b) => parseInt(a.block_number) - parseInt(b.block_number));

  // 1. Duplicate block number check
  const duplicateBlock = otherBlocks.find(b => parseInt(b.block_number) === blockNumber);
  if (duplicateBlock) {
    toast.error(`Block number ${blockNumber} already exists for this tariff`);
    loading.value = false;
    return;
  }

  // 2. from_m3 must be less than to_m3
  if (fromM3 >= toM3) {
    toast.error(`"From (m³)" must be less than "To (m³)"`);
    loading.value = false;
    return;
  }

  // 3. Range must start above previous block's to_m3
  const previousBlock = otherBlocks
    .filter(b => parseInt(b.block_number) < blockNumber)
    .sort((a, b) => parseInt(b.block_number) - parseInt(a.block_number))[0];

  if (previousBlock) {
    const prevTo = parseFloat(previousBlock.to_m3);
    if (fromM3 <= prevTo) {
      toast.error(
        `Block ${blockNumber} "From (m³)" must be above Block ${previousBlock.block_number}'s "To (m³)" (${prevTo})`
      );
      loading.value = false;
      return;
    }
  }

  // 4. Range must end before next block's from_m3
  const nextBlock = otherBlocks
    .filter(b => parseInt(b.block_number) > blockNumber)
    .sort((a, b) => parseInt(a.block_number) - parseInt(b.block_number))[0];

  if (nextBlock) {
    const nextFrom = parseFloat(nextBlock.from_m3);
    if (toM3 >= nextFrom) {
      toast.error(
        `Block ${blockNumber} "To (m³)" must be below Block ${nextBlock.block_number}'s "From (m³)" (${nextFrom})`
      );
      loading.value = false;
      return;
    }
  }

  // Keep tariff id before any resets
  const tariffId = selectedTariff.value.id;
  let saveSuccess = false;

  try {
    if (editingTariffBlockId.value) {
      await api.put(`/tariff_blocks/${editingTariffBlockId.value}`, tariffBlockForm.value);
      toast.success("Tariff Block updated successfully!");
      showTariffBlockForm.value = false;
      editingTariffBlockId.value = null;
      saveSuccess = true;
    } else {
      await api.post(`/tariff_blocks`, tariffBlockForm.value);
      toast.success("Tariff Block created successfully!");
      saveSuccess = true;
      if (saveAndAddAnother.value) {
        try {
          resetTariffBlockForm();
          await nextTick();
          firstInput.value?.focus();
        } catch (resetError) {
          console.error('Error during form reset:', resetError);
        }
      } else {
        showTariffBlockForm.value = false;
      }
    }
  } catch (error) {
    console.error('saveTariffBlock error:', error)
    console.error('error.response:', error.response)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
      toast.error("Please check the form for errors");
    } else {
      toast.error("Something went wrong");
    }
  } finally {
    loading.value = false;
  }

  // Refresh list completely outside try/catch
  if (saveSuccess) {
    fetchTariffBlocks(tariffId);
  }
};
//to delete block
const deleteTariffBlock = async (id) => {
  openActionId.value = null

  const confirmed = await confirmAction("Delete this tariff block?", "Are you sure you want to delete this tariff block?");
  if (!confirmed) return;

  api.delete(`/tariff_blocks/${id}`)
    .then(() => {
      toast.success("Tariff block deleted successfully");
      fetchTariffBlocks(selectedTariff.value.id);
    })
    .catch(() => {
      toast.error("Failed to delete tariff block");
    });
};
//to back to tariff modal from block modal
const backToTariffModal = () => {
  showTariffBlockModal.value = false // Close block modal
  showTariffModal.value = true // Reopen parent tariff modal
}
//back to category modal from tariff modal
const backToCatagoryModal = () => {
  showTariffModal.value = false // Close tariff modal
  router.push({ name: 'CatagoryRegistration' }) // <-- route name of your page      // Reopen parent category modal
}
const statusOptions = ref([])
const fetchTariffStatuses = async () => {
  try {
   const response = await api.get('/status_codes/tariffs');

    // filter only tariffs
    const tariffStatuses = response.data.filter(
      s => s.entity_type === 'tariffs'
    );

    // convert for BaseSelect component
    statusOptions.value = tariffStatuses.map(status => ({
      value: status.id,
      label: status.status_code
    }));

  } catch (error) {
    console.error("Full error response:", error.response || error);
    toast.error("Failed to load tariff statuses");
  }
};
  
// Bulk delete functionality
const bulkDeleteCategories = async () => {
  if (selectedCategories.value.length === 0) {
    toast.warning('No categories selected')
    return
  }
  
  const confirmed = await confirmAction(
    `Delete ${selectedCategories.value.length} categories?`,
    "This action cannot be undone for bulk deletes."
  )
  
  if (!confirmed) return
  
  try {
    await Promise.all(
      selectedCategories.value.map(id => api.delete(`/categories/${id}`))
    )
    toast.success(`${selectedCategories.value.length} categories deleted!`)
    selectedCategories.value = []
    fetchCategories()
  } catch (error) {
    toast.error('Failed to delete some categories')
  }
}

const bulkDeleteTariffs = async () => {
  if (selectedTariffs.value.length === 0) {
    toast.warning('No tariffs selected')
    return
  }
  
  const confirmed = await confirmAction(
    `Delete ${selectedTariffs.value.length} tariffs?`,
    "This action cannot be undone for bulk deletes."
  )
  
  if (!confirmed) return
  
  try {
    await Promise.all(
      selectedTariffs.value.map(id => api.delete(`/tariffs/${id}`))
    )
    toast.success(`${selectedTariffs.value.length} tariffs deleted!`)
    selectedTariffs.value = []
    fetchTariffs(selectedCategory.value.id)
  } catch (error) {
    toast.error('Failed to delete some tariffs')
  }
}

const bulkDeleteTariffBlocks = async () => {
  if (selectedTariffBlocks.value.length === 0) {
    toast.warning('No tariff blocks selected')
    return
  }
  
  const confirmed = await confirmAction(
    `Delete ${selectedTariffBlocks.value.length} tariff blocks?`,
    "This action cannot be undone for bulk deletes."
  )
  
  if (!confirmed) return
  
  try {
    await Promise.all(
      selectedTariffBlocks.value.map(id => api.delete(`/tariff_blocks/${id}`))
    )
    toast.success(`${selectedTariffBlocks.value.length} tariff blocks deleted!`)
    selectedTariffBlocks.value = []
    fetchTariffBlocks(selectedTariff.value.id)
  } catch (error) {
    toast.error('Failed to delete some tariff blocks')
  }
}
// Filtered tariffs based on status and year range
const filteredTariffs = computed(() => {
  let filtered = [...tariffs.value]
  
  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(t => t.status_code_id === statusFilter.value)
  }
  
  // Filter by year range
  if (yearFromFilter.value) {
    filtered = filtered.filter(t => t.from_year >= yearFromFilter.value)
  }
  
  if (yearToFilter.value) {
    filtered = filtered.filter(t => t.to_year <= yearToFilter.value)
  }
  
  return filtered
})

// Clear filters
const clearFilters = () => {
  statusFilter.value = null
  yearFromFilter.value = null
  yearToFilter.value = null
}


const editingTariffId = ref(null)

const editTariff = async (tariff) => {
  editingTariffId.value = tariff.id
  tariffForm.value = { ...tariff }
  await fetchTariffStatuses(); // Load status options for the select
  showTariffForm.value = true
   openActionId.value = null // Close dropdown after action
}
//tariff model
const openTariffModal = (category) => {
  selectedCategory.value = category // Store the whole object for the UI title
  tariffForm.value.category_id = category.id // Set the FK for the relationship
  showTariffModal.value = true
  fetchTariffs(category.id) // Load the table rows for this specific category
}

const saveTariff = async () => {
  loading.value = true;
  try {
    if(editingTariffId.value) {
      await api.put(`/tariffs/${editingTariffId.value}`, tariffForm.value);
      toast.success("Tariff updated successfully!");
    } else {  
      await api.post('/tariffs', tariffForm.value);
      toast.success("Tariff created successfully!");
    }
    await fetchTariffs(selectedCategory.value.id);
    showTariffForm.value = false;
    editingTariffId.value = null;
  } catch (error) {
    if (error.response?.status === 422) {
      if (error.response.data.errors) {
        errors.value = error.response.data.errors;
      }
      if (error.response.data.message) {
        toast.error(error.response.data.message); 
      } else {
        toast.error("Please check the form for errors");
      }
    } else {
      toast.error("Something went wrong");
    }
  } finally {
    loading.value = false;
  }
};
const openAddTariffForm =  async () => {
  editingTariffId.value = null
  // Clear previous values but keep the catagory_id
  tariffForm.value = {
    category_id: selectedCategory.value.id, // The FK relationship
    from_year: new Date().getFullYear(),
    to_year: new Date().getFullYear() + 1,
    status_id: null // This will show the placeholder in BaseInput
  }
  errors.value = {} // Clear old errors
   await fetchTariffStatuses(); // Load status options for the select
  showTariffForm.value = true
}
// Fetch tariffs for a specific category

// Fetch tariffs for a specific category
const fetchTariffs = async (categoryId) => {
  loading.value = true; // Start loading
  try {
  // Use the variable name passed into the function (catagoryId)
const response = await api.get(`/categories/${categoryId}/tariffs`);
    tariffs.value = response.data.map(t => ({
      ...t,
      category_name: t.category?.category_name,
      status_name: t.status?.status_code //this is to show status code in tariff table by using relation with status code table 
    }));
  } finally {
    loading.value = false; // Stop loading regardless of success/error
  }
};

const deleteTariff = async (id) => {
  openActionId.value = null

  const confirmed = await confirmAction(
    "Delete this tariff?",
    "This will also delete all tariff blocks associated with it."
  );

  if (!confirmed) return;

  try {
    // Fetch and delete all child blocks first
    const blocksRes = await api.get(`/tariffs/${id}/blocks`)
    const blocks = blocksRes.data

    if (blocks.length > 0) {
      await Promise.all(blocks.map(b => api.delete(`/tariff_blocks/${b.id}`)))
    }

    // Then delete the tariff itself
    await api.delete(`/tariffs/${id}`)

    toast.success('Tariff deleted successfully')
    fetchTariffs(selectedCategory.value.id)
  } catch (error) {
    toast.error('Failed to delete tariff')
  }
};
// State Management

// Table Headers
const columns = [
  { label: '#', key: 'index' },
  { label: 'Category Name', key: 'category_name' },
  { label: 'Description', key: 'description' }
]

const form = ref({
  category_name: '',
  description: ''
})

// Logic
const fetchCategories = () => {
  api
    .get('/categories')
    .then((res) => {
      categories.value = res.data.categories
    })
    .catch((err) => {
     
      categories.value = [] 
      toast.error('Error fetching categories')
    })
}

const editCategory = (id) => {
  const category = categories.value.find((c) => c.id === id)
  if (!category) return
  form.value.category_name = category.category_name
  form.value.description = category.description
  editingCategoryId.value = category.id
  showModal.value = true
   openActionId.value = null // Close dropdown after action
}

const deleteCategory = async (id) => {
  openActionId.value = null
  if (
    !(await confirmAction(
      'Delete this category?',
      "This will also delete all its tariffs and tariff blocks."
    ))
  )
    return
   try {
    // Fetch all tariffs for this category
    const tariffsRes = await api.get(`/categories/${id}/tariffs`)
    const categoryTariffs = tariffsRes.data

    // For each tariff, delete its blocks then the tariff itself
    for (const tariff of categoryTariffs) {
      const blocksRes = await api.get(`/tariffs/${tariff.id}/blocks`)
      const blocks = blocksRes.data

      if (blocks.length > 0) {
        await Promise.all(blocks.map(b => api.delete(`/tariff_blocks/${b.id}`)))
      }

      await api.delete(`/tariffs/${tariff.id}`)
    }

    // Finally delete the category
    await api.delete(`/categories/${id}`)

    toast.success('Category deleted successfully!')
    fetchCategories()
  } catch {
    toast.error("Failed to delete category")
  }
}

const openModalForCreate = () => {
  resetForm()
  editingCategoryId.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = { category_name: '', description: '' }
  errors.value = {}
}

const toggleDropdown = (id) => {
  openActionId.value = openActionId.value === id ? null : id
}

const saveCategory = () => {
  loading.value = true
  const payload = { ...form.value }
  const request = editingCategoryId.value
    ? api.put(`/categories/${editingCategoryId.value}`, payload)
    : api.post('/categories', payload)

  request
    .then(() => {
      toast.success(editingCategoryId.value ? 'Updated!' : 'Registered!')
      fetchCategories()
      closeModal()
    })
    .catch((error) => {
      if (error.response?.data?.errors) errors.value = error.response.data.errors
    })
    .finally(() => (loading.value = false))
}
// Tariff details sheet
const showTariffDetailsModal = ref(false)
const tariffSheetData = ref(null)
const tariffSheetLoading = ref(false)

const openTariffDetailsModal = async (row) => {
  showTariffDetailsModal.value = true
  tariffSheetLoading.value = true
  tariffSheetData.value = null
  try {
    const res = await api.get(`/tariffs/${row.id}/tariff-sheet`)
    tariffSheetData.value = res.data
  } catch (error) {
    console.error('Tariff sheet error:', error.response?.status, error.response?.data)
    toast.error('Failed to load tariff sheet')
    showTariffDetailsModal.value = false
  } finally {
    tariffSheetLoading.value = false
  }
}

const printTariffSheet = () => {
  if (!tariffSheetData.value) return

  const data = tariffSheetData.value
  const grandTotal = data.blocks.reduce((sum, b) => sum + b.total, 0)

  const rows = data.blocks.map(b => `
    <tr>
      <td>Block ${b.block_number}</td>
      <td>${b.from_m3} – ${b.to_m3}</td>
      <td class="mono">${b.calculation}</td>
      <td class="right">${b.total.toLocaleString()}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Water Tariff Sheet</title>
  <style>
    body { font-family: sans-serif; padding: 32px; color: #111; background: white; }
    h2 { text-align: center; font-size: 20px; margin-bottom: 4px; }
    .meta { text-align: center; color: #555; font-size: 13px; margin-bottom: 20px; }
    .info { display: flex; justify-content: space-between; padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
    .info div label { display: block; color: #888; font-size: 11px; text-transform: uppercase; margin-bottom: 2px; }
    .info div strong { font-size: 15px; color: #111; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #eef2ff; color: #4338ca; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; padding: 10px 14px; text-align: left; border: 1px solid #c7d2fe; }
    td { padding: 10px 14px; border: 1px solid #e5e7eb; color: #333; }
    tr:nth-child(even) td { background: #fafafa; }
    .mono { font-family: monospace; }
    .right { text-align: right; }
    .total-row td { font-weight: bold; background: #eef2ff !important; color: #4338ca; border-top: 2px solid #a5b4fc; }
  </style>
</head>
<body>
  <h2>Water Tariff Sheet</h2>
  <p class="meta">${data.category_name} — ${data.from_year}–${data.to_year}</p>
  <div class="info">
    <div><label>Category</label><strong>${data.category_name}</strong></div>
    <div><label>Year</label><strong>${data.from_year} – ${data.to_year}</strong></div>
    <div><label>Status</label><strong>${data.status}</strong></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Block</th>
        <th>Range (m³)</th>
        <th>Calculation</th>
        <th class="right">Total (ETB)</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="3" class="right">Grand Total</td>
        <td class="right">${grandTotal.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) { toast.error('Please allow popups to print'); return }
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 300)
}
const handleKeydown = (e) => {
  // Ctrl/Cmd + N to open "Add Category" modal (only if no other modals are open)
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault()
    if (!showModal.value && !showTariffModal.value && !showTariffBlockModal.value) {
      openModalForCreate()
    }
  }
  
  // Escape to close modals (close the topmost modal)
  if (e.key === 'Escape') {
    if (showTariffDetailsModal.value) {
      showTariffDetailsModal.value = false
    } else if (showTariffBlockForm.value) {
      showTariffBlockForm.value = false
    } else if (showTariffBlockModal.value) {
      showTariffBlockModal.value = false
    } else if (showTariffForm.value) {
      showTariffForm.value = false
    } else if (showTariffModal.value) {
      showTariffModal.value = false
    } else if (showModal.value) {
      closeModal()
    }
  }
  
  // Enter to submit form when modal is open and not in textarea
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
    e.preventDefault()
    if (!loading.value) {
      if (showTariffBlockForm.value) {
        saveTariffBlock()
      } else if (showTariffForm.value) {
        saveTariff()
      } else if (showModal.value) {
        saveCategory()
      }
    }
  }
}

onMounted(() => {
  fetchCategories()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="p-6 text-gray-900 dark:text-gray-100">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Category Management</h1>
      <!-- <button
        @click="openModalForCreate"
        class="px-5 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
      >
        Add Category
      </button> -->

      
        <button 
          v-if="selectedCategories.length > 0"
          @click="bulkDeleteCategories" 
          class="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete {{ selectedCategories.length }} Selected
        </button>
    
      
      <BaseButton @click="openModalForCreate" 
              class="px-5 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95">
        Add Category
      </BaseButton>
    </div>

    <!-- Main Categories Table -->
    <BaseTable
      :columns="columns"
      :rows="categories"
      rowKey="id"
      selectable
      :searchable="true"
      :showToolbar="true"
      :showPageSize="true"
      :showPagination="true"
      :showPaginationInfo="true"
      :loading="loading"
      empty-text="No categories found yet."
      empty-subtext="Get started by adding your first category"
      @update:selected="selectedCategories = $event"
    >
      <template #cell-index="{ row }">
        <span class="text-gray-400 font-mono text-sm">
          {{ categories.indexOf(row) + 1 }}
        </span>
      </template>

      <template #cell-category_name="{ row }">
        <span class="font-semibold text-gray-800 dark:text-gray-200">
          {{ row.category_name }}
        </span>
      </template>

      <template #cell-description="{ row }">
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate italic">
          {{ row.description || 'No description provided' }}
        </p>
      </template>

      <template #actions="{ row }">
       
          <ThreeDotsButton
            :actions="[
              {
                name: 'View Tariff',
                onClick: () => openTariffModal(row),
                class: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
              },
              {
                name: 'Edit',
                onClick: () => editCategory(row.id),
                class: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              },
              {
                name: 'Delete',
                onClick: () => deleteCategory(row.id),
                class: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }
            ]"
            :open="openActionId === row.id"
            @toggle="toggleDropdown(row.id)"
          />
   
      </template>
    </BaseTable>

    <!-- Category Form Modal (Create/Edit Category) -->
    <BaseModal
      v-model="showModal"
      :title="editingCategoryId ? 'Edit Category' : 'New Category'"
      :subtitle="editingCategoryId ? 'Update category details' : 'Create a new category'"
      size="md"
      :confirmText="editingCategoryId ? 'Update' : 'Register'"
      :loading="loading"
      @confirm="saveCategory"
      @close="closeModal"
    >
      <div class="space-y-5">
        <BaseInput
          v-model="form.category_name"
          type="text"
          label="Category Name"
          placeholder="e.g. Electrical Supplies"
          :error="errors.category_name?.[0]"
        />
        <BaseInput
          v-model="form.description"
          type="textarea"
          label="Description"
          placeholder="What is this category used for?"
          rows="3"
          :error="errors.description?.[0]"
        />
      </div>
    </BaseModal>

    <!-- Tariff Modal (List of Tariffs) -->
     <BaseModal
      v-model="showTariffModal"
      :title="`Tariffs for ${selectedCategory?.category_name}`"
      subtitle="Manage pricing and units for this category"
      size="4xl"
      :loading="loading"
      @close="showTariffModal = false"
    >
      <div class="space-y-4">
        <!-- Action Buttons and Filters -->
        <div class="flex justify-between items-start gap-3 flex-wrap">
          <div class="flex items-center gap-3">
            <button 
              @click="backToCatagoryModal"
              class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Categories
            </button>
            
            <button 
              v-if="selectedTariffs.length > 0"
              @click="bulkDeleteTariffs" 
              class="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete {{ selectedTariffs.length }}
            </button>
          </div>
          
          <BaseButton 
            @click="openAddTariffForm" 
            class="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
           
            Add Tariff
        </BaseButton>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex-1">
            <BaseSelect
              v-model="statusFilter"
              label="Filter by Status"
              :options="statusOptions"
              placeholder="All statuses"
              :clearable="true"
            />
          </div>
          <div class="flex-1">
            <BaseInput
              v-model="yearFromFilter"
              type="number"
              label="From Year"
              placeholder="e.g. 2020"
            />
          </div>
          <div class="flex-1">
            <BaseInput
              v-model="yearToFilter"
              type="number"
              label="To Year"
              placeholder="e.g. 2025"
            />
          </div>
          <button 
            v-if="statusFilter || yearFromFilter || yearToFilter"
            @click="clearFilters"
            class="mt-6 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <BaseTable
          :columns="[
            { key: 'index', label: '#' },
            { key: 'category_name', label: 'Category Name' },
            { key: 'from_year', label: 'From Year' },
            { key: 'to_year', label: 'To Year' },
            { key: 'status_name', label: 'Status' }
          ]"
          :rows="filteredTariffs"
          rowKey="id"
          :selectable="true"
          :searchable="true"
          empty-text="No tariffs defined for this category."
          @update:selected="selectedTariffs = $event"
        >
          <template #cell-index="{ row }">
            {{ filteredTariffs.indexOf(row) + 1 }}
          </template>

          <template #actions="{ row }">
           
              <ThreeDotsButton 
                :actions="[
                     { 
                    name: 'View Tariff Details', 
                    onClick: () => openTariffDetailsModal(row),
                    class: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                  },
                  { 
                    name: 'Set Tariff Blocks', 
                    onClick: () => openTariffBlockModal(row),
                    class: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                  },
                  { 
                    name: 'Edit', 
                    onClick: () => editTariff(row),
                    class: 'text-blue-600 hover:bg-blue-50' 
                  },
                  { 
                    name: 'Delete', 
                    onClick: () => deleteTariff(row.id), 
                    class: 'text-red-600 hover:bg-red-50' 
                  }
                ]" 
                :open="openActionId === row.id"
                @toggle="toggleDropdown(row.id)"
              />
        
          </template>
        </BaseTable>

      </div>
    </BaseModal>
      <!-- Tariff Form Modal -->
    <BaseModal
       v-model="showTariffForm"
      :title="editingTariffId ? 'Update Tariff' : 'Register New Tariff'"
      subtitle="Configure tariff details"
      size="md"
      :loading="loading"
      :close-on-click-outside="false"
      :confirm-text="editingTariffId ? 'Update' : 'Save Tariff'"
      :show-cancel="true"
      @confirm="saveTariff"
      @close="showTariffForm = false"
    >
      <div class="space-y-4">
        <BaseSelect
          v-model="tariffForm.status_id"
          label="Tariff Status"
          :options="statusOptions"
          placeholder="Select tariff status"
          :searchable="true"
          :clearable="true"
          :hover-mode="false"
          dropdown-placement="auto"
          :error="errors.status_id?.[0]"
        />
        
        <div class="grid grid-cols-2 gap-4">
          <BaseInput 
            v-model="tariffForm.from_year" 
            label="From Year" 
            type="number" 
            placeholder="YYYY"
            :error="errors.from_year?.[0]"
          />
          <BaseInput 
            v-model="tariffForm.to_year" 
            label="To Year" 
            type="number" 
            placeholder="YYYY"
            :error="errors.to_year?.[0]"
          />
        </div>
      </div>

    </BaseModal>

    <!-- Tariff Block Modal -->
       <BaseModal
      v-model="showTariffBlockModal"
      title=""
      subtitle="Manage tariff blocks for this tariff"
      size="4xl"
      :loading="loading"
      @close="showTariffBlockModal = false"
    >
      <template #title>
        Tariff Blocks for 
        <em style="color: #6366f1; font-style: italic;">{{ selectedTariff?.from_year }}-{{ selectedTariff?.to_year }}</em>
        of {{ selectedTariff?.catagory_name }}
      </template>
      <div class="space-y-4">
        <!-- Action Buttons -->
        <div class="flex justify-between items-center gap-3">
          <div class="flex items-center gap-3">
            <button 
              @click="backToTariffModal"
              class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tariffs
            </button>
            
            <button 
              v-if="selectedTariffBlocks.length > 0"
              @click="bulkDeleteTariffBlocks" 
              class="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete {{ selectedTariffBlocks.length }}
            </button>
          </div>
          
          <button 
            @click="openAddTariffBlockForm" 
            class="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Tariff Block
          </button>
        </div>

        <BaseTable
          :columns="[
            { key: 'index', label: '#' },
            { key: 'tariff_id', label: 'Tariff ID' },
            { key: 'block_number', label: 'Block Number' },
            { key: 'from_m3', label: 'From (m³)' },
            { key: 'to_m3', label: 'To (m³)' },
            { key: 'price_per_m3', label: 'Price per (m³)' }
          ]"
          :rows="tariffBlocks"
          rowKey="id"
          :selectable="true"
          :searchable="true"
          empty-text="No tariff blocks defined for this tariff."
          @update:selected="selectedTariffBlocks = $event"
        >
          <template #cell-index="{ row }">
            {{ tariffBlocks.indexOf(row) + 1 }}
          </template>

          <template #actions="{ row }">
            <div class="flex justify-end pr-2 group-hover:opacity-100 transition-opacity duration-200">
              <ThreeDotsButton 
                :actions="[
                  { 
                    name: 'Edit', 
                    onClick: () => editTariffBlock(row),
                    class: 'text-blue-600 hover:bg-blue-50' 
                  },
                  { 
                    name: 'Delete', 
                    onClick: () => deleteTariffBlock(row.id), 
                    class: 'text-red-600 hover:bg-red-50' 
                  }
                ]" 
                :open="openActionId === row.id"
                @toggle="toggleDropdown(row.id)"
              />
            </div>
          </template>
        </BaseTable>
      </div>
    </BaseModal>

  

    <!-- Tariff Block Form Modal (Create/Edit Tariff Block) -->
    <BaseModal
      v-model="showTariffBlockForm"
      :title="editingTariffBlockId ? 'Update Tariff Block' : 'Register New Tariff Block'"
      subtitle="Configure tariff block details"
      size="md"
      :loading="loading"
      :confirm-text="editingTariffBlockId ? 'Update' : 'Save Tariff Block'"
      :show-cancel="true"
      @confirm="saveTariffBlock"
      @close="showTariffBlockForm = false"
    >
      <div class="space-y-4">
        <BaseInput 
          ref="firstInput"
          v-model="tariffBlockForm.block_number" 
          label="Block Number" 
          type="number" 
          placeholder="e.g. 1 for Block 1"
          :error="errors.block_number?.[0]"
        />

        <div class="grid grid-cols-2 gap-4">
          <BaseInput 
            v-model="tariffBlockForm.from_m3" 
            label="From (m³)" 
            type="number" 
            placeholder="From m³"
            :error="errors.from_m3?.[0]"
          />
          <BaseInput 
            v-model="tariffBlockForm.to_m3" 
            label="To (m³)" 
            type="number" 
            placeholder="To m³"
            :error="errors.to_m3?.[0]"
          />
        </div>

        <BaseInput 
          v-model="tariffBlockForm.price_per_m3" 
          label="Price per m³" 
          type="number" 
          placeholder="e.g. 0.50"
          :error="errors.price_per_m3?.[0]"
        />

        <div 
          v-if="!editingTariffBlockId"
          class="flex items-center gap-2"
        >
          <input
            type="checkbox"
            id="saveAndAdd"
            v-model="saveAndAddAnother"
            class="w-4 h-4"
          />
          <label for="saveAndAdd" class="text-sm font-medium text-gray-800 dark:text-gray-200">
            Save & Add Another
          </label>
        </div>
      </div>
    </BaseModal>
      <!-- Tariff Details Sheet Modal -->
    <BaseModal
      v-model="showTariffDetailsModal"
      title=""
      subtitle=""
      size="4xl"
      :loading="tariffSheetLoading"
      :close-on-escape="false"
      :close-on-click-outside="false"
      cancel-label="Close"
      confirm-text="Print"
      :show-cancel="true"
      @confirm="printTariffSheet"
      @close="showTariffDetailsModal = false"
    >
      <template #title>
        Water Tariff Sheet —
        <em style="color: #6366f1; font-style: italic;">
          {{ tariffSheetData?.category_name }} {{ tariffSheetData?.from_year }}–{{ tariffSheetData?.to_year }}
        </em>
      </template>

      <div v-if="tariffSheetLoading" class="py-10 text-center text-gray-400">
        Loading tariff sheet...
      </div>

      <div v-else-if="tariffSheetData" id="printable-tariff-sheet" class="space-y-4">
        <!-- Tariff Header -->
        <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between items-center rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Category</p>
            <p class="font-bold text-gray-800 dark:text-gray-100 text-lg">{{ tariffSheetData.category_name }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">Year</p>
            <p class="font-bold text-indigo-600 dark:text-indigo-400 text-lg italic">
              {{ tariffSheetData.from_year }} – {{ tariffSheetData.to_year }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {{ tariffSheetData.status }}
            </span>
          </div>
        </div>

        <!-- Blocks Table using BaseTable -->
        <BaseTable
          :columns="[
            { key: 'block_number', label: 'Block' },
            { key: 'range', label: 'Range (m³)' },
            { key: 'calculation', label: 'Calculation' },
            { key: 'total', label: 'Total (ETB)', align: 'right' }
          ]"
          :rows="[
            ...tariffSheetData.blocks,
            {
              block_number: '__total__',
              range: '',
              calculation: 'Grand Total',
              total: tariffSheetData.blocks.reduce((sum, b) => sum + b.total, 0)
            }
          ]"
          rowKey="block_number"
          :searchable="false"
          :selectable="false"
          :show-page-size="false"
          :show-pagination-info="false"
          empty-text="No blocks defined for this tariff."
        >
          <template #cell-block_number="{ row }">
            <span v-if="row.block_number !== '__total__'" class="font-medium">Block {{ row.block_number }}</span>
            <span v-else></span>
          </template>

          <template #cell-range="{ row }">
            <span v-if="row.block_number !== '__total__'">{{ row.from_m3 }} – {{ row.to_m3 }}</span>
          </template>

          <template #cell-calculation="{ row }">
            <span v-if="row.block_number !== '__total__'" class="font-mono">{{ row.calculation }}</span>
            <span v-else class="font-bold text-indigo-700 dark:text-indigo-300 col-span-3">Grand Total</span>
          </template>

          <template #cell-total="{ row }">
            <span
              :class="row.block_number === '__total__'
                ? 'font-bold text-indigo-700 dark:text-indigo-300 text-base'
                : 'font-semibold text-gray-800 dark:text-gray-100'"
            >
              {{ row.total.toLocaleString() }}
            </span>
          </template>
        </BaseTable>
      </div>
    </BaseModal>
  </div>
</template>
