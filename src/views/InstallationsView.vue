<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerInsightsStore } from '../stores/customerInsights'
import type { Installation } from '../stores/customerInsights'
import StatusBadge from '../components/common/StatusBadge.vue'

const store = useCustomerInsightsStore()
const router = useRouter()

// ── Filter State ──────────────────────────────────────────────────────────────
const filters = ref({
  search: '',
  month: '',
  year: '',
  status: '',
  category: '',
  plan: '',
  area: '',
  installer: '',
  pickupPoint: '',
  mdu: '',
})

const selectedInstallation = ref<Installation | null>(null)
const filtersExpanded = ref(false)

// ── Pagination ────────────────────────────────────────────────────────────────
const rowsPerPage = ref(25)
const currentPage = ref(1)

// ── Sorting ────────────────────────────────────────────────────────────────────
const sortBy = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// ── Filtered & Sorted Data ────────────────────────────────────────────────────
const filtered = computed(() => {
  let result = store.installations

  // Search
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(i =>
      i.customerName.toLowerCase().includes(q) ||
      (i.installationDate && i.installationDate.toLowerCase().includes(q))
    )
  }

  // Status
  if (filters.value.status) {
    result = result.filter(i => i.status === filters.value.status)
  }

  // Sort
  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      let aVal: any = a[sortBy.value as keyof Installation]
      let bVal: any = b[sortBy.value as keyof Installation]

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

// ── Pagination ────────────────────────────────────────────────────────────────
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

// ── Reset pagination when filters change ───────────────────────────────────────
watch([filters, rowsPerPage], () => {
  currentPage.value = 1
}, { deep: true })

// ── Sort handler ───────────────────────────────────────────────────────────────
const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

// ── Filter handlers ────────────────────────────────────────────────────────────
const clearFilters = () => {
  filters.value = {
    search: '',
    month: '',
    year: '',
    status: '',
    category: '',
    plan: '',
    area: '',
    installer: '',
    pickupPoint: '',
    mdu: '',
  }
}

const statusOptions = ['Activated', 'Pending', 'Refunded']
const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

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



// ── Column definitions ────────────────────────────────────────────────────────
const columns = [
  { key: 'customerName', label: 'Customer', sortable: true, pinned: true, width: 200 },
  { key: 'installationDate', label: 'Requested On', sortable: true, pinned: true, width: 150 },
  { key: 'status', label: 'Installation Status', sortable: true, pinned: false, width: 140 },
  { key: 'activationDate', label: 'Activation Date', sortable: true, pinned: false, width: 140 },
  { key: 'durationDays', label: 'Duration (Days)', sortable: true, pinned: false, width: 120 },
  { key: 'category', label: 'Category', sortable: false, pinned: false, width: 120 },
  { key: 'installer', label: 'Installer', sortable: false, pinned: false, width: 140 },
  { key: 'address', label: 'Address', sortable: false, pinned: false, width: 160 },
  { key: 'area', label: 'Area', sortable: false, pinned: false, width: 120 },
  { key: 'mdu', label: 'MDU', sortable: false, pinned: false, width: 100 },
  { key: 'plan', label: 'Plan', sortable: false, pinned: false, width: 120 },
  { key: 'requirements', label: 'Requirements', sortable: false, pinned: false, width: 140 },
  { key: 'pickupPoint', label: 'Pickup Point', sortable: false, pinned: false, width: 140 },
  { key: 'mst', label: 'MST', sortable: false, pinned: false, width: 100 },
  { key: 'hcLm', label: 'HC LM', sortable: false, pinned: false, width: 100 },
  { key: 'lm', label: 'LM', sortable: false, pinned: false, width: 100 },
  { key: 'pvcBundles', label: 'PVC (Bundles)', sortable: false, pinned: false, width: 130 },
  { key: 'accessCable', label: 'Access Cable', sortable: false, pinned: false, width: 130 },
  { key: 'accessPvc', label: 'Access PVC', sortable: false, pinned: false, width: 130 },
  { key: 'mstAccess', label: 'MST Access', sortable: false, pinned: false, width: 130 },
  { key: 'distributionCable', label: 'Distribution Cable', sortable: false, pinned: false, width: 150 },
  { key: 'flexible', label: 'Flexible', sortable: false, pinned: false, width: 120 },
  { key: 'atb', label: 'ATB', sortable: false, pinned: false, width: 100 },
  { key: 'patchCord', label: 'Patch Cord', sortable: false, pinned: false, width: 120 },
  { key: 'clip', label: 'Clip', sortable: false, pinned: false, width: 100 },
  { key: 'thrustboring', label: 'Thrustboring / Cutting', sortable: false, pinned: false, width: 160 },
]

// ── Count active filters ───────────────────────────────────────────────────────
const activeFilterCount = computed(() => {
  return Object.values(filters.value).filter(v => v !== '').length
})

const getCellValue = (installation: Installation, key: string): string => {
  switch (key) {
    case 'customerName': return installation.customerName
    case 'installationDate': return installation.installationDate || '—'
    case 'activationDate': return installation.activationDate || '—'
    case 'durationDays': return installation.durationDays ? String(installation.durationDays) : '—'
    case 'status': return installation.status
    case 'category': return installation.category || '—'
    case 'installer': return installation.installer || '—'
    case 'address': return installation.address || '—'
    case 'area': return installation.area || '—'
    case 'mdu': return installation.mdu || '—'
    case 'plan': return installation.plan || '—'
    case 'requirements': return installation.requirements || '—'
    case 'pickupPoint': return installation.pickupPoint || '—'
    case 'mst': return installation.mst || '—'
    case 'hcLm': return installation.hcLm || '—'
    case 'lm': return installation.lm || '—'
    case 'pvcBundles': return installation.pvcBundles || '—'
    case 'accessCable': return installation.accessCable || '—'
    case 'accessPvc': return installation.accessPvc || '—'
    case 'mstAccess': return installation.mstAccess || '—'
    case 'distributionCable': return installation.distributionCable || '—'
    case 'flexible': return installation.flexible || '—'
    case 'atb': return installation.atb || '—'
    case 'patchCord': return installation.patchCord || '—'
    case 'clip': return installation.clip || '—'
    case 'thrustboring': return installation.thrustboring || '—'
    default: return '—'
  }
}

// ── Toggle filters panel ───────────────────────────────────────────────────────
const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}




</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-sm">
          <button
            @click="router.push('/resources')"
            class="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Resources
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          <button
            @click="router.push('/installation-insights')"
            class="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Installation Insights
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          <span class="text-gray-600">Browse Installations</span>
        </nav>
      </div>
    </div>

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Browse Installations</h1>
            <p class="text-sm text-gray-500 mt-0.5">Browse and manage all customer installations</p>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-600">{{ pageInfo.total }} total</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Filter Bar -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-20">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Search Field -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by customer name or address..."
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
            <button class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">
              Export
            </button>
            <button class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Expandable Filter Panel -->
      <Transition name="expand">
        <div v-if="filtersExpanded" class="bg-gray-50 border-t border-gray-200">
          <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
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
                  <label class="label text-xs mb-1">Status</label>
                  <select v-model="filters.status" class="select text-sm">
                    <option value="">All Statuses</option>
                    <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>

                <div>
                  <label class="label text-xs mb-1">Category</label>
                  <select v-model="filters.category" class="select text-sm">
                    <option value="">All Categories</option>
                  </select>
                </div>

                <div>
                  <label class="label text-xs mb-1">Plan</label>
                  <select v-model="filters.plan" class="select text-sm">
                    <option value="">All Plans</option>
                  </select>
                </div>

                <div>
                  <label class="label text-xs mb-1">Area</label>
                  <select v-model="filters.area" class="select text-sm">
                    <option value="">All Areas</option>
                  </select>
                </div>

                <div>
                  <label class="label text-xs mb-1">Installer</label>
                  <select v-model="filters.installer" class="select text-sm">
                    <option value="">All Installers</option>
                  </select>
                </div>

                <div>
                  <label class="label text-xs mb-1">Pickup Point</label>
                  <select v-model="filters.pickupPoint" class="select text-sm">
                    <option value="">All Pickup Points</option>
                  </select>
                </div>

                <div>
                  <label class="label text-xs mb-1">MDU</label>
                  <select v-model="filters.mdu" class="select text-sm">
                    <option value="">All MDU</option>
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
        </div>
      </Transition>
    </div>

    <!-- Table Container -->
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      <div class="card overflow-hidden flex flex-col">
        <!-- Table Wrapper: horizontal scroll only on table, not page -->
        <div class="overflow-x-auto min-w-0">
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
                    col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : '',
                    col.pinned ? 'sticky left-0 z-10 bg-gray-50 shadow-sm' : ''
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
                v-for="(inst, idx) in paginatedData"
                :key="inst.id"
                @click="selectedInstallation = inst"
                :class="[
                  'hover:bg-gray-50/60 transition-colors cursor-pointer',
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                ]"
              >
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :style="{ width: col.width + 'px', minWidth: col.width + 'px' }"
                  :class="[
                    'px-4 py-3 text-sm text-gray-700',
                    col.pinned ? 'sticky left-0 z-10 bg-inherit shadow-sm' : ''
                  ]"
                >
                  <div class="truncate">
                    <template v-if="col.key === 'status'">
                      <StatusBadge :status="inst.status" size="sm" />
                    </template>
                    <template v-else>
                      {{ getCellValue(inst, col.key) }}
                    </template>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedData.length === 0">
                <td :colspan="columns.length" class="px-6 py-12 text-center">
                  <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-sm text-gray-500">No installations found</p>
                </td>
              </tr>
            </tbody>
          </table>
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
            Showing {{ pageInfo.start }}–{{ pageInfo.end }} of {{ pageInfo.total }} installations
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
    </div>

    <!-- Details Drawer -->
    <Teleport to="body">
      <!-- Backdrop: fade only -->
      <Transition name="backdrop">
        <div v-if="selectedInstallation" class="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" @click="selectedInstallation = null"></div>
      </Transition>

      <!-- Drawer: slide from right -->
      <Transition name="drawer-slide">
        <div v-if="selectedInstallation" class="fixed inset-y-0 right-0 z-50 flex">
          <div class="bg-white flex flex-col h-full border-l border-gray-200 shadow-2xl overflow-hidden" style="width: 500px; max-width: 100vw;">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 class="text-base font-semibold text-gray-900">Installation Details</h2>
                <p class="text-xs text-gray-500 mt-0.5">{{ selectedInstallation.customerName }}</p>
              </div>
              <button @click="selectedInstallation = null" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <!-- Customer Information -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer Information</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Customer Name</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedInstallation.customerName }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Customer ID</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedInstallation.customerId }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Installation Details -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Installation Details</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Status</dt>
                    <dd class="text-sm font-medium"><StatusBadge :status="selectedInstallation.status" size="sm" /></dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Installation Date</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedInstallation.installationDate || '—' }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Activation Date</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedInstallation.activationDate || '—' }}</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Duration (Days)</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ selectedInstallation.durationDays || '—' }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Materials Used -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Materials Used</p>
                <dl class="space-y-2">
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">MST</dt>
                    <dd class="text-sm font-medium text-gray-900">—</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">PVC (Bundles)</dt>
                    <dd class="text-sm font-medium text-gray-900">—</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Access Cable</dt>
                    <dd class="text-sm font-medium text-gray-900">—</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Distribution Cable</dt>
                    <dd class="text-sm font-medium text-gray-900">—</dd>
                  </div>
                  <div class="flex items-start justify-between">
                    <dt class="text-xs text-gray-500">Patch Cord</dt>
                    <dd class="text-sm font-medium text-gray-900">—</dd>
                  </div>
                </dl>
              </div>

              <!-- Timeline -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline</p>
                <div class="relative pl-4 space-y-3">
                  <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div class="relative">
                    <div class="absolute -left-3 top-1 w-2 h-2 rounded-full bg-primary"></div>
                    <p class="text-xs font-medium text-gray-700">Installation Requested</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ selectedInstallation.installationDate || 'N/A' }}</p>
                  </div>
                  <div v-if="selectedInstallation.activationDate" class="relative">
                    <div class="absolute -left-3 top-1 w-2 h-2 rounded-full bg-green-500"></div>
                    <p class="text-xs font-medium text-gray-700">Installation Activated</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ selectedInstallation.activationDate }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Backdrop: fade in/out independently */
.backdrop-enter-active {
  transition: opacity 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.backdrop-leave-active {
  transition: opacity 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Drawer: slide from right */
.drawer-slide-enter-active {
  transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-leave-active {
  transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

/* Expand animation for filter panel */
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
