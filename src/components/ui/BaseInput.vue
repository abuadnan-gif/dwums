<template>
  <div class="flex flex-col w-full">
    <!-- Label -->
    <label v-if="label" class="mb-1 font-medium ">{{ label }}</label>

    <!-- Standard Inputs -->
    <input
      v-if="type !== 'select' && type !== 'file' && type !== 'textarea'"
      :type="type"
      v-model="internalValue"
      :placeholder="placeholder"
      :disabled="disabled"
       class="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2
focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500
bg-white dark:bg-gray-800
text-gray-900 dark:text-white
placeholder-gray-500 dark:placeholder-gray-400"
    />

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      v-model="internalValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-2
focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500
bg-white dark:bg-gray-800
text-gray-900 dark:text-white
placeholder-gray-500 dark:placeholder-gray-400"
    ></textarea>

    <!-- Select -->
    <select
      v-else-if="type === 'select'"
      v-model="internalValue"
      :disabled="disabled"
      class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-900"
    >
      <option value="" disabled hidden>Select {{ label }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- File Input -->
<input
  v-else-if="type === 'file'"
  type="file"
  :multiple="multiple"
  @change="onFileChange"
  class="w-full border rounded p-2"
/>

    <!-- Error Message -->
    <p v-if="error" class="text-red-600 mt-1 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Array, File, Object],
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  rows: { type: Number, default: 3 }
})

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => (internalValue.value = val)
)

watch(internalValue, (val) => emit('update:modelValue', val))
//Must support for uplading single or multiple files
const onFileChange = (event) => {
  const files = Array.from(event.target.files)

  if (props.multiple) {
    internalValue.value = files
    emit('update:modelValue', files)
  } else {
    const singleFile = files[0] || null
    internalValue.value = singleFile
    emit('update:modelValue', singleFile)
  }
}

</script>
