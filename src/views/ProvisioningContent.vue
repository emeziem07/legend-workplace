<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import KpiStatCard from '../components/common/KpiStatCard.vue'

// ── Mock Data ──────────────────────────────────────────────────────────────
interface ProvisioningRecord {
  id: string
  customerName: string
  installer: string
  area: string
  plan: string
  installationDate: string
  jobOrderDate: string
  provisioningStatus: 'Awaiting Provisioning' | 'Ready' | 'Provisioned' | 'Blocked'
  activationStatus: 'Waiting' | 'Activated' | 'Failed' | 'Delayed'
  powerLevel: string
  indoorStatus: 'Pending' | 'Complete'
  outdoorStatus: 'Pending' | 'Complete'
  splicePlan: 'Pending' | 'Complete' | 'N/A'
  issues: 'Normal' | 'Attention Required' | 'Critical'
  dateActivated: string | null
  waitingDuration: string
  timeline: Array<{ stage: string; completed: boolean }>
}

const mockProvisioningData: ProvisioningRecord[] = [
  {
    id: 'prov1',
    customerName: 'Acme Corp',
    installer: 'TechInstall Ltd',
    area: 'Lagos Island',
    plan: 'Enterprise',
    installationDate: 'Jul 1, 2025',
    jobOrderDate: 'Jun 28, 2025',
    provisioningStatus: 'Awaiting Provisioning',
    activationStatus: 'Waiting',
    powerLevel: 'Pending',
    indoorStatus: 'Complete',
    outdoorStatus: 'Pending',
    splicePlan: 'Pending',
    issues: 'Attention Required',
    dateActivated: null,
    waitingDuration: '12 days',
    timeline: [
      { stage: 'Installation Completed', completed: true },
      { stage: 'Awaiting Provisioning', completed: true },
      { stage: 'Indoor Work Complete', completed: true },
      { stage: 'Outdoor Work Complete', completed: false },
      { stage: 'Provisioned', completed: false },
      { stage: 'Activated', completed: false },
    ],
  },
  {
    id: 'prov2',
    customerName: 'TechStart Inc',
    installer: 'ProInstall Services',
    area: 'Victoria Island',
    plan: 'Professional',
    installationDate: 'Jul 3, 2025',
    jobOrderDate: 'Jul 1, 2025',
    provisioningStatus: 'Ready',
    activationStatus: 'Waiting',
    powerLevel: 'Complete',
    indoorStatus: 'Complete',
    outdoorStatus: 'Complete',
    splicePlan: 'Complete',
    issues: 'Normal',
    dateActivated: null,
    waitingDuration: '10 days',
    timeline: [
      { stage: 'Installation Completed', completed: true },
      { stage: 'Awaiting Provisioning', completed: true },
      { stage: 'Indoor Work Complete', completed: true },
      { stage: 'Outdoor Work Complete', completed: true },
      { stage: 'Provisioned', completed: false },
      { stage: 'Activated', completed: false },
    ],
  },
  {
    id: 'prov3',
    customerName: 'Global Solutions',
    installer: 'TechInstall Ltd',
    area: 'Lekki',
    plan: 'Standard',
    installationDate: 'Jun 25, 2025',
    jobOrderDate: 'Jun 22, 2025',
    provisioningStatus: 'Provisioned',
    activationStatus: 'Activated',
    powerLevel: 'Complete',
    indoorStatus: 'Complete',
    outdoorStatus: 'Complete',
    splicePlan: 'Complete',
    issues: 'Normal',
    dateActivated: 'Jul 8, 2025',
    waitingDuration: '13 days',
    timeline: [
      { stage: 'Installation Completed', completed: true },
      { stage: 'Awaiting Provisioning', completed: true },
      { stage: 'Indoor Work Complete', completed: true },
      { stage: 'Outdoor Work Complete', completed: true },
      { stage: 'Provisioned', completed: true },
      { stage: 'Activated', completed: true },
    ],
  },
  {
    id: 'prov4',
    customerName: 'Enterprise Ltd',
    installer: 'ProInstall Services',
    area: 'Ikoyi',
    plan: 'Enterprise',
    installationDate: 'Jul 5, 2025',
    jobOrderDate: 'Jul 2, 2025',
    provisioningStatus: 'Blocked',
    activationStatus: 'Delayed',
    powerLevel: 'Pending',
    indoorStatus: 'Pending',
    outdoorStatus: 'Complete',
    splicePlan: 'Pending',
    issues: 'Critical',
    dateActivated: null,
    waitingDuration: '8 days',
    timeline: [
      { stage: 'Installation Completed', completed: true },
      { stage: 'Awaiting Provisioning', completed: true },
      { stage: 'Indoor Work Complete', completed: false },
      { stage: 'Outdoor Work Complete', completed: true },
      { stage: 'Provisioned', completed: false },
      { stage: 'Activated', completed: false },
    ],
  },
  {
    id: 'prov5',
    customerName: 'Digital Ventures',
    installer: 'TechInstall Ltd',
    area: 'Ajah',
    plan: 'Professional',
    installationDate: 'Jul 2, 2025',
    jobOrderDate: 'Jun 30, 2025',
    provisioningStatus: 'Ready',
    activationStatus: 'Waiting',
    powerLevel: 'Complete',
    indoorStatus: 'Complete',
    outdoorStatus: 'Complete',
    splicePlan: 'Complete',
    issues: 'Normal',
    dateActivated: null,
    waitingDuration: '11 days',
    timeline: [
      { stage: 'Installation Completed', completed: true },
      { stage: 'Awaiting Provisioning', completed: true },
      { stage: 'Indoor Work Complete', completed: true },
      { stage: 'Outdoor Work Complete', completed: true },
      { stage: 'Provisioned', completed: false },
      { stage: 'Activated', completed: false },
    ],
  },
]

// ── Filter State ───────────────────────────────────────────────────────────
const filters = ref({
  search: '',
  month: '',
  year: '',
  provisioningStatus: '',
  activationStatus: '',
  installer: '',
  area: '',
  plan: '',
  pickupPoint: '',
})

const selectedRecord = ref<ProvisioningRecord | null>(null)
const filtersExpanded = ref(false)

// ── Pagination ────────────────────────────────────────────────────────────
const rowsPerPage = ref(25)
const currentPage = ref(1)

// ── Sorting ────────────────────────────────────────────────────────────────
const sortBy = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// ── Filtered & Sorted Data ────────────────────────────────────────────────
const filtered = computed(() => {
  let result = mockProvisioningData

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(r =>
      r.customerName.toLowerCase().includes(q) ||
      r.installer.toLowerCase().includes(q)
    )
  }

  if (filters.value.provisioningStatus) {
    result = result.filter(r => r.provisioningStatus === filters.value.provisioningStatus)
  }

  if (filters.value.activationStatus) {
    result = result.filter(r => r.activationStatus === filters.value.activationStatus)
  }

  if (filters.value.installer) {
    result = result.filter(r => r.installer === filters.value.installer)
  }

  if (filters.value.area) {
    result = result.filter(r => r.area === filters.value.area)
  }

  if (filters.value.plan) {
    result = result.filter(r => r.plan === filters.value.plan)
  }

  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      let aVal: any = a[sortBy.value as keyof ProvisioningRecord]
      let bVal: any = b[sortBy.value as keyof ProvisioningRecord]

      if (aVal === undefined || aVal === null) aVal = ''
      if (bVal === undefined || bVal === null) bVal = ''

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

// ── Pagination ────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.ceil(filtered.value.length / rowsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return filtered.value.slice(start, end)
})

const pageInfo = computed(() => {
  const start = filtered.value.length === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1
  const end = Math.min(currentPage.value * rowsPerPage.value, filtered.value.length)
  return { start, end, total: filtered.value.length }
})

watch([filters, rowsPerPage], () => {
  currentPage.value = 1
}, { deep: true })

// ── Sort handler ───────────────────────────────────────────────────────────
const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

// ── Filter handlers ────────────────────────────────────────────────────────
const clearFilters = () => {
  filters.value = {
    search: '',
    month: '',
    year: '',
    provisioningStatus: '',
    activationStatus: '',
    installer: '',
    area: '',
    plan: '',
    pickupPoint: '',
  }
}

const activeFilterCount = computed(() => {
  return Object.values(filters.value).filter(v => v !== '').length
})

// ── KPI Cards ──────────────────────────────────────────────────────────────
const summaryCards = computed(() => [
  {
    label: 'Awaiting Provisioning',
    value: String(mockProvisioningData.filter(r => r.provisioningStatus === 'Awaiting Provisioning').length),
    icon: 'clock',
    subtitle: 'In queue',
  },
  {
    label: 'Ready for Activation',
    value: String(mockProvisioningData.filter(r => r.provisioningStatus === 'Ready').length),
    icon: 'check',
    subtitle: 'Provisioned',
  },
  {
    label: 'Activated',
    value: String(mockProvisioningData.filter(r => r.activationStatus === 'Activated').length),
    icon: 'trending-up',
    subtitle: 'Live',
  },
  {
    label: 'Blocked',
    value: String(mockProvisioningData.filter(r => r.provisioningStatus === 'Blocked').length),
    icon: 'chart-bar',
    subtitle: 'Requires attention',
  },
  {
    label: 'Avg Provisioning Time',
    value: '11d',
    icon: 'calendar',
    subtitle: 'Average duration',
  },
  {
    label: 'Success Rate',
    value: '83%',
    icon: 'trending-up',
    subtitle: 'Activation success',
  },
])

// ── Operational Alerts ────────────────────────────────────────────────────
const operationalAlerts = computed(() => [
  {
    id: 'delayed',
    label: 'Provisioning Delayed',
    count: mockProvisioningData.filter(r => r.provisioningStatus === 'Awaiting Provisioning').length,
    color: '#f59e0b',
    filter: 'provisioningStatus',
    filterValue: 'Awaiting Provisioning',
  },
  {
    id: 'awaiting',
    label: 'Awaiting Activation',
    count: mockProvisioningData.filter(r => r.provisioningStatus === 'Ready').length,
    color: '#3b82f6',
    filter: 'provisioningStatus',
    filterValue: 'Ready',
  },
  {
    id: 'blocked',
    label: 'Blocked',
    count: mockProvisioningData.filter(r => r.provisioningStatus === 'Blocked').length,
    color: '#ef4444',
    filter: 'provisioningStatus',
    filterValue: 'Blocked',
  },
  {
    id: 'indoor',
    label: 'Indoor Work Pending',
    count: mockProvisioningData.filter(r => r.indoorStatus === 'Pending').length,
    color: '#f59e0b',
    filter: 'indoorStatus',
    filterValue: 'Pending',
  },
  {
    id: 'outdoor',
    label: 'Outdoor Work Pending',
    count: mockProvisioningData.filter(r => r.outdoorStatus === 'Pending').length,
    color: '#f59e0b',
    filter: 'outdoorStatus',
    filterValue: 'Pending',
  },
  {
    id: 'critical',
    label: 'Critical Issues',
    count: mockProvisioningData.filter(r => r.issues === 'Critical').length,
    color: '#ef4444',
    filter: 'issues',
    filterValue: 'Critical',
  },
])

const applyAlertFilter = (alert: typeof operationalAlerts.value[0]) => {
  clearFilters()
  if (alert.filter === 'provisioningStatus') {
    filters.value.provisioningStatus = alert.filterValue
  } else if (alert.filter === 'activationStatus') {
    filters.value.activationStatus = alert.filterValue
  }
}

// ── Unique filter options ──────────────────────────────────────────────────
const installerOptions = computed(() => [...new Set(mockProvisioningData.map(r => r.installer))])
const areaOptions = computed(() => [...new Set(mockProvisioningData.map(r => r.area))])
const planOptions = computed(() => [...new Set(mockProvisioningData.map(r => r.plan))])

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

// ── Column definitions ────────────────────────────────────────────────────
const columns = [
  { key: 'customerName', label: 'Customer', sortable: true, width: 180 },
  { key: 'installer', label: 'Installer', sortable: true, width: 160 },
  { key: 'area', label: 'Area', sortable: true, width: 140 },
  { key: 'plan', label: 'Plan', sortable: true, width: 120 },
  { key: 'installationDate', label: 'Installation Date', sortable: true, width: 140 },
  { key: 'jobOrderDate', label: 'Job Order Date', sortable: true, width: 140 },
  { key: 'provisioningStatus', label: 'Provisioning Status', sortable: true, width: 160 },
  { key: 'activationStatus', label: 'Activation Status', sortable: true, width: 150 },
  { key: 'powerLevel', label: 'Power Level', sortable: false, width: 120 },
  { key: 'indoorStatus', label: 'Indoor Status', sortable: false, width: 130 },
  { key: 'outdoorStatus', label: 'Outdoor Status', sortable: false, width: 130 },
  { key: 'splicePlan', label: 'Splice Plan', sortable: false, width: 120 },
  { key: 'issues', label: 'Issues', sortable: false, width: 140 },
  { key: 'dateActivated', label: 'Date Activated', sortable: true, width: 140 },
  { key: 'waitingDuration', label: 'Waiting Duration', sortable: true, width: 140 },
]

const getCellValue = (record: ProvisioningRecord, key: string): string => {
  switch (key) {
    case 'customerName': return record.customerName
    case 'installer': return record.installer
    case 'area': return record.area
    case 'plan': return record.plan
    case 'installationDate': return record.installationDate
    case 'jobOrderDate': return record.jobOrderDate
    case 'provisioningStatus': return record.provisioningStatus
    case 'activationStatus': return record.activationStatus
    case 'powerLevel': return record.powerLevel
    case 'indoorStatus': return record.indoorStatus
    case 'outdoorStatus': return record.outdoorStatus
    case 'splicePlan': return record.splicePlan
    case 'issues': return record.issues
    case 'dateActivated': return record.dateActivated || '—'
    case 'waitingDuration': return record.waitingDuration
    default: return '—'
  }
}

const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <KpiStatCard
        v-for="card in summaryCards"
        :key="card.label"
        v-bind="card"
      />
    </div>

    <!-- Operational Alerts -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Operational Alerts</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          v-for="alert in operationalAlerts"
          :key="alert.id"
          @click="applyAlertFilter(alert)"
          class="card p-4 text-left hover:shadow-md transition-shadow cursor-pointer"
        >
          <div class="flex items-start gap-2 mb-2">
            <span class="w-2 h-2 rounded-full shrink-0 mt-1" :style="{ backgroundColor: alert.color }"></span>
            <p class="text-xs font-medium text-gray-700 leading-tight">{{ alert.label }}</p>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ alert.count }}</p>
          <p class="text-xs text-gray-400 mt-1">Click to filter</p>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border border-gray-200 rounded-lg mb-6">
      <div class="p-4">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Search Field -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by customer or installer..."
              class="input pl-9 w-full"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button @click="toggleFilters" class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">
              Filters
              <span v-if="activeFilterCount > 0" class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-primary text-white rounded-full">
                {{ activeFilterCount }}
              </span>
            </button>
            <button class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">Export</button>
            <button class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">Refresh</button>
          </div>
        </div>
      </div>

      <!-- Expandable Filter Panel -->
      <Transition name="expand">
        <div v-if="filtersExpanded" class="bg-gray-50 border-t border-gray-200 p-4">
          <div class="space-y-4">
            <!-- Filter Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label class="label text-xs mb-1">Month</label>
                <select v-model="filters.month" class="select text-sm">
                  <option value="">All Months</option>
                  <option v-for="m in months" :key="m.value" :value="String(m.value)">{{ m.label }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Year</label>
                <select v-model="filters.year" class="select text-sm">
                  <option value="">All Years</option>
                  <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Provisioning Status</label>
                <select v-model="filters.provisioningStatus" class="select text-sm">
                  <option value="">All Statuses</option>
                  <option>Awaiting Provisioning</option>
                  <option>Ready</option>
                  <option>Provisioned</option>
                  <option>Blocked</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Activation Status</label>
                <select v-model="filters.activationStatus" class="select text-sm">
                  <option value="">All Statuses</option>
                  <option>Waiting</option>
                  <option>Activated</option>
                  <option>Failed</option>
                  <option>Delayed</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Installer</label>
                <select v-model="filters.installer" class="select text-sm">
                  <option value="">All Installers</option>
                  <option v-for="i in installerOptions" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Area</label>
                <select v-model="filters.area" class="select text-sm">
                  <option value="">All Areas</option>
                  <option v-for="a in areaOptions" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Plan</label>
                <select v-model="filters.plan" class="select text-sm">
                  <option value="">All Plans</option>
                  <option v-for="p in planOptions" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <button @click="clearFilters" class="btn-secondary text-sm w-full sm:w-auto justify-center">
                Clear Filters
              </button>
              <button class="btn-primary text-sm w-full sm:w-auto justify-center">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Provisioning Table -->
    <div class="card overflow-hidden flex flex-col">
      <!-- Desktop: Table -->
      <div class="hidden md:block overflow-x-auto min-w-0">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th
                v-for="col in columns"
                :key="col.key"
                @click="col.sortable && handleSort(col.key)"
                :style="{ width: col.width + 'px', minWidth: col.width + 'px' }"
                :class="[
                  'text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3 whitespace-nowrap',
                  col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                ]"
              >
                <div class="flex items-center gap-2">
                  <span class="truncate">{{ col.label }}</span>
                  <svg
                    v-if="col.sortable && sortBy === col.key"
                    :class="['w-3.5 h-3.5 text-primary flex-shrink-0', sortOrder === 'desc' ? 'rotate-180' : '']"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4"/>
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(record, idx) in paginatedData"
              :key="record.id"
              @click="selectedRecord = record"
              :class="[
                'hover:bg-gray-50/60 transition-colors cursor-pointer',
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              ]"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :style="{ width: col.width + 'px', minWidth: col.width + 'px' }"
                class="px-4 py-3 text-sm text-gray-700"
              >
                <div class="truncate">
                  <template v-if="['provisioningStatus', 'activationStatus', 'powerLevel', 'indoorStatus', 'outdoorStatus', 'splicePlan', 'issues'].includes(col.key)">
                    <StatusBadge :status="getCellValue(record, col.key)" size="sm" />
                  </template>
                  <template v-else>
                    {{ getCellValue(record, col.key) }}
                  </template>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td :colspan="columns.length" class="px-6 py-12 text-center">
                <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-sm text-gray-500">No provisioning records found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: Card layout -->
      <div class="md:hidden p-3 space-y-3">
        <div
          v-for="record in paginatedData"
          :key="record.id"
          @click="selectedRecord = record"
          class="rounded-xl border border-gray-100 bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ record.customerName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ record.installer }} · {{ record.area }}</p>
            </div>
            <StatusBadge :status="record.provisioningStatus" size="sm" />
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span>{{ record.plan }}</span>
            <span>·</span>
            <span>{{ record.installationDate }}</span>
          </div>
        </div>
        <div v-if="paginatedData.length === 0" class="py-12 text-center text-sm text-gray-400">
          No provisioning records found
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">Rows per page:</span>
          <select v-model.number="rowsPerPage" class="select w-20 text-sm">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <div class="text-sm text-gray-600">
          Showing {{ pageInfo.start }}–{{ pageInfo.end }} of {{ pageInfo.total }} records
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn-secondary text-sm px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div class="flex items-center gap-1">
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn-secondary text-sm px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Details Drawer -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition name="backdrop">
        <div v-if="selectedRecord" class="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" @click="selectedRecord = null"></div>
      </Transition>

      <!-- Drawer -->
      <Transition name="drawer-slide">
        <div v-if="selectedRecord" class="fixed inset-y-0 right-0 z-50 flex">
          <div class="bg-white flex flex-col h-full border-l border-gray-200 shadow-2xl overflow-hidden" style="width: 500px; max-width: 100vw;">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 class="text-base font-semibold text-gray-900">Provisioning Details</h2>
                <p class="text-xs text-gray-500 mt-0.5">{{ selectedRecord.customerName }}</p>
              </div>
              <button @click="selectedRecord = null" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <!-- Customer Information -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer Information</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Customer</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.customerName }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Plan</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.plan }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Area</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.area }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Provisioning Timeline -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Provisioning Timeline</p>
                <div class="relative pl-4 space-y-3">
                  <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div v-for="(stage, i) in selectedRecord.timeline" :key="i" class="relative">
                    <div
                      class="absolute -left-3 top-1 w-2 h-2 rounded-full"
                      :style="{ backgroundColor: stage.completed ? '#22c55e' : '#d1d5db' }"
                    ></div>
                    <p :class="['text-xs font-medium', stage.completed ? 'text-green-700' : 'text-gray-500']">
                      {{ stage.completed ? '✓' : '○' }} {{ stage.stage }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Installation Details -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Installation Details</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Installation Date</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.installationDate }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Job Order Date</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.jobOrderDate }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Installer</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.installer }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Provisioning Status -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Provisioning Status</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Provisioning</dt>
                    <dd><StatusBadge :status="selectedRecord.provisioningStatus" size="sm" /></dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Activation</dt>
                    <dd><StatusBadge :status="selectedRecord.activationStatus" size="sm" /></dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Power Level</dt>
                    <dd><StatusBadge :status="selectedRecord.powerLevel" size="sm" /></dd>
                  </div>
                </dl>
              </div>

              <!-- Work Status -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Work Status</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Indoor Work</dt>
                    <dd><StatusBadge :status="selectedRecord.indoorStatus" size="sm" /></dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Outdoor Work</dt>
                    <dd><StatusBadge :status="selectedRecord.outdoorStatus" size="sm" /></dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Splice Plan</dt>
                    <dd><StatusBadge :status="selectedRecord.splicePlan" size="sm" /></dd>
                  </div>
                </dl>
              </div>

              <!-- Issues & Activation -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Operational Status</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Issues</dt>
                    <dd><StatusBadge :status="selectedRecord.issues" size="sm" /></dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Date Activated</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.dateActivated || '—' }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Waiting Duration</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedRecord.waitingDuration }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
