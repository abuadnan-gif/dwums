// utils/sidebarConfig.js
export const roleBasedSidebar = {
  // Admin - Full Access
  Admin: {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'Administrative',
        icon: 'MapIcon',
        items: [
          { name: 'Regions', path: '/admin/regions', icon: 'GlobeAltIcon', permission: 'view_regions' },
          { name: 'Kebeles', path: '/admin/kebeles', icon: 'MapIcon', permission: 'view_kebeles' }
        ]
      },
      {
        title: 'User Management',
        icon: 'UserGroupIcon',
        items: [
          { name: 'All Staff', path: '/admin/staffs', icon: 'UsersIcon', permission: 'view_staff' },
          { name: 'All Users', path: '/admin/users', icon: 'UserIcon', permission: 'view_users' },
          { name: 'Roles', path: '/admin/system/roles', icon: 'ShieldCheckIcon', permission: 'manage_roles' },
          { name: 'Permissions', path: '/admin/system/permissions', icon: 'KeyIcon', permission: 'manage_permissions' }
        ]
      },
      {
        title: 'Branches',
        icon: 'BuildingOfficeIcon',
        items: [
          { name: 'All Branches', path: '/admin/branches/all', icon: 'BuildingLibraryIcon', permission: 'view_branches' },
          { name: 'Branch Material', path: '/admin/branch_material', icon: 'CubeIcon', permission: 'view_branch_materials' }
        ]
      },
      {
        title: 'Applicants',
        icon: 'UserPlusIcon',
        items: [
          { name: 'New Applications', path: '/admin/applicants/new', icon: 'UserPlusIcon', permission: 'create_applicants' },
          { name: 'Document Verification', path: '/admin/applicants/documents', icon: 'DocumentCheckIcon', permission: 'verify_documents' },
          { name: 'Work Orders', path: '/admin/applicants/work-orders', icon: 'ClipboardDocumentListIcon', permission: 'view_workorders' }
        ]
      },
      {
        title: 'Estimations',
        icon: 'CalculatorIcon',
        items: [
          { name: 'Cost Estimations', path: '/admin/estimations/costs', icon: 'CalculatorIcon', permission: 'create_estimations' },
          { name: 'All Materials', path: '/admin/materials', icon: 'ArchiveBoxIcon', permission: 'view_materials' },
          { name: 'Other Charges', path: '/admin/estimations/charges', icon: 'ReceiptPercentIcon', permission: 'view_other_charges' },
          { name: 'Installation Queue', path: '/admin/estimations/installations', icon: 'WrenchScrewdriverIcon', permission: 'view_installations' }
        ]
      },
      {
        title: 'Customers',
        icon: 'UserGroupIcon',
        items: [
          { name: 'All Customers', path: '/admin/customers/all', icon: 'UsersIcon', permission: 'view_customers' },
          { name: 'Meter Management', path: '/admin/meters', icon: 'BoltIcon', permission: 'manage_meters' }
        ]
      },
      {
        title: 'Billing',
        icon: 'BanknotesIcon',
        items: [
          { name: 'Tariff Management', path: '/admin/billing/tariffs', icon: 'ReceiptPercentIcon', permission: 'manage_tariffs' },
          { name: 'Payment Collection', path: '/admin/billing/payments', icon: 'CreditCardIcon', permission: 'process_payments' }
        ]
      },
      {
        title: 'Reference',
        icon: 'BookOpenIcon',
        items: [
          { name: 'Request Types', path: '/admin/reference/request-types', icon: 'DocumentMagnifyingGlassIcon', permission: 'manage_reference' },
          { name: 'Status Codes', path: '/admin/reference/status-codes', icon: 'HashtagIcon', permission: 'manage_reference' },
          { name: 'Categories', path: '/admin/reference/categories', icon: 'TagIcon', permission: 'manage_reference' }
        ]
      },
      {
        title: 'Reports',
        icon: 'ChartBarIcon',
        items: [
          { name: 'Revenue Analytics', path: '/admin/reports/revenue', icon: 'CurrencyDollarIcon', permission: 'view_reports' },
          { name: 'Usage Patterns', path: '/admin/reports/usage', icon: 'ChartLineIcon', permission: 'view_reports' }
        ]
      },
      {
        title: 'System',
        icon: 'Cog6ToothIcon',
        items: [
          { name: 'System Settings', path: '/admin/system/settings', icon: 'Cog6ToothIcon', permission: 'configure_system' },
          { name: 'System Logs', path: '/admin/system/logs', icon: 'ClipboardDocumentListIcon', permission: 'view_logs' }
        ]
      }
    ]
  },

  // Customer Service Role
  'Customer-Service': {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'Applicants',
        icon: 'UserPlusIcon',
        items: [
          { name: 'New Applications', path: '/admin/applicants/new', icon: 'UserPlusIcon', permission: 'create_applicants' },
          { name: 'Document Verification', path: '/admin/applicants/documents', icon: 'DocumentCheckIcon', permission: 'verify_documents' },
          { name: 'Work Orders', path: '/admin/applicants/work-orders', icon: 'ClipboardDocumentListIcon', permission: 'view_workorders' }
        ]
      },
      {
        title: 'Customers',
        icon: 'UserGroupIcon',
        items: [
          { name: 'All Customers', path: '/admin/customers/all', icon: 'UsersIcon', permission: 'view_customers' }
        ]
      },
      {
        title: 'Reference',
        icon: 'BookOpenIcon',
        items: [
          { name: 'Request Types', path: '/admin/reference/request-types', icon: 'DocumentMagnifyingGlassIcon', permission: 'view_reference' },
          { name: 'Status Codes', path: '/admin/reference/status-codes', icon: 'HashtagIcon', permission: 'view_reference' }
        ]
      }
    ]
  },

  // Technical Engineer Role
  'Technical-Engineer': {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'Estimations',
        icon: 'CalculatorIcon',
        items: [
          { name: 'Cost Estimations', path: '/admin/estimations/costs', icon: 'CalculatorIcon', permission: 'create_estimations' },
          { name: 'Other Charges', path: '/admin/estimations/charges', icon: 'ReceiptPercentIcon', permission: 'view_other_charges' }
        ]
      },
      {
        title: 'Work Orders',
        icon: 'ClipboardDocumentListIcon',
        items: [
          { name: 'Work Orders', path: '/admin/applicants/work-orders', icon: 'ClipboardDocumentListIcon', permission: 'view_workorders' },
          { name: 'Installation Queue', path: '/admin/estimations/installations', icon: 'WrenchScrewdriverIcon', permission: 'view_installations' }
        ]
      },
      {
        title: 'Materials',
        icon: 'CubeIcon',
        items: [
          { name: 'All Materials', path: '/admin/materials', icon: 'ArchiveBoxIcon', permission: 'view_materials' },
          { name: 'Branch Material', path: '/admin/branch_material', icon: 'BuildingStorefrontIcon', permission: 'view_branch_materials' }
        ]
      }
    ]
  },

  // Finance Officer Role
  'Finance-Officer': {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'Billing',
        icon: 'BanknotesIcon',
        items: [
          { name: 'Tariff Management', path: '/admin/billing/tariffs', icon: 'ReceiptPercentIcon', permission: 'manage_tariffs' },
          { name: 'Payment Collection', path: '/admin/billing/payments', icon: 'CreditCardIcon', permission: 'process_payments' },
          { name: 'Overdue Accounts', path: '/admin/billing/overdue', icon: 'ExclamationTriangleIcon', permission: 'view_financials' }
        ]
      },
      {
        title: 'Reports',
        icon: 'ChartBarIcon',
        items: [
          { name: 'Revenue Analytics', path: '/admin/reports/revenue', icon: 'CurrencyDollarIcon', permission: 'view_reports' },
          { name: 'Export Reports', path: '/admin/reports/export', icon: 'ArrowDownTrayIcon', permission: 'export_reports' }
        ]
      }
    ]
  },

  // Warehouse Manager Role
  'Warehouse-Manager': {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'Inventory',
        icon: 'CubeIcon',
        items: [
          { name: 'All Materials', path: '/admin/materials', icon: 'ArchiveBoxIcon', permission: 'manage_materials' },
          { name: 'Branch Material', path: '/admin/branch_material', icon: 'BuildingStorefrontIcon', permission: 'manage_branch_materials' }
        ]
      },
      {
        title: 'Reports',
        icon: 'ChartBarIcon',
        items: [
          { name: 'Stock Reports', path: '/admin/reports/stock', icon: 'ChartBarIcon', permission: 'view_reports' }
        ]
      }
    ]
  },

  // Compliance Officer Role
  'Compliance-Officer': {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'Verification',
        icon: 'DocumentCheckIcon',
        items: [
          { name: 'Document Verification', path: '/admin/applicants/documents', icon: 'DocumentCheckIcon', permission: 'verify_documents' },
          { name: 'New Applications', path: '/admin/applicants/new', icon: 'UserPlusIcon', permission: 'view_applicants' }
        ]
      }
    ]
  },

  // Field Technician Role
  'Field-Technician': {
    dashboard: { title: 'Dashboard', icon: 'HomeIcon', path: '/admin/dashboard', permission: null },
    dropdowns: [
      {
        title: 'My Tasks',
        icon: 'ClipboardDocumentListIcon',
        items: [
          { name: 'My Work Orders', path: '/admin/applicants/work-orders', icon: 'ClipboardDocumentListIcon', permission: 'view_assigned_workorders' },
          { name: 'Installations', path: '/admin/estimations/installations', icon: 'WrenchScrewdriverIcon', permission: 'update_installations' }
        ]
      }
    ]
  }
};

// Helper function to filter sidebar based on user roles and permissions
export const getFilteredSidebar = (userRoles, userPermissions) => {
  const primaryRole = userRoles[0] || 'Customer-Service';
  const roleConfig = roleBasedSidebar[primaryRole] || roleBasedSidebar['Customer-Service'];
  
  // Filter dropdown items based on permissions
  const filteredDropdowns = roleConfig.dropdowns
    .map(dropdown => ({
      ...dropdown,
      items: dropdown.items.filter(item => 
        !item.permission || userPermissions.includes(item.permission)
      )
    }))
    .filter(dropdown => dropdown.items.length > 0);
  
  return {
    dashboard: roleConfig.dashboard,
    dropdowns: filteredDropdowns
  };
};