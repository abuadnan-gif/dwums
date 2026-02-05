<template>
  <div 
    class="group relative transform-gpu transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Glow Background -->
    <div 
      class="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      :class="glowClass"
    ></div>
    
    <!-- Main Card -->
    <div 
      class="relative rounded-2xl border overflow-hidden"
      :class="[
        'bg-light-bg-card dark:bg-dark-bg-card',
        'border-light-border-subtle/30 dark:border-dark-border-subtle/30',
        'group-hover:border-opacity-50 transition-all duration-500',
        isHovering ? 'shadow-2xl' : 'shadow-lg'
      ]"
    >
      <!-- Gradient Overlay -->
      <div 
        class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        :class="gradientOverlayClass"
      ></div>
      
      <!-- Animated Border -->
      <div class="absolute inset-0 border-2 border-transparent rounded-2xl">
        <div 
          class="absolute inset-0 rounded-2xl"
          :class="borderGradientClass"
          :style="{
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '2px',
            animation: 'gradientFlow 3s linear infinite'
          }"
        ></div>
      </div>
      
      <!-- Sparkline Chart -->
      <div 
        v-if="sparklineData"
        class="absolute top-0 right-0 left-0 h-16 overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity duration-500"
      >
        <svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path 
            :d="sparklinePath"
            fill="none"
            :stroke="sparklineColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <!-- Title and Icon -->
          <div class="flex items-center space-x-3">
            <div class="relative">
              <!-- Icon Background -->
              <div 
                class="absolute -inset-2 rounded-xl blur-md opacity-30"
                :class="iconGlowClass"
              ></div>
              
              <!-- Icon -->
              <div 
                class="relative p-2.5 rounded-lg backdrop-blur-sm"
                :class="iconBgClass"
              >
                <component :is="getIcon(icon)" class="w-5 h-5" :class="iconColorClass" />
              </div>
            </div>
            
            <div>
              <p class="text-sm font-semibold uppercase tracking-wider text-light-text-muted dark:text-dark-text-muted">
                {{ title }}
              </p>
              <p class="text-3xl font-bold mt-1">
                <span :class="valueColorClass">{{ formattedValue }}</span>
                <span v-if="unit" class="text-lg font-normal text-light-text-muted dark:text-dark-text-muted ml-1">
                  {{ unit }}
                </span>
              </p>
            </div>
          </div>
          
          <!-- Trend Indicator -->
          <div 
            v-if="trend"
            class="relative"
            :class="[
              'px-2.5 py-1 rounded-full text-xs font-bold',
              trend.direction === 'up' 
                ? 'bg-state-success/10 text-state-success' 
                : 'bg-state-error/10 text-state-error'
            ]"
          >
            <div class="flex items-center space-x-1">
              <TrendingUpIcon v-if="trend.direction === 'up'" class="w-3 h-3" />
              <TrendingDownIcon v-else class="w-3 h-3" />
              <span>{{ trend.value }}%</span>
            </div>
            
            <!-- Trend Glow -->
            <div 
              class="absolute -inset-1 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500"
              :class="trend.direction === 'up' ? 'bg-state-success' : 'bg-state-error'"
            ></div>
          </div>
        </div>
        
        <!-- Description -->
        <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
          {{ description }}
        </p>
        
        <!-- Progress Bar -->
        <div v-if="progress !== undefined" class="space-y-2 mb-6">
          <div class="flex justify-between text-xs">
            <span class="text-light-text-muted dark:text-dark-text-muted">Progress</span>
            <span class="font-semibold" :class="progressColorClass">{{ progress }}%</span>
          </div>
          <div class="h-1.5 bg-light-bg-surface dark:bg-dark-bg-surface rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000"
              :class="progressBarClass"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-light-border-subtle/30 dark:border-dark-border-subtle/30">
          <span class="text-xs text-light-text-muted dark:text-dark-text-muted">
            {{ period }}
          </span>
          
          <button 
            v-if="action"
            @click="$emit('action-click')"
            class="group/btn relative text-xs font-semibold"
            :class="actionColorClass"
          >
            <span class="relative z-10">{{ action.label }}</span>
            <div class="absolute -inset-2 rounded-lg opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"
                 :class="actionGlowClass"></div>
            <ArrowRightIcon class="inline w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
      
      <!-- Hover Effect -->
      <div 
        class="absolute inset-0 bg-gradient-to-t from-light-bg-surface/0 via-light-bg-surface/0 to-light-bg-surface/5 dark:from-dark-bg-surface/0 dark:via-dark-bg-surface/0 dark:to-dark-bg-surface/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>
      
      <!-- Corner Accents -->
      <div class="absolute top-0 right-0 w-8 h-8 overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8"
             :class="cornerAccentClass"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'
import { TrendingUpIcon, TrendingDownIcon, ArrowRightIcon } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  trend: {
    type: Object,
    default: null
  },
  progress: {
    type: Number,
    default: undefined
  },
  period: {
    type: String,
    default: 'Last 30 days'
  },
  action: {
    type: Object,
    default: null
  },
  gradient: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'accent', 'success', 'warning', 'error', 'info'].includes(value)
  },
  sparklineData: {
    type: Array,
    default: null
  }
})

const emit = defineEmits(['action-click'])
const isHovering = ref(false)

const formattedValue = computed(() => {
  const val = props.value
  if (typeof val === 'number') {
    return val.toLocaleString()
  }
  return val
})

const gradientClasses = {
  primary: {
    glowClass: 'bg-gradient-to-r from-brand-primary/30 to-brand-accent/30',
    gradientOverlayClass: 'bg-gradient-to-br from-brand-primary to-brand-accent',
    borderGradientClass: 'bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary',
    iconGlowClass: 'bg-gradient-to-br from-brand-primary to-brand-accent',
    iconBgClass: 'bg-gradient-to-br from-brand-primary/10 to-brand-accent/10',
    iconColorClass: 'text-brand-primary dark:text-brand-accent',
    valueColorClass: 'bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent',
    progressBarClass: 'bg-gradient-to-r from-brand-primary to-brand-accent',
    progressColorClass: 'bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent',
    actionColorClass: 'text-brand-primary dark:text-brand-accent',
    actionGlowClass: 'bg-brand-primary',
    cornerAccentClass: 'bg-gradient-to-br from-brand-primary/20 to-brand-accent/20',
    sparklineColor: '#1E40AF'
  },
  accent: {
    glowClass: 'bg-gradient-to-r from-brand-accent/30 to-brand-primary/30',
    gradientOverlayClass: 'bg-gradient-to-br from-brand-accent to-brand-primary',
    borderGradientClass: 'bg-gradient-to-r from-brand-accent via-brand-primary to-brand-accent',
    iconGlowClass: 'bg-gradient-to-br from-brand-accent to-brand-primary',
    iconBgClass: 'bg-gradient-to-br from-brand-accent/10 to-brand-primary/10',
    iconColorClass: 'text-brand-accent dark:text-brand-primary',
    valueColorClass: 'bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent',
    progressBarClass: 'bg-gradient-to-r from-brand-accent to-brand-primary',
    progressColorClass: 'bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent',
    actionColorClass: 'text-brand-accent dark:text-brand-primary',
    actionGlowClass: 'bg-brand-accent',
    cornerAccentClass: 'bg-gradient-to-br from-brand-accent/20 to-brand-primary/20',
    sparklineColor: '#1488A6'
  },
  success: {
    glowClass: 'bg-gradient-to-r from-state-success/30 to-state-success/50',
    gradientOverlayClass: 'bg-gradient-to-br from-state-success to-state-success/80',
    borderGradientClass: 'bg-gradient-to-r from-state-success via-state-success/80 to-state-success',
    iconGlowClass: 'bg-gradient-to-br from-state-success to-state-success/80',
    iconBgClass: 'bg-gradient-to-br from-state-success/10 to-state-success/40',
    iconColorClass: 'text-state-success',
    valueColorClass: 'bg-gradient-to-r from-state-success to-state-success/80 bg-clip-text text-transparent',
    progressBarClass: 'bg-gradient-to-r from-state-success to-state-success/80',
    progressColorClass: 'bg-gradient-to-r from-state-success to-state-success/80 bg-clip-text text-transparent',
    actionColorClass: 'text-state-success',
    actionGlowClass: 'bg-state-success',
    cornerAccentClass: 'bg-gradient-to-br from-state-success/20 to-state-success/40',
    sparklineColor: '#16A34A'
  },
  warning: {
    glowClass: 'bg-gradient-to-r from-state-warning/30 to-state-error/30',
    gradientOverlayClass: 'bg-gradient-to-br from-state-warning to-state-error',
    borderGradientClass: 'bg-gradient-to-r from-state-warning via-state-error to-state-warning',
    iconGlowClass: 'bg-gradient-to-br from-state-warning to-state-error',
    iconBgClass: 'bg-gradient-to-br from-state-warning/20 to-state-error/40',
    iconColorClass: 'text-state-warning',
    valueColorClass: 'bg-gradient-to-r from-state-warning to-state-error bg-clip-text text-transparent',
    progressBarClass: 'bg-gradient-to-r from-state-warning to-state-error',
    progressColorClass: 'bg-gradient-to-r from-state-warning to-state-error bg-clip-text text-transparent',
    actionColorClass: 'text-state-warning',
    actionGlowClass: 'bg-state-warning',
    cornerAccentClass: 'bg-gradient-to-br from-state-warning/20 to-state-error/40',
    sparklineColor: '#F59E0B'
  },
  error: {
    glowClass: 'bg-gradient-to-r from-state-error/30 to-state-error/50',
    gradientOverlayClass: 'bg-gradient-to-br from-state-error to-state-error/80',
    borderGradientClass: 'bg-gradient-to-r from-state-error via-state-error/80 to-state-error',
    iconGlowClass: 'bg-gradient-to-br from-state-error to-state-error/80',
    iconBgClass: 'bg-gradient-to-br from-state-error/10 to-state-error/40',
    iconColorClass: 'text-state-error',
    valueColorClass: 'bg-gradient-to-r from-state-error to-state-error/80 bg-clip-text text-transparent',
    progressBarClass: 'bg-gradient-to-r from-state-error to-state-error/80',
    progressColorClass: 'bg-gradient-to-r from-state-error to-state-error/80 bg-clip-text text-transparent',
    actionColorClass: 'text-state-error',
    actionGlowClass: 'bg-state-error',
    cornerAccentClass: 'bg-gradient-to-br from-state-error/20 to-state-error/40',
    sparklineColor: '#DC2626'
  },
  info: {
    glowClass: 'bg-gradient-to-r from-state-info/30 to-brand-accent/30',
    gradientOverlayClass: 'bg-gradient-to-br from-state-info to-brand-accent',
    borderGradientClass: 'bg-gradient-to-r from-state-info via-brand-accent to-state-info',
    iconGlowClass: 'bg-gradient-to-br from-state-info to-brand-accent',
    iconBgClass: 'bg-gradient-to-br from-state-info/20 to-brand-accent/40',
    iconColorClass: 'text-state-info',
    valueColorClass: 'bg-gradient-to-r from-state-info to-brand-accent bg-clip-text text-transparent',
    progressBarClass: 'bg-gradient-to-r from-state-info to-brand-accent',
    progressColorClass: 'bg-gradient-to-r from-state-info to-brand-accent bg-clip-text text-transparent',
    actionColorClass: 'text-state-info',
    actionGlowClass: 'bg-state-info',
    cornerAccentClass: 'bg-gradient-to-br from-state-info/20 to-brand-accent/40',
    sparklineColor: '#0284C7'
  }
}

const gradientConfig = computed(() => gradientClasses[props.gradient])

// Computed properties for gradient classes
const glowClass = computed(() => gradientConfig.value.glowClass)
const gradientOverlayClass = computed(() => gradientConfig.value.gradientOverlayClass)
const borderGradientClass = computed(() => gradientConfig.value.borderGradientClass)
const iconGlowClass = computed(() => gradientConfig.value.iconGlowClass)
const iconBgClass = computed(() => gradientConfig.value.iconBgClass)
const iconColorClass = computed(() => gradientConfig.value.iconColorClass)
const valueColorClass = computed(() => gradientConfig.value.valueColorClass)
const progressBarClass = computed(() => gradientConfig.value.progressBarClass)
const progressColorClass = computed(() => gradientConfig.value.progressColorClass)
const actionColorClass = computed(() => gradientConfig.value.actionColorClass)
const actionGlowClass = computed(() => gradientConfig.value.actionGlowClass)
const cornerAccentClass = computed(() => gradientConfig.value.cornerAccentClass)
const sparklineColor = computed(() => gradientConfig.value.sparklineColor)

// Generate sparkline path
const sparklinePath = computed(() => {
  if (!props.sparklineData || props.sparklineData.length === 0) return ''
  
  const points = props.sparklineData
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  
  const stepX = 100 / (points.length - 1)
  let path = `M 0 ${40 - ((points[0] - min) / range) * 40}`
  
  for (let i = 1; i < points.length; i++) {
    const x = i * stepX
    const y = 40 - ((points[i] - min) / range) * 40
    path += ` L ${x} ${y}`
  }
  
  return path
})

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons['Circle']
}
</script>