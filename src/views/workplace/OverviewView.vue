<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import KpiStatCard from '../../components/common/KpiStatCard.vue'
import { useKpiStore } from '../../stores/kpi'
import { useRequestsStore } from '../../stores/requests'
import KpiTable from '../../components/overview/KpiTable.vue'
import RequestsAccordion from '../../components/overview/RequestsAccordion.vue'
import AppraisalTab from '../../components/appraisal/AppraisalTab.vue'
import FeedbackTab from '../../components/feedback/FeedbackTab.vue'
import PayslipsTab from '../../components/payslips/PayslipsTab.vue'
import { useUserStore } from '../../stores/user'
import { staffMockData } from '../../mock/staff'
import { supervisorMockData } from '../../mock/supervisor'
import { hodMockData } from '../../mock/hod'
import { hrMockData } from '../../mock/hr'
import { adminMockData } from '../../mock/admin'

const kpiStore = useKpiStore()
const requestsStore = useRequestsStore()
const userStore = useUserStore()

const roleData = computed(() => {
  switch (userStore.role) {
    case 'staff': return staffMockData
    case 'supervisor': return supervisorMockData
    case 'hod': return hodMockData
    case 'hr': return hrMockData
    case 'admin': return adminMockData
    default: return staffMockData
  }
})

const performanceCards = computed(() => roleData.value.performanceCards)

const dashboardTitle = computed(() => {
  switch (userStore.role) {
    case 'staff': return 'My Performance Dashboard'
    case 'supervisor': return 'Team Performance Dashboard'
    case 'hod': return 'Department Performance Dashboard'
    case 'hr': return 'Organisation Performance Dashboard'
    case 'admin': return 'System Overview Dashboard'
    default: return 'Performance Dashboard'
  }
})

const showKpiTable = computed(() =>
  ['staff', 'supervisor', 'hod', 'admin'].includes(userStore.role)
)

const showRequests = computed(() =>
  userStore.hasPermission('submit_request')
)

const tabs = [
  { key: 'overview' as const, label: 'Overview' },
  { key: 'appraisal' as const, label: 'Appraisal' },
  { key: 'feedback' as const, label: 'Feedback' },
  { key: 'payslips' as const, label: 'Payslips' },
]

const activeTab = ref<'overview' | 'appraisal' | 'feedback' | 'payslips'>('overview')

const tabRefs = ref<HTMLButtonElement[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

const updateIndicator = () => {
  const idx = tabs.findIndex(t => t.key === activeTab.value)
  const el = tabRefs.value[idx]
  if (el) {
    indicatorLeft.value = el.offsetLeft
    indicatorWidth.value = el.offsetWidth
  }
}

onMounted(() => nextTick(updateIndicator))
watch(activeTab, () => nextTick(updateIndicator))
</script>

<template>
  <div class="w-full min-w-0">
    <!-- Segmented Pill Control -->
    <div class="mb-6">
      <div class="relative inline-flex rounded-full p-1" style="background-color: #f0f0f0;">
        <div
          class="absolute top-1 bottom-1 rounded-full pointer-events-none"
          style="background-color: #FD4F00; transition: left 0.2s cubic-bezier(0.4,0,0.2,1), width 0.2s cubic-bezier(0.4,0,0.2,1);"
          :style="{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }"
        ></div>
        <button
          v-for="(tab, i) in tabs"
          :key="tab.key"
          :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
          @click="activeTab = tab.key"
          class="relative z-10 px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap select-none"
          :style="{ color: activeTab === tab.key ? '#ffffff' : '#4b5563', transition: 'color 0.15s ease' }"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'">
      <!-- Performance Dashboard -->
      <div class="mb-6">
        <div class="section-header">
          <div>
            <h2 class="section-title">{{ dashboardTitle }}</h2>
            <p class="text-xs text-gray-500 mt-0.5">Q3 2025 · Updated today</p>
          </div>
          <div class="flex items-center gap-2">
            <select class="select w-full sm:w-40 text-sm">
              <option>Q3 2025</option>
              <option>Q2 2025</option>
              <option>Q1 2025</option>
            </select>
          </div>
        </div>

        <!-- KPI stat cards: 4 cols desktop, 2 cols medium, 1 col small -->
        <div class="kpi-cards-grid">
          <KpiStatCard
            v-for="card in performanceCards"
            :key="card.label"
            v-bind="card"
          />
        </div>
      </div>

      <!-- KPI Table -->
      <div v-if="showKpiTable" class="mb-6 w-full min-w-0">
        <KpiTable :rows="kpiStore.kpiRows" />
      </div>

      <!-- Requests -->
      <div v-if="showRequests" class="w-full min-w-0">
        <RequestsAccordion :requests="requestsStore.requests" />
      </div>
    </div>

    <!-- Appraisal Tab -->
    <div v-else-if="activeTab === 'appraisal'">
      <AppraisalTab />
    </div>

    <!-- Feedback Tab -->
    <div v-else-if="activeTab === 'feedback'">
      <FeedbackTab />
    </div>

    <!-- Payslips Tab -->
    <div v-else-if="activeTab === 'payslips'">
      <PayslipsTab />
    </div>
  </div>
</template>

<style scoped>
/* Responsive KPI cards: 4 → 2 → 1 columns */
.kpi-cards-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1023px) {
  .kpi-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 639px) {
  .kpi-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
