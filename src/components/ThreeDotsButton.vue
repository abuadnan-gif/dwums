<script setup>
import { ref } from 'vue'

defineProps({
  actions: {
    type: Array,
    required: true
  }
})

const open = ref(false)
</script>

<template>
  <div class="relative inline-block">
    <button
      @click="open = !open"
      class="flex items-center gap-1 p-2 rounded hover:bg-gray-200"
    >
      <span class="w-2 h-2 rounded-full bg-green-500"></span>
      <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
      <span class="w-2 h-2 rounded-full bg-red-500"></span>
    </button>
    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 mt-2 w-40 bg-white border rounded shadow"
    >
      <button
        v-for="(action, i) in actions"
        :key="i"
        @click="action.onClick()"
        class="block w-full text-left px-4 py-2 hover:bg-gray-100"
        :class="action.class"
      >
        {{ action.name }}
      </button>
    </div>
  </div>
</template>
