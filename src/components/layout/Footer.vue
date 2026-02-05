<template>
  <footer class=" relative mt-16 border-t border-neutral-200/50 dark:border-neutral-800/50">
    <div class="absolute top-0 left-0 right-0 h-0.5">
        <div
          class="h-full bg-gradient-to-r from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark opacity-90 animate-gradient-flow"
        ></div>
        <div
          class="absolute inset-0 h-full bg-gradient-to-r from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark opacity-30 blur-sm animate-pulse-slow"
        ></div>
      </div>
    <div
      class="px-6 py-3 flex flex-col md:flex-row items-center 
             justify-center md:justify-between
             text-sm text-neutral-600 dark:text-neutral-400
             gap-x-4 gap-y-2"
    >

      <div class="flex flex-col mx-auto md:flex-row md:items-center justify-center space-y-4 md:space-y-0 gap-6">
        <span class="text-xs text-center md:text-right">
         Copy Right © 2026 Kombolcha city DWUMS. Design and Developed by
            <span class="text-primary cursor-pointer relative group" >
          G-TECH
           <div
        class="absolute bottom-full text-center mb-2 right-1  w-48 p-2 md:items-center bg-white dark:bg-slate-900 text-xs text-neutral-800 dark:text-neutral-200 border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity left-1/2 -translate-x-1/2
           sm:left-1/2 sm:-translate-x-1/2
           xs:left-1/2 xs:-translate-x-1/2"
      >
        G-TECH Solutions<br />
        Kombolcha, Ethiopia<br />
        Phone: +251 900000000<br />
        Email: gtech@gtech.com
      </div> </span>
        </span>
      </div>
       <div class="flex items-center gap-2 justify-center md:justify-start">
      
        <span class="text-xs opacity-40 select-none">|</span>
        <span class="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
          v1.0.0
        </span>
      </div>
         <!-- Floating Elements -->
        <div v-show="showBackToTop" class="fixed bottom-6 right-2 z-50 lg:block">
          <button
            @click="scrollToTop"
            class="group relative p-3 rounded-xl bg-gradient-to-br from-white/20 to-white/10 dark:from-neutral-900/20 dark:to-neutral-800/10 border border-neutral-300/30 dark:border-neutral-700/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-110"
          >
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-light/10 to-accent-light/10 dark:from-primary-dark/10 dark:to-accent-dark/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <ArrowUpIcon
              class="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-primary dark:group-hover:text-primary relative"
            />
            <div
              class="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              Back to top
              <div
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 dark:bg-neutral-800 rotate-45"
              ></div>
            </div>
          </button>
        </div>

    </div>
  </footer>
</template>
<script setup>
import { ArrowUpIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted, onUnmounted } from 'vue'

const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>