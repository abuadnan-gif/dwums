<template>
  <div class="elite-card hover:shadow-2xl transition-all duration-500 overflow-hidden">
    <!-- Card Header -->
    <div class="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Top Customers</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Highest consumption and revenue</p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="toggleView"
            class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            :title="viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'">
            <svg class="w-5 h-5 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="viewMode === 'list'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button class="btn-elite text-sm px-4 py-2">
            Export Report
          </button>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-neutral-200/50 dark:border-neutral-800/50">
            <th class="text-left p-6">
              <div class="flex items-center">
                <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Customer</span>
                <button @click="sortBy('name')" class="ml-2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="sortColumn === 'name' 
                        ? (sortDirection === 'asc' 
                          ? 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' 
                          : 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12') 
                        : 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'" />
                  </svg>
                </button>
              </div>
            </th>
            <th class="text-left p-6">
              <div class="flex items-center">
                <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Consumption</span>
                <button @click="sortBy('consumption')" class="ml-2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="sortColumn === 'consumption' 
                        ? (sortDirection === 'asc' 
                          ? 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' 
                          : 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12') 
                        : 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'" />
                  </svg>
                </button>
              </div>
            </th>
            <th class="text-left p-6">
              <div class="flex items-center">
                <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Revenue</span>
                <button @click="sortBy('revenue')" class="ml-2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="sortColumn === 'revenue' 
                        ? (sortDirection === 'asc' 
                          ? 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' 
                          : 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12') 
                        : 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'" />
                  </svg>
                </button>
              </div>
            </th>
            <th class="text-left p-6">
              <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</span>
            </th>
            <th class="text-left p-6">
              <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Trend</span>
            </th>
            <th class="text-left p-6">
              <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in sortedCustomers" :key="customer.id" 
            class="border-b border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 group transition-all duration-300">
            <!-- Customer Info -->
            <td class="p-6">
              <div class="flex items-center">
                <div class="relative">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark flex items-center justify-center text-white font-semibold">
                    {{ customer.initials }}
                  </div>
                  <div :class="[
                    'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-surface-dark',
                    customer.status === 'active' ? 'bg-success-light dark:bg-success-dark' :
                    customer.status === 'pending' ? 'bg-warning-light dark:bg-warning-dark' :
                    'bg-critical-light dark:bg-critical-dark'
                  ]"></div>
                </div>
                <div class="ml-4">
                  <p class="font-medium text-neutral-900 dark:text-neutral-100">{{ customer.name }}</p>
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ customer.location }}</p>
                </div>
              </div>
            </td>
            
            <!-- Consumption -->
            <td class="p-6">
              <div class="flex items-center">
                <div class="w-24 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mr-3">
                  <div class="h-full rounded-full bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark"
                    :style="{ width: `${customer.consumptionPercentage}%` }"></div>
                </div>
                <span class="font-medium text-neutral-900 dark:text-neutral-100">
                  {{ customer.consumption.toLocaleString() }} m³
                </span>
              </div>
            </td>
            
            <!-- Revenue -->
            <td class="p-6">
              <div class="flex items-center">
                <div class="p-2 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 mr-3">
                  <svg class="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-neutral-900 dark:text-neutral-100">{{ formatCurrency(customer.revenue) }}</p>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400">Monthly avg</p>
                </div>
              </div>
            </td>
            
            <!-- Status -->
            <td class="p-6">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                customer.status === 'active' 
                  ? 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark'
                  : customer.status === 'pending'
                  ? 'bg-warning-light/10 text-warning-light dark:bg-warning-dark/10 dark:text-warning-dark'
                  : 'bg-critical-light/10 text-critical-light dark:bg-critical-dark/10 dark:text-critical-dark'
              ]">
                {{ customer.status.charAt(0).toUpperCase() + customer.status.slice(1) }}
              </span>
            </td>
            
            <!-- Trend -->
            <td class="p-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" :class="customer.trend >= 0 ? 'text-success-light dark:text-success-dark' : 'text-critical-light dark:text-critical-dark'" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="customer.trend >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" />
                </svg>
                <span :class="[
                  'font-medium',
                  customer.trend >= 0 
                    ? 'text-success-light dark:text-success-dark' 
                    : 'text-critical-light dark:text-critical-dark'
                ]">
                  {{ customer.trend >= 0 ? '+' : '' }}{{ customer.trend }}%
                </span>
              </div>
            </td>
            
            <!-- Actions -->
            <td class="p-6">
              <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="viewCustomer(customer)" 
                  class="p-2 rounded-lg hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors"
                  title="View Details">
                  <svg class="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="sendNotification(customer)"
                  class="p-2 rounded-lg hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors"
                  title="Send Notification">
                  <svg class="w-4 h-4 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button @click="generateReport(customer)"
                  class="p-2 rounded-lg hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10 transition-colors"
                  title="Generate Report">
                  <svg class="w-4 h-4 text-secondary-light dark:text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="customers.length === 0" class="p-12 text-center">
      <div class="inline-block">
        <div class="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h1m-1 0v1m0-1V8m0 13v1m0-16V4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No customers found</h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Start by adding new customers to your system</p>
        <button class="btn-elite mt-4">
          Add New Customer
        </button>
      </div>
    </div>

    <!-- Table Footer -->
    <div v-if="customers.length > 0" class="p-6 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ customers.length }} customers
        </div>
        <div class="flex items-center space-x-2">
          <button @click="previousPage" :disabled="currentPage === 1"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === 1
                ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
            ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex items-center space-x-1">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              ]">
              {{ page }}
            </button>
          </div>
          
          <button @click="nextPage" :disabled="currentPage === totalPages"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === totalPages
                ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
            ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const viewMode = ref('list')
const sortColumn = ref('revenue')
const sortDirection = ref('desc')
const currentPage = ref(1)
const pageSize = 8

const customers = ref([
  {
    id: 1,
    name: 'Tewodros Alemu Manufacturing',
    initials: 'TA',
    location: 'Addis Ababa, Bole',
    consumption: 45000,
    consumptionPercentage: 95,
    revenue: 1250000,
    status: 'active',
    trend: 12.5
  },
  {
    id: 2,
    name: 'Sara Mohammed Textiles',
    initials: 'SM',
    location: 'Dire Dawa',
    consumption: 38000,
    consumptionPercentage: 80,
    revenue: 980000,
    status: 'active',
    trend: 8.2
  },
  {
    id: 3,
    name: 'Kebede Hotel & Resort',
    initials: 'KH',
    location: 'Bahir Dar',
    consumption: 32000,
    consumptionPercentage: 68,
    revenue: 820000,
    status: 'active',
    trend: 15.3
  },
  {
    id: 4,
    name: 'Zenebe Commercial Center',
    initials: 'ZC',
    location: 'Mekele',
    consumption: 28000,
    consumptionPercentage: 60,
    revenue: 720000,
    status: 'pending',
    trend: -3.2
  },
  {
    id: 5,
    name: 'Alemitu Pharmaceuticals',
    initials: 'AP',
    location: 'Adama',
    consumption: 25000,
    consumptionPercentage: 53,
    revenue: 650000,
    status: 'active',
    trend: 22.1
  },
  {
    id: 6,
    name: 'Bereket Construction',
    initials: 'BC',
    location: 'Hawassa',
    consumption: 22000,
    consumptionPercentage: 47,
    revenue: 580000,
    status: 'suspended',
    trend: -15.7
  },
  {
    id: 7,
    name: 'Meron Trading PLC',
    initials: 'MT',
    location: 'Jimma',
    consumption: 19000,
    consumptionPercentage: 40,
    revenue: 520000,
    status: 'active',
    trend: 5.8
  },
  {
    id: 8,
    name: 'Yohannes Agricultural',
    initials: 'YA',
    location: 'Gondar',
    consumption: 16000,
    consumptionPercentage: 34,
    revenue: 450000,
    status: 'active',
    trend: 18.9
  }
])

const sortedCustomers = computed(() => {
  const sorted = [...customers.value].sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sorted.slice(start, end)
})

const totalPages = computed(() => Math.ceil(customers.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => Math.min(currentPage.value * pageSize, customers.value.length))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 3
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 1)
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

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'desc'
  }
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
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

const viewCustomer = (customer) => {
  console.log('View customer:', customer)
  // Implement customer view logic
}

const sendNotification = (customer) => {
  console.log('Send notification to:', customer)
  // Implement notification logic
}

const generateReport = (customer) => {
  console.log('Generate report for:', customer)
  // Implement report generation logic
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<style scoped>
/* Smooth hover transitions */
tr {
  transition: all 0.3s ease;
}

tr:hover {
  background: linear-gradient(90deg, 
    rgba(var(--primary-rgb), 0.05) 0%,
    rgba(var(--accent-rgb), 0.05) 100%);
}

/* Fade-in animation for rows */
@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tbody tr {
  animation: fadeInRow 0.5s ease-out;
  animation-fill-mode: both;
}

tbody tr:nth-child(1) { animation-delay: 0.1s; }
tbody tr:nth-child(2) { animation-delay: 0.2s; }
tbody tr:nth-child(3) { animation-delay: 0.3s; }
tbody tr:nth-child(4) { animation-delay: 0.4s; }
tbody tr:nth-child(5) { animation-delay: 0.5s; }
tbody tr:nth-child(6) { animation-delay: 0.6s; }
tbody tr:nth-child(7) { animation-delay: 0.7s; }
tbody tr:nth-child(8) { animation-delay: 0.8s; }

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #0066FF, #8B5CF6);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #3B82F6, #A78BFA);
}
</style>