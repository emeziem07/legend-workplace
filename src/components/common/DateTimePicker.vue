<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  confirm: [dateTime: string]
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)

// Calendar state
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

// Time state (12-hour format)
const selectedHour = ref(9)
const selectedMinute = ref(0)
const selectedPeriod = ref<'AM' | 'PM'>('AM')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const hours = computed(() => Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)))
const minutes = computed(() => Array.from({ length: 60 }, (_, i) => i))

const calendarDays = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
})

const selectedDate = ref<number | null>(new Date().getDate())

const today = new Date()
const isToday = (d: number) =>
  d === today.getDate() && viewMonth.value === today.getMonth() && viewYear.value === today.getFullYear()

const isSelected = (d: number) =>
  d === selectedDate.value && viewMonth.value === today.getMonth() && viewYear.value === today.getFullYear()

const selectDate = (d: number) => {
  selectedDate.value = d
}

const prevMonth = () => {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

const nextMonth = () => {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

const years = computed(() => {
  const current = new Date().getFullYear()
  const arr: number[] = []
  for (let y = current - 10; y <= current + 10; y++) arr.push(y)
  return arr
})

const selectToday = () => {
  const now = new Date()
  viewYear.value = now.getFullYear()
  viewMonth.value = now.getMonth()
  selectedDate.value = now.getDate()
}

const clearSelection = () => {
  selectedDate.value = null
  selectedHour.value = 9
  selectedMinute.value = 0
  selectedPeriod.value = 'AM'
}

const confirm = () => {
  if (!selectedDate.value) return

  const minuteStr = String(selectedMinute.value).padStart(2, '0')

  const monthName = monthNames[viewMonth.value]
  const dateStr = `${selectedDate.value} ${monthName} ${viewYear.value}`

  const dateTime = `${dateStr} • ${selectedHour.value}:${minuteStr} ${selectedPeriod.value}`

  emit('confirm', dateTime)
}

const onEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onEsc)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Picker Panel -->
      <div ref="panelRef" class="relative bg-white rounded-2xl shadow-2xl overflow-hidden z-10 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-y-visible lg:h-96">
          <!-- LEFT PANEL: Calendar -->
          <div class="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-100 p-4 sm:p-6 flex flex-col">
            <!-- Header: Month/Year Navigation -->
            <div class="flex items-center justify-between mb-2">
              <button @click="prevMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div class="flex items-center gap-2">
                <select v-model.number="viewMonth" class="text-sm font-semibold border border-gray-300 rounded px-2 py-1">
                  <option v-for="(m, i) in monthNames" :key="i" :value="i">{{ m }}</option>
                </select>
                <select v-model.number="viewYear" class="text-sm font-semibold border border-gray-300 rounded px-2 py-1">
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
              <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <!-- Weekday headers -->
            <div class="grid grid-cols-7 gap-1 mb-1">
              <span v-for="d in dayNames" :key="d" class="text-xs font-semibold text-gray-500 text-center h-6 flex items-center justify-center">{{ d }}</span>
            </div>

            <!-- Calendar days -->
            <div class="grid grid-cols-7 gap-1 flex-1">
              <button
                v-for="(d, i) in calendarDays"
                :key="i"
                :disabled="!d"
                :class="[
                  'py-1.5 text-xs font-medium rounded transition-colors h-8 flex items-center justify-center',
                  !d ? 'cursor-default' : 'cursor-pointer',
                  d && isSelected(d) ? 'bg-primary text-white' : d && isToday(d) ? 'text-primary font-bold border border-primary/30' : 'text-gray-700 hover:bg-orange-50'
                ]"
                @click="d && selectDate(d)"
              >
                {{ d || '' }}
              </button>
            </div>
          </div>

          <!-- RIGHT PANEL: Time Picker -->
          <div class="w-full lg:w-1/2 p-4 sm:p-6 flex flex-col">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Time</p>

            <!-- Time display -->
            <div class="text-center mb-3 p-2 bg-gray-50 rounded-lg">
              <p class="text-lg font-semibold text-gray-900">
                {{ String(selectedHour).padStart(2, '0') }}:{{ String(selectedMinute).padStart(2, '0') }} {{ selectedPeriod }}
              </p>
            </div>

            <!-- Time columns -->
            <div class="flex items-stretch justify-center gap-1 flex-1">
              <!-- Hour column -->
              <div class="flex flex-col items-center flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-500 mb-2 h-5 flex items-center">Hour</p>
                <div class="relative w-full overflow-hidden" style="height: 200px;">
                  <div class="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col gap-0">
                    <div class="h-20"></div>
                    <button
                      v-for="h in hours"
                      :key="h"
                      @click="selectedHour = h"
                      :class="[
                        'py-2 text-sm font-medium rounded transition-colors flex-shrink-0',
                        selectedHour === h ? 'bg-primary text-white' : 'text-gray-700 hover:bg-orange-50'
                      ]"
                      :style="selectedHour === h ? {} : { opacity: '0.6' }"
                    >
                      {{ String(h).padStart(2, '0') }}
                    </button>
                    <div class="h-20"></div>
                  </div>
                </div>
              </div>

              <!-- Minute column -->
              <div class="flex flex-col items-center flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-500 mb-2 h-5 flex items-center">Min</p>
                <div class="relative w-full overflow-hidden" style="height: 200px;">
                  <div class="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col gap-0">
                    <div class="h-20"></div>
                    <button
                      v-for="m in minutes"
                      :key="m"
                      @click="selectedMinute = m"
                      :class="[
                        'py-2 text-sm font-medium rounded transition-colors flex-shrink-0',
                        selectedMinute === m ? 'bg-primary text-white' : 'text-gray-700 hover:bg-orange-50'
                      ]"
                      :style="selectedMinute === m ? {} : { opacity: '0.6' }"
                    >
                      {{ String(m).padStart(2, '0') }}
                    </button>
                    <div class="h-20"></div>
                  </div>
                </div>
              </div>

              <!-- AM/PM column -->
              <div class="flex flex-col items-center flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-500 mb-2 h-5 flex items-center">Period</p>
                <div class="relative w-full overflow-hidden" style="height: 200px;">
                  <div class="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col gap-0">
                    <div class="h-20"></div>
                    <button
                      v-for="period in ['AM', 'PM']"
                      :key="period"
                      @click="selectedPeriod = period as 'AM' | 'PM'"
                      :class="[
                        'py-2 text-sm font-medium rounded transition-colors flex-shrink-0',
                        selectedPeriod === period ? 'bg-primary text-white' : 'text-gray-700 hover:bg-orange-50'
                      ]"
                      :style="selectedPeriod === period ? {} : { opacity: '0.6' }"
                    >
                      {{ period }}
                    </button>
                    <div class="h-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 flex-shrink-0">
          <div class="flex gap-2">
            <button @click="selectToday" class="btn-secondary text-xs flex-1 sm:flex-none">Today</button>
            <button @click="clearSelection" class="btn-secondary text-xs flex-1 sm:flex-none">Clear</button>
          </div>
          <div class="flex gap-2">
            <button @click="emit('close')" class="btn-secondary text-xs flex-1 sm:flex-none">Cancel</button>
            <button @click="confirm" :disabled="!selectedDate" class="btn-primary text-xs flex-1 sm:flex-none" :class="!selectedDate ? 'opacity-40 cursor-not-allowed' : ''">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
