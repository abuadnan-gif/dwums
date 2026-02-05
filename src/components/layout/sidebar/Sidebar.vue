<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Dropdown from './SidebarDropdown.vue'
import SidebarItem from './SidebarItem.vue'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const sidebarCollapsed = computed(() => themeStore.sidebarCollapsed)

// Centralized state for expanded dropdown
const expandedDropdown = ref(null)

// Function to handle dropdown toggle with exclusive expansion
const handleDropdownToggle = (dropdownTitle) => {
  if (expandedDropdown.value === dropdownTitle) {
    // If clicking the same dropdown, collapse it
    expandedDropdown.value = null
  } else {
    // Otherwise, expand the clicked dropdown and collapse others
    expandedDropdown.value = dropdownTitle
  }
}

// Watch for route changes to auto-open the relevant dropdown
watch(
  () => route.path,
  (newPath) => {
    // Reset expanded dropdown when route changes
    expandedDropdown.value = null

    // Define dropdown paths mapping
    const dropdownPaths = {
      Administrative: '/admin-hierarchy',
      User: '/user',
      Branches: '/branches',
      Applicants: '/applicants',
      Estimations: '/estimations',
      Customers: '/customers',
      Billing: '/billing',
      Reference: '/reference',
      Reports: '/reports',
      System: '/system'
    }

    // Find which dropdown should be expanded based on current route
    for (const [title, path] of Object.entries(dropdownPaths)) {
      if (newPath.startsWith(path)) {
        expandedDropdown.value = title
        break
      }
    }
  },
  { immediate: true }
)

const stats = ref({
  activeStaff: '48',
  pendingApplications: '156',
  activeCustomers: '12.8K'
})

const toggleSidebar = () => {
  themeStore.toggleSidebar()
}

// Administrative Hierarchy Items
const adminItems = [
  {
    name: 'Regions',
    path: '/admin-hierarchy/regions',
    badge: '11',
    icon: 'GlobeAltIcon'
  },
  {
    name: 'Zones',
    path: '/admin-hierarchy/zones',
    badge: '78',
    icon: 'GlobeAsiaAustraliaIcon'
  },
  {
    name: 'Woredas',
    path: '/admin-hierarchy/woredas',
    badge: '645',
    icon: 'MapIcon'
  },
  {
    name: 'Cities',
    path: '/admin-hierarchy/cities',
    badge: '42',
    icon: 'BuildingOffice2Icon'
  },
  {
    name: 'Kebeles',
    path: '/admin-hierarchy/kebeles',
    badge: '2,147',
    icon: 'MapPinIcon'
  }
]

// Staff/User & Organization
const userItems = [
  {
    name: 'All Staff',
    path: '/staff/all',
    badge: '48',
    icon: 'UsersIcon'
  },
  {
    name: 'All User',
    path: '/user/all',
    badge: '48',
    icon: 'UserIcon'
  },
  {
    name: 'Roles & Permissions',
    path: '/staff/roles',
    badge: '8',
    icon: 'ShieldCheckIcon'
  }
]

// Branch Governance Items
const branchItems = [
  {
    name: 'All Branches',
    path: '/branches/all',
    badge: '89',
    icon: 'BuildingLibraryIcon'
  },
  {
    name: 'Coverage Areas',
    path: '/branches/coverage',
    badge: null,
    icon: 'MapIcon'
  },
  {
    name: 'Branch Performance',
    path: '/branches/performance',
    badge: null,
    icon: 'ChartBarIcon'
  }
]

// Applicant & Onboarding Items
const applicantItems = [
  {
    name: 'New Applications',
    path: '/applicants/new',
    badge: '45',
    icon: 'UserPlusIcon'
  },
  {
    name: 'Document Verification',
    path: '/applicants/documents',
    badge: '23',
    icon: 'DocumentCheckIcon'
  },
  {
    name: 'Work Orders',
    path: '/applicants/work-orders',
    badge: '67',
    icon: 'ClipboardDocumentListIcon'
  },
  {
    name: 'Pending Estimations',
    path: '/applicants/estimations',
    badge: '34',
    icon: 'ClockIcon'
  },
  {
    name: 'Approval Queue',
    path: '/applicants/approvals',
    badge: '12',
    icon: 'QueueListIcon'
  }
]

// Estimation & Costing Items
const estimationItems = [
  {
    name: 'Cost Estimations',
    path: '/estimations/costs',
    badge: null,
    icon: 'CalculatorIcon'
  },
  {
    name: 'Material Inventory',
    path: '/estimations/materials',
    badge: '2.1K',
    icon: 'ArchiveBoxIcon'
  },
  {
    name: 'Other Charges',
    path: '/estimations/charges',
    badge: null,
    icon: 'ReceiptPercentIcon'
  },
  {
    name: 'Payment Tracking',
    path: '/estimations/payments',
    badge: null,
    icon: 'CreditCardIcon'
  },
  {
    name: 'Installation Queue',
    path: '/estimations/installations',
    badge: '89',
    icon: 'WrenchScrewdriverIcon'
  }
]

// Customer & Metering Items
const customerItems = [
  {
    name: 'All Customers',
    path: '/customers/all',
    badge: '12.8K',
    icon: 'UsersIcon'
  },
  {
    name: 'Meter Management',
    path: '/meters/all',
    badge: '15.2K',
    icon: 'BoltIcon'
  },
  {
    name: 'QR Code Generator',
    path: '/customers/qr-codes',
    badge: null,
    icon: 'QrCodeIcon'
  },
  {
    name: 'Connection Requests',
    path: '/customers/connections',
    badge: '21',
    icon: 'PlugIcon'
  },
  {
    name: 'Customer Categories',
    path: '/customers/categories',
    badge: '7',
    icon: 'RectangleStackIcon'
  }
]

// Tariff & Billing Items
const billingItems = [
  {
    name: 'Tariff Management',
    path: '/billing/tariffs',
    badge: '14',
    icon: 'ReceiptPercentIcon'
  },
  {
    name: 'Meter Readings',
    path: '/billing/readings',
    badge: '12.8K',
    icon: 'EyeIcon'
  },
  {
    name: 'Usage Breakdown',
    path: '/billing/usage',
    badge: null,
    icon: 'ChartPieIcon'
  },
  {
    name: 'Monthly Bills',
    path: '/billing/bills',
    badge: '12.8K',
    icon: 'DocumentTextIcon'
  },
  {
    name: 'Payment Collection',
    path: '/billing/payments',
    badge: null,
    icon: 'BanknotesIcon'
  },
  {
    name: 'Overdue Accounts',
    path: '/billing/overdue',
    badge: '324',
    icon: 'ExclamationTriangleIcon'
  }
]

// Reference Data Items
const referenceItems = [
  {
    name: 'Request Types',
    path: '/reference/request-types',
    badge: null,
    icon: 'DocumentMagnifyingGlassIcon'
  },
  {
    name: 'Status Codes',
    path: '/reference/status-codes',
    badge: null,
    icon: 'HashtagIcon'
  },
  {
    name: 'Categories',
    path: '/reference/categories',
    badge: '7',
    icon: 'TagIcon'
  },
  {
    name: 'Submission Methods',
    path: '/reference/submission-methods',
    badge: null,
    icon: 'PaperAirplaneIcon'
  }
]

// Reports & Analytics Items
const reportItems = [
  {
    name: 'Revenue Analytics',
    path: '/reports/revenue',
    badge: null,
    icon: 'CurrencyDollarIcon'
  },
  {
    name: 'Usage Patterns',
    path: '/reports/usage',
    badge: null,
    icon: 'ChartLineIcon'
  },
  {
    name: 'Staff Performance',
    path: '/reports/staff-performance',
    badge: null,
    icon: 'TrophyIcon'
  },
  {
    name: 'Operational Efficiency',
    path: '/reports/efficiency',
    badge: null,
    icon: 'CogIcon'
  },
  {
    name: 'System Health',
    path: '/reports/health',
    badge: null,
    icon: 'HeartIcon'
  },
  {
    name: 'Export Reports',
    path: '/reports/export',
    badge: null,
    icon: 'ArrowDownTrayIcon'
  }
]

// System Management Items
const systemItems = [
  {
    name: 'User Management',
    path: '/system/users',
    badge: '48',
    icon: 'UserCircleIcon'
  },
  {
    name: 'Role Permissions',
    path: '/system/roles',
    badge: '12',
    icon: 'ShieldCheckIcon'
  },
  {
    name: 'System Logs',
    path: '/system/logs',
    badge: null,
    icon: 'ClipboardDocumentListIcon'
  },
  {
    name: 'API Integration',
    path: '/system/api',
    badge: null,
    icon: 'CpuChipIcon'
  },
  {
    name: 'Database Backup',
    path: '/system/backup',
    badge: null,
    icon: 'CloudArrowDownIcon'
  },
  {
    name: 'System Settings',
    path: '/system/settings',
    badge: null,
    icon: 'Cog6ToothIcon'
  }
]

// Function to generate random particle positions
const getParticleStyle = (index) => {
  const top = Math.floor(Math.random() * 100)
  const left = Math.floor(Math.random() * 100)
  const delay = Math.random() * 5

  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}
</script>
<template>
  <aside
    :class="[
      'fixed top-16 h-[calc(100vh-4rem)] z-50 transition-transform duration-300',
      'lg:translate-x-0',
      themeStore.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full',
      sidebarCollapsed ? 'w-20 lg:w-20' : 'w-64 lg:w-64'
    ]"
  >
    <!-- Animated Background Gradient -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-dark/10 via-accent-dark/10 to-transparent dark:from-primary-dark/20 dark:via-accent-dark/20 blur-3xl opacity-60"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary-dark/10 via-primary-dark/10 to-transparent dark:from-secondary-dark/20 dark:via-primary-dark/20 blur-3xl opacity-60"
      ></div>
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="i in 8"
        :key="i"
        class="absolute w-1 h-1 rounded-full bg-white/10 dark:bg-white/5"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Glass Morphism Overlay -->
    <div
      class="absolute inset-0 backdrop-blur-xl bg-gradient-to-b from-white/80 to-white/60 dark:from-surface-dark/90 dark:to-surface-dark/80"
    ></div>
    <div class="absolute inset-0 border-r border-gray-300 dark:border-white/10"></div>

    <div class="relative h-full flex flex-col">
      <!-- Sidebar Toggle Button -->
      <div class="p-4 border-b border-white/10 dark:border-white/5 relative">
        <button
          @click="toggleSidebar"
          class="w-full group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95"
          :class="[
            'sidebar-toggle-btn',
            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
          ]"
          aria-label="Toggle sidebar"
        >
          <div class="p-3 flex items-center justify-center">
            <!-- Arrow Icon (changes based on collapsed state) -->
            <Icon
              :name="sidebarCollapsed ? 'ArrowRightCircleIcon' : 'ArrowLeftCircleIcon'"
              class="w-6 h-6 transition-transform duration-500"
              :class="isDark ? 'text-white/80' : 'text-neutral-600'"
            />

            <!-- Collapse Text -->
            <transition
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="transform opacity-0 -translate-x-4"
              enter-to-class="transform opacity-100 translate-x-0"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="transform opacity-100 translate-x-0"
              leave-to-class="transform opacity-0 -translate-x-4"
            >
              <span
                v-if="!sidebarCollapsed"
                class="ml-3 text-sm font-medium"
                :class="isDark ? 'text-white/80' : 'text-neutral-700'"
              >
                Collapse
              </span>
            </transition>
          </div>

          <!-- Hover Glow Effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          ></div>

          <!-- Tooltip for Collapsed State -->
          <div
            v-if="sidebarCollapsed"
            class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50"
            :class="['premium-tooltip', isDark ? 'dark-tooltip' : 'light-tooltip']"
          >
            Expand Sidebar
          </div>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <div class="space-y-2">
          <!-- Dashboard -->
          <SidebarItem
            title="Dashboard"
            icon="HomeIcon"
            :active="$route.path === '/dashboard'"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :badge="null"
            path="/dashboard"
          />

          <!-- Administrative Hierarchy -->
          <Dropdown
            title="Administrative"
            icon="MapIcon"
            :items="adminItems"
            :is-active="$route.path.startsWith('/admin-hierarchy')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Administrative'"
            @toggle="handleDropdownToggle('Administrative')"
          />

          <!-- Staff & Organization -->
          <Dropdown
            title="User"
            icon="UserGroupIcon"
            :items="userItems"
            :is-active="$route.path.startsWith('/user')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'User'"
            @toggle="handleDropdownToggle('User')"
          />

          <!-- Branch Governance -->
          <Dropdown
            title="Branches"
            icon="BuildingOfficeIcon"
            :items="branchItems"
            :is-active="$route.path.startsWith('/branches')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Branches'"
            @toggle="handleDropdownToggle('Branches')"
          />

          <!-- Applicants & Onboarding -->
          <Dropdown
            title="Applicants"
            icon="UserPlusIcon"
            :items="applicantItems"
            :is-active="$route.path.startsWith('/applicants')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Applicants'"
            @toggle="handleDropdownToggle('Applicants')"
          />

          <!-- Estimation & Costing -->
          <Dropdown
            title="Estimations"
            icon="CalculatorIcon"
            :items="estimationItems"
            :is-active="$route.path.startsWith('/estimations')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Estimations'"
            @toggle="handleDropdownToggle('Estimations')"
          />

          <!-- Customer & Metering -->
          <Dropdown
            title="Customers"
            icon="UserGroupIcon"
            :items="customerItems"
            :is-active="$route.path.startsWith('/customers')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Customers'"
            @toggle="handleDropdownToggle('Customers')"
          />

          <!-- Tariff & Billing -->
          <Dropdown
            title="Billing"
            icon="BanknotesIcon"
            :items="billingItems"
            :is-active="$route.path.startsWith('/billing')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Billing'"
            @toggle="handleDropdownToggle('Billing')"
          />

          <!-- Reference Data -->
          <Dropdown
            title="Reference"
            icon="BookOpenIcon"
            :items="referenceItems"
            :is-active="$route.path.startsWith('/reference')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Reference'"
            @toggle="handleDropdownToggle('Reference')"
          />

          <!-- Reports & Analytics -->
          <Dropdown
            title="Reports"
            icon="ChartBarIcon"
            :items="reportItems"
            :is-active="$route.path.startsWith('/reports')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'Reports'"
            @toggle="handleDropdownToggle('Reports')"
          />

          <!-- System Management -->
          <Dropdown
            title="System"
            icon="Cog6ToothIcon"
            :items="systemItems"
            :is-active="$route.path.startsWith('/system')"
            :collapsed="sidebarCollapsed"
            :is-dark="isDark"
            :is-open="expandedDropdown === 'System'"
            @toggle="handleDropdownToggle('System')"
          />
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-white/10 dark:border-white/5 relative">
        <div
          :class="['flex items-center', sidebarCollapsed ? 'justify-center' : 'justify-between']"
        >
          <!-- User Avatar -->
          <div class="relative group">
            <div class="relative">
              <div
                class="absolute -inset-1 bg-gradient-to-r from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark rounded-full opacity-20 blur group-hover:opacity-30 transition-opacity duration-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>


