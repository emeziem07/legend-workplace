import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Closed Out' | 'Rejected' | 'Ongoing'
export type ScheduleStatus = 'Pending' | 'Approved' | 'Closed Out' | 'Rejected' | 'Awaiting Close Out'

export interface ChatMessage {
  id: string
  sender: string
  role: 'employee' | 'supervisor'
  message: string
  timestamp: string
  unread?: boolean
}

export interface ProgressEntry {
  timestamp: string
  notes: string
  attachments: string[]
}

export interface Task {
  id: string
  kpiId: string
  kpiName: string
  objective: string
  description: string
  startTime: string
  endTime: string
  isMeeting: boolean
  status: TaskStatus
  closeOutNotes?: string
  evidenceFiles?: string[]
  chatMessages: ChatMessage[]
  startDate?: string
  endDate?: string
  isMultiDay?: boolean
  progressHistory?: ProgressEntry[]
  lastProgressUpdate?: string
}

export interface DaySchedule {
  id: string
  date: string
  dateLabel: string
  dateGroup: 'Today' | 'Yesterday' | 'Earlier'
  status: ScheduleStatus
  approvedBy?: string
  tasks: Task[]
  dayClosedOut: boolean
}

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<DaySchedule[]>([
    {
      id: 'sch1',
      date: '2025-07-14',
      dateLabel: 'Monday, Jul 14, 2025',
      dateGroup: 'Today',
      status: 'Pending',
      dayClosedOut: false,
      tasks: [
        {
          id: 't1',
          kpiId: 'k3',
          kpiName: 'Strategic Initiative Delivery',
          objective: 'Prepare Annual Strategy Report',
          description: 'Prepare Annual Report (Day 1 of 4) - Research and outline',
          startTime: '09:00',
          endTime: '12:00',
          startDate: '2025-07-14',
          endDate: '2025-07-17',
          isMeeting: false,
          status: 'Ongoing',
          isMultiDay: true,
          chatMessages: [],
        },
        {
          id: 't2',
          kpiId: 'k4',
          kpiName: 'Team Collaboration',
          objective: 'Lead cross-functional workshop',
          description: 'Leadership Meeting - Q3 strategic planning session',
          startTime: '14:00',
          endTime: '15:30',
          startDate: '2025-07-14',
          endDate: '2025-07-14',
          isMeeting: true,
          status: 'Pending',
          isMultiDay: false,
          chatMessages: [],
        },
        {
          id: 't3',
          kpiId: 'k1',
          kpiName: 'Operational Efficiency',
          objective: 'Achieve 95% SLA compliance',
          description: 'Email Review - Process and respond to pending communications',
          startTime: '16:00',
          endTime: '17:00',
          startDate: '2025-07-14',
          endDate: '2025-07-14',
          isMeeting: false,
          status: 'Pending',
          isMultiDay: false,
          chatMessages: [],
        },
      ],
    },
    {
      id: 'sch2',
      date: '2025-07-15',
      dateLabel: 'Tuesday, Jul 15, 2025',
      dateGroup: 'Today',
      status: 'Pending',
      dayClosedOut: false,
      tasks: [
        {
          id: 't4',
          kpiId: 'k3',
          kpiName: 'Strategic Initiative Delivery',
          objective: 'Prepare Annual Strategy Report',
          description: 'Prepare Annual Report (Day 2 of 4) - Draft sections 1-3',
          startTime: '09:00',
          endTime: '12:00',
          startDate: '2025-07-14',
          endDate: '2025-07-17',
          isMeeting: false,
          status: 'Ongoing',
          isMultiDay: true,
          chatMessages: [],
        },
        {
          id: 't5',
          kpiId: 'k2',
          kpiName: 'Customer Satisfaction',
          objective: 'Resolve escalations within 24 hours',
          description: 'Client Workshop - Product roadmap and feature discussion',
          startTime: '10:00',
          endTime: '12:00',
          startDate: '2025-07-15',
          endDate: '2025-07-15',
          isMeeting: true,
          status: 'Pending',
          isMultiDay: false,
          chatMessages: [],
        },
      ],
    },
    {
      id: 'sch3',
      date: '2025-07-16',
      dateLabel: 'Wednesday, Jul 16, 2025',
      dateGroup: 'Today',
      status: 'Pending',
      dayClosedOut: false,
      tasks: [
        {
          id: 't6',
          kpiId: 'k3',
          kpiName: 'Strategic Initiative Delivery',
          objective: 'Prepare Annual Strategy Report',
          description: 'Prepare Annual Report (Day 3 of 4) - Draft sections 4-6',
          startTime: '09:00',
          endTime: '12:00',
          startDate: '2025-07-14',
          endDate: '2025-07-17',
          isMeeting: false,
          status: 'Ongoing',
          isMultiDay: true,
          chatMessages: [],
        },
        {
          id: 't7',
          kpiId: 'k6',
          kpiName: 'Budget Management',
          objective: 'Maintain departmental spend within 5% of budget',
          description: 'Budget Review - Q3 financial analysis and forecasting',
          startTime: '14:00',
          endTime: '16:00',
          startDate: '2025-07-16',
          endDate: '2025-07-16',
          isMeeting: false,
          status: 'Pending',
          isMultiDay: false,
          chatMessages: [],
        },
      ],
    },
    {
      id: 'sch4',
      date: '2025-07-17',
      dateLabel: 'Thursday, Jul 17, 2025',
      dateGroup: 'Today',
      status: 'Pending',
      dayClosedOut: false,
      tasks: [
        {
          id: 't8',
          kpiId: 'k3',
          kpiName: 'Strategic Initiative Delivery',
          objective: 'Prepare Annual Strategy Report',
          description: 'Prepare Annual Report (Day 4 of 4) - Final review and submission',
          startTime: '09:00',
          endTime: '12:00',
          startDate: '2025-07-14',
          endDate: '2025-07-17',
          isMeeting: false,
          status: 'Ongoing',
          isMultiDay: true,
          chatMessages: [],
        },
        {
          id: 't9',
          kpiId: 'k4',
          kpiName: 'Team Collaboration',
          objective: 'Lead cross-functional workshop',
          description: 'Team Sync - Weekly progress update and blockers discussion',
          startTime: '15:00',
          endTime: '16:00',
          startDate: '2025-07-17',
          endDate: '2025-07-17',
          isMeeting: true,
          status: 'Pending',
          isMultiDay: false,
          chatMessages: [],
        },
      ],
    },
    {
      id: 'sch5',
      date: '2025-07-12',
      dateLabel: 'Saturday, Jul 12, 2025',
      dateGroup: 'Yesterday',
      status: 'Approved',
      approvedBy: 'Sarah Mitchell',
      dayClosedOut: true,
      tasks: [
        {
          id: 't10',
          kpiId: 'k1',
          kpiName: 'Operational Efficiency',
          objective: 'Achieve 95% SLA compliance',
          description: 'Review and update SLA tracking dashboard with week 28 data',
          startTime: '09:00',
          endTime: '11:00',
          startDate: '2025-07-12',
          endDate: '2025-07-12',
          isMeeting: false,
          status: 'Closed Out',
          isMultiDay: false,
          closeOutNotes: 'Dashboard updated. Current SLA compliance at 96.4%. Evidence screenshot attached.',
          chatMessages: [
            { id: 'c3', sender: 'Sarah Mitchell', role: 'supervisor', message: 'Excellent! 96.4% is above target. Keep it up.', timestamp: '11:30 AM', unread: true },
          ],
        },
        {
          id: 't11',
          kpiId: 'k5',
          kpiName: 'Professional Development',
          objective: 'Complete 40 hours of learning per quarter',
          description: 'Complete Module 4 of Strategic Leadership online course',
          startTime: '13:00',
          endTime: '15:00',
          startDate: '2025-07-12',
          endDate: '2025-07-12',
          isMeeting: false,
          status: 'Closed Out',
          isMultiDay: false,
          closeOutNotes: 'Module 4 completed. Certificate of completion uploaded.',
          chatMessages: [],
        },
      ],
    },
    {
      id: 'sch6',
      date: '2025-07-10',
      dateLabel: 'Thursday, Jul 10, 2025',
      dateGroup: 'Earlier',
      status: 'Closed Out',
      dayClosedOut: true,
      tasks: [
        {
          id: 't12',
          kpiId: 'k6',
          kpiName: 'Budget Management',
          objective: 'Submit all expense reports on time',
          description: 'Submit Q2 departmental expense reconciliation report',
          startTime: '09:00',
          endTime: '12:00',
          startDate: '2025-07-10',
          endDate: '2025-07-10',
          isMeeting: false,
          status: 'Closed Out',
          isMultiDay: false,
          closeOutNotes: 'Q2 reconciliation submitted. Total spend was within 3.2% of budget.',
          chatMessages: [],
        },
      ],
    },
  ])

  const stats = computed(() => {
    const all = schedules.value
    const completed = all.filter(s => s.status === 'Closed Out' || s.status === 'Approved').length
    const pending = all.filter(s => s.status === 'Pending').length
    const scores = [87, 92, 95, 89, 94]
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    return {
      averageScore: `${avg}%`,
      total: all.length,
      completed,
      pending,
    }
  })

  const addSchedule = (schedule: Omit<DaySchedule, 'id'>) => {
    const id = `sch${Date.now()}`
    const newSchedule = { ...schedule, id }
    
    // If any task is multi-day, generate schedules for each day
    const tasksToAdd = newSchedule.tasks
    const multiDayTasks = tasksToAdd.filter(t => t.isMultiDay && t.startDate && t.endDate)
    
    if (multiDayTasks.length > 0) {
      // For each multi-day task, create schedule entries for each day
      const allDates = new Set<string>()
      multiDayTasks.forEach(task => {
        const start = new Date(task.startDate!)
        const end = new Date(task.endDate!)
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          allDates.add(d.toISOString().split('T')[0])
        }
      })
      
      // Create a schedule for each date
      allDates.forEach(dateStr => {
        const dateObj = new Date(dateStr + 'T00:00:00')
        const dateLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        
        const dateGroup = dateStr === today ? 'Today' : dateStr === yesterday ? 'Yesterday' : 'Earlier'
        
        const tasksForDate = tasksToAdd.map(task => {
          if (task.isMultiDay && task.startDate && task.endDate) {
            const taskStart = new Date(task.startDate)
            const taskEnd = new Date(task.endDate)
            if (dateObj >= taskStart && dateObj <= taskEnd) {
              return { ...task }
            }
          } else if (!task.isMultiDay && task.startDate === dateStr) {
            return { ...task }
          }
          return null
        }).filter((t): t is Task => t !== null)
        
        if (tasksForDate.length > 0) {
          schedules.value.unshift({
            id: `sch${Date.now()}_${dateStr}`,
            date: dateStr,
            dateLabel,
            dateGroup,
            status: 'Pending',
            dayClosedOut: false,
            tasks: tasksForDate,
          })
        }
      })
    } else {
      // Single-day schedule
      schedules.value.unshift(newSchedule)
    }
  }

  const updateTask = (scheduleId: string, taskId: string, updates: Partial<Task>) => {
    const sch = schedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (task) Object.assign(task, updates)
  }

  const addChatMessage = (scheduleId: string, taskId: string, msg: Omit<ChatMessage, 'id'>) => {
    const sch = schedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (task) task.chatMessages.push({ ...msg, id: `msg${Date.now()}` })
  }

  const getUnreadCount = (scheduleId: string, taskId: string, viewerRole: 'employee' | 'supervisor') => {
    const sch = schedules.value.find(s => s.id === scheduleId)
    if (!sch) return 0
    const task = sch.tasks.find(t => t.id === taskId)
    if (!task) return 0
    return task.chatMessages.filter(m => m.role !== viewerRole && m.unread !== false).length
  }

  const markMessagesRead = (scheduleId: string, taskId: string, viewerRole: 'employee' | 'supervisor') => {
    const sch = schedules.value.find(s => s.id === scheduleId)
    if (!sch) return
    const task = sch.tasks.find(t => t.id === taskId)
    if (!task) return
    task.chatMessages.forEach(m => {
      if (m.role !== viewerRole) m.unread = false
    })
  }

  const closeOutDay = (scheduleId: string) => {
    const sch = schedules.value.find(s => s.id === scheduleId)
    if (sch) {
      sch.dayClosedOut = true
      sch.status = 'Awaiting Close Out'
    }
  }

  return { schedules, stats, addSchedule, updateTask, addChatMessage, closeOutDay, getUnreadCount, markMessagesRead }
})
