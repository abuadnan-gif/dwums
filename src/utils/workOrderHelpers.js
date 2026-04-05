/**
 * Work Order Constants and Helper Functions
 */

// Status constants
export const WORK_ORDER_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const WORK_ORDER_STATUS_LABELS = {
  [WORK_ORDER_STATUS.PENDING]: 'Pending',
  [WORK_ORDER_STATUS.ASSIGNED]: 'Assigned',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'In Progress',
  [WORK_ORDER_STATUS.COMPLETED]: 'Completed',
  [WORK_ORDER_STATUS.CANCELLED]: 'Cancelled',
  [WORK_ORDER_STATUS.ACTIVE]: 'active', 
  [WORK_ORDER_STATUS.INACTIVE]: 'inactive'
}

export const WORK_ORDER_STATUS_COLORS = {
  [WORK_ORDER_STATUS.PENDING]: 'warning',
  [WORK_ORDER_STATUS.ASSIGNED]: 'info',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'primary',
  [WORK_ORDER_STATUS.COMPLETED]: 'success',
  [WORK_ORDER_STATUS.CANCELLED]: 'critical'
}

export const WORK_ORDER_STATUS_ICONS = {
  [WORK_ORDER_STATUS.PENDING]: 'ClockIcon',
  [WORK_ORDER_STATUS.ASSIGNED]: 'UserIcon',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'CogIcon',
  [WORK_ORDER_STATUS.COMPLETED]: 'CheckCircleIcon',
  [WORK_ORDER_STATUS.CANCELLED]: 'XCircleIcon'
}

// Priority constants
export const WORK_ORDER_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

export const WORK_ORDER_PRIORITY_LABELS = {
  [WORK_ORDER_PRIORITY.LOW]: 'Low',
  [WORK_ORDER_PRIORITY.MEDIUM]: 'Medium',
  [WORK_ORDER_PRIORITY.HIGH]: 'High',
  [WORK_ORDER_PRIORITY.URGENT]: 'Urgent'
}

export const WORK_ORDER_PRIORITY_COLORS = {
  [WORK_ORDER_PRIORITY.LOW]: 'success',
  [WORK_ORDER_PRIORITY.MEDIUM]: 'warning',
  [WORK_ORDER_PRIORITY.HIGH]: 'high',
  [WORK_ORDER_PRIORITY.URGENT]: 'critical'
}

export const WORK_ORDER_PRIORITY_ICONS = {
  [WORK_ORDER_PRIORITY.LOW]: 'ClockIcon',
  [WORK_ORDER_PRIORITY.MEDIUM]: 'FlagIcon',
  [WORK_ORDER_PRIORITY.HIGH]: 'ExclamationTriangleIcon',
  [WORK_ORDER_PRIORITY.URGENT]: 'ExclamationCircleIcon'
}

// Date range options for filtering
export const DATE_RANGE_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'custom', label: 'Custom Range' }
]

/**
 * Format status for display
 * @param {string} status - Status key
 * @returns {string} Formatted status
 */
export const formatWorkOrderStatus = (status) => {
  if (!status) return 'N/A'
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Get status class for styling
 * @param {string} status - Status key
 * @returns {string} CSS class
 */
export const getWorkOrderStatusClass = (status) => {
  const classes = {
    [WORK_ORDER_STATUS.PENDING]: 'status-pending',
    [WORK_ORDER_STATUS.ASSIGNED]: 'status-assigned',
    [WORK_ORDER_STATUS.IN_PROGRESS]: 'status-in-progress',
    [WORK_ORDER_STATUS.COMPLETED]: 'status-completed',
    [WORK_ORDER_STATUS.CANCELLED]: 'status-cancelled'
  }
  return classes[status] || 'status-unknown'
}

/**
 * Get priority class for styling
 * @param {string} priority - Priority key
 * @returns {string} CSS class
 */
export const getWorkOrderPriorityClass = (priority) => {
  const classes = {
    [WORK_ORDER_PRIORITY.LOW]: 'priority-low',
    [WORK_ORDER_PRIORITY.MEDIUM]: 'priority-medium',
    [WORK_ORDER_PRIORITY.HIGH]: 'priority-high',
    [WORK_ORDER_PRIORITY.URGENT]: 'priority-urgent'
  }
  return classes[priority] || 'priority-medium'
}

/**
 * Get priority icon
 * @param {string} priority - Priority key
 * @returns {string} Icon name
 */
export const getPriorityIcon = (priority) => {
  return WORK_ORDER_PRIORITY_ICONS[priority] || 'FlagIcon'
}

/**
 * Check if work order is overdue
 * @param {object} workOrder - Work order object
 * @returns {boolean} True if overdue
 */
export const isWorkOrderOverdue = (workOrder) => {
  if (!workOrder?.scheduled_date) return false
  if (workOrder.status === WORK_ORDER_STATUS.COMPLETED || 
      workOrder.status === WORK_ORDER_STATUS.CANCELLED) {
    return false
  }
  return new Date(workOrder.scheduled_date) < new Date()
}

/**
 * Calculate days until due or overdue
 * @param {object} workOrder - Work order object
 * @returns {number} Days difference
 */
export const getWorkOrderDueDays = (workOrder) => {
  if (!workOrder?.scheduled_date) return 0
  
  const dueDate = new Date(workOrder.scheduled_date)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Get status badge variant based on status
 * @param {string} status - Status key
 * @returns {string} Badge variant
 */
export const getWorkOrderBadgeVariant = (status) => {
  const variants = {
    [WORK_ORDER_STATUS.PENDING]: 'warning',
    [WORK_ORDER_STATUS.ASSIGNED]: 'info',
    [WORK_ORDER_STATUS.IN_PROGRESS]: 'primary',
    [WORK_ORDER_STATUS.COMPLETED]: 'success',
    [WORK_ORDER_STATUS.CANCELLED]: 'critical'
  }
  return variants[status] || 'neutral'
}

/**
 * Get next available statuses based on current status
 * @param {string} currentStatus - Current status
 * @returns {Array} Array of possible next statuses
 */
export const getNextWorkOrderStatuses = (currentStatus) => {
  const transitions = {
    [WORK_ORDER_STATUS.PENDING]: [WORK_ORDER_STATUS.ASSIGNED, WORK_ORDER_STATUS.CANCELLED],
    [WORK_ORDER_STATUS.ASSIGNED]: [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.CANCELLED],
    [WORK_ORDER_STATUS.IN_PROGRESS]: [WORK_ORDER_STATUS.COMPLETED, WORK_ORDER_STATUS.CANCELLED],
    [WORK_ORDER_STATUS.COMPLETED]: [],
    [WORK_ORDER_STATUS.CANCELLED]: []
  }
  return transitions[currentStatus] || []
}

/**
 * Generate work order code
 * @param {number} id - Work order ID
 * @param {string} prefix - Code prefix
 * @returns {string} Formatted work order code
 */
export const generateWorkOrderCode = (id, prefix = 'WO') => {
  if (!id) return ''
  const paddedId = String(id).padStart(6, '0')
  return `${prefix}-${paddedId}`
}

/**
 * Format work order for display
 * @param {object} workOrder - Work order object
 * @returns {object} Formatted work order
 */
export const formatWorkOrderForDisplay = (workOrder) => {
  if (!workOrder) return null
  
  return {
    ...workOrder,
    formattedStatus: formatWorkOrderStatus(workOrder.status),
    statusClass: getWorkOrderStatusClass(workOrder.status),
    priorityClass: getWorkOrderPriorityClass(workOrder.priority),
    priorityIcon: getPriorityIcon(workOrder.priority),
    isOverdue: isWorkOrderOverdue(workOrder),
    dueDays: getWorkOrderDueDays(workOrder),
    displayCode: workOrder.order_code || generateWorkOrderCode(workOrder.id)
  }
}

/**
 * Get color for timeline dot based on status
 * @param {string} status - Status key
 * @returns {string} CSS class for dot color
 */
export const getTimelineDotColor = (status) => {
  const colors = {
    'created': 'bg-primary',
    [WORK_ORDER_STATUS.PENDING]: 'bg-warning',
    [WORK_ORDER_STATUS.ASSIGNED]: 'bg-info',
    [WORK_ORDER_STATUS.IN_PROGRESS]: 'bg-primary',
    [WORK_ORDER_STATUS.COMPLETED]: 'bg-success',
    [WORK_ORDER_STATUS.CANCELLED]: 'bg-critical'
  }
  return colors[status] || 'bg-muted'
}

// Helper function to get unique array by key
const getUniqueBy = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

// Add this to workOrderHelpers.js (at the end of the file)

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */






// Add these to workOrderHelpers.js (you can add them near the other helper functions)

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A'
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  try {
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options })
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Format date and time for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  
  try {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Format priority for display
 * @param {string} priority - Priority key
 * @returns {string} Formatted priority
 */
export const formatPriority = (priority) => {
  if (!priority) return 'Medium'
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return 'No phone'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  }
  return phone
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Format role name
 * @param {string} role - Role key
 * @returns {string} Formatted role
 */
export const formatRole = (role) => {
  if (!role) return 'Staff'
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get status badge variant based on status
 * @param {string} status - Status key
 * @returns {string} Badge variant
 */
export const getStatusBadgeVariant = (status) => {
  const variants = {
    'pending': 'warning',
    'assigned': 'info',
    'in_progress': 'primary',
    'completed': 'success',
    'cancelled': 'critical',
    'active': 'success',
    'inactive': 'neutral'
  }
  return variants[status] || 'neutral'
}

/**
 * Get priority badge variant based on priority
 * @param {string} priority - Priority key
 * @returns {string} Badge variant
 */
export const getPriorityBadgeVariant = (priority) => {
  const variants = {
    'low': 'success',
    'medium': 'warning',
    'high': 'high',
    'urgent': 'critical'
  }
  return variants[priority] || 'neutral'
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Debounce function to limit rate of execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Check if a work order is overdue
 * @param {object} workOrder - Work order object
 * @returns {boolean} True if overdue
 */
export const isOverdue = (workOrder) => {
  if (!workOrder) return false
  
  // Get the due/scheduled date
  const dueDate = workOrder.scheduled_date || workOrder.due_date
  if (!dueDate) return false
  
  // Check if already completed or cancelled
  const status = workOrder.status_code || workOrder.status
  if (status === 'completed' || status === 'cancelled') return false
  
  // Compare dates
  try {
    return new Date(dueDate) < new Date()
  } catch (error) {
    return false
  }
}


/**
 * Alias for formatWorkOrderStatus
 * @param {string} status - Status key
 * @returns {string} Formatted status
 */
export const formatStatus = formatWorkOrderStatus

/**
 * Alias for getWorkOrderStatusClass
 * @param {string} status - Status key
 * @returns {string} CSS class
 */
export const getStatusClass = getWorkOrderStatusClass

/**
 * Alias for getWorkOrderPriorityClass
 * @param {string} priority - Priority key
 * @returns {string} CSS class
 */
export const getPriorityClass = getWorkOrderPriorityClass

/**
 * Alias for isWorkOrderOverdue
 * @param {object} workOrder - Work order object
 * @returns {boolean} True if overdue
 */
