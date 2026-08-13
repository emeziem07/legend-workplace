<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerInsightsStore } from '../stores/customerInsights'
import KpiStatCard from '../components/common/KpiStatCard.vue'

const router = useRouter()
const store = useCustomerInsightsStore()

type Workspace = 'overview' | 'browse' | 'provisioning'
const activeWorkspace = ref<Workspace>('overview')
const selectedYear = ref(2025)

const workspaceConfig = {
  overview: {
    title: 'Installation Insights',
    subtitle: 'Monitor customer installations, activations, provisioning and operational performance.',
  },
  browse: {
    title: 'Browse Installations',
    subtitle: 'Browse and manage all customer installation records.',
  },
  provisioning: {
    title: 'Provisioning',
    subtitle: 'Monitor provisioning progress, activation readiness and operational blockers.',
  },
}

const currentConfig = computed(() => workspaceConfig[activeWorkspace.value])

const summaryCards = computed(() => [
  { label: 'Total Installations', value: String(store.summaryStats.totalInstallations), icon: 'chart-bar', subtitle: 'All time' },
  { label: 'Activated', value: String(store.summaryStats.activated), icon: 'check', subtitle: 'Completed' },
  { label: 'Pending', value: String(store.summaryStats.pending), icon: 'clock', subtitle: 'In progress' },
  { label: 'Refunded', value: String(store.summaryStats.refunded), icon: 'trending-up', subtitle: 'Cancelled' },
  { label: 'Activation Rate', value: `${store.summaryStats.activationRate}%`, icon: 'chart-bar', subtitle: 'Success rate' },
  { label: 'Avg Duration', value: `${store.summaryStats.averageInstallationDuration}d`, icon: 'calendar', subtitle: 'Days to activate' },
])

// Historical data for different years
const historicalData = {
  2025: store.monthlyData,
  2024: [
    { month: 'January 2024', year: 2024, total: 18, activated: 14, refunded: 2, pending: 2 },
    { month: 'February 2024', year: 2024, total: 22, activated: 17, refunded: 3, pending: 2 },
    { month: 'March 2024', year: 2024, total: 19, activated: 15, refunded: 2, pending: 2 },
    { month: 'April 2024', year: 2024, total: 21, activated: 16, refunded: 3, pending: 2 },
    { month: 'May 2024', year: 2024, total: 20, activated: 15, refunded: 2, pending: 3 },
    { month: 'June 2024', year: 2024, total: 23, activated: 18, refunded: 3, pending: 2 },
    { month: 'July 2024', year: 2024, total: 25, activated: 20, refunded: 2, pending: 3 },
    { month: 'August 2024', year: 2024, total: 24, activated: 19, refunded: 3, pending: 2 },
    { month: 'September 2024', year: 2024, total: 22, activated: 17, refunded: 2, pending: 3 },
    { month: 'October 2024', year: 2024, total: 26, activated: 21, refunded: 3, pending: 2 },
    { month: 'November 2024', year: 2024, total: 28, activated: 22, refunded: 3, pending: 3 },
    { month: 'December 2024', year: 2024, total: 30, activated: 24, refunded: 3, pending: 3 },
  ],
  2023: [
    { month: 'January 2023', year: 2023, total: 12, activated: 9, refunded: 2, pending: 1 },
    { month: 'February 2023', year: 2023, total: 14, activated: 11, refunded: 2, pending: 1 },
    { month: 'March 2023', year: 2023, total: 16, activated: 12, refunded: 2, pending: 2 },
    { month: 'April 2023', year: 2023, total: 15, activated: 11, refunded: 2, pending: 2 },
    { month: 'May 2023', year: 2023, total: 17, activated: 13, refunded: 2, pending: 2 },
    { month: 'June 2023', year: 2023, total: 18, activated: 14, refunded: 2, pending: 2 },
    { month: 'July 2023', year: 2023, total: 19, activated: 15, refunded: 2, pending: 2 },
    { month: 'August 2023', year: 2023, total: 20, activated: 16, refunded: 2, pending: 2 },
    { month: 'September 2023', year: 2023, total: 18, activated: 14, refunded: 2, pending: 2 },
    { month: 'October 2023', year: 2023, total: 21, activated: 17, refunded: 2, pending: 2 },
    { month: 'November 2023', year: 2023, total: 22, activated: 18, refunded: 2, pending: 2 },
    { month: 'December 2023', year: 2023, total: 24, activated: 19, refunded: 3, pending: 2 },
  ],
  2022: [
    { month: 'January 2022', year: 2022, total: 8, activated: 6, refunded: 1, pending: 1 },
    { month: 'February 2022', year: 2022, total: 9, activated: 7, refunded: 1, pending: 1 },
    { month: 'March 2022', year: 2022, total: 10, activated: 8, refunded: 1, pending: 1 },
    { month: 'April 2022', year: 2022, total: 11, activated: 8, refunded: 2, pending: 1 },
    { month: 'May 2022', year: 2022, total: 12, activated: 9, refunded: 2, pending: 1 },
    { month: 'June 2022', year: 2022, total: 13, activated: 10, refunded: 2, pending: 1 },
    { month: 'July 2022', year: 2022, total: 14, activated: 11, refunded: 2, pending: 1 },
    { month: 'August 2022', year: 2022, total: 15, activated: 12, refunded: 2, pending: 1 },
    { month: 'September 2022', year: 2022, total: 13, activated: 10, refunded: 2, pending: 1 },
    { month: 'October 2022', year: 2022, total: 16, activated: 13, refunded: 2, pending: 1 },
    { month: 'November 2022', year: 2022, total: 17, activated: 14, refunded: 2, pending: 1 },
    { month: 'December 2022', year: 2022, total: 18, activated: 15, refunded: 2, pending: 1 },
  ],
}

const monthlyDataForYear = computed(() => {
  return historicalData[selectedYear.value as keyof typeof historicalData] || store.monthlyData
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb (Fixed) -->
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
          <span class="text-gray-600">Installation Insights</span>
        </nav>
      </div>
    </div>

    <!-- Page Header (Fixed, text updates) -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">{{ currentConfig.title }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ currentConfig.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Workspace Tabs (Fixed) -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div class="flex items-center gap-0">
          <button
            @click="activeWorkspace = 'overview'"
            :class="[
              'px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors',
              activeWorkspace === 'overview'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            ]"
          >
            Overview
          </button>
          <button
            @click="activeWorkspace = 'browse'"
            :class="[
              'px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors',
              activeWorkspace === 'browse'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            ]"
          >
            Browse Installations
          </button>
          <button
            @click="activeWorkspace = 'provisioning'"
            :class="[
              'px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors',
              activeWorkspace === 'provisioning'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            ]"
          >
            Provisioning
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area (Changes per workspace) -->
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      <!-- Overview Workspace -->
      <div v-if="activeWorkspace === 'overview'">
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KpiStatCard
            v-for="card in summaryCards"
            :key="card.label"
            v-bind="card"
          />
        </div>

        <!-- Monthly Performance Table -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-sm font-semibold text-gray-900">Monthly Performance</h2>
              <p class="text-xs text-gray-500 mt-0.5">Installation metrics by month</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <label class="text-xs font-medium text-gray-600">Year:</label>
              <select v-model.number="selectedYear" class="select text-sm w-24">
                <option :value="2025">2025</option>
                <option :value="2024">2024</option>
                <option :value="2023">2023</option>
                <option :value="2022">2022</option>
              </select>
            </div>
          </div>

          <!-- Desktop: Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 bg-gray-50">
                  <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Month</th>
                  <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
                  <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Activated</th>
                  <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Refunded</th>
                  <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Pending</th>
                  <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 pr-6">Activation %</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="row in monthlyDataForYear"
                  :key="row.month"
                  class="hover:bg-gray-50/60 transition-colors"
                >
                  <td class="px-6 py-4">
                    <span class="text-sm font-medium text-gray-900">{{ row.month }}</span>
                  </td>
                  <td class="px-4 py-4 text-center">
                    <span class="text-sm font-semibold text-gray-900">{{ row.total }}</span>
                  </td>
                  <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {{ row.activated }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {{ row.refunded }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {{ row.pending }}
                    </span>
                  </td>
                  <td class="px-4 py-4 pr-6 text-center">
                    <span class="text-sm font-semibold text-gray-900">{{ row.total > 0 ? Math.round((row.activated / row.total) * 100) : 0 }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile: Card layout -->
          <div class="md:hidden divide-y divide-gray-50">
            <div
              v-for="row in monthlyDataForYear"
              :key="row.month"
              class="px-4 py-4"
            >
              <p class="text-sm font-semibold text-gray-900 mb-3">{{ row.month }}</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Total</span>
                  <span class="text-sm font-semibold text-gray-900">{{ row.total }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Activated</span>
                  <span class="text-sm font-semibold text-green-700">{{ row.activated }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Refunded</span>
                  <span class="text-sm font-semibold text-red-700">{{ row.refunded }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Pending</span>
                  <span class="text-sm font-semibold text-amber-700">{{ row.pending }}</span>
                </div>
                <div class="flex items-center justify-between col-span-2">
                  <span class="text-xs text-gray-500">Activation Rate</span>
                  <span class="text-sm font-semibold text-gray-900">{{ row.total > 0 ? Math.round((row.activated / row.total) * 100) : 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Browse Installations Workspace -->
      <div v-if="activeWorkspace === 'browse'">
        <InstallationsBrowseContent />
      </div>

      <!-- Provisioning Workspace -->
      <div v-if="activeWorkspace === 'provisioning'">
        <ProvisioningContent />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InstallationsBrowseContent from './InstallationsBrowseContent.vue'
import ProvisioningContent from './ProvisioningContent.vue'

export default {
  components: {
    InstallationsBrowseContent,
    ProvisioningContent,
  },
}
</script>
