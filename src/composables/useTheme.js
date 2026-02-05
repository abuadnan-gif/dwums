import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const setTheme = (theme) => {
    isDark.value = theme === 'dark'
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (prefersDark) {
      setTheme('dark')
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}