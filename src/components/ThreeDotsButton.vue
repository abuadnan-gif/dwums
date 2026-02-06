<script setup>
import { ref } from 'vue'
import { getColor } from '@/utils/colors';
import Icon from '@/components/Icon.vue'

defineProps({
  actions: Array,
    isOpen: Boolean
  
})

// const open = ref(false)
const emit = defineEmits(['toggle'])
const handleClick = (action) => {
  action.onClick()    
  emit('toggle')      
}
</script>

<template>
  <div class="relative inline-block">
    <button
      @click="$emit('toggle')"
      class="flex items-center gap-1 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <span class="w-2 h-2 rounded-full bg-green-500"></span>
      <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
      <span class="w-2 h-2 rounded-full bg-red-500"></span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-[9999]"
    >
      <button
        v-for="(action, i) in actions"
        :key="i"
       @click="handleClick(action)"
        class="flex items-center w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="action.class"
      >
      <Icon :name="action.icon" class="mr-2"
      :style="{ color: getColor(action.color, 'default', isDark) }"
      />
      <span :style="{ color: getColor(action.color, 'default', isDark) }"> 
        {{ action.name }}
        </span>
      </button>
    </div>
  </div>
</template>
