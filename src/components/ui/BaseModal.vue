<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Icon from '@/components/Icon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconAnimation: {
    type: String,
    default: 'pulse',
    validator: (value) => ['pulse', 'bounce', 'spin', 'none'].includes(value)
  },
  badge: {
    type: String,
    default: ''
  },
  badgeType: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'critical'].includes(value)
  },
  badgeIcon: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'].includes(value)
  },
  animation: {
    type: String,
    default: 'scale',
    validator: (value) =>
      ['scale', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'fade', 'flip'].includes(
        value
      )
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  centered: {
    type: Boolean,
    default: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  resizable: {
    type: Boolean,
    default: false
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showFullscreenToggle: {
    type: Boolean,
    default: false
  },
  showScrollIndicator: {
    type: Boolean,
    default: true
  },
  showSteps: {
    type: Boolean,
    default: false
  },
  steps: {
    type: Array,
    default: () => []
  },
  currentStep: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  footerBorderless: {
    type: Boolean,
    default: false
  },
  closeLabel: {
    type: String,
    default: 'Close'
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: ''
  },
  minWidth: {
    type: String,
    default: ''
  },
  gradientTitle: {
    type: Boolean,
    default: true // Changed to true by default
  },
  //Added BY ME
  confirmText: {
    type: String,
    default: '' // if empty, no confirm button shows
  }
})

const emit = defineEmits([
  'update:modelValue',
  'close',
  'scroll',
  'resize',
  'drag',
  'fullscreen-change',
  'step-change'
])

const modalRef = ref(null)
const modalBody = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0, left: 0, top: 0 })
const modalPosition = ref({ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' })
const modalSize = ref({ width: null, height: null })
const isAtBottom = ref(false)
const isAtTop = ref(true)

// Computed
const modalStyle = computed(() => {
  const style = {}

  // Position for draggable modals
  if (props.draggable && !props.centered) {
    Object.assign(style, modalPosition.value)
  }

  // Size for resizable modals
  if (props.resizable && modalSize.value.width) {
    style.width = modalSize.value.width
    style.height = modalSize.value.height
  } else {
    if (props.width) style.width = props.width
    if (props.height) style.height = props.height
    if (props.maxWidth) style.maxWidth = props.maxWidth
    if (props.minWidth) style.minWidth = props.minWidth
  }

  return style
})

// Methods
const beforeEnter = (el) => {
  el.style.opacity = 0
}

const afterEnter = (el) => {
  el.style.opacity = 1
}

const afterLeave = () => {
  // Cleanup after animation
}

const handleOverlayClick = () => {
  if (props.closeOnClickOutside && !isDragging.value) {
    closeModal()
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const toggleFullscreen = () => {
  emit('fullscreen-change', !props.fullscreen)
}

const handleScroll = () => {
  if (modalBody.value) {
    const { scrollTop, scrollHeight, clientHeight } = modalBody.value
    isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 20
    isAtTop.value = scrollTop === 0

    emit('scroll', {
      scrollTop,
      scrollHeight,
      clientHeight,
      isAtBottom: isAtBottom.value,
      isAtTop: isAtTop.value
    })
  }
}

// Drag functionality
const startDrag = (e) => {
  if (!props.draggable || e.target.closest('button')) return

  isDragging.value = true
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    left: modalRef.value?.offsetLeft || 0,
    top: modalRef.value?.offsetTop || 0
  }

  document.body.style.userSelect = 'none'
}

const onDrag = (e) => {
  if (!isDragging.value || !modalRef.value) return

  e.preventDefault()

  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y

  const newLeft = dragStart.value.left + dx
  const newTop = dragStart.value.top + dy

  // Keep modal within viewport
  const modalWidth = modalRef.value.offsetWidth
  const modalHeight = modalRef.value.offsetHeight

  const constrainedLeft = Math.min(Math.max(newLeft, 0), window.innerWidth - modalWidth)

  const constrainedTop = Math.min(Math.max(newTop, 0), window.innerHeight - modalHeight)

  modalPosition.value = {
    left: `${constrainedLeft}px`,
    top: `${constrainedTop}px`,
    transform: 'none'
  }

  emit('drag', { left: constrainedLeft, top: constrainedTop })
}

const stopDrag = () => {
  isDragging.value = false
  document.body.style.userSelect = ''
}

// Resize functionality
const startResize = (e) => {
  if (!props.resizable) return

  isResizing.value = true
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: modalRef.value?.offsetWidth || 0,
    height: modalRef.value?.offsetHeight || 0
  }

  document.body.style.userSelect = 'none'

  const onResize = (e) => {
    if (!isResizing.value || !modalRef.value) return

    e.preventDefault()

    const dx = e.clientX - dragStart.value.x
    const dy = e.clientY - dragStart.value.y

    const newWidth = Math.max(300, dragStart.value.width + dx)
    const newHeight = Math.max(200, dragStart.value.height + dy)

    modalSize.value = {
      width: `${newWidth}px`,
      height: `${newHeight}px`
    }

    emit('resize', { width: newWidth, height: newHeight })
  }

  const stopResize = () => {
    isResizing.value = false
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', stopResize)
  }

  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

// Keyboard handling
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.closeOnEscape && props.modelValue) {
    closeModal()
  }
}

// Body scroll lock
const lockBodyScroll = (shouldLock) => {
  if (shouldLock) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    lockBodyScroll(true)
    document.addEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  lockBodyScroll(false)
  document.removeEventListener('keydown', handleEscape)
})

watch(
  () => props.modelValue,
  (newVal) => {
    lockBodyScroll(newVal)

    if (newVal) {
      document.addEventListener('keydown', handleEscape)
      nextTick(() => {
        if (modalBody.value) {
          modalBody.value.addEventListener('scroll', handleScroll)
        }
      })
    } else {
      document.removeEventListener('keydown', handleEscape)
      if (modalBody.value) {
        modalBody.value.removeEventListener('scroll', handleScroll)
      }
    }
  }
)
const toLoadingText = (text) => {
  if (!text) return ''

  const words = text.split(' ')
  let first = words[0]

  if (first.endsWith('e')) {
    first = first.slice(0, -1) + 'ing'
  } else {
    first = first + 'ing'
  }

  return [first, ...words.slice(1)].join(' ') + '...'
}
const loadingText = computed(() =>
  props.loading ? toLoadingText(props.confirmText) : props.confirmText
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade" @after-leave="afterLeave">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <!-- Background decoration -->
        <div class="modal-bg-decoration">
          <div class="modal-orb modal-orb-1"></div>
          <div class="modal-orb modal-orb-2"></div>
          <div class="modal-grid"></div>
        </div>

        <Transition
          :name="`modal-${animation}`"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
        >
          <div
            v-if="modelValue"
            ref="modalRef"
            class="modal"
            :class="[
              `modal-${size}`,
              {
                'modal-fullscreen': fullscreen,
                'modal-with-image': image,
                'modal-centered': centered,
                'modal-draggable': draggable
              }
            ]"
            :style="modalStyle"
            @click.stop
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
          >
            <!-- Modal Header -->
            <div class="modal-header" :class="{ 'modal-header-with-image': image }">
              <div class="modal-header-left">
                <div class="modal-icon-wrapper">
                  <slot name="icon">
                    <div v-if="icon" class="modal-icon-bg">
                      <Icon :name="icon" class="modal-icon" :class="iconAnimation" />
                    </div>
                  </slot>
                  <div v-if="badge" class="modal-badge" :class="`modal-badge-${badgeType}`">
                    <Icon v-if="badgeIcon" :name="badgeIcon" class="modal-badge-icon" />
                    <span>{{ badge }}</span>
                  </div>
                </div>

                <div class="modal-title-section">
                  <h3 class="modal-title" :class="{ 'gradient-title': gradientTitle }">
                    {{ title }}
                  </h3>
                  <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
                </div>
              </div>
              <!-- by me -->
<div class="modal-header-extra">
    <slot name="header-extra"></slot>
  </div>
  <!-- end -->
              <div class="modal-header-actions">
                <!-- Fullscreen toggle -->
                <button
                  v-if="showFullscreenToggle"
                  class="modal-action-btn"
                  @click="toggleFullscreen"
                  :title="fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
                >
                  <Icon :name="fullscreen ? 'ArrowsPointingInIcon' : 'ArrowsPointingOutIcon'" />
                </button>

                <!-- Close button -->
                <button
                  v-if="showClose"
                  class="modal-close"
                  @click="closeModal"
                  :aria-label="closeLabel"
                >
                  <Icon name="XMarkIcon" />
                </button>
              </div>
            </div>

            <!-- Image Section (if provided) -->
            <div v-if="image" class="modal-image-section">
              <img :src="image" :alt="title" class="modal-image" loading="lazy" />
              <div class="modal-image-overlay"></div>
            </div>

            <!-- Progress Bar (if loading) -->
            <div v-if="loading" class="modal-progress">
              <div class="modal-progress-bar" :style="{ width: `${progress}%` }"></div>
            </div>

            <!-- Modal Body -->
            <div
              ref="modalBody"
              class="modal-body"
              :class="{ 'modal-body-no-padding': noPadding }"
              @scroll="handleScroll"
            >
              <slot>
                <p v-if="content" class="modal-content-text">{{ content }}</p>
              </slot>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer" :class="{ 'modal-footer-borderless': footerBorderless }">
              <!-- Steps (optional) -->
              <div v-if="showSteps" class="modal-steps">
                <div
                  v-for="step in steps"
                  :key="step.index"
                  class="modal-step"
                  :class="{
                    'modal-step-active': currentStep >= step.index,
                    'modal-step-completed': currentStep > step.index
                  }"
                >
                  <div class="modal-step-indicator">
                    <Icon v-if="currentStep > step.index" name="CheckIcon" />
                    <span v-else>{{ step.index }}</span>
                  </div>
                  <span class="modal-step-label">{{ step.label }}</span>
                </div>
              </div>

              <!-- Footer slot or default buttons -->
              <slot name="footer">
                <div
                  class="modal-footer-buttons"
                  style="display: flex; justify-content: flex-end; gap: 0.5rem"
                >
                  <!-- Cancel Button -->
                  <button
                    v-if="showClose"
                    class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    @click="closeModal"
                  >
                    {{ closeLabel }}
                  </button>
                  <button
                    v-if="confirmText"
                    class="px-4 py-2 flex items-center justify-center gap-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    @click="$emit('confirm')"
                    :disabled="loading"
                  >
                    <Icon v-if="loading" name="ArrowPathIcon" class="w-5 h-5 animate-spin" />
                 
                    <span>{{ loadingText }}</span>
                  </button>
                </div>
              </slot>
            </div>

            <!-- Resize handle (if resizable) -->
            <div v-if="resizable" class="modal-resize-handle" @mousedown="startResize"></div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
:root {
  --color-primary: #0066ff;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-critical: #ef4444;
  --color-foreground: #0f172a;
  --color-muted-foreground: #64748b;
  --color-muted: #f1f5f9;
  --color-border: #e2e8f0;
}

.dark {
  --color-foreground: #f1f5f9;
  --color-muted-foreground: #94a3b8;
  --color-muted: #1e293b;
  --color-border: #334155;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  transition: all 0.3s ease;
}

/* Background Decoration */
.modal-bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.modal-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: modalFloat 20s ease-in-out infinite;
}

.modal-orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%);
  top: -200px;
  right: -200px;
}

.dark .modal-orb-1 {
  background: radial-gradient(circle, rgba(0, 102, 255, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.modal-orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%);
  bottom: -150px;
  left: -150px;
  animation-delay: -5s;
}

.modal-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 102, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.dark .modal-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

/* Modal Container */
.modal {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow:
    0 30px 60px -15px rgba(0, 0, 0, 0.3),
    0 20px 40px -10px rgba(0, 102, 255, 0.2);
  width: 100%;
  max-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dark .modal {
  background: rgba(15, 23, 42, 0.95);
  box-shadow:
    0 30px 60px -15px rgba(0, 0, 0, 0.5),
    0 20px 40px -10px rgba(0, 102, 255, 0.1);
}

/* Modal Sizes */
.modal-sm {
  max-width: 400px;
}
.modal-md {
  max-width: 500px;
}
.modal-lg {
  max-width: 600px;
}
.modal-xl {
  max-width: 800px;
}
.modal-2xl {
  max-width: 1000px;
}
.modal-3xl {
  max-width: 1200px;
}
.modal-4xl {
  max-width: 1400px;
}

.modal-fullscreen {
  max-width: 95vw;
  height: 95vh;
  margin: 2.5vh auto;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.75rem 2rem;
  position: relative;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
}

.modal-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-icon-bg {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(139, 92, 246, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.modal-icon {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

/* Icon Animations */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
.bounce {
  animation: bounce 2s ease-in-out infinite;
}
.spin {
  animation: spin 3s linear infinite;
}

/* Gradient Title - Enhanced with better gradient */
.gradient-title {
  background: linear-gradient(135deg, #0066ff 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.modal-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.modal-badge-info {
  background: rgba(0, 102, 255, 0.1);
  color: var(--color-primary);
}

.modal-badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.modal-badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.modal-badge-critical {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-critical);
}

.modal-badge-icon {
  width: 12px;
  height: 12px;
}

.modal-title-section {
  flex: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  color: var(--color-foreground);
}

.dark .modal-title {
  color: #f1f5f9;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  margin-top: 0.25rem;
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-action-btn {
  padding: 0.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-muted-foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.modal-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-foreground);
  transform: scale(1.1);
}

.dark .modal-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-close {
  padding: 0.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-muted-foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-critical);
  transform: rotate(90deg);
}

/* Image Section */
.modal-image-section {
  position: relative;
  height: 200px;
  overflow: hidden;
  margin: 0 2rem 1rem 2rem;
  border-radius: 24px;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.modal:hover .modal-image {
  transform: scale(1.05);
}

.modal-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.5) 100%);
  pointer-events: none;
  border-radius: 24px;
}

/* Progress Bar */
.modal-progress {
  height: 4px;
  background: rgba(0, 102, 255, 0.1);
  overflow: hidden;
  margin: 0 2rem;
  border-radius: 4px;
}

.modal-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: width 0.3s ease;
  border-radius: 4px;
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  scroll-behavior: smooth;
}

.modal-body-no-padding {
  padding: 0;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--color-muted-foreground);
  border-radius: 20px;
  opacity: 0.3;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.modal-content-text {
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Scroll Indicator */
.modal-scroll-indicator {
  position: sticky;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.3s ease;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .modal-scroll-indicator {
  background: rgba(15, 23, 42, 0.95);
}

.modal-scroll-indicator:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 102, 255, 0.2);
}

.scroll-indicator-line {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 3px;
}

.scroll-indicator-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-foreground);
}

.scroll-indicator-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid rgba(0, 102, 255, 0.1);
}

.dark .modal-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.modal-footer-borderless {
  border-top: none;
}

/* Steps */
.modal-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.modal-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;
}

.modal-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -1rem;
  width: 2rem;
  height: 2px;
  background: var(--color-border);
}

.modal-step-active:not(:last-child)::after {
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
}

.modal-step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-foreground);
  transition: all 0.3s ease;
}

.modal-step-active .modal-step-indicator {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  transform: scale(1.1);
  box-shadow: 0 10px 20px -5px rgba(0, 102, 255, 0.3);
}

.modal-step-completed .modal-step-indicator {
  background: var(--color-success);
  color: white;
}

.modal-step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted-foreground);
  text-align: center;
}

.modal-step-active .modal-step-label {
  color: var(--color-primary);
  font-weight: 600;
}

/* Resize Handle */
.modal-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 50%, var(--color-muted-foreground) 50%);
  opacity: 0.3;
  transition: opacity 0.2s ease;
}

.modal-resize-handle:hover {
  opacity: 0.8;
}

/* Animations */
@keyframes modalFloat {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Scale Animation */
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

/* Slide Up Animation */
.modal-slide-up-enter-active,
.modal-slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-up-enter-from,
.modal-slide-up-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

/* Slide Down Animation */
.modal-slide-down-enter-active,
.modal-slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-down-enter-from,
.modal-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

/* Slide Left Animation */
.modal-slide-left-enter-active,
.modal-slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-left-enter-from,
.modal-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Slide Right Animation */
.modal-slide-right-enter-active,
.modal-slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-right-enter-from,
.modal-slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* Flip Animation */
.modal-flip-enter-active,
.modal-flip-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-flip-enter-from,
.modal-flip-leave-to {
  opacity: 0;
  transform: rotateX(-90deg);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal {
    max-height: calc(100vh - 2rem);
    border-radius: 24px;
  }

  .modal-sm,
  .modal-md,
  .modal-lg,
  .modal-xl,
  .modal-2xl,
  .modal-3xl,
  .modal-4xl {
    max-width: 100%;
  }

  .modal-header {
    padding: 1.25rem;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-header-left {
    width: 100%;
  }
/* by me */
.modal-header-extra {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem; /* adjust spacing if needed */
  align-items: center;
}

/* end */
  .modal-header-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .modal-footer {
    padding: 1.25rem;
  }

  .modal-steps {
    gap: 1rem;
  }

  .modal-step:not(:last-child)::after {
    width: 1rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-icon-bg {
    width: 48px;
    height: 48px;
  }

  .modal-icon {
    width: 24px;
    height: 24px;
  }

  .modal-image-section {
    margin: 0 1.25rem 0.75rem 1.25rem;
    height: 150px;
  }

  .modal-progress {
    margin: 0 1.25rem;
  }
}

@media (max-width: 480px) {
  .modal-steps {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-step:not(:last-child)::after {
    display: none;
  }

  .modal-badge {
    position: absolute;
    top: 0.5rem;
    right: 3rem;
  }
}
</style>
