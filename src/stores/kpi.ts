import { defineStore } from 'pinia'
import { ref } from 'vue'

export type KpiStatus = 'On Track' | 'Attention' | 'Exceeding'

export interface KpiObjective {
  text: string
}

export interface KpiRow {
  id: string
  kpi: string
  objectives: KpiObjective[]
  matrix: string
  target: string
  weighting: number
  maxRating: number
  actual: number
  status: KpiStatus
}

export const useKpiStore = defineStore('kpi', () => {
  const performanceCards = ref([
    { label: 'Overall Average', value: '87.4%', delta: '+2.3%', deltaPositive: true, icon: 'chart-bar', subtitle: 'Q3 2025' },
    { label: 'Daily Schedule', value: '94.1%', delta: '+1.7%', deltaPositive: true, icon: 'calendar', subtitle: 'Completion rate' },
    { label: 'Close-out Reports', value: '78.6%', delta: '-3.2%', deltaPositive: false, icon: 'document', subtitle: 'Pending: 4' },
    { label: 'Average KPI', value: '91.2%', delta: '+4.5%', deltaPositive: true, icon: 'trending-up', subtitle: 'vs last quarter' },
  ])

  const kpiRows = ref<KpiRow[]>([
    {
      id: 'k1',
      kpi: 'Operational Efficiency',
      objectives: [
        { text: 'Reduce process cycle time by 15%' },
        { text: 'Achieve 95% SLA compliance' },
        { text: 'Eliminate rework incidents' },
      ],
      matrix: 'Cycle Time / SLA Rate',
      target: '95%',
      weighting: 25,
      maxRating: 5,
      actual: 4.4,
      status: 'On Track',
    },
    {
      id: 'k2',
      kpi: 'Customer Satisfaction',
      objectives: [
        { text: 'Maintain NPS above 70' },
        { text: 'Resolve escalations within 24 hours' },
      ],
      matrix: 'NPS Score / Resolution Time',
      target: 'NPS 70+',
      weighting: 20,
      maxRating: 5,
      actual: 4.8,
      status: 'Exceeding',
    },
    {
      id: 'k3',
      kpi: 'Strategic Initiative Delivery',
      objectives: [
        { text: 'Deliver Q3 roadmap milestones on time' },
        { text: 'Submit weekly progress reports' },
      ],
      matrix: 'Milestone % / Report Compliance',
      target: '90%',
      weighting: 20,
      maxRating: 5,
      actual: 3.5,
      status: 'Attention',
    },
    {
      id: 'k4',
      kpi: 'Team Collaboration & Communication',
      objectives: [
        { text: 'Lead 2 cross-functional workshops per quarter' },
        { text: 'Achieve peer collaboration score of 4+' },
      ],
      matrix: 'Workshops Led / Peer Score',
      target: '4.0 / 5.0',
      weighting: 15,
      maxRating: 5,
      actual: 4.1,
      status: 'On Track',
    },
    {
      id: 'k5',
      kpi: 'Professional Development',
      objectives: [
        { text: 'Complete 40 hours of learning per quarter' },
        { text: 'Obtain one professional certification' },
      ],
      matrix: 'Learning Hours / Certifications',
      target: '40 hrs',
      weighting: 10,
      maxRating: 5,
      actual: 5.0,
      status: 'Exceeding',
    },
    {
      id: 'k6',
      kpi: 'Budget Management',
      objectives: [
        { text: 'Maintain departmental spend within 5% of budget' },
        { text: 'Submit all expense reports on time' },
      ],
      matrix: 'Budget Variance / Report Timeliness',
      target: '±5%',
      weighting: 10,
      maxRating: 5,
      actual: 3.2,
      status: 'Attention',
    },
  ])

  return { performanceCards, kpiRows }
})
