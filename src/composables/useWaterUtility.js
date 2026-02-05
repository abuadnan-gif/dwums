import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import apiService from '@/utils/api'
import { formatCurrency, formatDate, calculateWaterBill } from '@/utils/helpers'

export function useWaterUtility() {
  const themeStore = useThemeStore()
  const loading = ref(false)
  const error = ref(null)

  const userRole = computed(() => themeStore.userRole)
  const isDarkMode = computed(() => themeStore.isDark)

  const getRoleScope = () => {
    const scopes = {
      national: 'country',
      regional: 'region',
      zone: 'zone',
      branch: 'branch',
      customer: 'account'
    }
    return scopes[userRole.value] || 'country'
  }

  const fetchCustomers = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiService.getCustomers({
        ...params,
        scope: getRoleScope()
      })
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateEstimation = async (applicantData) => {
    loading.value = true
    
    try {
      // Calculate estimation based on materials, labor, and other charges
      const estimation = {
        ...applicantData,
        est_date: new Date().toISOString(),
        status: 'Draft'
      }
      
      return await apiService.createEstimation(estimation)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitMeterReading = async (readingData) => {
    loading.value = true
    
    try {
      // Validate reading
      if (readingData.current_reading < readingData.previous_reading) {
        throw new Error('Current reading cannot be less than previous reading')
      }
      
      return await apiService.submitReading(readingData)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const calculateBill = (usage, tariffBlocks) => {
    return calculateWaterBill(usage, tariffBlocks)
  }

  const exportData = async (module, format = 'csv') => {
    loading.value = true
    
    try {
      // Implementation for data export
      console.log(`Exporting ${module} data as ${format}`)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    userRole,
    isDarkMode,
    getRoleScope,
    fetchCustomers,
    generateEstimation,
    submitMeterReading,
    calculateBill,
    exportData,
    formatCurrency,
    formatDate
  }
}