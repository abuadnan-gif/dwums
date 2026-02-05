<template>
  <div class="elite-card hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl">
    <!-- Animated Background -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
    </div>
    
    <div class="relative">
      <!-- Card Header -->
      <div class="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2">
              <div class="p-2 rounded-lg bg-blue-500/10">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Water Consumption</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Real-time consumption patterns & analysis</p>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
            </div>
            <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Live Data</span>
          </div>
        </div>
      </div>

      <!-- Consumption Stats -->
      <div class="p-6">
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="text-center p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">245K</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total m³</p>
          </div>
          <div class="text-center p-4 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/10 dark:border-cyan-500/20">
            <p class="text-2xl font-bold text-cyan-600 dark:text-cyan-400">8.2K</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily Avg</p>
          </div>
          <div class="text-center p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20">
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">-3.2%</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Change</p>
          </div>
        </div>

        <!-- Interactive Chart -->
        <div class="relative h-48">
          <!-- Chart Container -->
          <div class="absolute inset-0">
            <!-- Grid Lines -->
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <!-- Vertical Grid Lines -->
              <g v-for="i in 4" :key="'v' + i" class="text-gray-200 dark:text-gray-800">
                <line 
                  :x1="(i * 100)" 
                  :y1="0" 
                  :x2="(i * 100)" 
                  :y2="200" 
                  stroke="currentColor" 
                  stroke-width="1" 
                  stroke-dasharray="2,2"
                />
              </g>
              
              <!-- Horizontal Grid Lines -->
              <g v-for="i in 3" :key="'h' + i" class="text-gray-200 dark:text-gray-800">
                <line 
                  :x1="0" 
                  :y1="(i * 50)" 
                  :x2="400" 
                  :y2="(i * 50)" 
                  stroke="currentColor" 
                  stroke-width="1" 
                  stroke-dasharray="2,2"
                />
              </g>
            </svg>
            
            <!-- Data Chart -->
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <!-- Gradient for area fill -->
                <linearGradient id="consumptionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="rgb(59 130 246)" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="rgb(59 130 246)" stop-opacity="0" />
                </linearGradient>
                
                <!-- Gradient for line -->
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="rgb(59 130 246)" />
                  <stop offset="50%" stop-color="rgb(6 182 212)" />
                  <stop offset="100%" stop-color="rgb(16 185 129)" />
                </linearGradient>
              </defs>
              
              <!-- Area Fill -->
              <path 
                :d="areaPath" 
                fill="url(#consumptionGradient)" 
                class="transition-all duration-1000 ease-out"
              />
              
              <!-- Main Line -->
              <path 
                :d="linePath" 
                fill="none" 
                stroke="url(#lineGradient)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-1000 ease-out"
              >
                <animate 
                  attributeName="stroke-dasharray" 
                  :values="`0 ${lineLength}; ${lineLength} ${lineLength}`" 
                  dur="1.5s" 
                  fill="freeze" 
                />
              </path>
              
              <!-- Data Points -->
              <g>
                <circle
                  v-for="(point, index) in dataPoints"
                  :key="index"
                  :cx="point.x"
                  :cy="point.y"
                  r="4"
                  fill="white"
                  stroke="rgb(59 130 246)"
                  stroke-width="2"
                  class="cursor-pointer transition-all duration-300"
                  @mouseenter="hoverPoint = point"
                  @mouseleave="hoverPoint = null"
                >
                  <animate
                    attributeName="r"
                    values="4;6;4"
                    dur="2s"
                    repeatCount="indefinite"
                    :begin="`${index * 0.3}s`"
                  />
                </circle>
              </g>
              
              <!-- Glow Effect on Points -->
              <g>
                <circle
                  v-for="(point, index) in dataPoints"
                  :key="'glow' + index"
                  :cx="point.x"
                  :cy="point.y"
                  r="8"
                  fill="rgb(59 130 246)"
                  fill-opacity="0.2"
                >
                  <animate
                    attributeName="r"
                    values="8;12;8"
                    dur="2s"
                    repeatCount="indefinite"
                    :begin="`${index * 0.3}s`"
                  />
                </circle>
              </g>
            </svg>
          </div>
          
          <!-- Hover Tooltip -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="hoverPoint" 
              class="absolute bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-2xl z-10"
              :style="{
                left: `calc(${(hoverPoint.x / 400) * 100}% - 60px)`,
                top: `calc(${(hoverPoint.y / 200) * 100}% - 80px)`
              }"
            >
              <!-- Tooltip Arrow -->
              <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-800"></div>
              
              <div class="text-center">
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ hoverPoint.label }}
                  </p>
                </div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ hoverPoint.value }} m³
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ hoverPoint.time }}
                </p>
                <div class="mt-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-xs text-blue-600 dark:text-blue-400">
                    {{ getPeakStatus(hoverPoint.value) }}
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Time Slider -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">Time Range</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ timeRange }}
              </span>
              <button 
                @click="toggleTimeRange"
                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
          </div>
          <div class="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
            <div 
              class="absolute h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-500"
              :style="{ width: `${sliderPosition}%` }"
            ></div>
            <div 
              class="absolute w-4 h-4 rounded-full bg-white dark:bg-gray-300 border-2 border-blue-500 shadow-lg -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125"
              :style="{ left: `${sliderPosition}%` }"
              @mousedown="startDrag"
            ></div>
          </div>
          <div class="flex justify-between mt-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Last 7d</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Last 30d</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Last 90d</span>
          </div>
        </div>

        <!-- Consumption Breakdown -->
        <div class="mt-8">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Consumption by Sector</h4>
          <div class="grid grid-cols-2 gap-3">
            <div 
              v-for="sector in consumptionBySector" 
              :key="sector.id"
              class="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group cursor-pointer"
              @mouseenter="activeSector = sector"
              @mouseleave="activeSector = null"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div 
                    class="w-3 h-3 rounded-full mr-2 transition-transform duration-300 group-hover:scale-125"
                    :style="{ backgroundColor: sector.color }"
                  ></div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ sector.name }}</span>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ sector.value }}%</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ sector.consumption }} m³</p>
                </div>
              </div>
              <div class="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  class="absolute h-full rounded-full transition-all duration-1000 ease-out"
                  :class="{ 'animate-pulse': activeSector?.id === sector.id }"
                  :style="{
                    width: `${sector.value}%`,
                    background: sector.gradient
                  }"
                ></div>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-xs text-gray-500 dark:text-gray-400">0%</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const hoverPoint = ref(null)
const activeSector = ref(null)
const timeRange = ref('Last 24 Hours')
const sliderPosition = ref(70)
const isDragging = ref(false)

const consumptionData = ref([
  { time: '00:00', value: 7200 },
  { time: '04:00', value: 5800 },
  { time: '08:00', value: 12500 },
  { time: '12:00', value: 9800 },
  { time: '16:00', value: 15200 },
  { time: '20:00', value: 11200 },
  { time: '24:00', value: 6800 },
])

const consumptionBySector = ref([
  { 
    id: 1, 
    name: 'Residential', 
    value: 45, 
    consumption: '110,555', 
    color: '#3B82F6',
    gradient: 'linear-gradient(to right, #3B82F6, #60A5FA)'
  },
  { 
    id: 2, 
    name: 'Commercial', 
    value: 32, 
    consumption: '78,617', 
    color: '#10B981',
    gradient: 'linear-gradient(to right, #10B981, #34D399)'
  },
  { 
    id: 3, 
    name: 'Industrial', 
    value: 18, 
    consumption: '44,222', 
    color: '#8B5CF6',
    gradient: 'linear-gradient(to right, #8B5CF6, #A78BFA)'
  },
  { 
    id: 4, 
    name: 'Public', 
    value: 5, 
    consumption: '12,284', 
    color: '#F59E0B',
    gradient: 'linear-gradient(to right, #F59E0B, #FBBF24)'
  },
])

const dataPoints = computed(() => {
  const width = 400
  const height = 200
  const maxValue = Math.max(...consumptionData.value.map(d => d.value))
  const spacing = width / (consumptionData.value.length - 1)
  
  return consumptionData.value.map((data, index) => ({
    x: index * spacing,
    y: height - (data.value / maxValue) * height,
    value: data.value.toLocaleString(),
    label: data.value >= 10000 ? 'Peak Hour' : 'Off-Peak',
    time: data.time,
    data: data
  }))
})

const linePath = computed(() => {
  if (dataPoints.value.length === 0) return ''
  
  let path = `M ${dataPoints.value[0].x} ${dataPoints.value[0].y}`
  for (let i = 1; i < dataPoints.value.length; i++) {
    const prev = dataPoints.value[i - 1]
    const curr = dataPoints.value[i]
    
    // Create smooth curve using cubic bezier
    const cp1x = prev.x + (curr.x - prev.x) / 3
    const cp1y = prev.y
    const cp2x = curr.x - (curr.x - prev.x) / 3
    const cp2y = curr.y
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
  }
  return path
})

const areaPath = computed(() => {
  if (dataPoints.value.length === 0) return ''
  
  let path = linePath.value
  path += ` L ${dataPoints.value[dataPoints.value.length - 1].x} 200`
  path += ` L ${dataPoints.value[0].x} 200`
  path += ' Z'
  return path
})

const lineLength = computed(() => {
  // Calculate approximate line length for animation
  let length = 0
  for (let i = 1; i < dataPoints.value.length; i++) {
    const dx = dataPoints.value[i].x - dataPoints.value[i - 1].x
    const dy = dataPoints.value[i].y - dataPoints.value[i - 1].y
    length += Math.sqrt(dx * dx + dy * dy)
  }
  return Math.round(length)
})

const getPeakStatus = (valueStr) => {
  const value = parseInt(valueStr.replace(/,/g, ''))
  if (value >= 14000) return '🚨 High Peak'
  if (value >= 10000) return '⚠️ Peak Hours'
  if (value >= 7000) return '📊 Normal Usage'
  return '💤 Low Usage'
}

const toggleTimeRange = () => {
  const ranges = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days']
  const currentIndex = ranges.indexOf(timeRange.value)
  timeRange.value = ranges[(currentIndex + 1) % ranges.length]
}

const startDrag = (e) => {
  isDragging.value = true
  const handleMouseMove = (moveEvent) => {
    if (!isDragging.value) return
    
    const slider = moveEvent.target.closest('.relative')
    if (!slider) return
    
    const rect = slider.getBoundingClientRect()
    const x = moveEvent.clientX - rect.left
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100))
    sliderPosition.value = Math.round(percentage)
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Simulate data updates
onMounted(() => {
  setInterval(() => {
    if (!isDragging.value && Math.random() > 0.7) {
      const index = Math.floor(Math.random() * consumptionData.value.length)
      const change = (Math.random() - 0.5) * 2000
      consumptionData.value[index].value = Math.max(1000, Math.min(20000, consumptionData.value[index].value + change))
    }
  }, 5000)
})
</script>

<style scoped>
.elite-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.dark .elite-card {
  background: linear-gradient(
    135deg,
    rgba(31, 41, 55, 0.95) 0%,
    rgba(17, 24, 39, 0.98) 100%
  );
  border: 1px solid rgba(55, 65, 81, 0.5);
}

.elite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .elite-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>