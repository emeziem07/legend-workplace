import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ApprovalMessage {
  id: string
  sender: string
  role: 'supervisor' | 'employee'
  message: string
  timestamp: string
  unread?: boolean
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const useApprovalsStore = defineStore('approvals', () => {

  const pendingSchedules = ref([
    {
      id: 'pa1',
      employeeName: 'Marcus Williams',
      employeeRole: 'Business Analyst',
      date: 'Jul 13, 2025',
      status: 'Pending Approval',
      tasks: [
        {
          id: 'pt1',
          kpiName: 'Data Analytics',
          objective: 'Build Q3 reporting dashboard',
          description: 'Complete the first iteration of the analytics dashboard for stakeholder review',
          startTime: '09:00',
          endTime: '12:00',
          isMeeting: false,
          approved: null as boolean | null,
          comment: '',
          conversation: [
            { id: 'm1', sender: 'Marcus Williams', role: 'employee' as const, message: 'Started working on the dashboard wireframes. Will share first draft by noon.', timestamp: '09:12 AM', unread: true },
          ] as ApprovalMessage[],
        },
        {
          id: 'pt2',
          kpiName: 'Team Collaboration',
          objective: 'Cross-functional sync',
          description: 'Weekly sync with product, engineering, and design teams',
          startTime: '14:00',
          endTime: '15:00',
          isMeeting: true,
          approved: null as boolean | null,
          comment: '',
          conversation: [] as ApprovalMessage[],
        },
      ],
      scheduleApproved: null as boolean | null,
    },
    {
      id: 'pa2',
      employeeName: 'Priya Sharma',
      employeeRole: 'Operations Manager',
      date: 'Jul 13, 2025',
      status: 'Pending Approval',
      tasks: [
        {
          id: 'pt3',
          kpiName: 'Process Improvement',
          objective: 'Streamline vendor onboarding',
          description: 'Map current vendor onboarding process and identify quick wins',
          startTime: '08:30',
          endTime: '11:30',
          isMeeting: false,
          approved: null as boolean | null,
          comment: '',
          conversation: [] as ApprovalMessage[],
        },
      ],
      scheduleApproved: null as boolean | null,
    },
  ])

  const closeOutApprovals = ref([
    {
      id: 'ca1',
      employeeName: 'Marcus Williams',
      employeeRole: 'Business Analyst',
      date: 'Jul 12, 2025',
      tasks: [
        {
          id: 'ct1',
          kpiName: 'Data Analytics',
          objective: 'Build Q3 reporting dashboard',
          description: 'Completed Phase 1 of the dashboard with 5 core metrics visualized',
          closeOutNotes: 'Dashboard Phase 1 complete. Shared Figma prototype with stakeholders. All 5 core metrics integrated. Awaiting feedback before Phase 2.',
          evidenceFiles: ['dashboard_v1_screenshot.png', 'stakeholder_feedback_form.pdf'],
          approved: null as boolean | null,
          comment: '',
          conversation: [
            { id: 'cm1', sender: 'Marcus Williams', role: 'employee' as const, message: 'Uploaded the dashboard screenshots and stakeholder feedback form. Kindly review.', timestamp: '04:15 PM', unread: true },
          ] as ApprovalMessage[],
        },
      ],
      dayApproved: null as boolean | null,
    },
  ])

  const otherRequests = ref({
    leave: [
      {
        id: 'or1',
        employeeName: 'Priya Sharma',
        employeeRole: 'Operations Manager',
        type: 'Leave' as const,
        title: 'Sick Leave Request',
        date: 'Jul 12, 2025',
        status: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
        details: {
          'Leave Type': 'Sick Leave',
          'Duration': '2 days',
          'Start Date': 'Jul 14, 2025',
          'End Date': 'Jul 15, 2025',
          'Reason': 'Medical appointment and recovery.',
        },
      },
    ],
    trip: [
      {
        id: 'or2',
        employeeName: 'James Okafor',
        employeeRole: 'Sales Executive',
        type: 'Trip' as const,
        title: 'Client Visit – Abuja',
        date: 'Jul 11, 2025',
        status: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
        details: {
          'Destination': 'Abuja, Nigeria',
          'Purpose': 'Q3 account review with Enterprise Client',
          'Travel Dates': 'Jul 17 – Jul 18, 2025',
          'Budget': '₦280,000',
          'Accommodation': 'Transcorp Hilton',
          'Transport': 'Flight',
        },
      },
    ],
    aie: [
      {
        id: 'or3',
        employeeName: 'Marcus Williams',
        employeeRole: 'Business Analyst',
        type: 'AIE' as const,
        title: 'Analytics Software License',
        date: 'Jul 9, 2025',
        status: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
        details: {
          'Title': 'Tableau Desktop Annual License',
          'Category': 'Software & Tools',
          'Amount': '₦320,000',
          'Justification': 'Required for advanced data visualization and executive reporting.',
          'Vendor': 'Tableau Software LLC',
        },
      },
    ],
  })

  const addScheduleMessage = (scheduleId: string, taskId: string, message: string) => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (task) {
      task.conversation.push({
        id: `msg${Date.now()}`,
        sender: 'Sarah Mitchell',
        role: 'supervisor',
        message,
        timestamp: now(),
        unread: true,
      })
    }
  }

  const getScheduleUnreadCount = (scheduleId: string, taskId: string, viewerRole: 'employee' | 'supervisor') => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (!sch) return 0
    const task = sch.tasks.find(t => t.id === taskId)
    if (!task) return 0
    return task.conversation.filter(m => m.role !== viewerRole && m.unread !== false).length
  }

  const markScheduleMessagesRead = (scheduleId: string, taskId: string, viewerRole: 'employee' | 'supervisor') => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (!task) return
    task.conversation.forEach(m => { if (m.role !== viewerRole) m.unread = false })
  }

  const setScheduleComment = (scheduleId: string, taskId: string, comment: string) => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (task) task.comment = comment
  }

  const setCloseOutComment = (caId: string, taskId: string, comment: string) => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (!ca) return
    const task = ca.tasks.find(t => t.id === taskId)
    if (task) task.comment = comment
  }

  const approveScheduleTask = (scheduleId: string, taskId: string) => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (task) task.approved = true
  }

  const rejectScheduleTask = (scheduleId: string, taskId: string) => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (task) task.approved = false
  }

  const approveSchedule = (scheduleId: string) => {
    const sch = pendingSchedules.value.find(s => s.id === scheduleId)
    if (sch) sch.scheduleApproved = true
  }

  const addCloseOutMessage = (caId: string, taskId: string, message: string) => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (!ca) return
    const task = ca.tasks.find(t => t.id === taskId)
    if (task) {
      task.conversation.push({
        id: `msg${Date.now()}`,
        sender: 'Sarah Mitchell',
        role: 'supervisor',
        message,
        timestamp: now(),
        unread: true,
      })
    }
  }

  const getCloseOutUnreadCount = (caId: string, taskId: string, viewerRole: 'employee' | 'supervisor') => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (!ca) return 0
    const task = ca.tasks.find(t => t.id === taskId)
    if (!task) return 0
    return task.conversation.filter(m => m.role !== viewerRole && m.unread !== false).length
  }

  const markCloseOutMessagesRead = (caId: string, taskId: string, viewerRole: 'employee' | 'supervisor') => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (!ca) return
    const task = ca.tasks.find(t => t.id === taskId)
    if (!task) return
    task.conversation.forEach(m => { if (m.role !== viewerRole) m.unread = false })
  }

  const approveCloseOutTask = (caId: string, taskId: string) => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (!ca) return
    const task = ca.tasks.find(t => t.id === taskId)
    if (task) task.approved = true
  }

  const rejectCloseOutTask = (caId: string, taskId: string) => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (!ca) return
    const task = ca.tasks.find(t => t.id === taskId)
    if (task) task.approved = false
  }

  const approveDay = (caId: string) => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (ca) ca.dayApproved = true
  }

  const rejectDay = (caId: string) => {
    const ca = closeOutApprovals.value.find(c => c.id === caId)
    if (ca) ca.dayApproved = false
  }

  const approveOtherRequest = (id: string, tab: 'leave' | 'trip' | 'aie') => {
    const req = otherRequests.value[tab].find((r) => r.id === id)
    if (req) req.status = 'Approved'
  }

  const rejectOtherRequest = (id: string, tab: 'leave' | 'trip' | 'aie') => {
    const req = otherRequests.value[tab].find((r) => r.id === id)
    if (req) req.status = 'Rejected'
  }

  return {
    pendingSchedules, closeOutApprovals, otherRequests,
    addScheduleMessage, approveScheduleTask, rejectScheduleTask, approveSchedule,
    addCloseOutMessage, approveCloseOutTask, rejectCloseOutTask, approveDay, rejectDay,
    approveOtherRequest, rejectOtherRequest,
    getScheduleUnreadCount, markScheduleMessagesRead,
    getCloseOutUnreadCount, markCloseOutMessagesRead,
    setScheduleComment, setCloseOutComment,
  }
})
