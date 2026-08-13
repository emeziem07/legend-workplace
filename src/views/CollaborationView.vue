<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import { useCollaborationStore } from '../stores/collaboration'
import AvatarInitials from '../components/common/AvatarInitials.vue'

const store = useCollaborationStore()

// ── Direct @Mentions ──────────────────────────────────────────────────────
interface Mention {
  id: string
  senderId: string
  senderName: string
  senderInitials: string
  message: string
  threadId: string
  threadName: string
  timestamp: string
  isRead: boolean
  isObligation: boolean
}

const mentions = ref<Mention[]>([
  {
    id: '1',
    senderId: 'admin',
    senderName: 'System Admin',
    senderInitials: 'SA',
    message: '@B Ayonotejr check this out — splice diagram for the node.',
    threadId: 'team-1',
    threadName: '#Team · Discussion Stream',
    timestamp: '16:11',
    isRead: false,
    isObligation: false
  },
  {
    id: '2',
    senderId: 'fa',
    senderName: 'F Adeyemi',
    senderInitials: 'FA',
    message: '@B Ayonotejr can you confirm the agenda before the 16:00 sync? It\'s your obligation.',
    threadId: '1',
    threadName: '#Emergency Fiber Cut Outage Sync',
    timestamp: '14:02',
    isRead: false,
    isObligation: true
  },
  {
    id: '3',
    senderId: 'ko',
    senderName: 'K Obi',
    senderInitials: 'KO',
    message: '@B Ayonotejr minutes from the governance call are overdue — flagging before it breaches.',
    threadId: '2',
    threadName: '#Q3 Rollout — Weekly Governance',
    timestamp: 'Yesterday',
    isRead: true,
    isObligation: false
  }
])

type MentionFilter = 'all' | 'unread' | 'obligations'
const mentionFilter = ref<MentionFilter>('all')

const filteredMentions = computed(() => {
  if (mentionFilter.value === 'unread') {
    return mentions.value.filter(m => !m.isRead)
  } else if (mentionFilter.value === 'obligations') {
    return mentions.value.filter(m => m.isObligation)
  }
  return mentions.value
})

const openMentionThread = (mention: Mention) => {
  mention.isRead = true
  selectThread(mention.threadId)
  activeTab.value = 'discussion'
}

// ── Meeting Schedule ──────────────────────────────────────────────────────
interface Meeting {
  id: string
  title: string
  location: string
  date: string
  time: string
  endTime: string
  participants: Array<{ initials: string; name: string }>
  obligationCount: number
  breachedCount: number
  status: 'scheduled' | 'pending' | 'retrospective'
  captured?: boolean
}

const meetings = ref<Meeting[]>([
  {
    id: '1',
    title: 'Emergency Fiber Cut Outage Sync',
    location: 'HQ-Field',
    date: 'Today',
    time: '16:00',
    endTime: '16:30',
    participants: [
      { initials: 'BA', name: 'Bola Adeyemi' },
      { initials: 'SA', name: 'Sarah Ahmed' },
      { initials: 'DO', name: 'David Okon' }
    ],
    obligationCount: 6,
    breachedCount: 1,
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Q3 Rollout — Weekly Governance',
    location: 'HQ-HQ',
    date: 'Tomorrow',
    time: '10:00',
    endTime: '11:00',
    participants: [
      { initials: 'BA', name: 'Bola Adeyemi' },
      { initials: 'FA', name: 'Fatima Ahmed' },
      { initials: 'KO', name: 'Kofi Osei' }
    ],
    obligationCount: 5,
    breachedCount: 0,
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Field standup — Maitama node',
    location: 'Field',
    date: 'Today',
    time: '12:40',
    endTime: '12:55',
    participants: [
      { initials: 'SA', name: 'Sarah Ahmed' },
      { initials: 'DO', name: 'David Okon' }
    ],
    obligationCount: 3,
    breachedCount: 0,
    status: 'retrospective',
    captured: true
  }
])

const showScheduleModal = ref(false)
const newMeetingForm = ref({
  title: '',
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  participants: [] as string[],
  organiser: '',
  noteTaker: ''
})

const openScheduleModal = () => {
  showScheduleModal.value = true
}

const closeScheduleModal = () => {
  showScheduleModal.value = false
  newMeetingForm.value = {
    title: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: [],
    organiser: '',
    noteTaker: ''
  }
}

const saveMeeting = () => {
  if (!newMeetingForm.value.title || !newMeetingForm.value.location) return
  
  const newMeeting: Meeting = {
    id: `meeting-${Date.now()}`,
    title: newMeetingForm.value.title,
    location: newMeetingForm.value.location,
    date: newMeetingForm.value.date,
    time: newMeetingForm.value.startTime,
    endTime: newMeetingForm.value.endTime,
    participants: [],
    obligationCount: 0,
    breachedCount: 0,
    status: 'scheduled'
  }
  
  meetings.value.unshift(newMeeting)
  closeScheduleModal()
}

const selectedMeeting = ref<Meeting | null>(null)

const openMeetingDetails = (meeting: Meeting) => {
  selectedMeeting.value = meeting
}

const closeMeetingDetails = () => {
  selectedMeeting.value = null
}

const scheduledMeetings = computed(() => 
  meetings.value.filter(m => m.status === 'scheduled')
)

const retrospectiveMeetings = computed(() => 
  meetings.value.filter(m => m.status === 'retrospective')
)

// ── Right Panel Collapse ──────────────────────────────────────────────────────
const rightPanelCollapsed = ref(false)

const toggleRightPanel = () => {
  rightPanelCollapsed.value = !rightPanelCollapsed.value
}

// ── Mobile Navigation ─────────────────────────────────────────────────────────
const mobileLeftOpen = ref(false)
const mobileRightOpen = ref(false)

const closeLeftDrawer = () => { mobileLeftOpen.value = false }
const closeRightDrawer = () => { mobileRightOpen.value = false }

// ── Thread Selection ──────────────────────────────────────────────────────────
const selectThread = (id: string) => {
  store.setActive(id)
  closeLeftDrawer()
}

// ── Tab Navigation ───────────────────────────────────────────────────────────
type TabKey = 'discussion' | 'meetings' | 'mentions' | 'governance'
const activeTab = ref<TabKey>('discussion')

// ── Message Composer ─────────────────────────────────────────────────────────
const newMessage = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const pendingFile = ref<{ name: string; size: string; type: 'pdf' | 'word' | 'excel' | 'image' | 'other'; file?: File } | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

watch(() => store.activeConversation?.messages.length, scrollToBottom)
onMounted(scrollToBottom)

const sendMessage = () => {
  const body = newMessage.value.trim()
  if (!body && !pendingFile.value) return
  if (!store.activeConversationId) return
  store.sendMessage(
    store.activeConversationId,
    body,
    pendingFile.value ? { name: pendingFile.value.name, size: pendingFile.value.size, type: pendingFile.value.type } : undefined
  )
  newMessage.value = ''
  pendingFile.value = null
  scrollToBottom()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  let type: 'pdf' | 'word' | 'excel' | 'image' | 'other' = 'other'
  if (ext === 'pdf') type = 'pdf'
  else if (['doc', 'docx'].includes(ext)) type = 'word'
  else if (['xls', 'xlsx'].includes(ext)) type = 'excel'
  else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) type = 'image'
  pendingFile.value = { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, type, file }
  input.value = ''
}

const dragOver = ref(false)

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  let type: 'pdf' | 'word' | 'excel' | 'image' | 'other' = 'other'
  if (ext === 'pdf') type = 'pdf'
  else if (['doc', 'docx'].includes(ext)) type = 'word'
  else if (['xls', 'xlsx'].includes(ext)) type = 'excel'
  else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) type = 'image'
  pendingFile.value = { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, type, file }
}

// ── Governance Notification ───────────────────────────────────────────────────
const showGovernanceNotification = computed(() => {
  return store.activeConversation && Math.random() > 0.5
})

// ── Grouped Messages ──────────────────────────────────────────────────────────
const groupedMessages = computed(() => {
  const msgs = store.activeConversation?.messages || []
  const groups: { label: string; messages: any[] }[] = []
  let currentLabel = ''
  for (const msg of msgs) {
    if (msg.dateLabel !== currentLabel) {
      currentLabel = msg.dateLabel
      groups.push({ label: currentLabel, messages: [msg] })
    } else {
      groups[groups.length - 1].messages.push(msg)
    }
  }
  return groups
})

// ── File Icon Helper ──────────────────────────────────────────────────────────
const fileIcon = (type: 'pdf' | 'word' | 'excel' | 'image' | 'other') => {
  if (type === 'pdf') return '#dc2626'
  if (type === 'word') return '#2563eb'
  if (type === 'excel') return '#16a34a'
  if (type === 'image') return '#8b5cf6'
  return '#6b7280'
}

const fileIconPath = (type: 'pdf' | 'word' | 'excel' | 'image' | 'other') => {
  if (type === 'image') return 'M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 0L5 19h14l-4.5-6-3 4z'
  return 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6'
}

const getFileTypeLabel = (type: 'pdf' | 'word' | 'excel' | 'image' | 'other') => {
  if (type === 'pdf') return 'PDF'
  if (type === 'word') return 'DOC'
  if (type === 'excel') return 'XLSX'
  if (type === 'image') return 'IMAGE'
  return 'FILE'
}

const getImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

const imagePreviewUrl = ref<string>('')

watch(() => pendingFile.value, async (newFile) => {
  if (newFile?.type === 'image' && newFile.file) {
    imagePreviewUrl.value = await getImagePreview(newFile.file)
  } else {
    imagePreviewUrl.value = ''
  }
})

// ── Keyboard & Escape ─────────────────────────────────────────────────────────
const onEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeLeftDrawer()
    closeRightDrawer()
  }
}
onMounted(() => document.addEventListener('keydown', onEsc))
onBeforeUnmount(() => document.removeEventListener('keydown', onEsc))
</script>

<template>
  <div class="collab-container">
    <!-- ── DESKTOP: Three-column layout ── -->
    <div class="collab-desktop">
      <!-- LEFT: Navigation Sidebar -->
      <aside class="collab-left">
        <!-- Workspace Header -->
        <div class="collab-workspace-header">
          <div>
            <h2 class="collab-workspace-name">Concert</h2>
            <p class="collab-workspace-subtitle">Suburban workspace</p>
          </div>
          <button class="collab-workspace-action" title="Add workspace">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>

        <!-- Search -->
        <div class="collab-search">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="collab-search-icon">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search..." class="collab-search-input" />
        </div>

        <!-- Threads Section -->
        <div class="collab-nav-section">
          <h3 class="collab-nav-label">THREADS</h3>
          <div class="collab-nav-list">
            <button
              v-for="thread in store.conversations.filter(c => c.category === 'group')"
              :key="thread.id"
              @click="selectThread(thread.id)"
              :class="['collab-nav-item', store.activeConversationId === thread.id ? 'active' : '']"
            >
              <span class="collab-nav-item-name">{{ thread.name }}</span>
              <span v-if="thread.unreadCount > 0" class="collab-nav-item-badge">{{ thread.unreadCount }}</span>
            </button>
          </div>
        </div>

        <!-- Teams Section -->
        <div class="collab-nav-section">
          <h3 class="collab-nav-label">TEAMS</h3>
          <div class="collab-nav-list">
            <button
              v-for="team in store.conversations.filter(c => c.category === 'department')"
              :key="team.id"
              @click="selectThread(team.id)"
              :class="['collab-nav-item', store.activeConversationId === team.id ? 'active' : '']"
            >
              <span class="collab-nav-item-name">{{ team.name }}</span>
              <span v-if="team.unreadCount > 0" class="collab-nav-item-badge">{{ team.unreadCount }}</span>
            </button>
          </div>
        </div>

        <!-- User Profile -->
        <div class="collab-user-profile">
          <AvatarInitials :name="store.currentUserName" size="sm" />
          <div class="collab-user-info">
            <p class="collab-user-name">{{ store.currentUserName.split(' ')[0] }} {{ store.currentUserName.split(' ')[1]?.[0] }}...</p>
            <p class="collab-user-status">● Active now</p>
          </div>
        </div>
      </aside>

      <!-- CENTER: Thread View -->
      <main class="collab-center">
        <template v-if="store.activeConversation">
          <!-- Thread Header -->
          <div class="collab-thread-header">
            <div class="collab-thread-title-area">
              <h1 class="collab-thread-title">{{ store.activeConversation.name }}</h1>
            </div>
            <div class="collab-thread-controls">
              <div class="collab-search-compact">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search..." class="collab-search-compact-input" />
              </div>
              <div class="collab-participants-stack">
                <div
                  v-for="(p, idx) in store.activeConversation.participants.slice(0, 3)"
                  :key="p.id"
                  :style="{ marginLeft: idx === 0 ? '0' : '-8px', zIndex: 3 - idx }"
                >
                  <AvatarInitials :name="p.name" size="xs" :title="p.name" />
                </div>
                <div v-if="store.activeConversation.participants.length > 3" :style="{ marginLeft: '-8px', zIndex: 0 }">
                  <div class="collab-participants-more">+{{ store.activeConversation.participants.length - 3 }}</div>
                </div>
              </div>
              <button class="collab-icon-btn" title="Notifications">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 0 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"/>
                </svg>
              </button>
              <button class="collab-icon-btn" title="Start call">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </button>
              <button @click="mobileRightOpen = true" class="collab-icon-btn lg:hidden" title="Details">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Tab Strip -->
          <div class="collab-tabs">
            <button
              @click="activeTab = 'discussion'"
              :class="['collab-tab', activeTab === 'discussion' ? 'active' : '']"
            >
              Discussion Stream
            </button>
            <button
              @click="activeTab = 'meetings'"
              :class="['collab-tab', activeTab === 'meetings' ? 'active' : '']"
            >
              Meeting Schedule
            </button>
            <button
              @click="activeTab = 'mentions'"
              :class="['collab-tab', activeTab === 'mentions' ? 'active' : '']"
            >
              Direct @Mentions
            </button>
            <button
              @click="activeTab = 'governance'"
              :class="['collab-tab', activeTab === 'governance' ? 'active' : '']"
            >
              Obligation Governance
            </button>
          </div>

          <!-- Discussion Stream Tab -->
          <div v-if="activeTab === 'discussion'" class="collab-tab-content">
            <!-- Governance Notification -->
            <div v-if="showGovernanceNotification" class="collab-governance-banner">
              <div class="collab-governance-content">
                <p class="collab-governance-title">1 meeting obligation needs your action</p>
                <p class="collab-governance-subtitle">Governance obligation spawned for this tenant · due in 2h 6m</p>
              </div>
              <button class="collab-governance-action">View Obligations</button>
            </div>

            <!-- Messages -->
            <div ref="messagesRef" class="collab-messages">
              <div v-if="store.activeConversation.messages.length === 0" class="collab-empty-state">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="collab-empty-icon">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p class="collab-empty-text">No messages yet. Start the conversation.</p>
              </div>

              <template v-for="group in groupedMessages" :key="group.label">
                <div class="collab-date-separator">
                  <span>{{ group.label }}</span>
                </div>
                <div v-for="msg in group.messages" :key="msg.id" :class="['collab-message-wrapper', msg.isMe ? 'sent' : 'received']">
                  <div v-if="!msg.isMe" class="collab-message-avatar-container">
                    <AvatarInitials :name="msg.senderName" size="sm" class="collab-message-avatar" />
                  </div>
                  <div class="collab-message-group">
                    <div v-if="!msg.isMe" class="collab-message-header">
                      <span class="collab-message-name">{{ msg.senderName }}</span>
                      <span class="collab-message-time">{{ msg.timestamp }}</span>
                    </div>
                    <div v-if="msg.isMe" class="collab-message-time-right">{{ msg.timestamp }}</div>
                    <div class="collab-message-body">{{ msg.body }}</div>
                    <div v-if="msg.attachment" class="collab-attachment-card">
                      <div v-if="msg.attachment.type === 'image'" class="collab-attachment-image-preview">
                        <img :src="msg.attachment.preview" :alt="msg.attachment.name" />
                      </div>
                      <div v-else class="collab-attachment-file">
                        <svg :style="{ color: fileIcon(msg.attachment.type) }" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path :d="fileIconPath(msg.attachment.type)"/>
                        </svg>
                        <div class="collab-attachment-info">
                          <p class="collab-attachment-name">{{ msg.attachment.name }}</p>
                          <p class="collab-attachment-meta">{{ getFileTypeLabel(msg.attachment.type) }} · {{ msg.attachment.size }}</p>
                        </div>
                      </div>
                      <div v-if="msg.attachment.type !== 'image'" class="collab-attachment-action">
                        <button class="collab-attachment-btn">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Composer -->
            <div class="collab-composer-area" @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop="handleDrop">
              <div v-if="dragOver" class="collab-drag-overlay">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <p>Drop file to attach</p>
              </div>

              <div class="collab-composer-container">
                <div v-if="pendingFile" class="collab-pending-file-preview">
                  <div v-if="pendingFile.type === 'image' && imagePreviewUrl" class="collab-pending-image-thumb">
                    <img :src="imagePreviewUrl" :alt="pendingFile.name" />
                    <button @click="pendingFile = null; imagePreviewUrl = ''" class="collab-pending-remove">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div v-else class="collab-pending-file-info">
                    <svg :style="{ color: fileIcon(pendingFile.type) }" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path :d="fileIconPath(pendingFile.type)"/>
                    </svg>
                    <div class="collab-pending-text">
                      <p class="collab-pending-name">{{ pendingFile.name }}</p>
                      <p class="collab-pending-size">{{ getFileTypeLabel(pendingFile.type) }} · {{ pendingFile.size }}</p>
                    </div>
                    <button @click="pendingFile = null; imagePreviewUrl = ''" class="collab-pending-remove">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>

                <div class="collab-composer">
                  <button @click="fileInputRef?.click()" class="collab-composer-btn" title="Attach file">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                  </button>
                  <input ref="fileInputRef" type="file" class="hidden" @change="handleFileSelect" />

                  <textarea
                    v-model="newMessage"
                    @keydown="onKeydown"
                    rows="1"
                    placeholder="Reply, or type @ to mention team members..."
                    class="collab-composer-input"
                    style="min-height: 40px; max-height: 120px;"
                  ></textarea>

                  <button
                    @click="sendMessage"
                    :disabled="!newMessage.trim() && !pendingFile"
                    class="collab-composer-send"
                    :style="(newMessage.trim() || pendingFile) ? 'background:#FD4F00;' : 'background:#e5e7eb;'"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Meeting Schedule Tab -->
          <div v-if="activeTab === 'meetings'" class="collab-tab-content collab-meetings-content">
            <!-- Header -->
            <div class="collab-meetings-header">
              <div class="collab-meetings-title-area">
                <h2 class="collab-meetings-title">Meeting Schedule</h2>
                <p class="collab-meetings-subtitle">General Activities Calendar (GAC) · scheduled & retrospective</p>
              </div>
              <button @click="openScheduleModal" class="collab-primary-btn">
                + Schedule Meeting
              </button>
            </div>

            <!-- Scheduled Meetings Section -->
            <div class="collab-meetings-section">
              <h3 class="collab-meetings-section-label">SCHEDULED · ON THE GAC</h3>
              <div class="collab-meetings-list">
                <div
                  v-for="meeting in scheduledMeetings"
                  :key="meeting.id"
                  @click="openMeetingDetails(meeting)"
                  :class="['collab-meeting-card', meeting.breachedCount > 0 ? 'breached' : 'pending']"
                >
                  <div class="collab-meeting-accent"></div>
                  <div class="collab-meeting-content">
                    <h4 class="collab-meeting-title">{{ meeting.title }}</h4>
                    <div class="collab-meeting-meta">
                      <span class="collab-meeting-location">{{ meeting.location }}</span>
                      <span class="collab-meeting-separator">·</span>
                      <span class="collab-meeting-datetime">{{ meeting.date }} · {{ meeting.time }}–{{ meeting.endTime }}</span>
                    </div>
                    <div class="collab-meeting-participants">
                      <div
                        v-for="(p, idx) in meeting.participants.slice(0, 3)"
                        :key="p.initials"
                        :style="{ marginLeft: idx === 0 ? '0' : '-8px', zIndex: 3 - idx }"
                      >
                        <AvatarInitials :name="p.name" size="xs" :title="p.name" />
                      </div>
                      <div v-if="meeting.participants.length > 3" :style="{ marginLeft: '-8px', zIndex: 0 }">
                        <div class="collab-meeting-participants-more">+{{ meeting.participants.length - 3 }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="collab-meeting-obligations">
                    <div class="collab-meeting-obligation-count">{{ meeting.obligationCount }}</div>
                    <div :class="['collab-meeting-obligation-status', meeting.breachedCount > 0 ? 'breached' : 'pending']">
                      <span v-if="meeting.breachedCount > 0">{{ meeting.breachedCount }} breached</span>
                      <span v-else>pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Retrospective Meetings Section -->
            <div v-if="retrospectiveMeetings.length > 0" class="collab-meetings-section">
              <h3 class="collab-meetings-section-label">UNSCHEDULED · RETROSPECTIVE CAPTURE</h3>
              <div class="collab-meetings-list">
                <div
                  v-for="meeting in retrospectiveMeetings"
                  :key="meeting.id"
                  @click="openMeetingDetails(meeting)"
                  class="collab-meeting-card retrospective"
                >
                  <div class="collab-meeting-accent"></div>
                  <div class="collab-meeting-content">
                    <h4 class="collab-meeting-title">{{ meeting.title }}</h4>
                    <div class="collab-meeting-meta">
                      <span class="collab-meeting-location">Captured after</span>
                      <span class="collab-meeting-separator">·</span>
                      <span class="collab-meeting-datetime">{{ meeting.date }} · {{ meeting.time }}</span>
                      <span class="collab-meeting-separator">·</span>
                      <span class="collab-meeting-window">within window</span>
                    </div>
                    <div class="collab-meeting-participants">
                      <div
                        v-for="(p, idx) in meeting.participants.slice(0, 3)"
                        :key="p.initials"
                        :style="{ marginLeft: idx === 0 ? '0' : '-8px', zIndex: 3 - idx }"
                      >
                        <AvatarInitials :name="p.name" size="xs" :title="p.name" />
                      </div>
                    </div>
                  </div>
                  <div class="collab-meeting-obligations">
                    <div class="collab-meeting-obligation-count">{{ meeting.obligationCount }}</div>
                    <div class="collab-meeting-obligation-status neutral">
                      obligations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Direct @Mentions Tab -->
          <div v-if="activeTab === 'mentions'" class="collab-tab-content collab-mentions-content">
            <!-- Header -->
            <div class="collab-mentions-header">
              <div class="collab-mentions-title-area">
                <h2 class="collab-mentions-title">Direct @Mentions</h2>
                <p class="collab-mentions-subtitle">Where you've been called into a thread</p>
              </div>
            </div>

            <!-- Filter Buttons -->
            <div class="collab-mentions-filters">
              <button
                @click="mentionFilter = 'all'"
                :class="['collab-mentions-filter-btn', mentionFilter === 'all' ? 'active' : '']"
              >
                All
              </button>
              <button
                @click="mentionFilter = 'unread'"
                :class="['collab-mentions-filter-btn', mentionFilter === 'unread' ? 'active' : '']"
              >
                Unread
              </button>
              <button
                @click="mentionFilter = 'obligations'"
                :class="['collab-mentions-filter-btn', mentionFilter === 'obligations' ? 'active' : '']"
              >
                Obligations
              </button>
            </div>

            <!-- Mentions List -->
            <div class="collab-mentions-list">
              <div v-if="filteredMentions.length === 0" class="collab-mentions-empty">
                <p>No mentions to display</p>
              </div>

              <div
                v-for="mention in filteredMentions"
                :key="mention.id"
                @click="openMentionThread(mention)"
                :class="['collab-mention-card', !mention.isRead ? 'unread' : '']"
              >
                <div class="collab-mention-avatar">
                  <AvatarInitials :name="mention.senderName" size="sm" />
                </div>
                <div class="collab-mention-content">
                  <div class="collab-mention-header">
                    <span class="collab-mention-sender">{{ mention.senderName }}</span>
                    <span class="collab-mention-timestamp">{{ mention.timestamp }}</span>
                  </div>
                  <p class="collab-mention-message">{{ mention.message }}</p>
                  <div class="collab-mention-footer">
                    <span class="collab-mention-thread">{{ mention.threadName }}</span>
                    <span v-if="mention.isObligation" class="collab-mention-obligation-badge">Obligation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Obligation Governance Tab (Placeholder) -->
          <div v-if="activeTab === 'governance'" class="collab-tab-content collab-placeholder">
            <p>Obligation Governance</p>
          </div>
        </template>

        <div v-else class="collab-no-selection">
          <p>Select a thread to begin</p>
        </div>
      </main>

      <!-- RIGHT: Details Panel -->
      <aside v-if="store.activeConversation" :class="['collab-right', rightPanelCollapsed ? 'collapsed' : '']">
        <div class="collab-details-header">
          <h3>Collaboration Thread Details</h3>
        </div>

        <!-- Thread Information -->
        <div class="collab-details-section">
          <h4 class="collab-details-label">THREAD INFORMATION</h4>
          <div class="collab-details-item">
            <span class="collab-details-key">Date of creation</span>
            <span class="collab-details-value">Today</span>
          </div>
          <div class="collab-details-item">
            <span class="collab-details-key">Thread Status</span>
            <span class="collab-details-value">Active Governance</span>
          </div>
          <div class="collab-details-item">
            <span class="collab-details-key">Strategic Tags</span>
            <span class="collab-details-value">0</span>
          </div>
        </div>

        <!-- Variable Obligations -->
        <div class="collab-details-section">
          <h4 class="collab-details-label">VARIABLE OBLIGATIONS · 3</h4>
          <div class="collab-obligation-card">
            <div class="collab-obligation-header">
              <span class="collab-obligation-checkbox">☐</span>
              <span class="collab-obligation-title">Attendance Sign-in · C-01</span>
            </div>
            <p class="collab-obligation-meta">Field GPS check-in · due 16:17</p>
            <span class="collab-obligation-status due-soon">Due soon</span>
          </div>
          <div class="collab-obligation-card">
            <div class="collab-obligation-header">
              <span class="collab-obligation-checkbox">☐</span>
              <span class="collab-obligation-title">Minutes Upload · C-03</span>
            </div>
            <p class="collab-obligation-meta">Owner D Okon · due 14:17</p>
            <span class="collab-obligation-status breached">Breached</span>
          </div>
          <div class="collab-obligation-card">
            <div class="collab-obligation-header">
              <span class="collab-obligation-checkbox">✓</span>
              <span class="collab-obligation-title">Agenda Input · C-02</span>
            </div>
            <p class="collab-obligation-meta">Submitted 15:52 · closed on capture</p>
            <span class="collab-obligation-status closed">Closed</span>
          </div>
        </div>

        <!-- Linked Threads -->
        <div class="collab-details-section">
          <h4 class="collab-details-label">LINKED THREADS · 0</h4>
          <p class="collab-details-empty">No linked threads</p>
        </div>

        <!-- Activity Stream -->
        <div class="collab-details-section">
          <h4 class="collab-details-label">ACTIVITY STREAM</h4>
          <div class="collab-activity-bar">
            <div class="collab-activity-segment" style="width: 60%; background: #22c55e;"></div>
            <div class="collab-activity-segment" style="width: 25%; background: #f59e0b;"></div>
            <div class="collab-activity-segment" style="width: 15%; background: #ef4444;"></div>
          </div>
        </div>

        <!-- Meeting Recordings -->
        <div class="collab-details-section">
          <h4 class="collab-details-label">MEETING RECORDINGS · 4</h4>
          <div class="collab-recording">
            <span class="collab-recording-icon">▶</span>
            <div class="collab-recording-info">
              <p class="collab-recording-title">Call · 1 min</p>
              <p class="collab-recording-meta">29 Jul 16:08 · SME File Server</p>
            </div>
            <button class="collab-recording-action">View</button>
          </div>
          <div class="collab-recording">
            <span class="collab-recording-icon">▶</span>
            <div class="collab-recording-info">
              <p class="collab-recording-title">Call · 3 min</p>
              <p class="collab-recording-meta">28 Jul 14:30 · Network Sync</p>
            </div>
            <button class="collab-recording-action">View</button>
          </div>
        </div>
      </aside>

      <!-- RIGHT PANEL TOGGLE (Persistent) -->
      <div v-if="store.activeConversation" class="collab-right-toggle-container">
        <button @click="toggleRightPanel" class="collab-right-toggle" :title="rightPanelCollapsed ? 'Expand' : 'Collapse'">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path v-if="!rightPanelCollapsed" d="M15 19l-7-7 7-7"/>
            <path v-else d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ── MOBILE: Responsive Layout ── -->
    <!-- Left Drawer (Mobile) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mobileLeftOpen" class="collab-mobile-backdrop" @click="closeLeftDrawer"></div>
      </Transition>
      <Transition name="slide-left">
        <div v-if="mobileLeftOpen" class="collab-mobile-drawer left">
          <div class="collab-workspace-header">
            <div>
              <h2 class="collab-workspace-name">Concert</h2>
              <p class="collab-workspace-subtitle">Suburban workspace</p>
            </div>
            <button @click="closeLeftDrawer" class="collab-close-btn">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="collab-search">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="collab-search-icon">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search..." class="collab-search-input" />
          </div>

          <div class="collab-nav-section">
            <h3 class="collab-nav-label">THREADS</h3>
            <div class="collab-nav-list">
              <button
                v-for="thread in store.conversations.filter(c => c.category === 'group')"
                :key="thread.id"
                @click="selectThread(thread.id)"
                :class="['collab-nav-item', store.activeConversationId === thread.id ? 'active' : '']"
              >
                <span class="collab-nav-item-name">{{ thread.name }}</span>
                <span v-if="thread.unreadCount > 0" class="collab-nav-item-badge">{{ thread.unreadCount }}</span>
              </button>
            </div>
          </div>

          <div class="collab-nav-section">
            <h3 class="collab-nav-label">TEAMS</h3>
            <div class="collab-nav-list">
              <button
                v-for="team in store.conversations.filter(c => c.category === 'department')"
                :key="team.id"
                @click="selectThread(team.id)"
                :class="['collab-nav-item', store.activeConversationId === team.id ? 'active' : '']"
              >
                <span class="collab-nav-item-name">{{ team.name }}</span>
                <span v-if="team.unreadCount > 0" class="collab-nav-item-badge">{{ team.unreadCount }}</span>
              </button>
            </div>
          </div>

          <div class="collab-user-profile">
            <AvatarInitials :name="store.currentUserName" size="sm" />
            <div class="collab-user-info">
              <p class="collab-user-name">{{ store.currentUserName.split(' ')[0] }} {{ store.currentUserName.split(' ')[1]?.[0] }}...</p>
              <p class="collab-user-status">● Active now</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Right Drawer (Mobile) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mobileRightOpen" class="collab-mobile-backdrop" @click="closeRightDrawer"></div>
      </Transition>
      <Transition name="slide-right">
        <div v-if="mobileRightOpen && store.activeConversation" class="collab-mobile-drawer right">
          <div class="collab-details-header">
            <h3>Details</h3>
            <button @click="closeRightDrawer" class="collab-close-btn">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="collab-details-section">
            <h4 class="collab-details-label">THREAD INFORMATION</h4>
            <div class="collab-details-item">
              <span class="collab-details-key">Date of creation</span>
              <span class="collab-details-value">Today</span>
            </div>
            <div class="collab-details-item">
              <span class="collab-details-key">Thread Status</span>
              <span class="collab-details-value">Active Governance</span>
            </div>
          </div>

          <div class="collab-details-section">
            <h4 class="collab-details-label">VARIABLE OBLIGATIONS · 3</h4>
            <div class="collab-obligation-card">
              <div class="collab-obligation-header">
                <span class="collab-obligation-checkbox">☐</span>
                <span class="collab-obligation-title">Attendance Sign-in · C-01</span>
              </div>
              <p class="collab-obligation-meta">Field GPS check-in · due 16:17</p>
              <span class="collab-obligation-status due-soon">Due soon</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Schedule Meeting Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showScheduleModal" class="collab-modal-backdrop" @click="closeScheduleModal"></div>
      </Transition>
      <Transition name="fade">
        <div v-if="showScheduleModal" class="collab-modal">
          <div class="collab-modal-header">
            <h3>Schedule Meeting</h3>
            <button @click="closeScheduleModal" class="collab-modal-close">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="collab-modal-content">
            <div class="collab-form-group">
              <label class="collab-form-label">Meeting Title</label>
              <input v-model="newMeetingForm.title" type="text" class="collab-form-input" placeholder="e.g., Q3 Planning Session" />
            </div>
            <div class="collab-form-group">
              <label class="collab-form-label">Location</label>
              <input v-model="newMeetingForm.location" type="text" class="collab-form-input" placeholder="e.g., HQ-Conference Room A" />
            </div>
            <div class="collab-form-row">
              <div class="collab-form-group">
                <label class="collab-form-label">Date</label>
                <input v-model="newMeetingForm.date" type="date" class="collab-form-input" />
              </div>
              <div class="collab-form-group">
                <label class="collab-form-label">Start Time</label>
                <input v-model="newMeetingForm.startTime" type="time" class="collab-form-input" />
              </div>
              <div class="collab-form-group">
                <label class="collab-form-label">End Time</label>
                <input v-model="newMeetingForm.endTime" type="time" class="collab-form-input" />
              </div>
            </div>
            <div class="collab-form-group">
              <label class="collab-form-label">Organiser</label>
              <input v-model="newMeetingForm.organiser" type="text" class="collab-form-input" placeholder="Your name" />
            </div>
            <div class="collab-form-group">
              <label class="collab-form-label">Note-taker</label>
              <input v-model="newMeetingForm.noteTaker" type="text" class="collab-form-input" placeholder="Assigned note-taker" />
            </div>
          </div>
          <div class="collab-modal-footer">
            <button @click="closeScheduleModal" class="collab-secondary-btn">Cancel</button>
            <button @click="saveMeeting" class="collab-primary-btn">Schedule Meeting</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Meeting Details Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedMeeting" class="collab-modal-backdrop" @click="closeMeetingDetails"></div>
      </Transition>
      <Transition name="fade">
        <div v-if="selectedMeeting" class="collab-modal">
          <div class="collab-modal-header">
            <h3>{{ selectedMeeting.title }}</h3>
            <button @click="closeMeetingDetails" class="collab-modal-close">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="collab-modal-content">
            <div class="collab-details-item">
              <span class="collab-details-key">Location</span>
              <span class="collab-details-value">{{ selectedMeeting.location }}</span>
            </div>
            <div class="collab-details-item">
              <span class="collab-details-key">Date & Time</span>
              <span class="collab-details-value">{{ selectedMeeting.date }} · {{ selectedMeeting.time }}–{{ selectedMeeting.endTime }}</span>
            </div>
            <div class="collab-details-item">
              <span class="collab-details-key">Participants</span>
              <span class="collab-details-value">{{ selectedMeeting.participants.map(p => p.name).join(', ') }}</span>
            </div>
            <div class="collab-details-item">
              <span class="collab-details-key">Obligations</span>
              <span class="collab-details-value">{{ selectedMeeting.obligationCount }} total</span>
            </div>
            <div v-if="selectedMeeting.breachedCount > 0" class="collab-details-item">
              <span class="collab-details-key">Breached</span>
              <span class="collab-details-value" style="color: #b91c1c;">{{ selectedMeeting.breachedCount }}</span>
            </div>
          </div>
          <div class="collab-modal-footer">
            <button @click="closeMeetingDetails" class="collab-secondary-btn">Close</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Container ── */
.collab-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  background: #f9fafb;
  overflow: hidden;
}

/* ── Desktop Layout ── */
.collab-desktop {
  display: flex;
  height: 100%;
  gap: 0;
  overflow: hidden;
  position: relative;
}

/* ── LEFT SIDEBAR ── */
.collab-left {
  display: flex;
  flex-direction: column;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  width: 228px;
}

.collab-workspace-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.collab-workspace-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.collab-workspace-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.collab-workspace-action {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s;
  flex-shrink: 0;
}

.collab-workspace-action:hover {
  background: #f3f4f6;
  color: #111827;
}

.collab-search {
  position: relative;
  margin: 0.75rem;
}

.collab-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.collab-search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  background: #f9fafb;
  color: #111827;
  outline: none;
  transition: all 0.15s;
}

.collab-search-input:focus {
  border-color: #FD4F00;
  background: white;
}

.collab-nav-section {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.collab-nav-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 0.5rem;
  margin: 0 0 0.5rem 0;
}

.collab-nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.collab-nav-item {
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  transition: all 0.15s;
}

.collab-nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.collab-nav-item.active {
  background: #FEE7DC;
  color: #FD4F00;
  font-weight: 600;
}

.collab-nav-item-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collab-nav-item-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #FD4F00;
  color: white;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  flex-shrink: 0;
}

.collab-user-profile {
  padding: 1rem 0.75rem;
  margin-top: auto;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collab-user-info {
  flex: 1;
  min-width: 0;
}

.collab-user-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collab-user-status {
  font-size: 0.625rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

/* ── CENTER: THREAD VIEW ── */
.collab-center {
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
  min-width: 0;
  flex: 1;
}

.collab-thread-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.collab-thread-title-area {
  flex: 1;
  min-width: 0;
}

.collab-thread-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.collab-thread-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.collab-search-compact {
  position: relative;
  display: none;
}

@media (min-width: 1280px) {
  .collab-search-compact {
    display: flex;
    align-items: center;
  }
}

.collab-search-compact {
  position: relative;
  width: 160px;
}

.collab-search-compact svg {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.collab-search-compact-input {
  width: 100%;
  padding: 0.375rem 0.5rem 0.375rem 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  background: #f9fafb;
  color: #111827;
  outline: none;
  transition: all 0.15s;
}

.collab-search-compact-input:focus {
  border-color: #FD4F00;
  background: white;
}

.collab-participants-stack {
  display: flex;
  align-items: center;
  height: 32px;
}

.collab-participants-more {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  border: 2px solid white;
}

.collab-icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s;
}

.collab-icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

/* ── Tabs ── */
.collab-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.5rem;
  flex-shrink: 0;
  overflow-x: auto;
}

.collab-tab {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.collab-tab:hover {
  color: #111827;
}

.collab-tab.active {
  color: #FD4F00;
  border-bottom-color: #FD4F00;
}

/* ── Tab Content ── */
.collab-tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.collab-placeholder {
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.collab-no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

/* ── Governance Banner ── */
.collab-governance-banner {
  padding: 1rem 1.5rem;
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.collab-governance-content {
  flex: 1;
  min-width: 0;
}

.collab-governance-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #b45309;
  margin: 0;
}

.collab-governance-subtitle {
  font-size: 0.75rem;
  color: #92400e;
  margin: 0.25rem 0 0 0;
}

.collab-governance-action {
  padding: 0.375rem 0.75rem;
  background: #fbbf24;
  color: #78350f;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s;
}

.collab-governance-action:hover {
  background: #f59e0b;
}

/* ── Messages ── */
.collab-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
}

.collab-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #9ca3af;
}

.collab-empty-icon {
  width: 32px;
  height: 32px;
}

.collab-empty-text {
  font-size: 0.875rem;
}

.collab-date-separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0 0.5rem 0;
}

.collab-date-separator::before,
.collab-date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.collab-date-separator span {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
}

.collab-message-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 0.25rem;
}

.collab-message-wrapper.sent {
  flex-direction: row-reverse;
  align-items: flex-end;
}

.collab-message-avatar-container {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.collab-message-avatar {
  width: 100%;
  height: 100%;
}

.collab-message-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 60%;
}

.collab-message-wrapper.sent .collab-message-group {
  align-items: flex-end;
}

.collab-message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
}

.collab-message-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
}

.collab-message-time {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.collab-message-time-right {
  font-size: 0.6875rem;
  color: #9ca3af;
  padding: 0 0.75rem;
}

.collab-message-body {
  padding: 0.625rem 0.875rem;
  background: #f3f4f6;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}

.collab-message-wrapper.sent .collab-message-body {
  background: #FEE7DC;
  color: #111827;
}

/* ── Attachment Card ── */
.collab-attachment-card {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collab-attachment-image-preview {
  position: relative;
  width: 100%;
  max-width: 280px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f3f4f6;
}

.collab-attachment-image-preview img {
  width: 100%;
  height: auto;
  display: block;
  max-height: 300px;
  object-fit: cover;
}

.collab-attachment-file {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.collab-attachment-file svg {
  flex-shrink: 0;
}

.collab-attachment-info {
  flex: 1;
  min-width: 0;
}

.collab-attachment-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collab-attachment-meta {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.125rem 0 0 0;
}

.collab-attachment-action {
  flex-shrink: 0;
}

.collab-attachment-btn {
  padding: 0.375rem 0.75rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.collab-attachment-btn:hover {
  border-color: #FD4F00;
  color: #FD4F00;
}

/* ── Composer ── */
.collab-composer-area {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  position: relative;
  background: white;
}

.collab-drag-overlay {
  position: absolute;
  inset: 0;
  background: rgba(253, 79, 0, 0.06);
  border: 2px dashed #FD4F00;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #FD4F00;
  pointer-events: none;
  z-index: 10;
}

.collab-drag-overlay svg {
  width: 32px;
  height: 32px;
}

.collab-drag-overlay p {
  font-size: 0.875rem;
  font-weight: 500;
}

.collab-composer-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.collab-pending-file-preview {
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collab-pending-image-thumb {
  position: relative;
  width: 100%;
  max-width: 120px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
  border: 1px solid #e5e7eb;
}

.collab-pending-image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collab-pending-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
}

.collab-pending-remove:hover {
  background: rgba(0, 0, 0, 0.7);
}

.collab-pending-file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.collab-pending-file-info svg {
  flex-shrink: 0;
}

.collab-pending-text {
  flex: 1;
  min-width: 0;
}

.collab-pending-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collab-pending-size {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.125rem 0 0 0;
}

.collab-composer {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.15s;
}

.collab-composer:focus-within {
  border-color: #FD4F00;
  background: white;
  box-shadow: 0 0 0 3px rgba(253, 79, 0, 0.05);
}

.collab-composer-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s;
  flex-shrink: 0;
}

.collab-composer-btn:hover {
  background: white;
  color: #111827;
}

.collab-composer-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: #111827;
  outline: none;
  resize: none;
  background: transparent;
  transition: all 0.15s;
}

.collab-composer-input::placeholder {
  color: #9ca3af;
}

.collab-composer-input:focus {
  outline: none;
}

.collab-composer-send {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.collab-composer-send:disabled {
  cursor: not-allowed;
}

.collab-composer-send:hover:not(:disabled) {
  opacity: 0.9;
}

/* ── RIGHT SIDEBAR: DETAILS ── */
.collab-right {
   display: flex;
   flex-direction: column;
   background: white;
   border-left: 1px solid #e5e7eb;
   overflow-y: auto;
   overflow-x: hidden;
   position: relative;
   transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   flex-shrink: 0;
   width: 320px;
}

.collab-right.collapsed {
   width: 0;
   border-left: none;
   overflow: hidden;
   opacity: 0;
   pointer-events: none;
}

/* ── RIGHT PANEL TOGGLE CONTAINER (Persistent) ── */
.collab-right-toggle-container {
   display: flex;
   align-items: center;
   justify-content: center;
   background: white;
   border-left: 1px solid #e5e7eb;
   flex-shrink: 0;
   width: 24px;
   height: 100%;
   transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collab-right-toggle {
   width: 24px;
   height: 24px;
   display: flex;
   align-items: center;
   justify-content: center;
   border: 1px solid #e5e7eb;
   background: white;
   color: #6b7280;
   cursor: pointer;
   border-radius: 0.375rem;
   transition: all 0.15s;
   z-index: 10;
   padding: 0;
}

.collab-right-toggle:hover {
   background: #f3f4f6;
   color: #111827;
   border-color: #d1d5db;
}

.collab-details-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.collab-details-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.collab-details-section {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.collab-details-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.75rem 0;
}

.collab-details-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.collab-details-key {
  color: #6b7280;
}

.collab-details-value {
  color: #111827;
  font-weight: 500;
}

.collab-details-empty {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

/* ── Obligation Cards ── */
.collab-obligation-card {
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.collab-obligation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.collab-obligation-checkbox {
  font-size: 0.875rem;
  color: #6b7280;
  flex-shrink: 0;
}

.collab-obligation-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111827;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collab-obligation-meta {
  font-size: 0.625rem;
  color: #9ca3af;
  margin: 0 0 0.5rem 1.375rem;
}

.collab-obligation-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  margin-left: 1.375rem;
}

.collab-obligation-status.due-soon {
  background: #fef3c7;
  color: #b45309;
}

.collab-obligation-status.breached {
  background: #fee2e2;
  color: #b91c1c;
}

.collab-obligation-status.closed {
  background: #dcfce7;
  color: #15803d;
}

/* ── Activity Bar ── */
.collab-activity-bar {
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  gap: 2px;
}

.collab-activity-segment {
  border-radius: 3px;
}

/* ── Recordings ── */
.collab-recording {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.collab-recording-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FEE7DC;
  color: #FD4F00;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  flex-shrink: 0;
}

.collab-recording-info {
  flex: 1;
  min-width: 0;
}

.collab-recording-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
}

.collab-recording-meta {
  font-size: 0.625rem;
  color: #9ca3af;
  margin: 0.25rem 0 0 0;
}

.collab-recording-action {
  padding: 0.375rem 0.75rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s;
}

.collab-recording-action:hover {
  border-color: #FD4F00;
  color: #FD4F00;
}

/* ── Direct @Mentions ── */
.collab-mentions-content {
   display: flex;
   flex-direction: column;
   overflow: hidden;
}

.collab-mentions-header {
   padding: 1.5rem 1.5rem;
   border-bottom: 1px solid #e5e7eb;
   display: flex;
   align-items: flex-start;
   justify-content: space-between;
   gap: 1rem;
   flex-shrink: 0;
}

.collab-mentions-title-area {
   flex: 1;
   min-width: 0;
}

.collab-mentions-title {
   font-size: 1.125rem;
   font-weight: 600;
   color: #111827;
   margin: 0;
}

.collab-mentions-subtitle {
   font-size: 0.875rem;
   color: #6b7280;
   margin: 0.25rem 0 0 0;
}

.collab-mentions-filters {
   padding: 1rem 1.5rem;
   border-bottom: 1px solid #e5e7eb;
   display: flex;
   gap: 0.75rem;
   flex-shrink: 0;
   flex-wrap: wrap;
}

.collab-mentions-filter-btn {
   padding: 0.5rem 1rem;
   background: white;
   color: #6b7280;
   border: 1px solid #e5e7eb;
   border-radius: 0.5rem;
   font-size: 0.875rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.15s;
}

.collab-mentions-filter-btn:hover {
   border-color: #d1d5db;
   color: #111827;
}

.collab-mentions-filter-btn.active {
   background: #FD4F00;
   color: white;
   border-color: #FD4F00;
}

.collab-mentions-list {
   flex: 1;
   overflow-y: auto;
   padding: 1rem 1.5rem;
   display: flex;
   flex-direction: column;
   gap: 1rem;
   min-height: 0;
}

.collab-mentions-empty {
   flex: 1;
   display: flex;
   align-items: center;
   justify-content: center;
   color: #9ca3af;
   font-size: 0.875rem;
}

.collab-mention-card {
   display: flex;
   gap: 1rem;
   padding: 1rem;
   background: white;
   border: 1px solid #e5e7eb;
   border-radius: 0.75rem;
   cursor: pointer;
   transition: all 0.15s;
}

.collab-mention-card:hover {
   border-color: #d1d5db;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.collab-mention-card.unread {
   background: #fffbeb;
   border-color: #fde68a;
}

.collab-mention-avatar {
   flex-shrink: 0;
   width: 40px;
   height: 40px;
}

.collab-mention-content {
   flex: 1;
   min-width: 0;
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
}

.collab-mention-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 1rem;
}

.collab-mention-sender {
   font-size: 0.875rem;
   font-weight: 600;
   color: #111827;
}

.collab-mention-timestamp {
   font-size: 0.75rem;
   color: #9ca3af;
   white-space: nowrap;
   flex-shrink: 0;
}

.collab-mention-message {
   font-size: 0.875rem;
   color: #111827;
   margin: 0;
   line-height: 1.5;
   word-wrap: break-word;
}

.collab-mention-footer {
   display: flex;
   align-items: center;
   gap: 0.75rem;
   flex-wrap: wrap;
}

.collab-mention-thread {
   font-size: 0.75rem;
   color: #6b7280;
   font-weight: 500;
}

.collab-mention-obligation-badge {
   display: inline-block;
   padding: 0.25rem 0.5rem;
   background: #fef3c7;
   color: #b45309;
   border-radius: 0.375rem;
   font-size: 0.625rem;
   font-weight: 600;
}

/* ── MOBILE LAYOUT ── */
@media (max-width: 1023px) {
   .collab-desktop {
     grid-template-columns: 1fr;
   }

   .collab-left,
   .collab-right {
     display: none;
   }

   .collab-right-toggle {
     display: none;
   }

   .collab-icon-btn.lg\:hidden {
     display: flex;
   }

  .collab-messages {
    padding: 0.75rem 1rem;
  }

  .collab-composer-area {
    padding: 0.75rem 1rem;
  }

  .collab-message-group {
    max-width: 85%;
  }

  .collab-message-wrapper.sent .collab-message-group {
    max-width: 85%;
  }

  .collab-attachment-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .collab-attachment-image-preview {
    max-width: 100%;
  }

  .collab-mentions-header {
    padding: 1rem 1rem;
  }

  .collab-mentions-filters {
    padding: 0.75rem 1rem;
  }

  .collab-mentions-list {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 640px) {
  .collab-message-group {
    max-width: 90%;
  }

  .collab-message-wrapper.sent .collab-message-group {
    max-width: 90%;
  }

  .collab-pending-image-thumb {
    max-width: 100px;
    height: 70px;
  }
}

/* ── Mobile Drawers ── */
.collab-mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 40;
}

.collab-mobile-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: white;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.collab-mobile-drawer.left {
  left: 0;
}

.collab-mobile-drawer.right {
  right: 0;
}

.collab-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s;
  flex-shrink: 0;
}

.collab-close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* ── Scrollbar ── */
.collab-left::-webkit-scrollbar,
.collab-right::-webkit-scrollbar,
.collab-messages::-webkit-scrollbar {
  width: 6px;
}

.collab-left::-webkit-scrollbar-track,
.collab-right::-webkit-scrollbar-track,
.collab-messages::-webkit-scrollbar-track {
  background: transparent;
}

.collab-left::-webkit-scrollbar-thumb,
.collab-right::-webkit-scrollbar-thumb,
.collab-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.collab-left::-webkit-scrollbar-thumb:hover,
.collab-right::-webkit-scrollbar-thumb:hover,
.collab-messages::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ── Meeting Schedule ── */
.collab-meetings-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.collab-meetings-header {
  padding: 1.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.collab-meetings-title-area {
  flex: 1;
  min-width: 0;
}

.collab-meetings-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.collab-meetings-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.collab-primary-btn {
  padding: 0.625rem 1rem;
  background: #FD4F00;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s;
}

.collab-primary-btn:hover {
  background: #e64a00;
  box-shadow: 0 2px 8px rgba(253, 79, 0, 0.2);
}

.collab-secondary-btn {
  padding: 0.625rem 1rem;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.collab-secondary-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

.collab-meetings-section {
  padding: 1.5rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.collab-meetings-section:last-child {
  border-bottom: none;
}

.collab-meetings-section-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 0;
}

.collab-meetings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.collab-meeting-card {
  display: flex;
  align-items: stretch;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.collab-meeting-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.collab-meeting-accent {
  width: 4px;
  background: #f59e0b;
  flex-shrink: 0;
}

.collab-meeting-card.breached .collab-meeting-accent {
  background: #ef4444;
}

.collab-meeting-card.pending .collab-meeting-accent {
  background: #3b82f6;
}

.collab-meeting-card.retrospective .collab-meeting-accent {
  background: #8b5cf6;
}

.collab-meeting-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.collab-meeting-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collab-meeting-meta {
  font-size: 0.8125rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.collab-meeting-location {
  font-weight: 500;
}

.collab-meeting-datetime {
  white-space: nowrap;
}

.collab-meeting-window {
  color: #9ca3af;
  font-style: italic;
}

.collab-meeting-separator {
  color: #d1d5db;
}

.collab-meeting-participants {
  display: flex;
  align-items: center;
  height: 24px;
  margin-top: 0.25rem;
}

.collab-meeting-participants-more {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 600;
  border: 2px solid white;
}

.collab-meeting-obligations {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
  border-left: 1px solid #f3f4f6;
  min-width: 100px;
}

.collab-meeting-obligation-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.collab-meeting-obligation-status {
  font-size: 0.625rem;
  font-weight: 600;
  text-align: center;
  color: #6b7280;
}

.collab-meeting-obligation-status.breached {
  color: #b91c1c;
}

.collab-meeting-obligation-status.pending {
  color: #1e40af;
}

.collab-meeting-obligation-status.neutral {
  color: #6b7280;
}

/* ── Modal ── */
.collab-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 60;
}

.collab-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  z-index: 70;
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.collab-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.collab-modal-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.collab-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s;
  flex-shrink: 0;
}

.collab-modal-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.collab-modal-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.collab-modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
}

.collab-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.collab-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.collab-form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.collab-form-input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: all 0.15s;
}

.collab-form-input:focus {
  border-color: #FD4F00;
  box-shadow: 0 0 0 3px rgba(253, 79, 0, 0.05);
}

.collab-form-input::placeholder {
  color: #9ca3af;
}

/* ── Responsive ── */
@media (max-width: 1023px) {
  .collab-meetings-header {
    flex-direction: column;
    align-items: stretch;
  }

  .collab-primary-btn {
    width: 100%;
    text-align: center;
  }

  .collab-meeting-card {
    flex-direction: column;
  }

  .collab-meeting-obligations {
    border-left: none;
    border-top: 1px solid #f3f4f6;
    flex-direction: row;
    justify-content: space-around;
    padding: 0.75rem 1rem;
    min-width: auto;
  }

  .collab-form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .collab-modal {
    width: 95vw;
    max-height: 95vh;
  }

  .collab-modal-header {
    padding: 1rem;
  }

  .collab-modal-content {
    padding: 1rem;
  }

  .collab-modal-footer {
    padding: 1rem;
    flex-direction: column-reverse;
  }

  .collab-secondary-btn,
  .collab-primary-btn {
    width: 100%;
  }

  .collab-meetings-header {
    padding: 1rem;
  }

  .collab-meetings-section {
    padding: 1rem;
  }

  .collab-meeting-card {
    flex-direction: column;
  }

  .collab-meeting-obligations {
    border-left: none;
    border-top: 1px solid #f3f4f6;
    flex-direction: row;
    justify-content: space-around;
    padding: 0.75rem 1rem;
    min-width: auto;
  }
}
</style>
