<script setup lang="ts">
import { ref, computed } from 'vue'
import KpiStatCard from '../components/common/KpiStatCard.vue'

const viewMode = ref<'quarter' | 'month'>('quarter')

// Transformation Portfolio
const transformationProgrammes = [
  {
    id: 1,
    name: 'Digital Acceleration',
    description: 'Cloud migration and digital infrastructure',
    progress: 68,
    budget: 62,
    roi: 24,
    timeline: 'On Track',
  },
  {
    id: 2,
    name: 'Customer 360',
    description: 'Unified customer data platform',
    progress: 42,
    budget: 45,
    roi: 32,
    timeline: 'At Risk',
  },
  {
    id: 3,
    name: 'AI Integration',
    description: 'Enterprise AI capabilities',
    progress: 25,
    budget: 28,
    roi: 56,
    timeline: 'Planning',
  },
]

// Innovation Pipeline
const innovationInitiatives = [
  {
    id: 1,
    title: 'AI Powered Analytics',
    description: 'Predictive analytics using machine learning',
    impact: 9,
    feasibility: 7,
    stage: 'Development',
    potentialValue: 45,
    dueDate: '2024-08-15',
  },
  {
    id: 2,
    title: 'Blockchain Integration',
    description: 'Secure transaction processing',
    impact: 8,
    feasibility: 5,
    stage: 'Planning',
    potentialValue: 68,
    dueDate: '2024-10-30',
  },
  {
    id: 3,
    title: 'IoT Platform',
    description: 'Connected device management',
    impact: 7,
    feasibility: 8,
    stage: 'Ideation',
    potentialValue: 32,
    dueDate: '2024-09-01',
  },
]

// Strategic Risks
const strategicRisks = [
  {
    id: 1,
    name: 'Market Competition',
    description: 'New entrants in key market segments',
    probability: 70,
    impact: 85,
    mitigation: 'Accelerate product roadmap and increase marketing spend',
    priority: 'High',
  },
  {
    id: 2,
    name: 'Talent Retention',
    description: 'Key talent attrition risk',
    probability: 60,
    impact: 70,
    mitigation: 'Implement retention programmes and career development paths',
    priority: 'Medium',
  },
  {
    id: 3,
    name: 'Regulatory Changes',
    description: 'Upcoming data privacy regulations',
    probability: 80,
    impact: 75,
    mitigation: 'Proactive compliance assessment and legal review',
    priority: 'High',
  },
]

// Initiative Health Scores
const initiativeHealthScores = [
  {
    id: 1,
    name: 'Digital Transformation',
    owner: 'Sarah Chen',
    progress: 65,
    budgetHealth: 'On Track',
    timelineHealth: 'On Track',
    resourceHealth: 78,
    overallScore: 72,
  },
  {
    id: 2,
    name: 'Market Expansion',
    owner: 'Mike Ross',
    progress: 45,
    budgetHealth: 'At Risk',
    timelineHealth: 'At Risk',
    resourceHealth: 92,
    overallScore: 68,
  },
  {
    id: 3,
    name: 'Product Innovation',
    owner: 'Emma Watson',
    progress: 30,
    budgetHealth: 'On Track',
    timelineHealth: 'On Track',
    resourceHealth: 65,
    overallScore: 85,
  },
  {
    id: 4,
    name: 'Customer Experience',
    owner: 'John Doe',
    progress: 25,
    budgetHealth: 'At Risk',
    timelineHealth: 'At Risk',
    resourceHealth: 55,
    overallScore: 70,
  },
]

// OKRs
const okrs = [
  {
    id: 1,
    objective: 'Market Leadership',
    status: 'On Track',
    goal: 'Achieve #1 market position in target segments',
    kpis: [
      { name: 'Market Share Growth', current: 18, target: 25, unit: '%' },
      { name: 'Revenue Growth', current: 32, target: 50, unit: 'M' },
      { name: 'Customer Acquisition', current: 850, target: 1500, unit: '' },
    ],
    achievement: 65,
  },
  {
    id: 2,
    objective: 'Innovation Excellence',
    status: 'At Risk',
    goal: 'Launch breakthrough products and features',
    kpis: [
      { name: 'New Product Launches', current: 2, target: 5, unit: 'of' },
      { name: 'Patent Filings', current: 4, target: 10, unit: 'of' },
      { name: 'R&D Investment', current: 8.5, target: 15, unit: 'M of' },
    ],
    achievement: 45,
  },
  {
    id: 3,
    objective: 'Operational Efficiency',
    status: 'On Track',
    goal: 'Optimize processes and reduce operational costs',
    kpis: [
      { name: 'Cost Reduction', current: 12, target: 15, unit: '%' },
      { name: 'Process Automation', current: 45, target: 60, unit: '%' },
      { name: 'Time to Market', current: 45, target: 30, unit: 'days' },
    ],
    achievement: 78,
  },
]

const selectedOkrFilter = ref<'all' | 'on-track' | 'at-risk'>('all')

const filteredOkrs = computed(() => {
  if (selectedOkrFilter.value === 'all') return okrs
  if (selectedOkrFilter.value === 'on-track') return okrs.filter(o => o.status === 'On Track')
  return okrs.filter(o => o.status === 'At Risk')
})

// KPI Trends Data
const kpiTrendsData = [
  { month: 'January', strategyHealth: 72, initiativeSuccess: 68, innovationValue: 45 },
  { month: 'February', strategyHealth: 74, initiativeSuccess: 70, innovationValue: 52 },
  { month: 'March', strategyHealth: 76, initiativeSuccess: 72, innovationValue: 58 },
  { month: 'April', strategyHealth: 75, initiativeSuccess: 71, innovationValue: 62 },
  { month: 'May', strategyHealth: 77, initiativeSuccess: 73, innovationValue: 68 },
  { month: 'June', strategyHealth: 78, initiativeSuccess: 75, innovationValue: 72 },
]

const getStatusColor = (status: string) => {
  if (status === 'On Track') return 'badge-green'
  if (status === 'At Risk') return 'badge-amber'
  return 'badge-gray'
}

const getPriorityColor = (priority: string) => {
  if (priority === 'High') return 'badge-red'
  if (priority === 'Medium') return 'badge-amber'
  return 'badge-green'
}

const getHealthColor = (health: string) => {
  if (health === 'On Track') return 'text-green-600'
  if (health === 'At Risk') return 'text-amber-600'
  return 'text-gray-600'
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-sm">
          <span class="text-gray-900 font-medium">Strategy Insights</span>
        </nav>
      </div>
    </div>

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <h1 class="text-2xl font-semibold text-gray-900">Strategy Insights</h1>
        <p class="text-sm text-gray-500 mt-1">Executive strategy dashboard for monitoring organizational performance, strategic initiatives, innovation and enterprise risks.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      <!-- Executive KPI Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiStatCard
          label="Strategic Initiatives"
          value="24"
          icon="chart-bar"
          subtitle="18 Active"
        />
        <KpiStatCard
          label="Strategy Health"
          value="78%"
          icon="trending-up"
          subtitle="+5% vs last quarter"
          delta="+5%"
          :delta-positive="true"
        />
        <KpiStatCard
          label="Innovation Pipeline"
          value="42"
          icon="star"
          subtitle="12 approved for Q3"
        />
        <KpiStatCard
          label="Strategic Risks"
          value="8"
          icon="document"
          subtitle="3 Critical"
        />
      </div>

      <!-- Strategy Roadmap -->
      <div class="card mb-8">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-900">Strategy Roadmap</h2>
          <div class="flex items-center gap-2">
            <button
              @click="viewMode = 'quarter'"
              :class="['btn-secondary text-xs px-3 py-1.5', viewMode === 'quarter' ? 'bg-primary text-white border-primary' : '']"
            >
              Quarter View
            </button>
            <button
              @click="viewMode = 'month'"
              :class="['btn-secondary text-xs px-3 py-1.5', viewMode === 'month' ? 'bg-primary text-white border-primary' : '']"
            >
              Month View
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Q2 2024 -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Q2 2024 - Foundation</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Digital Transformation</span>
                    <span class="text-xs font-semibold text-gray-900">65%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500" style="width: 65%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Market Expansion</span>
                    <span class="text-xs font-semibold text-gray-900">45%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500" style="width: 45%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Q3 2024 -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Q3 2024 - Growth</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Product Innovation</span>
                    <span class="text-xs font-semibold text-gray-900">30%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500" style="width: 30%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Customer Experience</span>
                    <span class="text-xs font-semibold text-gray-900">25%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500" style="width: 25%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Q4 2024 -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Q4 2024 - Scale</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">International Launch</span>
                    <span class="text-xs font-semibold text-gray-900">15%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500" style="width: 15%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Partnership Program</span>
                    <span class="text-xs font-semibold text-gray-900">20%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500" style="width: 20%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Q1 2025 -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Q1 2025 - Optimize</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Operational Excellence</span>
                    <span class="text-xs font-semibold text-gray-900">10%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500" style="width: 10%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-700">Sustainability</span>
                    <span class="text-xs font-semibold text-gray-900">5%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500" style="width: 5%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Transformation Portfolio -->
        <div class="space-y-4">
          <h2 class="text-base font-semibold text-gray-900">Transformation Portfolio</h2>
          <div class="space-y-4">
            <div v-for="prog in transformationProgrammes" :key="prog.id" class="card p-5">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">{{ prog.name }}</h3>
                  <p class="text-xs text-gray-500 mt-0.5">{{ prog.description }}</p>
                </div>
                <span :class="['badge', prog.timeline === 'On Track' ? 'badge-green' : prog.timeline === 'At Risk' ? 'badge-amber' : 'badge-gray']">
                  {{ prog.timeline }}
                </span>
              </div>

              <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-600">Progress</span>
                  <span class="text-xs font-semibold text-gray-900">{{ prog.progress }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: prog.progress + '%' }"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p class="text-gray-500 mb-0.5">Budget</p>
                  <p class="font-semibold text-gray-900">{{ prog.budget }}%</p>
                </div>
                <div>
                  <p class="text-gray-500 mb-0.5">ROI</p>
                  <p class="font-semibold text-green-600">+{{ prog.roi }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Innovation Pipeline -->
        <div class="space-y-4">
          <h2 class="text-base font-semibold text-gray-900">Innovation Pipeline</h2>
          <div class="space-y-4">
            <div v-for="init in innovationInitiatives" :key="init.id" class="card p-5">
              <div class="mb-3">
                <h3 class="text-sm font-semibold text-gray-900">{{ init.title }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ init.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <p class="text-gray-500 mb-0.5">Impact</p>
                  <p class="font-semibold text-gray-900">{{ init.impact }}/10</p>
                </div>
                <div>
                  <p class="text-gray-500 mb-0.5">Feasibility</p>
                  <p class="font-semibold text-gray-900">{{ init.feasibility }}/10</p>
                </div>
                <div>
                  <p class="text-gray-500 mb-0.5">Potential Value</p>
                  <p class="font-semibold text-green-600">+{{ init.potentialValue }}%</p>
                </div>
                <div>
                  <p class="text-gray-500 mb-0.5">Due</p>
                  <p class="font-semibold text-gray-900">{{ init.dueDate }}</p>
                </div>
              </div>

              <span class="badge badge-blue text-xs">{{ init.stage }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Strategic Risks & Mitigations -->
        <div class="space-y-4">
          <h2 class="text-base font-semibold text-gray-900">Strategic Risks & Mitigations</h2>
          <div class="space-y-4">
            <div v-for="risk in strategicRisks" :key="risk.id" class="card p-5">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">{{ risk.name }}</h3>
                  <p class="text-xs text-gray-500 mt-0.5">{{ risk.description }}</p>
                </div>
                <span :class="['badge', getPriorityColor(risk.priority)]">{{ risk.priority }}</span>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <p class="text-gray-500 mb-0.5">Probability</p>
                  <p class="font-semibold text-gray-900">{{ risk.probability }}%</p>
                </div>
                <div>
                  <p class="text-gray-500 mb-0.5">Impact</p>
                  <p class="font-semibold text-gray-900">{{ risk.impact }}%</p>
                </div>
              </div>

              <div>
                <p class="text-xs text-gray-600 font-medium">Mitigation Plan</p>
                <p class="text-xs text-gray-700 mt-1">{{ risk.mitigation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Initiative Health Scores -->
        <div class="space-y-4">
          <h2 class="text-base font-semibold text-gray-900">Initiative Health Scores</h2>
          <div class="card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-gray-100 bg-gray-50">
                    <th class="text-left px-4 py-3 font-semibold text-gray-600">Initiative</th>
                    <th class="text-left px-4 py-3 font-semibold text-gray-600">Owner</th>
                    <th class="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="init in initiativeHealthScores" :key="init.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3">
                      <div>
                        <p class="font-medium text-gray-900">{{ init.name }}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <span :class="['text-xs font-medium', getHealthColor(init.budgetHealth)]">{{ init.budgetHealth }}</span>
                          <span class="text-gray-300">·</span>
                          <span :class="['text-xs font-medium', getHealthColor(init.timelineHealth)]">{{ init.timelineHealth }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-600">{{ init.owner }}</td>
                    <td class="px-4 py-3 text-center">
                      <span :class="['font-semibold', getScoreColor(init.overallScore)]">{{ init.overallScore }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- OKR Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900">Strategic Objective Tracking (OKRs)</h2>
          <div class="flex items-center gap-2">
            <button
              @click="selectedOkrFilter = 'all'"
              :class="['btn-secondary text-xs px-3 py-1.5', selectedOkrFilter === 'all' ? 'bg-primary text-white border-primary' : '']"
            >
              All
            </button>
            <button
              @click="selectedOkrFilter = 'on-track'"
              :class="['btn-secondary text-xs px-3 py-1.5', selectedOkrFilter === 'on-track' ? 'bg-primary text-white border-primary' : '']"
            >
              On Track
            </button>
            <button
              @click="selectedOkrFilter = 'at-risk'"
              :class="['btn-secondary text-xs px-3 py-1.5', selectedOkrFilter === 'at-risk' ? 'bg-primary text-white border-primary' : '']"
            >
              At Risk
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div v-for="okr in filteredOkrs" :key="okr.id" class="card p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ okr.objective }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ okr.goal }}</p>
              </div>
              <span :class="['badge', getStatusColor(okr.status)]">{{ okr.status }}</span>
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-gray-600 font-medium">Overall Achievement</span>
                <span class="text-sm font-semibold text-gray-900">{{ okr.achievement }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-primary" :style="{ width: okr.achievement + '%' }"></div>
              </div>
            </div>

            <div class="space-y-3">
              <div v-for="kpi in okr.kpis" :key="kpi.name" class="text-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-gray-600">{{ kpi.name }}</span>
                  <span class="font-semibold text-gray-900">{{ kpi.current }} {{ kpi.unit }} {{ kpi.target }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Trends -->
      <div class="card">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">Strategic KPI Trends</h2>
        </div>

        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                  <th class="text-center px-4 py-3 font-semibold text-gray-600">Strategy Health Score</th>
                  <th class="text-center px-4 py-3 font-semibold text-gray-600">Initiative Success Rate</th>
                  <th class="text-center px-4 py-3 font-semibold text-gray-600">Innovation Pipeline Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="data in kpiTrendsData" :key="data.month" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ data.month }}</td>
                  <td class="px-4 py-3 text-center text-gray-900 font-semibold">{{ data.strategyHealth }}%</td>
                  <td class="px-4 py-3 text-center text-gray-900 font-semibold">{{ data.initiativeSuccess }}%</td>
                  <td class="px-4 py-3 text-center text-gray-900 font-semibold">${{ data.innovationValue }}M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
