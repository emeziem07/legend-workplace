<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  min?: string
  max?: string
}>(), {
  placeholder: 'Select date',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const displayValue = ref('')
const panelStyle = ref<Record<string, string>>({})

const parseDate = (s: string) => {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

const selectedDate = computed(() => parseDate(props.modelValue))

const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

watch(selectedDate, (d) => {
  if (d) {
    viewYear.value = d.getFullYear()
    viewMonth.value = d.getMonth()
  }
}, { immediate: true })

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
})

const today = new Date()
const isToday = (d: number) =>
  d === today.getDate() && viewMonth.value === today.getMonth() && viewYear.value === today.getFullYear()

const isSelected = (d: number) => {
  const sel = selectedDate.value
  return sel && d === sel.getDate() && viewMonth.value === sel.getMonth() && viewYear.value === sel.getFullYear()
}

const isDisabled = (d: number) => {
  if (!d) return true
  const dateStr = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  if (props.min && dateStr < props.min) return true
  if (props.max && dateStr > props.max) return true
  return false
}

const selectDate = (d: number) => {
  if (isDisabled(d)) return
  const dateStr = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  emit('update:modelValue', dateStr)
  open.value = false
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

const formatDisplay = (s: string) => {
  const d = parseDate(s)
  if (!d) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

watch(() => props.modelValue, (v) => { displayValue.value = formatDisplay(v) }, { immediate: true })

const computePosition = () => {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const panelWidth = 320
  const panelHeight = 360
  const gap = 6
  const vw = window.innerWidth
  const vh = window.innerHeight

  let top = rect.bottom + gap
  let left = rect.left

  if (top + panelHeight > vh - 8) {
    top = rect.top - panelHeight - gap
  }
  if (left + panelWidth > vw - 8) {
    left = rect.right - panelWidth
  }
  if (left < 8) left = 8
  if (top < 8) top = 8

  panelStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '9999',
  }
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    computePosition()
  }
})

const onDocClick = (e: MouseEvent) => {
  const target = e.target as Node
  if (rootRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  open.value = false
}
const onResize = () => { if (open.value) computePosition() }

onMounted(() => {
  document.addEventListener('click', onDocClick)
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onResize, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onResize, true)
})
</script>

<template>
  <div ref="rootRef" class="dp-root">
    <label v-if="label" class="label">{{ label }}</label>
    <button ref="triggerRef" type="button" class="dp-trigger" :class="{ 'dp-trigger-active': open }" @click="open = !open">
      <svg class="dp-trigger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span :class="displayValue ? 'dp-trigger-text' : 'dp-trigger-placeholder'">
        {{ displayValue || placeholder }}
      </span>
      <svg class="dp-trigger-chevron" :class="{ 'rotate-180': open }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="dp-pop">
        <div v-if="open" ref="panelRef" class="dp-panel" :style="panelStyle">
          <div class="dp-header">
            <button class="dp-nav-btn" @click="prevMonth">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div class="dp-header-title">
              <select v-model="viewMonth" class="dp-month-select">
                <option v-for="(m, i) in monthNames" :key="i" :value="i">{{ m }}</option>
              </select>
              <select v-model.number="viewYear" class="dp-year-select">
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            <button class="dp-nav-btn" @click="nextMonth">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div class="dp-weekdays">
            <span v-for="d in dayNames" :key="d" class="dp-weekday">{{ d }}</span>
          </div>

          <div class="dp-days">
            <button
              v-for="(d, i) in calendarDays"
              :key="i"
              :disabled="isDisabled(d || 0)"
              :class="[
                'dp-day',
                d ? '' : 'dp-day-empty',
                d && isToday(d) ? 'dp-day-today' : '',
                d && isSelected(d) ? 'dp-day-selected' : '',
                d && isDisabled(d) ? 'dp-day-disabled' : '',
              ]"
              @click="d && selectDate(d)"
            >
              {{ d || '' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dp-root { position: relative; }

.dp-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 12px;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #111827;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}
.dp-trigger:hover { border-color: #d1d5db; }
.dp-trigger-active { border-color: #FD4F00; box-shadow: 0 0 0 3px rgba(253, 79, 0, 0.08); }
.dp-trigger-icon { width: 18px; height: 18px; color: #9ca3af; flex-shrink: 0; }
.dp-trigger-text { flex: 1; text-align: left; }
.dp-trigger-placeholder { flex: 1; text-align: left; color: #9ca3af; }
.dp-trigger-chevron { width: 16px; height: 16px; color: #9ca3af; transition: transform 0.2s; flex-shrink: 0; }
</style>

<style>
.dp-panel {
  width: 320px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  padding: 16px;
}

.dp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.dp-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
}
.dp-nav-btn:hover { background: #f3f4f6; color: #374151; }
.dp-header-title { display: flex; gap: 6px; }
.dp-month-select, .dp-year-select {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px 8px;
  background: #fff;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}
.dp-month-select:focus, .dp-year-select:focus { border-color: #FD4F00; }

.dp-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}
.dp-weekday {
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.dp-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.dp-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  font-family: inherit;
}
.dp-day:hover:not(.dp-day-disabled):not(.dp-day-empty) { background: #f3f4f6; }
.dp-day-empty { pointer-events: none; }
.dp-day-today { font-weight: 700; color: #FD4F00; }
.dp-day-selected { background: #FD4F00; color: #fff; font-weight: 600; }
.dp-day-selected:hover { background: #E04500; }
.dp-day-disabled { color: #d1d5db; cursor: not-allowed; }

.dp-pop-enter-active, .dp-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dp-pop-enter-from, .dp-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}
</style>
