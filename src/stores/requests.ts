import { defineStore } from 'pinia'
import { ref } from 'vue'

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review'

export interface ApprovalStep {
  name: string
  role: string
  status: 'Approved' | 'Pending' | 'Rejected' | 'Awaiting'
  date?: string
  comment?: string
}

export interface RequestItem {
  id: string
  type: 'Leave' | 'Trip' | 'AIE'
  title: string
  date: string
  status: RequestStatus
  details: Record<string, string>
  documents: { name: string; size: string }[]
  timeline: ApprovalStep[]
  supervisorComment?: string
}

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref<RequestItem[]>([
    {
      id: 'req1',
      type: 'Leave',
      title: 'Annual Leave Request',
      date: 'Jul 10, 2025',
      status: 'Under Review',
      details: {
        'Leave Type': 'Annual Leave',
        'Duration': '5 days',
        'Start Date': 'Jul 21, 2025',
        'End Date': 'Jul 25, 2025',
        'Reason': 'Family vacation planned for summer holiday.',
      },
      documents: [{ name: 'leave_form_signed.pdf', size: '128 KB' }],
      timeline: [
        { name: 'Alex Johnson', role: 'Employee', status: 'Approved', date: 'Jul 10, 2025' },
        { name: 'Sarah Mitchell', role: 'Line Manager', status: 'Approved', date: 'Jul 11, 2025', comment: 'Approved. Please ensure handover notes are completed.' },
        { name: 'HR Department', role: 'HR Review', status: 'Pending', date: '' },
      ],
      supervisorComment: 'Approved. Please ensure handover notes are completed before departure.',
    },
    {
      id: 'req2',
      type: 'Trip',
      title: 'Business Trip – Lagos Conference',
      date: 'Jul 5, 2025',
      status: 'Approved',
      details: {
        'Destination': 'Lagos, Nigeria',
        'Purpose': 'Annual Technology & Innovation Summit',
        'Travel Dates': 'Jul 14 – Jul 16, 2025',
        'Budget': '₦450,000',
        'Accommodation': 'Eko Hotel & Suites',
        'Transport': 'Company vehicle + flight',
      },
      documents: [
        { name: 'conference_invite.pdf', size: '345 KB' },
        { name: 'hotel_booking.pdf', size: '210 KB' },
      ],
      timeline: [
        { name: 'Alex Johnson', role: 'Employee', status: 'Approved', date: 'Jul 5, 2025' },
        { name: 'Sarah Mitchell', role: 'Line Manager', status: 'Approved', date: 'Jul 6, 2025', comment: 'Approved. Safe travels.' },
        { name: 'Finance', role: 'Budget Approval', status: 'Approved', date: 'Jul 7, 2025' },
      ],
    },
    {
      id: 'req3',
      type: 'AIE',
      title: 'Software License Procurement',
      date: 'Jun 28, 2025',
      status: 'Pending',
      details: {
        'Title': 'Annual Figma Professional License',
        'Category': 'Software & Tools',
        'Amount': '₦185,000',
        'Justification': 'Required for UI/UX design work and cross-team collaboration on product design.',
        'Vendor': 'Figma Inc.',
      },
      documents: [{ name: 'vendor_quote.pdf', size: '95 KB' }],
      timeline: [
        { name: 'Alex Johnson', role: 'Employee', status: 'Approved', date: 'Jun 28, 2025' },
        { name: 'Sarah Mitchell', role: 'Line Manager', status: 'Awaiting', date: '' },
      ],
    },
  ])

  const addRequest = (req: Omit<RequestItem, 'id'>) => {
    const id = `req${Date.now()}`
    requests.value.push({ ...req, id })
  }

  return { requests, addRequest }
})
