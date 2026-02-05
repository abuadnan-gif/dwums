<template>
  <PremiumModal
    v-model:visible="visible"
    title="Quick Actions"
    subtitle="Common tasks and shortcuts"
    icon="Zap"
    size="lg"
    :show-footer="false"
    @close="closeModal"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="action in quickActions"
        :key="action.id"
        @click="executeAction(action)"
        class="group relative p-4 rounded-xl border border-light-border-subtle dark:border-dark-border-subtle hover:border-brand-primary dark:hover:border-brand-accent transition-all duration-300 cursor-pointer transform-gpu hover:scale-[1.02] active:scale-[0.98]"
        style="will-change: transform;"
      >
        <!-- Background Gradient -->
        <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-brand-primary/0 to-brand-accent/0 group-hover:via-brand-primary/5 group-hover:to-brand-accent/5 transition-all duration-500"></div>
        
        <!-- Content -->
        <div class="relative">
          <!-- Icon -->
          <div class="relative mb-3">
            <div class="absolute -inset-3 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div 
              :class="[
                'relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500',
                action.bgClass
              ]"
            >
              <component :is="getIcon(action.icon)" :class="action.iconClass" class="w-6 h-6" />
            </div>
          </div>
          
          <!-- Text -->
          <div>
            <h4 class="font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors duration-300">
              {{ action.title }}
            </h4>
            <p class="text-sm text-light-text-muted dark:text-dark-text-muted mt-1">
              {{ action.description }}
            </p>
          </div>
          
          <!-- Badge -->
          <div 
            v-if="action.badge"
            :class="[
              'absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-full',
              action.badgeVariant === 'primary' ? 'bg-brand-primary/10 text-brand-primary' :
              action.badgeVariant === 'success' ? 'bg-state-success/10 text-state-success' :
              action.badgeVariant === 'warning' ? 'bg-state-warning/10 text-state-warning' :
              'bg-state-info/10 text-state-info'
            ]"
          >
            {{ action.badge }}
          </div>
          
          <!-- Hover Arrow -->
          <ChevronRightIcon class="absolute bottom-0 right-0 w-5 h-5 text-light-text-muted/30 dark:text-dark-text-muted/30 group-hover:text-brand-primary dark:group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-300" />
        </div>
        
        <!-- Ripple Effect -->
        <div 
          v-if="action.showRipple"
          class="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary/0 via-brand-primary/10 to-brand-accent/0"
          style="animation: quickActionRipple 0.6s ease-out forwards;"
        ></div>
      </div>
    </div>
    
    <!-- Recent Actions -->
    <div class="mt-8 pt-6 border-t border-light-border-subtle/30 dark:border-dark-border-subtle/30">
      <h4 class="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Recent Actions</h4>
      <div class="space-y-2">
        <div 
          v-for="recent in recentActions"
          :key="recent.id"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-light-bg-surface/50 dark:hover:bg-dark-bg-surface/50 transition-colors duration-300"
        >
          <div class="flex items-center space-x-3">
            <div :class="['p-2 rounded-lg', recent.bgClass]">
              <component :is="getIcon(recent.icon)" :class="recent.iconClass" class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ recent.title }}</p>
              <p class="text-xs text-light-text-muted dark:text-dark-text-muted">{{ recent.time }}</p>
            </div>
          </div>
          <button 
            @click.stop="repeatAction(recent)"
            class="p-1.5 rounded-lg hover:bg-light-bg-surface dark:hover:bg-dark-bg-surface transition-colors duration-300"
          >
            <RepeatIcon class="w-4 h-4 text-light-text-muted dark:text-dark-text-muted" />
          </button>
        </div>
      </div>
    </div>
  </PremiumModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as LucideIcons from 'lucide-vue-next'
import { ChevronRightIcon, RepeatIcon } from 'lucide-vue-next'
import PremiumModal from '@/components/modals/Modal.vue'

const visible = ref(false)

const quickActions = ref([
  {
    id: 1,
    icon: 'UserPlus',
    title: 'Register Applicant',
    description: 'Start new connection request',
    bgClass: 'bg-gradient-to-br from-brand-primary/20 to-brand-accent/20',
    iconClass: 'text-brand-primary dark:text-brand-accent',
    badge: 'NEW',
    badgeVariant: 'primary',
    action: 'register-applicant',
    showRipple: false
  },
  {
    id: 2,
    icon: 'FileText',
    title: 'Generate Report',
    description: 'Create performance report',
    bgClass: 'bg-gradient-to-br from-state-success/20 to-state-success/40',
    iconClass: 'text-state-success',
    badge: '24',
    badgeVariant: 'success',
    action: 'generate-report',
    showRipple: false
  },
  {
    id: 3,
    icon: 'CreditCard',
    title: 'Process Payment',
    description: 'Handle bill payments',
    bgClass: 'bg-gradient-to-br from-state-info/20 to-state-info/40',
    iconClass: 'text-state-info',
    action: 'process-payment',
    showRipple: false
  },
  {
    id: 4,
    icon: 'QrCode',
    title: 'Scan Meter',
    description: 'Quick meter reading',
    bgClass: 'bg-gradient-to-br from-brand-accent/20 to-brand-primary/20',
    iconClass: 'text-brand-accent',
    badge: 'FAST',
    badgeVariant: 'primary',
    action: 'scan-meter',
    showRipple: false
  },
  {
    id: 5,
    icon: 'AlertCircle',
    title: 'Issue Alert',
    description: 'Create system notification',
    bgClass: 'bg-gradient-to-br from-state-warning/20 to-state-warning/40',
    iconClass: 'text-state-warning',
    action: 'issue-alert',
    showRipple: false
  },
  {
    id: 6,
    icon: 'Settings',
    title: 'System Settings',
    description: 'Configure preferences',
    bgClass: 'bg-gradient-to-br from-light-bg-surface to-light-bg-surface/50 dark:from-dark-bg-surface dark:to-dark-bg-surface/50',
    iconClass: 'text-light-text-muted dark:text-dark-text-muted',
    action: 'system-settings',
    showRipple: false
  }
])

const recentActions = ref([
  {
    id: 1,
    icon: 'Users',
    title: 'Customer Registered',
    description: 'New residential connection',
    bgClass: 'bg-state-success/10',
    iconClass: 'text-state-success',
    time: '10 min ago',
    action: 'customer-registered'
  },
  {
    id: 2,
    icon: 'FileText',
    title: 'Report Generated',
    description: 'Monthly performance report',
    bgClass: 'bg-state-info/10',
    iconClass: 'text-state-info',
    time: '1 hour ago',
    action: 'report-generated'
  },
  {
    id: 3,
    icon: 'CreditCard',
    title: 'Payment Processed',
    description: 'ETB 2,500 received',
    bgClass: 'bg-brand-primary/10',
    iconClass: 'text-brand-primary',
    time: '2 hours ago',
    action: 'payment-processed'
  }
])

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons['Circle']
}

const executeAction = (action) => {
  // Show ripple effect
  action.showRipple = true
  setTimeout(() => {
    action.showRipple = false
  }, 600)
  
  // Execute action
  alert(`Executing: ${action.title}`)
  
  // Add to recent actions
  recentActions.value.unshift({
    id: Date.now(),
    icon: action.icon,
    title: action.title + ' (Quick)',
    description: action.description,
    bgClass: action.bgClass,
    iconClass: action.iconClass,
    time: 'Just now',
    action: action.action
  })
  
  // Keep only last 5
  if (recentActions.value.length > 5) {
    recentActions.value.pop()
  }
  
  // Close modal after delay
  setTimeout(() => {
    closeModal()
  }, 1000)
}

const repeatAction = (recent) => {
  alert(`Repeating: ${recent.title}`)
}

const closeModal = () => {
  visible.value = false
}

const openModal = () => {
  visible.value = true
}

// Listen for open event
onMounted(() => {
  window.addEventListener('open-quick-actions', openModal)
  
  // Add animation style
  const style = document.createElement('style')
  style.textContent = `
    @keyframes quickActionRipple {
      0% {
        opacity: 0;
        transform: scale(0.95);
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 0;
        transform: scale(1.05);
      }
    }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  window.removeEventListener('open-quick-actions', openModal)
})

// Expose open method
defineExpose({ openModal })
</script>