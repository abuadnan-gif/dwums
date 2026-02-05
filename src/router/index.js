import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'
import Dashboard from '../views/Dashboard.vue'
import UserRegister from '../views/user/UserRegister.vue'
import MeterRegistration from '@/views/Meter/MeterRegistration.vue'

/**
 * Placeholder component (Composition API)
 */
const PlaceholderView = defineComponent({
  name: 'PlaceholderView',
  props: {
    title: {
      type: String,
      default: 'Feature Under Development'
    },
    description: {
      type: String,
      default: 'This section is currently being developed and will be available soon.'
    }
  },
  setup(props) {
    return { props }
  },
  
})

/**
 * Helper to generate placeholder routes
 */
const placeholderRoute = (title, description) => ({
  component: PlaceholderView,
  props: { title, description }
})

const routes = [
  // { path: '/', redirect: '/dashboard' },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  {
    path: '/admin-hierarchy',
    redirect: '/admin-hierarchy/regions',
    children: [
      { path: 'regions', name: 'Regions', ...placeholderRoute(
        'Regions Management',
        'Manage Ethiopia federal regions and their administrative data.'
      )},
      { path: 'zones', name: 'Zones', ...placeholderRoute(
        'Zones Management',
        'Manage sub-regional zones and their operational oversight.'
      )},
      { path: 'woredas', name: 'Woredas', ...placeholderRoute(
        'Woredas Management',
        'Manage districts/woredas for branch oversight and governance.'
      )},
      { path: 'cities', name: 'Cities', ...placeholderRoute(
        'Cities Management',
        'Manage urban municipalities and city-specific operations.'
      )},
      { path: 'kebeles', name: 'Kebeles', ...placeholderRoute(
        'Kebeles Management',
        'Manage village/neighborhood level registration points.'
      )},
      { path: 'branches', name: 'Branches', ...placeholderRoute(
        'Branches Management',
        'Manage physical utility offices and field stations.'
      )}
    ]
  },

  {
    path: '/applicants',
    redirect: '/applicants/new',
    children: [
      { path: 'new', name: 'NewApplications', ...placeholderRoute(
        'New Applications',
        'Register and manage new water service applications.'
      )},
      { path: 'documents', name: 'DocumentVerification', ...placeholderRoute(
        'Document Verification',
        'Verify applicant documents and compliance checks.'
      )},
      { path: 'work-orders', name: 'WorkOrders', ...placeholderRoute(
        'Work Orders',
        'Manage actionable tasks and fieldwork assignments.'
      )}
    ]
  },
  {
    path: '/user',
    redirect: '/user/all',
    children: [
      {
        path: 'all',
        name: 'AllUsers',
        component: UserRegister
      }
    ]
  },

  {
    path: '/customers',
    redirect: '/customers/all',
    children: [
      { path: 'all', name: 'AllCustomers', ...placeholderRoute(
        'All Customers',
        'View and manage all active utility customers.'
      )},
      // { path: 'meters', name: 'MeterManagement', ...placeholderRoute(
      //   'Meter Management',
      //   'Manage installed water meters and devices.'
      // )}
    ]
  },
{ 
 

       path: '/meters',
    redirect: '/meters/all',
    children: [
      {
        path: 'all',
        name: 'AllMeters',
        component: MeterRegistration
      }
    ]
  },
  {
    path: '/billing',
    redirect: '/billing/tariffs',
    children: [
      { path: 'tariffs', name: 'TariffManagement', ...placeholderRoute(
        'Tariff Management',
        'Manage water tariff rates and pricing schedules.'
      )},
      { path: 'readings', name: 'MeterReadings', ...placeholderRoute(
        'Meter Readings',
        'Record and manage monthly water consumption readings.'
      )}
    ]
  },

  {
    path: '/reports',
    redirect: '/reports/revenue',
    children: [
      { path: 'revenue', name: 'RevenueAnalytics', ...placeholderRoute(
        'Revenue Analytics',
        'Analyze revenue trends and financial performance.'
      )},
      { path: 'usage', name: 'UsagePatterns', ...placeholderRoute(
        'Usage Patterns',
        'Analyze water consumption patterns and trends.'
      )}
    ]
  },

  {
    path: '/system',
    redirect: '/system/users',
    children: [
      { path: 'users', name: 'UserManagement', ...placeholderRoute(
        'User Management',
        'Manage system users and their permissions.'
      )},
      { path: 'settings', name: 'SystemSettings', ...placeholderRoute(
        'System Settings',
        'Configure system preferences and global settings.'
      )}
    ]
  },

  {
    path: '/quick-actions',
    name: 'QuickActions',
    component: () => import('../views/QuickActions.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
