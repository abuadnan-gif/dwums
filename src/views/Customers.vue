<!-- src/views/Customers.vue -->
<template>
  <div class="h-full w-full">
    <!-- Page Header -->
    <div class="px-6 py-8 border-b" :class="isDark ? 'border-white/10' : 'border-neutral-200/50'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Customer Management</h1>
          <p class="text-neutral-500 dark:text-neutral-400 mt-2">Manage all customer accounts, meters, and connections</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
            :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-neutral-200 hover:bg-black/5'">
            <svg class="w-5 h-5" :class="isDark ? 'text-white/80' : 'text-neutral-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-neutral-900'">Filter</span>
          </button>
          <button class="btn-elite flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Customer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6 h-[calc(100vh-12rem)] overflow-y-auto">
      <!-- Full-width Data Table -->
      <DataTable
        title="All Customers"
        description="12,847 active customer accounts"
        :columns="columns"
        :data="customers"
        :actions="actions"
        searchable
        exportable
        paginate
        :page-size="15"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import DataTable from '../components/ui/DataTable.vue'
import { useUtilityStore } from '../stores/utility'

const themeStore = useThemeStore()
const utilityStore = useUtilityStore()

const isDark = computed(() => themeStore.isDark)
const customers = computed(() => utilityStore.customers)

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Customer Name', sortable: true },
  { key: 'customerCode', label: 'Customer Code', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'meterNumber', label: 'Meter Number' },
  { key: 'connectionDate', label: 'Connection Date', type: 'date', sortable: true },
  { key: 'status', label: 'Status', type: 'badge', sortable: true },
  { key: 'balance', label: 'Balance', type: 'currency', sortable: true },
]

const actions = [
  { name: 'view', label: 'View Details', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'edit', label: 'Edit', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { name: 'delete', label: 'Delete', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', variant: 'danger' },
]
</script>

<style scoped>
/* Ensure full height */
.h-full {
  height: 100%;
}

.w-full {
  width: 100%;
}

/* Custom scrollbar */
.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar {
  width: 6px;
}

.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-track {
  background: transparent;
}

.h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.dark .h-\[calc\(100vh-12rem\)\]::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>