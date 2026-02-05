<template>
  <div class="elite-card hover:shadow-2xl transition-all duration-500 overflow-hidden">
    <!-- Card Header -->
    <div class="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recent Transactions</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Latest payments and billing activities</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <input type="text" placeholder="Search transactions..." 
              class="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary-dark/50 focus:border-transparent text-sm w-64">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button class="btn-elite text-sm px-4 py-2">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Invoice
          </button>
        </div>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
      <div v-for="transaction in transactions" :key="transaction.id" 
        class="p-6 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 group transition-all duration-300">
        <div class="flex items-center justify-between">
          <!-- Transaction Info -->
          <div class="flex items-center">
            <!-- Status Icon -->
            <div class="relative">
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center',
                transaction.status === 'paid' ? 'bg-success-light/10 dark:bg-success-dark/10' :
                transaction.status === 'pending' ? 'bg-warning-light/10 dark:bg-warning-dark/10' :
                transaction.status === 'overdue' ? 'bg-critical-light/10 dark:bg-critical-dark/10' :
                'bg-primary-light/10 dark:bg-primary-dark/10'
              ]">
                <svg class="w-6 h-6" 
                  :class="transaction.status === 'paid' ? 'text-success-light dark:text-success-dark' :
                         transaction.status === 'pending' ? 'text-warning-light dark:text-warning-dark' :
                         transaction.status === 'overdue' ? 'text-critical-light dark:text-critical-dark' :
                         'text-primary-light dark:text-primary-dark'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="transaction.status === 'paid' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
                         transaction.status === 'pending' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' :
                         transaction.status === 'overdue' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z' :
                         'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'" />
                </svg>
              </div>
              <!-- Pulsing dot for pending/overdue -->
              <div v-if="transaction.status === 'pending' || transaction.status === 'overdue'"
                class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-critical-light dark:bg-critical-dark animate-pulse">
              </div>
            </div>
            
            <div class="ml-4">
              <div class="flex items-center">
                <p class="font-medium text-neutral-900 dark:text-neutral-100">{{ transaction.customer }}</p>
                <span :class="[
                  'ml-2 px-2 py-0.5 rounded text-xs font-medium',
                  transaction.status === 'paid' ? 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark' :
                  transaction.status === 'pending' ? 'bg-warning-light/10 text-warning-light dark:bg-warning-dark/10 dark:text-warning-dark' :
                  transaction.status === 'overdue' ? 'bg-critical-light/10 text-critical-light dark:bg-critical-dark/10 dark:text-critical-dark' :
                  'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
                ]">
                  {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                </span>
              </div>
              <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {{ transaction.description }}
              </p>
              <div class="flex items-center mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(transaction.date) }}
                <span class="mx-2">•</span>
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ transaction.time }}
              </div>
            </div>
          </div>
          
          <!-- Amount & Actions -->
          <div class="flex items-center space-x-6">
            <!-- Amount -->
            <div class="text-right">
              <p class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {{ formatCurrency(transaction.amount) }}
              </p>
              <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {{ transaction.method }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="viewTransaction(transaction)" 
                class="p-2 rounded-lg hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors"
                title="View Details">
                <svg class="w-4 h-4 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button v-if="transaction.status === 'pending'" @click="markAsPaid(transaction)"
                class="p-2 rounded-lg hover:bg-success-light/10 dark:hover:bg-success-dark/10 transition-colors"
                title="Mark as Paid">
                <svg class="w-4 h-4 text-success-light dark:text-success-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button @click="downloadReceipt(transaction)"
                class="p-2 rounded-lg hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors"
                title="Download Receipt">
                <svg class="w-4 h-4 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              
              <button @click="sendReminder(transaction)"
                class="p-2 rounded-lg hover:bg-warning-light/10 dark:hover:bg-warning-dark/10 transition-colors"
                title="Send Reminder">
                <svg class="w-4 h-4 text-warning-light dark:text-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Progress Bar for Pending Payments -->
        <div v-if="transaction.status === 'pending' || transaction.status === 'overdue'" class="mt-4">
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-neutral-500 dark:text-neutral-400">Days remaining: {{ transaction.daysRemaining }}</span>
            <span class="font-medium" :class="transaction.daysRemaining <= 3 ? 'text-critical-light dark:text-critical-dark' : 'text-warning-light dark:text-warning-dark'">
              {{ transaction.daysRemaining <= 3 ? 'Urgent' : 'Due soon' }}
            </span>
          </div>
          <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :style="{
                width: `${100 - (transaction.daysRemaining / 30) * 100}%`,
                background: transaction.daysRemaining <= 3 
                  ? 'linear-gradient(to right, #EF4444, #F87171)'
                  : 'linear-gradient(to right, #F59E0B, #FBBF24)'
              }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="transactions.length > 0" class="p-6 border-t border-neutral-200/50 dark:border-neutral-800/50 text-center">
      <button @click="loadMore" 
        class="px-6 py-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-all duration-300 group">
        <span class="flex items-center text-neutral-600 dark:text-neutral-300 group-hover:text-primary-light dark:group-hover:text-primary-dark">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Load More Transactions
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const transactions = ref([
  {
    id: 1,
    customer: 'Tewodros Alemu Manufacturing',
    description: 'Monthly water bill - January 2024',
    amount: 125000,
    status: 'paid',
    method: 'Bank Transfer',
    date: '2024-01-20',
    time: '14:30',
    daysRemaining: 0
  },
  {
    id: 2,
    customer: 'Sara Mohammed Textiles',
    description: 'Commercial water usage - Q1 2024',
    amount: 98000,
    status: 'pending',
    method: 'Credit Card',
    date: '2024-01-19',
    time: '11:45',
    daysRemaining: 5
  },
  {
    id: 3,
    customer: 'Kebede Hotel & Resort',
    description: 'Large-scale consumption bill',
    amount: 82000,
    status: 'paid',
    method: 'Mobile Payment',
    date: '2024-01-18',
    time: '09:15',
    daysRemaining: 0
  },
  {
    id: 4,
    customer: 'Zenebe Commercial Center',
    description: 'Overdue payment reminder',
    amount: 72000,
    status: 'overdue',
    method: 'Pending',
    date: '2024-01-15',
    time: '16:20',
    daysRemaining: 2
  },
  {
    id: 5,
    customer: 'Alemitu Pharmaceuticals',
    description: 'Monthly water bill - January 2024',
    amount: 65000,
    status: 'paid',
    method: 'Direct Debit',
    date: '2024-01-14',
    time: '13:10',
    daysRemaining: 0
  },
  {
    id: 6,
    customer: 'Bereket Construction',
    description: 'Construction site water supply',
    amount: 58000,
    status: 'pending',
    method: 'Cash',
    date: '2024-01-12',
    time: '10:30',
    daysRemaining: 8
  },
  {
    id: 7,
    customer: 'Meron Trading PLC',
    description: 'Commercial water bill',
    amount: 52000,
    status: 'processing',
    method: 'Bank Transfer',
    date: '2024-01-10',
    time: '15:45',
    daysRemaining: 3
  },
  {
    id: 8,
    customer: 'Yohannes Agricultural',
    description: 'Irrigation water supply - January',
    amount: 45000,
    status: 'paid',
    method: 'Mobile Payment',
    date: '2024-01-08',
    time: '08:20',
    daysRemaining: 0
  }
])

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-ET', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const viewTransaction = (transaction) => {
  console.log('View transaction:', transaction)
  // Implement view logic
}

const markAsPaid = (transaction) => {
  console.log('Mark as paid:', transaction)
  transaction.status = 'paid'
  transaction.daysRemaining = 0
}

const downloadReceipt = (transaction) => {
  console.log('Download receipt:', transaction)
  // Implement download logic
}

const sendReminder = (transaction) => {
  console.log('Send reminder:', transaction)
  // Implement reminder logic
}

const loadMore = () => {
  // Implement load more logic
  console.log('Load more transactions')
}
</script>

<style scoped>
/* Smooth hover effects */
.group:hover {
  transform: translateX(4px);
}

/* Pulsing animation for urgent items */
@keyframes pulse-urgent {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.bg-critical-light, .bg-critical-dark {
  animation: pulse-urgent 2s ease-in-out infinite;
}

/* Gradient border for paid transactions */
tr:has(.bg-success-light) {
  position: relative;
}

tr:has(.bg-success-light)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #10B981, #34D399);
  border-radius: 2px;
}

/* Loading animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.loading-shimmer {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style>