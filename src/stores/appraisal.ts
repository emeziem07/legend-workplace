import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppraisalStore = defineStore('appraisal', () => {
  const cycles = ref([
    {
      id: 'ap1',
      period: 'Q2 2025 (Apr – Jun)',
      status: 'Completed',
      overallScore: 88.5,
      rating: 'Exceeds Expectations',
      reviewedBy: 'Sarah Mitchell',
      completedDate: 'Jul 3, 2025',
      objectives: [
        { name: 'Operational Efficiency', score: 90, comment: 'Demonstrated strong process improvement initiatives.' },
        { name: 'Customer Satisfaction', score: 92, comment: 'NPS maintained above target throughout the quarter.' },
        { name: 'Strategic Delivery', score: 82, comment: 'Slight delays in milestone 3 but recovered well.' },
        { name: 'Collaboration', score: 88, comment: 'Active participation in cross-functional projects.' },
        { name: 'Professional Development', score: 95, comment: 'Completed 3 certifications this quarter.' },
      ],
      supervisorComments: 'Alex has shown consistent performance this quarter with particular strength in customer satisfaction and professional development. Focus should be placed on strategic delivery timelines in Q3.',
    },
    {
      id: 'ap2',
      period: 'Q1 2025 (Jan – Mar)',
      status: 'Completed',
      overallScore: 84.2,
      rating: 'Meets Expectations',
      reviewedBy: 'Sarah Mitchell',
      completedDate: 'Apr 5, 2025',
      objectives: [
        { name: 'Operational Efficiency', score: 85, comment: 'Good progress on SLA metrics.' },
        { name: 'Customer Satisfaction', score: 87, comment: 'NPS at 68, slightly below 70 target.' },
        { name: 'Strategic Delivery', score: 78, comment: 'Two milestones delayed due to resourcing.' },
        { name: 'Collaboration', score: 86, comment: 'Good team player, needs to lead more.' },
        { name: 'Professional Development', score: 85, comment: 'One certification completed.' },
      ],
      supervisorComments: 'A solid quarter overall. Alex should focus on increasing strategic delivery performance and taking more leadership roles in cross-functional work.',
    },
    {
      id: 'ap3',
      period: 'Q3 2025 (Jul – Sep)',
      status: 'In Progress',
      overallScore: null,
      rating: null,
      reviewedBy: null,
      completedDate: null,
      objectives: [
        { name: 'Operational Efficiency', score: null, comment: '' },
        { name: 'Customer Satisfaction', score: null, comment: '' },
        { name: 'Strategic Delivery', score: null, comment: '' },
        { name: 'Collaboration', score: null, comment: '' },
        { name: 'Professional Development', score: null, comment: '' },
      ],
      supervisorComments: '',
    },
  ])

  return { cycles }
})
