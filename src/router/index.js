import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'

import AuthLayout from '@/components/layout/AuthLayout.vue'
import Login from '@/views/auth/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserRegister from '@/views/user/UserRegister.vue'
import MeterRegistration from '@/views/Meter/MeterRegistration.vue'
import CostEstimations from '@/views/Estimations/CostEstimations.vue'
import MainContent from '@/components/layout/MainContent.vue'
import roleRegister from '@/views/role/roleRegister.vue'
import permissionRegister from '@/views/permission/permissionRegister.vue'
import staffRegister from '@/views/staff/staffRegister.vue'
import Regions from '@/views/administrative/Regions.vue'
import Kebele from '@/views/administrative/Kebele.vue'
import BranchMaterial from '@/views/Branches/BranchMaterial.vue'
import Branches from '@/views/Branches/ManageBranches.vue'
import Applicant from '@/views/applicants/Applicant.vue'
import workorder from '@/views/WorkOrders/workorder.vue'
import CategoryRegistration from '@/views/Category/CategoryRegistration.vue'
import MaterialRegistration from '@/views/Material/MaterialRegistration.vue'
import OtherCharges from '@/views/OtherCharges/otherCharges.vue'
import RequestType from '@/views/references/request_type.vue'
import StatusCode from '@/views/references/StatusCode.vue'

const PlaceholderView = defineComponent({
  name: 'PlaceholderView',
  props: {
    title: { type: String, default: 'Feature Under Development' },
    description: { type: String, default: 'This section is under development.' }
  },
  setup(props) {
    return { props }
  },
  template: `<div class="p-6"><h2 class="text-xl font-bold mb-2">{{ props.title }}</h2><p>{{ props.description }}</p></div>`
})

const placeholderRoute = (title, description) => ({
  component: PlaceholderView,
  props: { title, description }
})

const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [{ path: '', name: 'login', component: Login }]
  },
  {
    path: '/admin',
    component: MainContent,
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'regions', name: 'Regions', component: Regions },
      { path: 'kebeles', name: 'Kebeles', component: Kebele },
      { path: 'branches/all', name: 'All Branches', component: Branches },
      { path: 'branch_material', name: 'Branch Materials', component: BranchMaterial },
      { path: 'reference/status-codes', name: 'Status Code', component: StatusCode },
      { path: 'applicants/new', name: 'New Applications', component: Applicant },
      { path: 'reference/request-types', name: 'Request Types', component: RequestType },
      {
        path: 'reference/categories',
        name: 'Category Registration',
        component: CategoryRegistration
      },
      { path: 'applicants/work-orders', name: 'Work Orders', component: workorder },
      { path: 'staffs', name: 'AllStaffs', component: staffRegister },
      { path: 'users', name: 'AllUsers', component: UserRegister },
      { path: 'meters', name: 'AllMeters', component: MeterRegistration },
      { path: 'materials', name: 'All Materials', component: MaterialRegistration },
      { path: 'estimations/costs', name: 'CostEstimations', component: CostEstimations },
      { path: 'estimations/charges', name: 'Other Charges', component: OtherCharges },
      {
        path: 'estimations/materials',
        name: 'MaterialInventory',
        ...placeholderRoute('Material Inventory', 'Manage estimation materials')
      },
      {
        path: 'estimations/payments',
        name: 'PaymentTracking',
        ...placeholderRoute('Payment Tracking', 'Track payments')
      },
      {
        path: 'estimations/installations',
        name: 'InstallationQueue',
        ...placeholderRoute('Installation Queue', 'Installation scheduling')
      },
      {
        path: 'billing/tariffs',
        name: 'TariffManagement',
        ...placeholderRoute('Tariff Management', 'Manage tariffs')
      },
      {
        path: 'billing/readings',
        name: 'MeterReadings',
        ...placeholderRoute('Meter Readings', 'Manage meter readings')
      },
      {
        path: 'reports/revenue',
        name: 'RevenueAnalytics',
        ...placeholderRoute('Revenue Analytics', 'Revenue reports')
      },
      {
        path: 'reports/usage',
        name: 'UsagePatterns',
        ...placeholderRoute('Usage Patterns', 'Usage trends')
      },
      {
        path: 'system/users',
        name: 'UserManagement',
        ...placeholderRoute('User Management', 'System users')
      },
      {
        path: 'system/settings',
        name: 'SystemSettings',
        ...placeholderRoute('System Settings', 'Configure system settings')
      },
      { path: 'system/roles', name: 'Roles', component: roleRegister },
      { path: 'system/permissions', name: 'Permissions', component: permissionRegister },
      {
        path: 'quick-actions',
        name: 'QuickActions',
        component: () => import('../views/QuickActions.vue')
      },
      {
        path: 'hierarchy/regions',
        ...placeholderRoute('Regions Management', 'Manage Ethiopia federal regions')
      },
      { path: 'hierarchy/zones', ...placeholderRoute('Zones Management', 'Manage zones') },
      { path: 'hierarchy/woredas', ...placeholderRoute('Woredas Management', 'Manage districts') },
      { path: 'hierarchy/cities', ...placeholderRoute('Cities Management', 'Manage cities') },
      {
        path: 'hierarchy/kebeles',
        ...placeholderRoute('Kebeles Management', 'Manage villages/neighborhoods')
      },
      {
        path: 'hierarchy/branches',
        ...placeholderRoute('Branches Management', 'Manage utility branches')
      },
      {
        path: 'applicants/new',
        ...placeholderRoute('New Applications', 'Register new applicants')
      },
      {
        path: 'applicants/documents',
        ...placeholderRoute('Document Verification', 'Verify documents')
      },
      { path: 'applicants/work-orders', ...placeholderRoute('Work Orders', 'Manage work orders') }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path.startsWith('/admin') && !token) {
    next('/')
  } else {
    next()
  }
})

export default router