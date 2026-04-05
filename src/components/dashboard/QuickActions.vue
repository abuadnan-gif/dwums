<!-- components/dashboard/QuickActions.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: String,
  permissions: Array
})

const quickActions = computed(() => {
  const actions = {
    'Admin': [
      { name: 'New Application', icon: 'UserPlusIcon', route: '/admin/applicants/new', color: 'blue' },
      { name: 'Create Estimation', icon: 'CalculatorIcon', route: '/admin/estimations/costs', color: 'green' },
      { name: 'Add Staff', icon: 'UserGroupIcon', route: '/admin/staffs', color: 'purple' },
      { name: 'Manage Roles', icon: 'ShieldCheckIcon', route: '/admin/system/roles', color: 'orange' }
    ],
    'Customer-Service': [
      { name: 'New Application', icon: 'UserPlusIcon', route: '/admin/applicants/new', color: 'blue' },
      { name: 'Verify Documents', icon: 'DocumentCheckIcon', route: '/admin/applicants/documents', color: 'yellow' },
      { name: 'View Customers', icon: 'UsersIcon', route: '/admin/customers/all', color: 'green' }
    ],
    'Technical-Engineer': [
      { name: 'New Estimation', icon: 'CalculatorIcon', route: '/admin/estimations/costs', color: 'blue' },
      { name: 'View Work Orders', icon: 'ClipboardDocumentListIcon', route: '/admin/applicants/work-orders', color: 'green' },
      { name: 'Check Materials', icon: 'CubeIcon', route: '/admin/materials', color: 'orange' }
    ],
    'Finance-Officer': [
      { name: 'Process Payments', icon: 'CreditCardIcon', route: '/admin/billing/payments', color: 'blue' },
      { name: 'Manage Tariffs', icon: 'ReceiptPercentIcon', route: '/admin/billing/tariffs', color: 'green' },
      { name: 'View Reports', icon: 'ChartBarIcon', route: '/admin/reports/revenue', color: 'purple' }
    ],
    'Warehouse-Manager': [
      { name: 'Add Material', icon: 'CubeIcon', route: '/admin/materials', color: 'blue' },
      { name: 'Check Stock', icon: 'BuildingStorefrontIcon', route: '/admin/branch_material', color: 'orange' }
    ],
    'Compliance-Officer': [
      { name: 'Verify Documents', icon: 'DocumentCheckIcon', route: '/admin/applicants/documents', color: 'blue' },
      { name: 'View Applications', icon: 'UserPlusIcon', route: '/admin/applicants/new', color: 'green' }
    ],
    'Field-Technician': [
      { name: 'My Work Orders', icon: 'ClipboardDocumentListIcon', route: '/admin/applicants/work-orders', color: 'blue' },
      { name: 'Installations', icon: 'WrenchScrewdriverIcon', route: '/admin/estimations/installations', color: 'green' }
    ]
  }
  
  return actions[props.role] || actions['Customer-Service']
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
    <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <router-link
        v-for="action in quickActions"
        :key="action.name"
        :to="action.route"
        class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
      >
        <div :class="[
          'w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform',
          `bg-${action.color}-100 dark:bg-${action.color}-900/30`
        ]">
          <Icon :name="action.icon" :class="`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`" />
        </div>
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ action.name }}</span>
      </router-link>
    </div>
  </div>
</template>