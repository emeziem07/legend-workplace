import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ObligationStatus = 'Pending' | 'In Progress' | 'Completed' | 'Breached'

export interface Obligation {
  id: string
  title: string
  description: string
  kpi: string
  kpiIcon: string
  source: string
  dateAssigned: string
  dueDate: string
  status: ObligationStatus
}

export const useObligationsStore = defineStore('obligations', () => {
  const obligations = ref<Obligation[]>([
    {
      id: 'ob1',
      title: 'Submit Q3 Operational Risk Register',
      description: 'Compile and submit the quarterly operational risk register with all department heads\' inputs and mitigations documented.',
      kpi: 'Risk Management',
      kpiIcon: 'shield',
      source: 'Strategy Meeting',
      dateAssigned: 'Jul 1, 2025',
      dueDate: 'Jul 18, 2025',
      status: 'In Progress',
    },
    {
      id: 'ob2',
      title: 'Complete Vendor Due Diligence Forms',
      description: 'Finalize and sign off on due diligence documentation for three new strategic vendors onboarded in June.',
      kpi: 'Procurement',
      kpiIcon: 'file',
      source: 'Procurement Review',
      dateAssigned: 'Jul 2, 2025',
      dueDate: 'Jul 15, 2025',
      status: 'Pending',
    },
    {
      id: 'ob3',
      title: 'Update Department Training Plan',
      description: 'Review and update the annual training plan to include new compliance modules and schedule sessions for all team members.',
      kpi: 'Professional Development',
      kpiIcon: 'book',
      source: 'HR Strategy Meeting',
      dateAssigned: 'Jul 3, 2025',
      dueDate: 'Jul 25, 2025',
      status: 'Pending',
    },
    {
      id: 'ob4',
      title: 'Prepare Investor Presentation Slides',
      description: 'Create the Q3 performance and outlook slides for the upcoming board investor presentation.',
      kpi: 'Strategic Reporting',
      kpiIcon: 'chart',
      source: 'Board Prep Meeting',
      dateAssigned: 'Jun 28, 2025',
      dueDate: 'Jul 10, 2025',
      status: 'Completed',
    },
    {
      id: 'ob5',
      title: 'Review Team Performance Appraisals',
      description: 'Complete mid-year performance reviews for all 6 direct reports and submit to HR.',
      kpi: 'Team Management',
      kpiIcon: 'users',
      source: 'HR Calendar',
      dateAssigned: 'Jul 5, 2025',
      dueDate: 'Jul 31, 2025',
      status: 'In Progress',
    },
    {
      id: 'ob6',
      title: 'Submit Monthly Compliance Report',
      description: 'Compile and submit the June compliance monitoring report to the compliance team.',
      kpi: 'Compliance',
      kpiIcon: 'check',
      source: 'Compliance Review',
      dateAssigned: 'Jun 25, 2025',
      dueDate: 'Jul 5, 2025',
      status: 'Completed',
    },
  ])

  const stats = computed(() => {
    const all = obligations.value
    return {
      total: all.length,
      completed: all.filter(o => o.status === 'Completed').length,
      inProgress: all.filter(o => o.status === 'In Progress').length,
      pending: all.filter(o => o.status === 'Pending').length,
    }
  })

  const updateStatus = (id: string, status: ObligationStatus) => {
    const ob = obligations.value.find(o => o.id === id)
    if (ob) ob.status = status
  }

  return { obligations, stats, updateStatus }
})
