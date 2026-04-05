// utils/dashboardWidgets.js
export const dashboardWidgets = {
  // Admin Widgets
  Admin: {
    stats: [
      { key: 'total_applicants', title: 'Total Applicants', icon: 'UserGroupIcon', color: 'blue', permission: 'view_applicants' },
      { key: 'pending_applications', title: 'Pending Applications', icon: 'ClockIcon', color: 'yellow', permission: 'view_applicants' },
      { key: 'active_workorders', title: 'Active Work Orders', icon: 'ClipboardDocumentListIcon', color: 'purple', permission: 'view_workorders' },
      { key: 'monthly_revenue', title: 'Monthly Revenue', icon: 'CurrencyDollarIcon', color: 'green', permission: 'view_financials' }
    ],
    charts: [
      { key: 'revenue_trend', title: 'Revenue Trend', type: 'line', permission: 'view_reports' },
      { key: 'workorder_status', title: 'Work Order Distribution', type: 'pie', permission: 'view_workorders' }
    ],
    tables: [
      { key: 'recent_applicants', title: 'Recent Applicants', permission: 'view_applicants' },
      { key: 'pending_workorders', title: 'Pending Work Orders', permission: 'view_workorders' }
    ]
  },
  
  // Customer Service Widgets
  'Customer-Service': {
    stats: [
      { key: 'pending_applications', title: 'Pending Applications', icon: 'ClockIcon', color: 'yellow', permission: 'view_applicants' },
      { key: 'documents_pending', title: 'Documents Pending', icon: 'DocumentCheckIcon', color: 'orange', permission: 'verify_documents' },
      { key: 'today_appointments', title: "Today's Appointments", icon: 'CalendarIcon', color: 'blue', permission: 'view_appointments' }
    ],
    tables: [
      { key: 'recent_applicants', title: 'Recent Applicants', permission: 'view_applicants' },
      { key: 'documents_to_review', title: 'Documents to Review', permission: 'verify_documents' }
    ]
  },
  
  // Technical Engineer Widgets
  'Technical-Engineer': {
    stats: [
      { key: 'pending_estimations', title: 'Pending Estimations', icon: 'CalculatorIcon', color: 'orange', permission: 'view_estimations' },
      { key: 'active_workorders', title: 'Active Work Orders', icon: 'ClipboardDocumentListIcon', color: 'purple', permission: 'view_workorders' },
      { key: 'installations_today', title: 'Installations Today', icon: 'WrenchScrewdriverIcon', color: 'blue', permission: 'view_workorders' }
    ],
    tables: [
      { key: 'my_assigned_workorders', title: 'My Assigned Work Orders', permission: 'view_assigned_workorders' },
      { key: 'pending_estimations_list', title: 'Pending Estimations', permission: 'view_estimations' }
    ]
  },
  
  // Finance Officer Widgets
  'Finance-Officer': {
    stats: [
      { key: 'monthly_revenue', title: 'Monthly Revenue', icon: 'CurrencyDollarIcon', color: 'green', permission: 'view_financials' },
      { key: 'pending_payments', title: 'Pending Payments', icon: 'BanknotesIcon', color: 'red', permission: 'process_payments' },
      { key: 'overdue_accounts', title: 'Overdue Accounts', icon: 'ExclamationTriangleIcon', color: 'orange', permission: 'view_financials' },
      { key: 'collection_rate', title: 'Collection Rate', icon: 'ChartBarIcon', color: 'blue', permission: 'view_financials' }
    ],
    charts: [
      { key: 'revenue_trend', title: 'Revenue Trend', type: 'line', permission: 'view_reports' },
      { key: 'collection_efficiency', title: 'Collection Efficiency', type: 'bar', permission: 'view_financials' }
    ],
    tables: [
      { key: 'recent_payments', title: 'Recent Payments', permission: 'process_payments' },
      { key: 'overdue_bills', title: 'Overdue Bills', permission: 'view_financials' }
    ]
  },
  
  // Warehouse Manager Widgets
  'Warehouse-Manager': {
    stats: [
      { key: 'total_materials', title: 'Total Materials', icon: 'CubeIcon', color: 'blue', permission: 'view_materials' },
      { key: 'low_stock_materials', title: 'Low Stock Alert', icon: 'ExclamationTriangleIcon', color: 'red', permission: 'manage_materials' },
      { key: 'total_branches', title: 'Branches', icon: 'BuildingOfficeIcon', color: 'green', permission: 'view_branches' }
    ],
    tables: [
      { key: 'low_stock_alerts', title: 'Low Stock Alerts', permission: 'manage_materials' },
      { key: 'recent_issues', title: 'Recent Issues', permission: 'view_materials' }
    ]
  },
  
  // Compliance Officer Widgets
  'Compliance-Officer': {
    stats: [
      { key: 'documents_pending', title: 'Documents Pending', icon: 'DocumentCheckIcon', color: 'yellow', permission: 'verify_documents' },
      { key: 'documents_approved', title: 'Approved Today', icon: 'CheckCircleIcon', color: 'green', permission: 'verify_documents' },
      { key: 'documents_rejected', title: 'Rejected', icon: 'XCircleIcon', color: 'red', permission: 'verify_documents' }
    ],
    tables: [
      { key: 'documents_to_review', title: 'Documents to Review', permission: 'verify_documents' },
      { key: 'recent_applicants', title: 'Recent Applicants', permission: 'view_applicants' }
    ]
  },
  
  // Field Technician Widgets
  'Field-Technician': {
    stats: [
      { key: 'my_workorders', title: 'My Work Orders', icon: 'ClipboardDocumentListIcon', color: 'blue', permission: 'view_assigned_workorders' },
      { key: 'completed_today', title: 'Completed Today', icon: 'CheckCircleIcon', color: 'green', permission: 'update_workorders' }
    ],
    tables: [
      { key: 'my_assigned_workorders', title: 'Assigned Work Orders', permission: 'view_assigned_workorders' }
    ]
  }
};

export const getWidgetsByRole = (role) => {
  return dashboardWidgets[role] || dashboardWidgets['Customer-Service'];
};