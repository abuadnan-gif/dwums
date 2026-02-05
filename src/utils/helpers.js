// Helper functions for the water utility system
import { format } from 'date-fns'

export const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  if (!date) return ''
  return format(new Date(date), formatString)
}

export const formatMeterReading = (reading) => {
  return `${parseFloat(reading).toFixed(2)} m³`
}

export const calculateWaterBill = (usage, tariffBlocks) => {
  let total = 0
  let remainingUsage = usage
  
  for (const block of tariffBlocks.sort((a, b) => a.block_number - b.block_number)) {
    const blockRange = block.to_m3 - block.from_m3
    const usageInBlock = Math.min(remainingUsage, blockRange)
    
    if (usageInBlock > 0) {
      total += usageInBlock * block.price_per_m3
      remainingUsage -= usageInBlock
    }
    
    if (remainingUsage <= 0) break
  }
  
  return total
}

export const validateEthiopianPhone = (phone) => {
  const regex = /^(?:(?:\+251|251|0)(9\d{8}))$/
  return regex.test(phone)
}

export const generateCustomerCode = (regionCode, sequence) => {
  const year = new Date().getFullYear()
  return `C-${regionCode}-${year}-${sequence.toString().padStart(6, '0')}`
}

export const calculateNRW = (totalProduced, totalBilled) => {
  if (totalProduced === 0) return 0
  const losses = totalProduced - totalBilled
  return ((losses / totalProduced) * 100).toFixed(2)
}

export const debounce = (func, delay) => {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}