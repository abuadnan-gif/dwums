<template>
  <div class="relative inline-block">
    <!-- Three Colored Dots -->
    <button
      @click="open = !open"
      class="flex items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
      :class="{ 'bg-muted': open }"
    >
      <span class="w-2 h-2 rounded-full bg-success"></span>
      <span class="w-2 h-2 rounded-full bg-warning"></span>
      <span class="w-2 h-2 rounded-full bg-critical"></span>
    </button>

    <!-- Dropdown -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="open"
          ref="dropdownRef"
          class="fixed z-dropdown min-w-[200px] bg-card border border-border rounded-lg shadow-medium p-2"
          :style="dropdownStyles"
          @click.stop
        >
          <button
            v-for="(action, i) in actions"
            :key="i"
            @click="handleClick(action)"
            class="flex items-center gap-3 w-full px-4 py-3 rounded-md text-foreground text-sm transition-colors hover:bg-muted"
            :class="action.class"
          >
            <component :is="action.icon" v-if="action.icon" class="w-4 h-4" />
            {{ action.name }}
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true
  }
})

const open = ref(false)
const dropdownRef = ref(null)
const dropdownStyles = ref({})

const handleClick = (action) => {
  action.onClick()
  open.value = false
}

const updatePosition = () => {
  if (!open.value) return

  const trigger = document.activeElement?.closest('button')?.getBoundingClientRect()
  if (!trigger) return

  const dropdown = dropdownRef.value
  if (!dropdown) return

  const { width, height } = dropdown.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let top = trigger.bottom + 8
  let left = trigger.right - width

  // Prevent overflow
  if (left + width > viewportWidth) {
    left = viewportWidth - width - 16
  }
  if (left < 16) {
    left = 16
  }

  if (top + height > viewportHeight) {
    top = trigger.top - height - 8
  }

  dropdownStyles.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

const handleClickOutside = (e) => {
  if (!open.value) return
  if (!e.target.closest('.relative.inline-block')) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(open, (val) => {
  if (val) {
    nextTick(updatePosition)
  }
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-critical { background-color: var(--color-critical); }
.bg-muted { background-color: var(--color-muted); }
.bg-card { background-color: var(--color-card); }
.border-border { border-color: var(--color-border); }
.text-foreground { color: var(--color-foreground); }
.hover\:bg-muted:hover { background-color: var(--color-muted); }
</style>