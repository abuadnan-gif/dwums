<template>
  <Card :padding="'0'" :hoverable="false" :glow="false" :className="'overflow-hidden'">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ title }}</h3>
          <p v-if="description" class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ description }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div v-if="searchable" class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="searchPlaceholder"
              class="pl-10 pr-4 py-2 w-64 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary-dark/50 focus:border-transparent text-sm transition-all"
              @input="handleSearch"
            />
          </div>
          
          <!-- Actions Slot -->
          <slot name="actions"></slot>
          
          <!-- Export Button -->
          <button
            v-if="exportable"
            @click="handleExport"
            class="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            title="Export data"
          >
            <svg class="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <table class="data-table w-full">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :class="[
              'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider',
              column.align === 'right' ? 'text-right' : 'text-left',
              column.class
            ]">
              <div class="flex items-center">
                {{ column.label }}
                <button
                  v-if="column.sortable"
                  @click="toggleSort(column.key)"
                  class="ml-2 p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                >
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="sortColumn === column.key 
                        ? (sortDirection === 'asc' 
                          ? 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' 
                          : 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12') 
                        : 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'" />
                  </svg>
                </button>
              </div>
            </th>
            <th v-if="actions.length > 0" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedData" :key="row.id || index" 
            :class="[
              'border-b border-neutral-200/50 dark:border-neutral-800/50',
              hoverable && 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50',
              rowClass && rowClass(row)
            ]">
            <td v-for="column in columns" :key="column.key" 
              :class="['px-6 py-4', column.align === 'right' ? 'text-right' : 'text-left', column.cellClass && column.cellClass(row)]">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                <template v-if="column.formatter">
                  {{ column.formatter(row[column.key], row) }}
                </template>
                <template v-else-if="column.type === 'badge'">
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    getBadgeClass(row[column.key], column)
                  ]">
                    {{ row[column.key] }}
                  </span>
                </template>
                <template v-else-if="column.type === 'date'">
                  {{ formatDate(row[column.key]) }}
                </template>
                <template v-else-if="column.type === 'currency'">
                  {{ formatCurrency(row[column.key]) }}
                </template>
                <template v-else>
                  {{ row[column.key] }}
                </template>
              </slot>
            </td>
            <td v-if="actions.length > 0" class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button
                  v-for="action in actions"
                  :key="action.name"
                  @click="handleAction(action.name, row)"
                  :class="[
                    'p-2 rounded-lg transition-colors',
                    action.variant === 'danger' 
                      ? 'text-critical-light dark:text-critical-dark hover:bg-critical-light/10 dark:hover:bg-critical-dark/10' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  ]"
                  :title="action.label"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center">
      <div class="inline-block">
        <div class="w-12 h-12 border-4 border-primary-light/30 dark:border-primary-dark/30 border-t-primary-light dark:border-t-primary-dark rounded-full animate-spin mx-auto"></div>
        <p class="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{{ loadingText }}</p>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="paginatedData.length === 0" class="p-12 text-center">
      <div class="inline-block">
        <div class="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No data found</h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ emptyText }}</p>
        <slot name="empty"></slot>
      </div>
    </div>
    
    <!-- Table Footer -->
    <div v-if="paginatedData.length > 0" class="px-6 py-4 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
        </div>
        <div v-if="paginate && totalPages > 1" class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === 1
                ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              ]"
            >
              {{ page }}
            </button>
            <span v-if="showEllipsis" class="px-2 text-neutral-400">...</span>
          </div>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === totalPages
                ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  title: String,
  description: String,
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  actions: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  loadingText: {
    type: String,
    default: 'Loading data...'
  },
  emptyText: {
    type: String,
    default: 'No records to display.'
  },
  searchable: Boolean,
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  exportable: Boolean,
  paginate: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  rowClass: Function
})

const emit = defineEmits(['action', 'export', 'row-click'])

const searchQuery = ref('')
const sortColumn = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)

// Computed
const filteredData = computed(() => {
  let result = [...props.data]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(row => 
      props.columns.some(column => {
        const value = row[column.key]
        return value && value.toString().toLowerCase().includes(query)
      })
    )
  }
  
  // Apply sorting
  if (sortColumn.value) {
    result.sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      
      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return result
})

const totalPages = computed(() => 
  props.paginate ? Math.ceil(filteredData.value.length / props.pageSize) : 1
)

const paginatedData = computed(() => {
  if (!props.paginate) return filteredData.value
  
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => 
  Math.min(currentPage.value * props.pageSize, filteredData.value.length)
)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const showEllipsis = computed(() => 
  totalPages.value > 5 && currentPage.value < totalPages.value - 2
)

// Methods
const toggleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleExport = () => {
  emit('export', filteredData.value)
}

const handleAction = (action, row) => {
  emit('action', { action, row })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return ''
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getBadgeClass = (value, column) => {
  if (column.badgeClasses && column.badgeClasses[value]) {
    return column.badgeClasses[value]
  }
  
  // Default badge classes based on common status values
  const status = value?.toLowerCase()
  if (status.includes('active') || status.includes('success') || status.includes('paid')) {
    return 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark'
  } else if (status.includes('pending') || status.includes('warning')) {
    return 'bg-warning-light/10 text-warning-light dark:bg-warning-dark/10 dark:text-warning-dark'
  } else if (status.includes('inactive') || status.includes('critical') || status.includes('overdue')) {
    return 'bg-critical-light/10 text-critical-light dark:bg-critical-dark/10 dark:text-critical-dark'
  }
  
  return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
}

// Watch for data changes
watch(() => props.data, () => {
  currentPage.value = 1
  searchQuery.value = ''
})

// Watch for page size changes
watch(() => props.pageSize, () => {
  currentPage.value = 1
})
</script>