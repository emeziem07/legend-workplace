import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ConvCategory = 'dm' | 'department' | 'group'

export interface CollabMessage {
  id: string
  senderId: string
  senderName: string
  body: string
  timestamp: string
  dateLabel: string
  isMe: boolean
  fileAttachment?: { name: string; size: string; type: 'pdf' | 'word' | 'excel' | 'image' | 'other' }
  replyTo?: { senderName: string; body: string }
  readBy?: string[]
}

export interface Participant {
  id: string
  name: string
  role: string
  department: string
}

export interface Conversation {
  id: string
  category: ConvCategory
  name: string
  department?: string
  groupDescription?: string
  participants: Participant[]
  messages: CollabMessage[]
  unreadCount: number
  lastMessage: string
  lastTimestamp: string
  isPermanent?: boolean
  createdBy?: string
  linkedContext?: { type: 'schedule' | 'request' | 'task'; label: string; id: string }
}

const ts = (h: number, m: number) => {
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
}

export const useCollaborationStore = defineStore('collaboration', () => {
  const currentUserId = 'u_alex'
  const currentUserName = 'Alex Johnson'
  const currentUserDept = 'Strategy & Operations'

  const conversations = ref<Conversation[]>([
    // ── Direct Messages ──────────────────────────────────────────────
    {
      id: 'dm1',
      category: 'dm',
      name: 'Sarah Mitchell',
      department: 'Strategy & Operations',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_sarah', name: 'Sarah Mitchell', role: 'Team Supervisor', department: 'Strategy & Operations' },
      ],
      messages: [
        { id: 'm1', senderId: 'u_sarah', senderName: 'Sarah Mitchell', body: 'Hi Alex, can you send me the Q3 progress report when you get a chance?', timestamp: ts(9, 14), dateLabel: 'Today', isMe: false, readBy: ['u_alex'] },
        { id: 'm2', senderId: 'u_alex', senderName: 'Alex Johnson', body: 'Sure! I\'ll have it ready by noon.', timestamp: ts(9, 17), dateLabel: 'Today', isMe: true, readBy: ['u_sarah'] },
        { id: 'm3', senderId: 'u_sarah', senderName: 'Sarah Mitchell', body: 'Great, thanks. Also please review the schedule approval I sent earlier.', timestamp: ts(10, 2), dateLabel: 'Today', isMe: false, readBy: [] },
      ],
      unreadCount: 1,
      lastMessage: 'Also please review the schedule approval I sent earlier.',
      lastTimestamp: ts(10, 2),
    },
    {
      id: 'dm2',
      category: 'dm',
      name: 'Marcus Williams',
      department: 'Strategy & Operations',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_marcus', name: 'Marcus Williams', role: 'Business Analyst', department: 'Strategy & Operations' },
      ],
      messages: [
        { id: 'm4', senderId: 'u_marcus', senderName: 'Marcus Williams', body: 'Hey, are you joining the 2pm strategy call?', timestamp: ts(8, 45), dateLabel: 'Today', isMe: false, readBy: ['u_alex'] },
        { id: 'm5', senderId: 'u_alex', senderName: 'Alex Johnson', body: 'Yes, I\'ll be there.', timestamp: ts(8, 50), dateLabel: 'Today', isMe: true, readBy: ['u_marcus'] },
      ],
      unreadCount: 0,
      lastMessage: 'Yes, I\'ll be there.',
      lastTimestamp: ts(8, 50),
    },
    {
      id: 'dm3',
      category: 'dm',
      name: 'Priya Sharma',
      department: 'Operations',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_priya', name: 'Priya Sharma', role: 'Operations Manager', department: 'Operations' },
      ],
      messages: [
        { id: 'm6', senderId: 'u_priya', senderName: 'Priya Sharma', body: 'The vendor onboarding docs are ready for your review.', timestamp: ts(16, 30), dateLabel: 'Yesterday', isMe: false, readBy: [] },
        { id: 'm7', senderId: 'u_priya', senderName: 'Priya Sharma', body: 'Let me know if you need anything else.', timestamp: ts(16, 31), dateLabel: 'Yesterday', isMe: false, readBy: [] },
      ],
      unreadCount: 2,
      lastMessage: 'Let me know if you need anything else.',
      lastTimestamp: 'Yesterday',
    },
    {
      id: 'dm4',
      category: 'dm',
      name: 'James Okafor',
      department: 'Sales',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_james', name: 'James Okafor', role: 'Sales Executive', department: 'Sales' },
      ],
      messages: [
        { id: 'm8', senderId: 'u_james', senderName: 'James Okafor', body: 'Can we sync on the Q3 targets before the board meeting?', timestamp: ts(11, 0), dateLabel: 'Jul 10', isMe: false, readBy: ['u_alex'] },
        { id: 'm9', senderId: 'u_alex', senderName: 'Alex Johnson', body: 'Absolutely, let\'s do Thursday at 3pm.', timestamp: ts(11, 15), dateLabel: 'Jul 10', isMe: true, readBy: ['u_james'] },
      ],
      unreadCount: 0,
      lastMessage: 'Absolutely, let\'s do Thursday at 3pm.',
      lastTimestamp: 'Jul 10',
    },

    // ── Department ───────────────────────────────────────────────────
    {
      id: 'dept1',
      category: 'department',
      name: 'Strategy & Operations',
      department: 'Strategy & Operations',
      isPermanent: true,
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_sarah', name: 'Sarah Mitchell', role: 'Team Supervisor', department: 'Strategy & Operations' },
        { id: 'u_marcus', name: 'Marcus Williams', role: 'Business Analyst', department: 'Strategy & Operations' },
        { id: 'u_emeka', name: 'Dr. Emeka Obi', role: 'Head of Department', department: 'Strategy & Operations' },
      ],
      messages: [
        { id: 'dm1', senderId: 'u_emeka', senderName: 'Dr. Emeka Obi', body: 'Team, please ensure all Q3 KPI reports are submitted by Friday EOD.', timestamp: ts(8, 0), dateLabel: 'Today', isMe: false, readBy: ['u_alex', 'u_sarah'] },
        { id: 'dm2', senderId: 'u_sarah', senderName: 'Sarah Mitchell', body: 'Noted. I\'ll remind the team.', timestamp: ts(8, 5), dateLabel: 'Today', isMe: false, readBy: ['u_alex'] },
        { id: 'dm3', senderId: 'u_alex', senderName: 'Alex Johnson', body: 'Understood, will have mine ready by Thursday.', timestamp: ts(8, 10), dateLabel: 'Today', isMe: true, readBy: ['u_emeka', 'u_sarah'] },
        { id: 'dm4', senderId: 'u_marcus', senderName: 'Marcus Williams', body: 'Same here. Working on the dashboard now.', timestamp: ts(8, 12), dateLabel: 'Today', isMe: false, readBy: [] },
      ],
      unreadCount: 1,
      lastMessage: 'Same here. Working on the dashboard now.',
      lastTimestamp: ts(8, 12),
    },

    // ── Groups ───────────────────────────────────────────────────────
    {
      id: 'grp1',
      category: 'group',
      name: 'Vendor Portal',
      groupDescription: 'Cross-functional team for the Vendor Portal project',
      createdBy: 'u_alex',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_priya', name: 'Priya Sharma', role: 'Operations Manager', department: 'Operations' },
        { id: 'u_marcus', name: 'Marcus Williams', role: 'Business Analyst', department: 'Strategy & Operations' },
        { id: 'u_ngozi', name: 'Ngozi Adeyemi', role: 'HR Manager', department: 'Human Resources' },
      ],
      messages: [
        { id: 'gm1', senderId: 'u_alex', senderName: 'Alex Johnson', body: 'Welcome to the Vendor Portal project group! Let\'s use this space to coordinate our work.', timestamp: ts(9, 0), dateLabel: 'Jul 11', isMe: true, readBy: ['u_priya', 'u_marcus', 'u_ngozi'] },
        { id: 'gm2', senderId: 'u_priya', senderName: 'Priya Sharma', body: 'Great! I\'ve uploaded the vendor onboarding checklist.', timestamp: ts(9, 30), dateLabel: 'Jul 11', isMe: false, readBy: ['u_alex', 'u_marcus'], fileAttachment: { name: 'vendor_onboarding_checklist.pdf', size: '245 KB', type: 'pdf' } },
        { id: 'gm3', senderId: 'u_marcus', senderName: 'Marcus Williams', body: 'Thanks Priya. I\'ll review and share feedback by tomorrow.', timestamp: ts(10, 0), dateLabel: 'Jul 11', isMe: false, readBy: ['u_alex'] },
        { id: 'gm4', senderId: 'u_ngozi', senderName: 'Ngozi Adeyemi', body: 'HR compliance requirements have been added to the shared doc.', timestamp: ts(14, 0), dateLabel: 'Today', isMe: false, readBy: [] },
      ],
      unreadCount: 1,
      lastMessage: 'HR compliance requirements have been added to the shared doc.',
      lastTimestamp: ts(14, 0),
    },
    {
      id: 'grp2',
      category: 'group',
      name: 'Q3 Planning',
      groupDescription: 'Q3 strategic planning and budget review',
      createdBy: 'u_sarah',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_sarah', name: 'Sarah Mitchell', role: 'Team Supervisor', department: 'Strategy & Operations' },
        { id: 'u_emeka', name: 'Dr. Emeka Obi', role: 'Head of Department', department: 'Strategy & Operations' },
      ],
      messages: [
        { id: 'gm5', senderId: 'u_sarah', senderName: 'Sarah Mitchell', body: 'Q3 planning session is scheduled for July 18th at 10am.', timestamp: ts(15, 0), dateLabel: 'Jul 10', isMe: false, readBy: ['u_alex', 'u_emeka'] },
        { id: 'gm6', senderId: 'u_emeka', senderName: 'Dr. Emeka Obi', body: 'Confirmed. Please come prepared with your department\'s Q2 performance summary.', timestamp: ts(15, 30), dateLabel: 'Jul 10', isMe: false, readBy: ['u_alex', 'u_sarah'] },
      ],
      unreadCount: 0,
      lastMessage: 'Please come prepared with your department\'s Q2 performance summary.',
      lastTimestamp: 'Jul 10',
    },
    {
      id: 'grp3',
      category: 'group',
      name: 'Annual Retreat',
      groupDescription: 'Planning committee for the 2025 company annual retreat',
      createdBy: 'u_ngozi',
      participants: [
        { id: 'u_alex', name: 'Alex Johnson', role: 'Senior Analyst', department: 'Strategy & Operations' },
        { id: 'u_ngozi', name: 'Ngozi Adeyemi', role: 'HR Manager', department: 'Human Resources' },
        { id: 'u_james', name: 'James Okafor', role: 'Sales Executive', department: 'Sales' },
      ],
      messages: [
        { id: 'gm7', senderId: 'u_ngozi', senderName: 'Ngozi Adeyemi', body: 'Hi team! We\'re planning the annual retreat for October. Please share venue suggestions.', timestamp: ts(11, 0), dateLabel: 'Jul 9', isMe: false, readBy: ['u_alex', 'u_james'] },
        { id: 'gm8', senderId: 'u_james', senderName: 'James Okafor', body: 'How about Transcorp Hilton in Abuja? Great facilities.', timestamp: ts(11, 45), dateLabel: 'Jul 9', isMe: false, readBy: ['u_alex', 'u_ngozi'] },
        { id: 'gm9', senderId: 'u_alex', senderName: 'Alex Johnson', body: 'That sounds great! I\'ll check availability.', timestamp: ts(12, 0), dateLabel: 'Jul 9', isMe: true, readBy: ['u_ngozi', 'u_james'] },
      ],
      unreadCount: 0,
      lastMessage: 'That sounds great! I\'ll check availability.',
      lastTimestamp: 'Jul 9',
    },
  ])

  const activeConversationId = ref<string | null>('dm1')

  const activeConversation = computed(() =>
    conversations.value.find(c => c.id === activeConversationId.value) || null
  )

  const dmConversations = computed(() => conversations.value.filter(c => c.category === 'dm'))
  const deptConversations = computed(() => conversations.value.filter(c => c.category === 'department'))
  const groupConversations = computed(() => conversations.value.filter(c => c.category === 'group'))

  const totalUnread = computed(() => conversations.value.reduce((a, c) => a + c.unreadCount, 0))

  const setActive = (id: string) => {
    activeConversationId.value = id
    const conv = conversations.value.find(c => c.id === id)
    if (conv) conv.unreadCount = 0
  }

  const sendMessage = (convId: string, body: string, file?: CollabMessage['fileAttachment']) => {
    const conv = conversations.value.find(c => c.id === convId)
    if (!conv) return
    const now = new Date()
    const msg: CollabMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      body,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateLabel: 'Today',
      isMe: true,
      fileAttachment: file,
      readBy: [],
    }
    conv.messages.push(msg)
    conv.lastMessage = file ? `📎 ${file.name}` : body
    conv.lastTimestamp = msg.timestamp
  }

  const startDM = (participant: Participant): string => {
    const existing = conversations.value.find(
      c => c.category === 'dm' && c.participants.some(p => p.id === participant.id)
    )
    if (existing) return existing.id
    const id = `dm_${Date.now()}`
    conversations.value.unshift({
      id,
      category: 'dm',
      name: participant.name,
      department: participant.department,
      participants: [
        { id: currentUserId, name: currentUserName, role: 'Senior Analyst', department: currentUserDept },
        participant,
      ],
      messages: [],
      unreadCount: 0,
      lastMessage: '',
      lastTimestamp: '',
    })
    return id
  }

  const createGroup = (name: string, description: string, members: Participant[]) => {
    const id = `grp_${Date.now()}`
    conversations.value.unshift({
      id,
      category: 'group',
      name,
      groupDescription: description,
      createdBy: currentUserId,
      participants: [
        { id: currentUserId, name: currentUserName, role: 'Senior Analyst', department: currentUserDept },
        ...members,
      ],
      messages: [],
      unreadCount: 0,
      lastMessage: '',
      lastTimestamp: '',
    })
    return id
  }

  const searchConversations = (query: string) => {
    if (!query.trim()) return conversations.value
    const q = query.toLowerCase()
    return conversations.value.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.department?.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q) ||
      c.participants.some(p => p.name.toLowerCase().includes(q))
    )
  }

  return {
    conversations,
    activeConversationId,
    activeConversation,
    dmConversations,
    deptConversations,
    groupConversations,
    totalUnread,
    currentUserId,
    currentUserName,
    setActive,
    sendMessage,
    startDM,
    createGroup,
    searchConversations,
  }
})
