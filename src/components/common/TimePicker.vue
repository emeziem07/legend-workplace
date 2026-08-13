<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  use24Hour?: boolean
}>(), {
  placeholder: 'Select time',
  use24Hour: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const parsed = computed(() => {
  if (!props.modelValue) return { hour: 9, minute: 0, period: 'AM' as 'AM' | 'PM' }
  const [time, period] = props.modelValue.split(' ')
  const [h, m] = time.split(':').map(Number)
  return { hour: h, minute: m, period: (period as 'AM' | 'PM') || 'AM' }
})

const hour = ref(parsed.value.hour)
const minute = ref(parsed.value.minute)
const period = ref(parsed.value.period)

watch(parsed, (v) => { hour.value = v.hour; minute.value = v.minute; period.value = v.period })

const hours12 = computed(() => Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)))
const hours24 = computed(() => Array.from({ length: 24 }, (_, i) => i))
const minutes = computed(() => Array.from({ length: 60 }, (_, i) => i))

const formatHour = (h: number) => {
  if (props.use24Hour) return String(h).padStart(2, '0')
  return String(h === 0 ? 12 : h).padStart(2, '0')
}

const formatMinute = (m: number) => String(m).padStart(2, '0')

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  if (props.use24Hour) return `${formatHour(hour.value)}:${formatMinute(minute.value)}`
  return `${formatHour(hour.value)}:${formatMinute(minute.value)} ${period.value}`
})

const selectHour = (h: number) => { hour.value = h; emitChange() }
const selectMinute = (m: number) => { minute.value = m; emitChange() }

const emitChange = () => {
  if (props.use24Hour) {
    emit('update:modelValue', `${formatHour(hour.value)}:${formatMinute(minute.value)}`)
  } else {
    emit('update:modelValue', `${formatHour(hour.value)}:${formatMinute(minute.value)} ${period.value}`)
  }
}

const computePosition = () => {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const panelWidth = 280
  const panelHeight = 320
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
  <div ref="rootRef" class="tp-root">
    <label v-if="label" class="label">{{ label }}</label>
    <button ref="triggerRef" type="button" class="tp-trigger" :class="{ 'tp-trigger-active': open }" @click="open = !open">
      <svg class="tp-trigger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <span :class="displayValue ? 'tp-trigger-text' : 'tp-trigger-placeholder'">
        {{ displayValue || placeholder }}
      </span>
      <svg class="tp-trigger-chevron" :class="{ 'rotate-180': open }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="tp-pop">
        <div v-if="open" ref="panelRef" class="tp-panel" :style="panelStyle">
          <div class="tp-display">
            {{ formatHour(hour) }}:{{ formatMinute(minute) }}<span v-if="!use24Hour" class="tp-display-period">{{ period }}</span>
          </div>

          <div class="tp-columns">
            <div class="tp-column">
              <p class="tp-column-label">Hour</p>
              <div class="tp-scroll">
                <button
                  v-for="h in (use24Hour ? hours24 : hours12)"
                  :key="h"
                  :class="['tp-option', hour === h ? 'tp-option-selected' : '']"
                  @click="selectHour(h)"
                >{{ formatHour(h) }}</button>
              </div>
            </div>
            <div class="tp-column">
              <p class="tp-column-label">Min</p>
              <div class="tp-scroll">
                <button
                  v-for="m in minutes"
                  :key="m"
                  :class="['tp-option', minute === m ? 'tp-option-selected' : '']"
                  @click="selectMinute(m)"
                >{{ formatMinute(m) }}</button>
              </div>
            </div>
            <div v-if="!use24Hour" class="tp-column tp-column-narrow">
              <p class="tp-column-label">AM/PM</p>
              <div class="tp-scroll">
                <button :class="['tp-option', period === 'AM' ? 'tp-option-selected' : '']" @click="period = 'AM'; emitChange()">AM</button>
                <button :class="['tp-option', period === 'PM' ? 'tp-option-selected' : '']" @click="period = 'PM'; emitChange()">PM</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.tp-root { position: relative; }

.tp-trigger {
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
.tp-trigger:hover { border-color: #d1d5db; }
.tp-trigger-active { border-color: #FD4F00; box-shadow: 0 0 0 3px rgba(253, 79, 0, 0.08); }
.tp-trigger-icon { width: 18px; height: 18px; color: #9ca3af; flex-shrink: 0; }
.tp-trigger-text { flex: 1; text-align: left; }
.tp-trigger-placeholder { flex: 1; text-align: left; color: #9ca3af; }
.tp-trigger-chevron { width: 16px; height: 16px; color: #9ca3af; transition: transform 0.2s; flex-shrink: 0; }
</style>

<style>
.tp-panel {
  width: 280px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  padding: 16px;
}

.tp-display {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 12px;
}
.tp-display-period { font-size: 0.875rem; font-weight: 500; color: #6b7280; margin-left: 4px; }

.tp-columns { display: flex; gap: 8px; }
.tp-column { flex: 1; }
.tp-column-narrow { flex: 0 0 56px; }
.tp-column-label {
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.tp-scroll {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-width: thin;
}
.tp-option {
  padding: 6px 0;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.15s, color 0.15s;
  font-family: inherit;
}
.tp-option:hover { background: #f3f4f6; }
.tp-option-selected { background: #FD4F00; color: #fff; font-weight: 600; }
.tp-option-selected:hover { background: #E04500; }

.tp-pop-enter-active, .tp-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tp-pop-enter-from, .tp-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}
</style>
