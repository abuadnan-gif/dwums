<script setup>
import * as Icons from '@heroicons/vue/24/outline'
defineProps({
    name:String
})
</script>

<template>
<component :is="Icons[name]" class="w-5 h-5"/>
</template>