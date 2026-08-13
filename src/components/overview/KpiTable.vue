<script setup lang="ts">
import type { KpiRow } from '../../stores/kpi'
import StatusBadge from '../common/StatusBadge.vue'

defineProps<{ rows: KpiRow[] }>()

const exportData = () => {
  alert('Export initiated – CSV download would start in production.')
}
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
      <div class="min-w-0">
        <h2 class="section-title">KPI Performance</h2>
        <p class="text-xs text-gray-500 mt-0.5 truncate">Q3 2025 – All key performance indicators</p>
      </div>
      <button @click="exportData" class="btn-secondary text-xs gap-1.5 shrink-0 ml-3">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span class="hidden sm:inline">Export</span>
      </button>
    </div>

    <!-- Desktop: Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3 w-12">S/N</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">KPI</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Objectives</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Matrix / Measures</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Target</th>
            <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Weighting</th>
            <th class="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 pr-6 whitespace-nowrap">Max Rating</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="(row, index) in rows" :key="row.id" class="hover:bg-gray-50/60 transition-colors">
            <td class="px-6 py-4">
              <span class="text-sm text-gray-400 font-medium">{{ String(index + 1).padStart(2, '0') }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm font-semibold text-gray-900 whitespace-nowrap">{{ row.kpi }}</span>
            </td>
            <td class="px-4 py-4 max-w-xs">
              <ul class="space-y-1">
                <li
                  v-for="(obj, i) in row.objectives"
                  :key="i"
                  class="flex items-start gap-2 text-xs text-gray-600"
                >
                  <span class="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                  {{ obj.text }}
                </li>
              </ul>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm text-gray-600">{{ row.matrix }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm font-medium text-gray-800 whitespace-nowrap">{{ row.target }}</span>
            </td>
            <td class="px-4 py-4 text-center">
              <span class="text-sm font-medium text-gray-700">{{ row.weighting }}%</span>
            </td>
            <td class="px-4 py-4 pr-6 text-center">
              <span class="text-sm font-medium text-gray-700">{{ row.maxRating }}.0</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: Standalone KPI cards -->
    <div class="md:hidden p-3 space-y-3">
      <div
        v-for="(row, index) in rows"
        :key="row.id"
        class="rounded-xl border border-gray-100 bg-white p-4"
      >
        <!-- Header: S/N + KPI name + Status badge -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-xs text-gray-400 font-medium shrink-0">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="text-sm font-semibold text-gray-900 leading-snug">{{ row.kpi }}</h3>
          </div>
          <StatusBadge :status="row.status" size="sm" />
        </div>

        <!-- Objectives -->
        <div class="mb-3">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Objectives</p>
          <ul class="space-y-1.5">
            <li
              v-for="(obj, i) in row.objectives"
              :key="i"
              class="flex items-start gap-2 text-xs text-gray-600 leading-relaxed"
            >
              <span class="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
              {{ obj.text }}
            </li>
          </ul>
        </div>

        <!-- Matrix / Measures -->
        <div class="mb-3">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Matrix / Measures</p>
          <p class="text-sm text-gray-700">{{ row.matrix }}</p>
        </div>

        <!-- Stats grid: Target, Weighting, Max Rating -->
        <div class="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Target</p>
            <p class="text-sm font-semibold text-gray-900">{{ row.target }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Weighting</p>
            <p class="text-sm font-semibold text-gray-900">{{ row.weighting }}%</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Max Rating</p>
            <p class="text-sm font-semibold text-gray-900">{{ row.maxRating }}.0</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
      <span class="text-xs text-gray-500">{{ rows.length }} KPIs</span>
      <span class="text-xs text-gray-500">
        Total Weighting: <span class="font-semibold text-gray-700">{{ rows.reduce((a, r) => a + r.weighting, 0) }}%</span>
      </span>
    </div>
  </div>
</template>
