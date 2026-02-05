<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition name="modal-backdrop">
      <div 
        v-if="visible"
        class="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-lg"
        @click="handleBackdropClick"
      ></div>
    </transition>

    <!-- Modal -->
    <transition name="modal">
      <div 
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <!-- Modal Container -->
        <div 
          ref="modalRef"
          :class="[
            'relative max-w-2xl w-full max-h-[90vh] overflow-hidden transform-gpu',
            'bg-gradient-to-b from-light-bg-card via-light-bg-card to-light-bg-card/95 dark:from-dark-bg-card dark:via-dark-bg-card dark:to-dark-bg-card/95',
            'backdrop-blur-xl border border-light-border-subtle/30 dark:border-dark-border-subtle/30',
            'shadow-2xl shadow-black/30 rounded-2xl',
            sizeClasses
          ]"
          style="will-change: transform, opacity;"
        >
          <!-- Animated Border -->
          <div class="absolute inset-0 rounded-2xl pointer-events-none">
            <div class="absolute -inset-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary rounded-2xl blur-xl opacity-20 animate-gradientBorder"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-light-border-subtle/10 via-transparent to-dark-border-subtle/10 rounded-2xl"></div>
          </div>

          <!-- Header -->
          <div class="relative p-6 border-b border-light-border-subtle/30 dark:border-dark-border-subtle/30">
            <!-- Header Background Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-accent/5"></div>
            
            <div class="relative flex items-center justify-between">
              <!-- Title with Icon -->
              <div class="flex items-center space-x-3">
                <div 
                  v-if="icon"
                  class="relative"
                >
                  <div class="absolute -inset-2 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl blur-lg opacity-30"></div>
                  <div class="relative p-2 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-accent/10">
                    <component :is="getIcon(icon)" class="w-5 h-5 text-brand-primary dark:text-brand-accent" />
                  </div>
                </div>
                
                <div>
                  <h3 class="text-xl font-bold tracking-tight text-light-text-primary dark:text-dark-text-primary">
                    {{ title }}
                  </h3>
                  <p v-if="subtitle" class="text-sm text-light-text-muted dark:text-dark-text-muted mt-1">
                    {{ subtitle }}
                  </p>
                </div>
              </div>

              <!-- Close Button -->
              <button
                @click="close"
                class="relative p-2 rounded-lg hover:bg-light-bg-surface dark:hover:bg-dark-bg-surface transition-all duration-300 group"
              >
                <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-primary/0 to-brand-accent/0 group-hover:from-brand-primary/10 group-hover:to-brand-accent/10 transition-all duration-300"></div>
                <XIcon class="w-5 h-5 text-light-text-muted dark:text-dark-text-muted group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors duration-300" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="relative p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div 
            v-if="showFooter"
            class="relative p-6 border-t border-light-border-subtle/30 dark:border-dark-border-subtle/30"
          >
            <!-- Footer Background Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/2 to-transparent"></div>
            
            <div class="relative flex items-center justify-end space-x-3">
              <slot name="footer">
                <button
                  v-if="showCancel"
                  @click="close"
                  class="px-4 py-2.5 text-sm font-medium rounded-lg border border-light-border-subtle dark:border-dark-border-subtle hover:bg-light-bg-surface dark:hover:bg-dark-bg-surface transition-all duration-300"
                >
                  {{ cancelText }}
                </button>
                <button
                  v-if="showConfirm"
                  @click="confirm"
                  class="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300"
                >
                  {{ confirmText }}
                </button>
              </slot>
            </div>
          </div>

          <!-- Floating Particles -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div 
              v-for="i in 5"
              :key="i"
              class="absolute w-1 h-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent opacity-0"
              :class="`particle-${i}`"
            ></div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as LucideIcons from 'lucide-vue-next'
import { XIcon } from 'lucide-vue-next'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'close', 'confirm'])

const modalRef = ref(null)

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl'
}[props.size]

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons['Circle']
}

const close = () => {
  emit('update:visible', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const handleEscape = (event) => {
  if (props.visible && props.closeOnEscape && event.key === 'Escape') {
    close()
  }
}

const animateParticles = () => {
  if (!modalRef.value) return
  
  const particles = modalRef.value.querySelectorAll('[class^="particle-"]')
  particles.forEach((particle, index) => {
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animation = `particleFloat${index + 1} 3s ease-in-out infinite`
    particle.style.opacity = '0.3'
  })
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  
  // Add animation styles
  const style = document.createElement('style')
  style.textContent = `
    .modal-backdrop-enter-active,
    .modal-backdrop-leave-active {
      transition: opacity 0.4s cubic-bezier(0.77,0,0.175,1);
    }
    
    .modal-backdrop-enter-from,
    .modal-backdrop-leave-to {
      opacity: 0;
    }
    
    .modal-enter-active {
      transition: all 0.5s cubic-bezier(0.77,0,0.175,1);
    }
    
    .modal-leave-active {
      transition: all 0.3s cubic-bezier(0.77,0,0.175,1);
    }
    
    .modal-enter-from {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    
    .modal-leave-to {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    
    @keyframes gradientBorder {
      0%, 100% {
        opacity: 0.2;
      }
      50% {
        opacity: 0.4;
      }
    }
    
    .animate-gradientBorder {
      animation: gradientBorder 3s ease-in-out infinite;
    }
    
    @keyframes particleFloat1 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      25% {
        transform: translate(10px, -10px) scale(1.5);
        opacity: 0.4;
      }
    }
    
    @keyframes particleFloat2 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      50% {
        transform: translate(-8px, 8px) scale(1.5);
        opacity: 0.4;
      }
    }
    
    @keyframes particleFloat3 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      75% {
        transform: translate(5px, 5px) scale(1.5);
        opacity: 0.4;
      }
    }
    
    @keyframes particleFloat4 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      33% {
        transform: translate(-5px, -5px) scale(1.5);
        opacity: 0.4;
      }
    }
    
    @keyframes particleFloat5 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      66% {
        transform: translate(7px, -7px) scale(1.5);
        opacity: 0.4;
      }
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      margin: 8px 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, var(--brand-primary), var(--brand-accent));
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, var(--brand-primary), var(--brand-accent));
      opacity: 0.8;
    }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Disable body scroll
    document.body.style.overflow = 'hidden'
    // Animate particles
    setTimeout(animateParticles, 100)
  } else {
    // Enable body scroll
    document.body.style.overflow = ''
  }
})
</script>