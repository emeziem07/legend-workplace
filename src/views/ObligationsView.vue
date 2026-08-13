<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useObligationsStore, type ObligationStatus } from '../stores/obligations'
import StatusBadge from '../components/common/StatusBadge.vue'

const store = useObligationsStore()
const selectedObligation = ref<string | null>(null)

// Status filter segmented control
const filterTabs = [
  { key: 'all' as const, label: 'All' },
  { key: 'Pending' as const, label: 'Pending' },
  { key: 'In Progress' as const, label: 'In Progress' },
  { key: 'Completed' as const, label: 'Completed' },
]
const activeFilter = ref<'all' | ObligationStatus>('all')
const tabRefs = ref<HTMLButtonElement[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

const updateIndicator = () => {
  const idx = filterTabs.findIndex(t => t.key === activeFilter.value)
  const el = tabRefs.value[idx]
  if (el) {
    indicatorLeft.value = el.offsetLeft
    indicatorWidth.value = el.offsetWidth
  }
}
onMounted(() => nextTick(updateIndicator))
watch(activeFilter, () => nextTick(updateIndicator))

const filtered = computed(() => {
  if (activeFilter.value === 'all') return store.obligations
  return store.obligations.filter(o => o.status === activeFilter.value)
})

// KPI icon mapping
const kpiIcons: Record<string, string> = {
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  chart: 'M3 3v18h18 M9 17V9 M13 17V5 M17 17v-3',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  check: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
}

// Calendar
const calendarDays = computed(() => {
  const days = []
  const daysInMonth = 31
  const firstDay = new Date(2025, 6, 1).getDay()
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `Jul ${d}, 2025`
    const obs = store.obligations.filter(o => o.dueDate === dateStr)
    days.push({ day: d, obligations: obs })
  }
  return days
})

const statusDotColor = (status: ObligationStatus) => {
  if (status === 'Completed') return '#16a34a'
  if (status === 'In Progress') return '#2563eb'
  return '#9ca3af'
}

const openObligation = (id: string) => {
  selectedObligation.value = selectedObligation.value === id ? null : id
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

    <!-- 1. Page Header -->
    <div class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-wider" style="color: #FD4F00;">Obligations</p>
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">My Obligations</h1>
      <p class="text-sm text-gray-500 mt-1">Action items assigned to you from meetings, reviews, and strategic initiatives.</p>
    </div>

    <!-- 2. Statistics Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div v-for="card in [
        { label: 'Total', value: store.stats.total, color: '#111827' },
        { label: 'Completed', value: store.stats.completed, color: '#16a34a' },
        { label: 'In Progress', value: store.stats.inProgress, color: '#2563eb' },
        { label: 'Pending', value: store.stats.pending, color: '#d97706' },
      ]" :key="card.label" class="card px-5 py-4">
        <p class="text-xs text-gray-500 mb-1">{{ card.label }}</p>
        <p class="text-2xl font-bold" :style="{ color: card.color }">{{ card.value }}</p>
      </div>
    </div>

    <!-- 3. Status Filter (Segmented Control) -->
    <div class="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
      <div class="relative inline-flex rounded-full p-1" style="background-color: #f0f0f0;">
        <div
          class="absolute top-1 bottom-1 rounded-full pointer-events-none"
          style="background-color: #FD4F00; transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1);"
          :style="{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }"
        ></div>
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          :ref="(el) => { if (el) tabRefs[filterTabs.indexOf(tab)] = el as HTMLButtonElement }"
          @click="activeFilter = tab.key"
          class="relative z-10 px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap select-none"
          :style="{ color: activeFilter === tab.key ? '#ffffff' : '#4b5563', transition: 'color 0.15s ease' }"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 4. Obligations Table -->
    <div class="card mb-6">
      <!-- Desktop: Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Obligation</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">KPI</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Description</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Date Assigned</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Due Date</th>
              <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 pr-6">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="ob in filtered"
              :key="ob.id"
              class="hover:bg-gray-50/60 transition-colors cursor-pointer"
              @click="openObligation(ob.id)"
            >
              <td class="px-6 py-5">
                <p class="text-sm font-semibold text-gray-900">{{ ob.title }}</p>
                <p class="text-xs text-gray-400 mt-1">From: {{ ob.source }}</p>
              </td>
              <td class="px-4 py-5">
                <div class="flex items-center gap-2">
                  <span class="flex items-center justify-center rounded-full shrink-0" style="width:28px;height:28px;background:#FFF0E8;color:#FD4F00;">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path :d="kpiIcons[ob.kpiIcon] || kpiIcons.check"/>
                    </svg>
                  </span>
                  <span class="text-sm text-gray-700 whitespace-nowrap">{{ ob.kpi }}</span>
                </div>
              </td>
              <td class="px-4 py-5 max-w-xs">
                <p class="text-sm text-gray-600 truncate">{{ ob.description }}</p>
              </td>
              <td class="px-4 py-5">
                <span class="text-sm text-gray-600 whitespace-nowrap">{{ ob.dateAssigned }}</span>
              </td>
              <td class="px-4 py-5">
                <span class="text-sm font-medium text-gray-800 whitespace-nowrap">{{ ob.dueDate }}</span>
              </td>
              <td class="px-4 py-5 pr-6 text-center">
                <StatusBadge :status="ob.status" size="sm" />
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-400">No obligations found for this filter.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: Card layout -->
      <div class="md:hidden divide-y divide-gray-50">
        <div
          v-for="ob in filtered"
          :key="ob.id"
          @click="openObligation(ob.id)"
          class="px-4 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
        >
          <div class="flex items-start gap-3 mb-2">
            <span class="flex items-center justify-center rounded-full shrink-0" style="width:28px;height:28px;background:#FFF0E8;color:#FD4F00;">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path :d="kpiIcons[ob.kpiIcon] || kpiIcons.check"/>
              </svg>
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900">{{ ob.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ ob.kpi }} · From: {{ ob.source }}</p>
            </div>
            <StatusBadge :status="ob.status" size="sm" />
          </div>
          <p class="text-xs text-gray-600 leading-relaxed mb-2 pl-10">{{ ob.description }}</p>
          <div class="flex items-center gap-4 pl-10 text-xs">
            <span class="text-gray-400">Assigned: {{ ob.dateAssigned }}</span>
            <span class="text-gray-400">·</span>
            <span class="font-medium text-gray-700">Due: {{ ob.dueDate }}</span>
          </div>
        </div>
        <div v-if="!filtered.length" class="px-4 py-12 text-center text-sm text-gray-400">
          No obligations found for this filter.
        </div>
      </div>
    </div>

    <!-- 5. Obligations Calendar -->
    <div class="card">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
        <h2 class="section-title">Obligations Calendar</h2>
        <div class="flex items-center gap-3 flex-wrap">
          <span class="flex items-center gap-1.5 text-xs text-gray-500">
            <span class="rounded-full" style="width:8px;height:8px;background:#9ca3af;"></span> Pending
          </span>
          <span class="flex items-center gap-1.5 text-xs text-gray-500">
            <span class="rounded-full" style="width:8px;height:8px;background:#2563eb;"></span> In Progress
          </span>
          <span class="flex items-center gap-1.5 text-xs text-gray-500">
            <span class="rounded-full" style="width:8px;height:8px;background:#16a34a;"></span> Completed
          </span>
        </div>
      </div>
      <div class="p-2 sm:p-4">
        <div class="grid grid-cols-7 gap-px rounded-lg overflow-hidden" style="background:#e5e7eb;">
          <div v-for="day in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="day" class="bg-gray-50 text-center text-xs font-medium text-gray-500 py-2">{{ day }}</div>
          <div
            v-for="(cell, i) in calendarDays"
            :key="i"
            :class="['min-h-16 sm:min-h-24 p-1 sm:p-2', !cell ? 'bg-gray-50' : 'bg-white']"
          >
            <template v-if="cell">
              <p class="text-xs font-medium text-gray-700 mb-1.5">{{ cell.day }}</p>
              <div class="space-y-1">
                <button
                  v-for="ob in cell.obligations"
                  :key="ob.id"
                  @click="openObligation(ob.id)"
                  class="w-full flex items-center gap-1.5 text-left rounded px-1.5 py-1 hover:bg-gray-50 transition-colors"
                >
                  <span class="rounded-full shrink-0" :style="{ width: '7px', height: '7px', backgroundColor: statusDotColor(ob.status) }"></span>
                  <span class="text-xs text-gray-700 truncate hidden sm:inline">{{ ob.title }}</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected obligation detail drawer -->
    <Transition name="slide-down">
      <div v-if="selectedObligation" class="card mt-4 p-5">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded-full inline-block mb-2">{{ store.obligations.find(o => o.id === selectedObligation)?.kpi }}</p>
            <h3 class="text-base font-semibold text-gray-900">{{ store.obligations.find(o => o.id === selectedObligation)?.title }}</h3>
          </div>
          <button @click="selectedObligation = null" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ store.obligations.find(o => o.id === selectedObligation)?.description }}</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Source</p>
            <p class="text-sm text-gray-700">{{ store.obligations.find(o => o.id === selectedObligation)?.source }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Date Assigned</p>
            <p class="text-sm text-gray-700">{{ store.obligations.find(o => o.id === selectedObligation)?.dateAssigned }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Due Date</p>
            <p class="text-sm text-gray-700">{{ store.obligations.find(o => o.id === selectedObligation)?.dueDate }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Status</p>
            <StatusBadge :status="store.obligations.find(o => o.id === selectedObligation)?.status || 'Pending'" size="sm" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
