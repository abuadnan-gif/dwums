<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import Icon from '@/components/Icon.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useThemeStore } from '@/stores/theme'

/* =========================
   Props
========================= */
const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  perPageOptions: { type: Array, default: () => [10, 20, 50, 100] },
  defaultPerPage: { type: Number, default: 20 },
  searchable: { type: Boolean, default: true },
  selectable: { type: Boolean, default: false },
  showToolbar: { type: Boolean, default: true },
  showPageSize: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
  showPaginationInfo: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  stickyHeader: { type: Boolean, default: false },
  maxHeight: { type: String, default: null },
  emptyText: { type: String, default: 'No data available' },
  emptySubtext: { type: String, default: 'Try adjusting your search or filters' },
  compact: { type: Boolean, default: false },
  rowHeight: { type: String, default: '64px' },
  headerHeight: { type: String, default: '56px' }
})

/* =========================
   Theme Store
========================= */
const themeStore = useThemeStore()

/* =========================
   State
========================= */
const search = ref('')
const sortKey = ref(null)
const sortDirection = ref('asc')
const currentPage = ref(1)
const perPage = ref(props.defaultPerPage)
const selectedRows = ref(new Set())
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const tableRef = ref(null)

/* =========================
   Window resize handler
========================= */
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize, { passive: true })
    handleResize()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

/* =========================
   Filtering
========================= */
const filteredRows = computed(() => {
  if (!search.value) return props.rows || []
  const term = search.value.toLowerCase()
  return (props.rows || []).filter((row)=>
  // return props.rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val ?? '')
        .toLowerCase()
        .includes(term)
    )
  )
})

/* =========================
   Sorting
========================= */
const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value || []

  return [...filteredRows.value].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    if (aVal == null) return 1
    if (bVal == null) return -1

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()

    return sortDirection.value === 'asc'
      ? aStr.localeCompare(bStr, undefined, { numeric: true })
      : bStr.localeCompare(aStr, undefined, { numeric: true })
  })
})

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
  emit('sort-change', { key: sortKey.value, direction: sortDirection.value })
}

/* =========================
   Pagination
========================= */
// const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / perPage.value)))
const totalPages = computed(() =>
  Math.max(1, Math.ceil((sortedRows.value || []).length / perPage.value))
)
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  // return sortedRows.value.slice(start, start + perPage.value)
  return (sortedRows.value || []).slice(start, start + perPage.value)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('page-change', page)
    if (tableRef.value) {
      tableRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

watch([search, perPage], () => {
  currentPage.value = 1
})

/* =========================
   Selection Methods
========================= */
const isAllSelected = computed(() => {
  if (paginatedRows.value.length === 0) return false
  return paginatedRows.value.every((row) => selectedRows.value.has(row[props.rowKey]))
})

const isIndeterminate = computed(() => {
  if (paginatedRows.value.length === 0) return false
  const selectedCount = paginatedRows.value.filter((row) =>
    selectedRows.value.has(row[props.rowKey])
  ).length
  return selectedCount > 0 && selectedCount < paginatedRows.value.length
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    paginatedRows.value.forEach((row) => selectedRows.value.delete(row[props.rowKey]))
  } else {
    paginatedRows.value.forEach((row) => selectedRows.value.add(row[props.rowKey]))
  }
  emit('update:selected', Array.from(selectedRows.value))
}

function toggleRowSelection(rowId) {
  if (selectedRows.value.has(rowId)) {
    selectedRows.value.delete(rowId)
  } else {
    selectedRows.value.add(rowId)
  }
  emit('update:selected', Array.from(selectedRows.value))
}

function clearSelection() {
  selectedRows.value.clear()
  emit('update:selected', [])
}

function isRowSelected(rowId) {
  return selectedRows.value.has(rowId)
}

defineExpose({
  selectedRows: computed(() => Array.from(selectedRows.value)),
  clearSelection,
  toggleRowSelection,
  toggleSelectAll,
  exportData: () => sortedRows.value
})

/* =========================
   Emits
========================= */
const emit = defineEmits([
  'update:selected',
  'sort-change',
  'page-change',
  'per-page-change',
  'row-click',
  'row-dblclick',
  'cell-click',
  'search'
])

/* =========================
   Computed Values
========================= */
const paginationStart = computed(() => {
  // if (sortedRows.value.length === 0) return 0
  if ((sortedRows.value || []).length === 0) return 0
  return (currentPage.value - 1) * perPage.value + 1
})

const paginationEnd = computed(() => {
  // return Math.min(currentPage.value * perPage.value, sortedRows.value.length)
  return Math.min(currentPage.value * perPage.value, (sortedRows.value || []).length)
})

const shouldShowPaginationInfo = computed(() => {
  return props.showPaginationInfo && sortedRows.value.length > 0
})

const tableStyle = computed(() => {
  const style = {}
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight
    style.overflowY = 'auto'
  }
  return style
})

const isMobile = computed(() => windowWidth.value < 768)
const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)

const themeClass = computed(() => ({
  'dark-mode': themeStore.isDark
}))

const rowStyle = computed(() => ({
  height: props.compact ? '56px' : props.rowHeight,
  minHeight: props.compact ? '56px' : props.rowHeight
}))

const headerStyle = computed(() => ({
  height: props.compact ? '48px' : props.headerHeight,
  minHeight: props.compact ? '48px' : props.headerHeight
}))

// Convert perPageOptions to format expected by BaseInput select
const pageSizeOptions = computed(() =>
  props.perPageOptions.map((opt) => ({ value: opt, label: `${opt} / page` }))
)
</script>

<template>
  <div ref="tableRef" class="table-wrapper" :class="themeClass">
    <!-- Toolbar - All elements on one line -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <!-- Select All Button -->
        <button
          v-if="selectable && paginatedRows.length > 0"
          class="btn btn-secondary btn-sm select-all-btn"
          @click="toggleSelectAll"
          :disabled="loading"
        >
          <Icon :name="isAllSelected ? 'XMarkIcon' : 'CheckCircleIcon'" />
          <span class="btn-text">{{ isAllSelected ? 'Deselect All' : 'Select All' }}</span>
          <span v-if="selectedRows.size > 0" class="selection-count">{{ selectedRows.size }}</span>
        </button>

        <!-- Selection Info (inline with select all) -->
        <span v-if="selectable && selectedRows.size > 0" class="selection-info">
          <Icon name="CheckCircleIcon" />
          <span class="info-text">{{ selectedRows.size }} selected</span>
        </span>
      </div>

      <div class="toolbar-center">
        <!-- Search - Using BaseInput -->
        <div v-if="searchable" class="search-container">
          <Icon name="MagnifyingGlassIcon" class="search-icon" />
          <BaseInput
            v-model="search"
            type="text"
            :placeholder="isMobile ? 'Search...' : 'Search records...'"
            class="search-input"
            @update:model-value="$emit('search', $event)"
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <Icon name="XMarkIcon" />
          </button>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- Page Size Selector - Using BaseInput with select type -->
        <div v-if="showPageSize" class="page-size-selector">
          <BaseInput
            v-model="perPage"
            type="select"
            :options="pageSizeOptions"
            class="select-field"
            @update:model-value="$emit('per-page-change', $event)"
          />
          <Icon name="ChevronDownIcon" class="select-arrow" />
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="table-container"
      :class="{ 'table-loading': loading, 'sticky-header': stickyHeader }"
      :style="tableStyle"
    >
      <table class="modern-table">
        <!-- Header with 30% Opacity -->
        <thead class="table-header">
          <tr :style="headerStyle">
            <!-- Selection Column - Using BaseInput checkbox? No, keeping native checkbox for performance -->
            <th v-if="selectable" class="checkbox-col" :style="headerStyle">
              <div class="checkbox-wrapper">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                  :disabled="loading || paginatedRows.length === 0"
                />
              </div>
            </th>

            <th
              v-for="col in columns"
              :key="col.key"
              @click="col.sortable !== false && !loading && toggleSort(col.key)"
              :class="{
                sortable: col.sortable !== false,
                'text-right': col.align === 'right',
                'text-center': col.align === 'center'
              }"
              :style="[headerStyle, col.width ? { width: col.width } : {}]"
            >
              <div class="header-content">
                <span class="header-label">{{ col.label }}</span>
                <span v-if="sortKey === col.key" class="sort-indicator">
                  <Icon :name="sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'" />
                </span>
              </div>
            </th>

            <th v-if="$slots.actions" class="actions-col" :style="headerStyle">Actions</th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <tr
            v-for="(row, index) in paginatedRows"
            :key="row[rowKey]"
            class="table-row"
            :class="{
              selected: selectable && selectedRows.has(row[rowKey]),
              clickable: $attrs.onRowClick
            }"
            :style="rowStyle"
            @click="$emit('row-click', row)"
            @dblclick="$emit('row-dblclick', row)"
          >
            <!-- Selection Checkbox - Keeping native for performance -->
            <td v-if="selectable" class="checkbox-col" :style="rowStyle" @click.stop>
              <div class="checkbox-wrapper">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="selectedRows.has(row[rowKey])"
                  @change="() => toggleRowSelection(row[rowKey])"
                  :disabled="loading"
                />
              </div>
            </td>

            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                col.cellClass,
                {
                  'text-right': col.align === 'right',
                  'text-center': col.align === 'center',
                  'font-bold': col.bold
                }
              ]"
              :style="rowStyle"
              @click.stop="
                col.clickable && $emit('cell-click', { row, column: col.key, value: row[col.key] })
              "
            >
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :value="row[col.key]"
                :column="col"
                
                :index="index"
                :selected="selectedRows.has(row[rowKey])"
              >
                <span class="cell-text">
                  <template v-if="col.type === 'date'">
                    {{ new Date(row[col.key]).toLocaleDateString() }}
                  </template>
                  <template v-else-if="col.type === 'currency'">
                    {{
                      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                        row[col.key]
                      )
                    }}
                  </template>
                  <template v-else-if="col.type === 'number'">
                    {{ new Intl.NumberFormat().format(row[col.key]) }}
                  </template>
                  <template v-else-if="col.type === 'badge'">
                    <span class="badge" :class="col.badgeClass?.(row[col.key])">
                      {{ row[col.key] }}
                    </span>
                  </template>
                  <template v-else>
                    {{ row[col.key] }}
                  </template>
                </span>
              </slot>
            </td>

            <td v-if="$slots.actions" class="actions-col" :style="rowStyle" @click.stop>
              <slot name="actions" :row="row" :index="index" />
            </td>
          </tr>

          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columns.length + (selectable ? 1 : 0) + ($slots.actions ? 1 : 0)">
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading data...</p>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="paginatedRows.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0) + ($slots.actions ? 1 : 0)">
              <div class="empty-state">
                <Icon name="DocumentTextIcon" class="empty-icon" />
                <p class="empty-title">{{ emptyText }}</p>
                <p v-if="emptySubtext" class="empty-subtitle">{{ emptySubtext }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <!-- <div v-if="showPagination && sortedRows.length > 0" class="table-footer"> -->
      <div v-if="showPagination && (sortedRows?.length || 0) > 0" class="table-footer"> 
      <!-- Pagination Info -->
      <div v-if="shouldShowPaginationInfo" class="pagination-info">
        Showing {{ paginationStart }} to {{ paginationEnd }} of {{ sortedRows.length }} entries
      </div>
      <div v-else></div>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button
          class="pagination-btn"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1 || loading"
        >
          <Icon name="ChevronLeftIcon" />
          <span>Prev</span>
        </button>

        <div class="page-numbers">
          <button
            v-for="page in totalPages"
            :key="page"
            v-show="
              totalPages <= 7 ||
              Math.abs(page - currentPage) <= 2 ||
              page === 1 ||
              page === totalPages
            "
            @click="changePage(page)"
            class="page-number"
            :class="{ active: page === currentPage }"
            :disabled="loading"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages || loading"
        >
          <span>Next</span>
          <Icon name="ChevronRightIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =========================
   CSS Variables
========================= */
:root {
  --primary: #0066ff;
  --primary-dark: #60a5fa;
  --secondary: #8b5cf6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --border-light: #e2e8f0;
  --border-dark: #334155;
  --bg-light: #ffffff;
  --bg-dark: #1e293b;
  --bg-hover-light: #f8fafc;
  --bg-hover-dark: #2d3748;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

/* Dark mode variables */
.dark-mode {
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --border-light: #334155;
  --bg-light: #1e293b;
  --bg-hover-light: #2d3748;
}

/* =========================
   Table Wrapper
========================= */
.table-wrapper {
  width: 100%;
  background: var(--bg-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  transition: all 0.2s ease;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

/* =========================
   Toolbar - All elements on one line
========================= */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-light);
  gap: 1rem;
  /* flex-wrap: nowrap; */
   flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: fit-content;
}

.toolbar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 2;
}

.toolbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex: 1;
  min-width: fit-content;
}

/* =========================
   Select All Button
========================= */
.select-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.selection-info {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  background: rgba(0, 102, 255, 0.1);
  border-radius: 40px;
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 500;
  height: 36px;
  white-space: nowrap;
}

.dark-mode .selection-info {
  background: rgba(96, 165, 250, 0.15);
  color: var(--primary-dark);
}

.selection-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.25rem;
  background: var(--primary);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.25rem;
}

.info-text {
  white-space: nowrap;
}

/* =========================
   Search Container - Using BaseInput
========================= */
.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
  z-index: 2;
}

/* BaseInput styling overrides */
.search-container :deep(.base-input) {
  margin-bottom: 0;
}

.search-container :deep(input) {
  width: 100%;
  height: 40px;
  padding: 0 2.5rem 0 2.5rem;
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.search-container :deep(input:focus) {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

.search-container :deep(input::placeholder) {
  color: var(--text-muted);
}

.search-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
}

.search-clear:hover {
  background: var(--bg-hover-light);
  color: var(--primary);
}

/* =========================
   Page Size Selector - Using BaseInput
========================= */
.page-size-selector {
  position: relative;
  display: inline-block;
  width: 130px;
}

/* BaseInput select styling */
.page-size-selector :deep(.base-input) {
  margin-bottom: 0;
}

.page-size-selector :deep(select) {
  width: 100%;
  height: 36px;
  padding: 0 2rem 0 1rem;
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.2s ease;
  background-image: none;
}

/* Light mode - use icon component */
:not(.dark-mode) .page-size-selector :deep(select) {
  background-image: none;
}

/* Dark mode - use background image arrow */
.dark-mode .page-size-selector :deep(select) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 0.75rem center !important;
  background-size: 1rem !important;
}

.dark-mode .select-arrow {
  display: none;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: var(--text-muted);
  pointer-events: none;
  transition: transform 0.2s ease;
  display: block;
  z-index: 2;
}

.page-size-selector :deep(select:focus) {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

.page-size-selector :deep(select:focus) + .select-arrow {
  transform: translateY(-50%) rotate(180deg);
  color: var(--primary);
}

.dark-mode .page-size-selector :deep(select:focus) {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

/* =========================
   Table Container
========================= */
/* .table-container {
  overflow-x: auto;
  position: relative;
  background: var(--bg-light);
} */
 .table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* ✅ smooth mobile scroll */
  position: relative;
  background: var(--bg-light);
}


.table-container.sticky-header {
  max-height: 500px;
  overflow-y: auto;
}

.table-container.sticky-header thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-loading {
  opacity: 0.7;
  pointer-events: none;
}

/* =========================
   Modern Table
========================= */
/* .modern-table {
  width: 100%;
  border-collapse: collapse;
} */
 .modern-table {
  width: max-content;   /* ✅ important */
  min-width: 100%;      /* ✅ fallback */
  border-collapse: collapse;
}

/* =========================
   Header with 30% Opacity
========================= */
.table-header {
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.3), rgba(139, 92, 246, 0.3));
  backdrop-filter: blur(8px);
  border-bottom: 2px solid var(--border-light);
}

.dark-mode .table-header {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(139, 92, 246, 0.3));
}

.table-header th {
  padding: 0 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  text-align: left;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
}

.header-label {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Sort Indicator */
.sort-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transition: all 0.2s ease;
}

.sort-indicator svg {
  width: 1rem;
  height: 1rem;
}

/* =========================
   Checkbox (Native - kept for performance)
========================= */
.checkbox-col {
  width: 50px;
  text-align: center;
  padding: 0 !important;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border-light);
  cursor: pointer;
  accent-color: var(--primary);
  transition: all 0.2s ease;
}

.checkbox:checked {
  transform: scale(1.05);
}

.checkbox:indeterminate {
  background-color: var(--primary);
  border-color: var(--primary);
  position: relative;
}

.checkbox:indeterminate::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 25%;
  right: 25%;
  height: 2px;
  background: white;
  transform: translateY(-50%);
}

.checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================
   Table Rows - Professional Zebra Striping
========================= */
.table-row {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--border-light);
}

/* Zebra striping */
.table-row:nth-child(even) {
  background-color: var(--bg-light);
}

.table-row:nth-child(odd) {
  background-color: rgba(0, 102, 255, 0.02);
}

.dark-mode .table-row:nth-child(odd) {
  background-color: rgba(96, 165, 250, 0.05);
}

/* Hover effect */
.table-row:hover {
  background-color: var(--bg-hover-light) !important;
  cursor: default;
}

.table-row.clickable:hover {
  cursor: pointer;
}

/* Selected row */
.table-row.selected {
  background-color: rgba(0, 102, 255, 0.1) !important;
  border-left: 3px solid var(--primary);
}

.dark-mode .table-row.selected {
  background-color: rgba(96, 165, 250, 0.15) !important;
}

/* Row cells */
.table-row td {
  padding: 0 1rem;
  color: var(--text-primary);   /* unified color */
  font-size: 0.9rem;           /* unified size */
  font-weight: 400;
}
.cell-text {
  font-size: inherit;
  color: inherit;
  font-weight: inherit;
}
/* .cell-text {
  display: block;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */
 @media (max-width: 640px) {
  .cell-text {
    white-space: normal;   /* ✅ allow wrapping */
    word-break: break-word;
  }
}

/* =========================
   Badge
========================= */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.875rem;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 1px solid transparent;
  height: 32px;
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  border-color: rgba(16, 185, 129, 0.2);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
  border-color: rgba(245, 158, 11, 0.2);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.2);
}

.badge-info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
  border-color: rgba(59, 130, 246, 0.2);
}

/* =========================
   Loading State
========================= */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* =========================
   Empty State
========================= */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* =========================
   Table Footer
========================= */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
  flex-wrap: wrap;
  gap: 1rem;
  background: var(--bg-light);
}

/* Pagination Info */
.pagination-info {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem;
  height: 40px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid var(--border-light);
  background: var(--bg-light);
  color: var(--text-secondary);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
}

.page-number:hover:not(:disabled) {
  border-color: var(--border-light);
  background: var(--bg-hover-light);
}

.page-number.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  font-weight: 600;
}

.page-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================
   Button Styles
========================= */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem;
  height: 36px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: var(--bg-light);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-light);
}

.btn-sm {
  height: 36px;
  font-size: 0.8125rem;
}

/* =========================
   Responsive Design
========================= */
@media (max-width: 1024px) {
  .search-container {
    max-width: 300px;
  }

  .page-size-selector {
    width: 110px;
  }
}

@media (max-width: 768px) {
  .table-toolbar {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .toolbar-left,
  .toolbar-center,
  .toolbar-right {
    flex: auto;
    width: 100%;
    justify-content: center;
  }

  .toolbar-left {
    order: 1;
  }

  .toolbar-center {
    order: 3;
  }

  .toolbar-right {
    order: 2;
  }

  .search-container {
    max-width: 100%;
  }

  .page-size-selector {
    width: 100%;
  }

  .table-footer {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .pagination {
    width: 100%;
    justify-content: center;
  }

  .pagination-info {
    width: 100%;
    text-align: center;
  }

  .page-number {
    min-width: 36px;
    height: 36px;
  }

  .pagination-btn {
    height: 36px;
  }
}

@media (max-width: 640px) {
  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .select-all-btn,
  .selection-info {
    width: 100%;
  }

  /* .table-row td {
    padding: 0 0.5rem;
    font-size: 0.875rem;
  } */
   @media (max-width: 640px) {
  .table-row td {
    padding: 0 0.4rem;   /* tighter */
    font-size: 0.8rem;
  }
}

  .badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    height: 28px;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn:hover,
  .pagination-btn:hover,
  .page-number:hover {
    transform: none;
  }

  .btn,
  .pagination-btn,
  .page-number {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Print Styles */
@media print {
  .table-wrapper {
    box-shadow: none;
    border: 1px solid #ddd;
  }

  .table-toolbar,
  .table-footer {
    display: none;
  }

  .table-header {
    background: #f8fafc !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
