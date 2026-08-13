<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSchedulesStore } from '../../stores/schedules'
import KpiStatCard from '../../components/common/KpiStatCard.vue'
import ScheduleCard from '../../components/schedules/ScheduleCard.vue'
import NewScheduleModal from '../../components/schedules/NewScheduleModal.vue'
import ChatDrawer from '../../components/common/ChatDrawer.vue'
import DatePicker from '../../components/common/DatePicker.vue'
import { useAuthStore } from '../../stores/auth'
import ConfirmModal from '../../components/common/ConfirmModal.vue'

const store = useSchedulesStore()
const auth = useAuthStore()

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const showNewModal = ref(false)
const closingDayId = ref<string | null>(null)

const chatState = ref<{ scheduleId: string; taskId: string } | null>(null)

const filteredSchedules = computed(() => {
  let result = store.schedules
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => s.tasks.some(t => t.description.toLowerCase().includes(q) || t.kpiName.toLowerCase().includes(q)))
  }
  if (statusFilter.value) {
    result = result.filter(s => s.status === statusFilter.value)
  }
  return result
})

const groups = computed(() => {
  const today = filteredSchedules.value.filter(s => s.dateGroup === 'Today')
  const yesterday = filteredSchedules.value.filter(s => s.dateGroup === 'Yesterday')
  const earlier = filteredSchedules.value.filter(s => s.dateGroup === 'Earlier')
  return { today, yesterday, earlier }
})

const openChat = (scheduleId: string, taskId: string) => {
  chatState.value = { scheduleId, taskId }
}
const closeChat = () => { chatState.value = null }

const chatTask = computed(() => {
  if (!chatState.value) return null
  const sch = store.schedules.find(s => s.id === chatState.value!.scheduleId)
  return sch?.tasks.find(t => t.id === chatState.value!.taskId) || null
})

const chatContext = computed(() => {
  const t = chatTask.value
  if (!t) return null
  return {
    kpi: t.kpiName,
    objective: t.objective,
    taskTitle: t.description,
    time: `${t.startTime} – ${t.endTime}`,
    status: t.status,
    participantName: 'Sarah Mitchell',
    participantRole: 'Supervisor',
  }
})

const handleSend = (message: string) => {
  if (!chatState.value) return
  store.addChatMessage(chatState.value.scheduleId, chatState.value.taskId, {
    sender: auth.user.name,
    role: 'employee',
    message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    unread: true,
  })
}

const handleMarkRead = () => {
  if (!chatState.value) return
  store.markMessagesRead(chatState.value.scheduleId, chatState.value.taskId, 'employee')
}

const requestCloseOutDay = (scheduleId: string) => {
  closingDayId.value = scheduleId
}

const confirmCloseOutDay = () => {
  if (closingDayId.value) {
    store.closeOutDay(closingDayId.value)
    closingDayId.value = null
  }
}

const statCards = computed(() => [
  { label: 'Average Score', value: store.stats.averageScore, icon: 'chart-bar', subtitle: 'This quarter' },
  { label: 'Total Schedules', value: String(store.stats.total), icon: 'calendar', subtitle: 'All records' },
  { label: 'Completed', value: String(store.stats.completed), icon: 'check', subtitle: 'Approved & closed' },
  { label: 'Pending', value: String(store.stats.pending), icon: 'clock', subtitle: 'Awaiting action' },
])
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Daily Schedules</h1>
        <p class="text-sm text-gray-500 mt-0.5">Track and manage your daily work schedule for KPI appraisal</p>
      </div>
      <button @click="showNewModal = true" class="btn-primary w-full sm:w-auto justify-center">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        New Schedule
      </button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiStatCard v-for="card in statCards" :key="card.label" v-bind="card" />
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-6">
      <div class="relative flex-1 min-w-0 sm:min-w-48">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search schedules..." class="input pl-9" />
      </div>
      <select v-model="statusFilter" class="select w-full sm:w-44">
        <option value="">All Statuses</option>
        <option>Pending</option>
        <option>Approved</option>
        <option>Awaiting Close Out</option>
        <option>Closed Out</option>
      </select>
      <div class="w-full sm:w-auto">
        <DatePicker v-model="dateFilter" />
      </div>
    </div>

    <!-- Today -->
    <div v-if="groups.today.length" class="mb-6">
      <div class="flex items-center gap-3 mb-3">
        <p class="text-sm font-semibold text-gray-900">Today</p>
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="badge badge-orange">{{ groups.today.length }}</span>
      </div>
      <div class="space-y-3">
        <ScheduleCard
          v-for="sch in groups.today"
          :key="sch.id"
          :schedule="sch"
          @open-chat="openChat"
          @close-out-day="requestCloseOutDay"
        />
      </div>
    </div>

    <!-- Yesterday -->
    <div v-if="groups.yesterday.length" class="mb-6">
      <div class="flex items-center gap-3 mb-3">
        <p class="text-sm font-semibold text-gray-900">Yesterday</p>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>
      <div class="space-y-3">
        <ScheduleCard
          v-for="sch in groups.yesterday"
          :key="sch.id"
          :schedule="sch"
          @open-chat="openChat"
          @close-out-day="requestCloseOutDay"
        />
      </div>
    </div>

    <!-- Earlier -->
    <div v-if="groups.earlier.length" class="mb-6">
      <div class="flex items-center gap-3 mb-3">
        <p class="text-sm font-semibold text-gray-900">Earlier</p>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>
      <div class="space-y-3">
        <ScheduleCard
          v-for="sch in groups.earlier"
          :key="sch.id"
          :schedule="sch"
          @open-chat="openChat"
          @close-out-day="requestCloseOutDay"
        />
      </div>
    </div>

    <div v-if="!filteredSchedules.length" class="card p-12 text-center">
      <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <p class="text-sm text-gray-500">No schedules found</p>
    </div>

    <!-- New Schedule Modal -->
    <NewScheduleModal v-if="showNewModal" @close="showNewModal = false" />

    <!-- Chat Drawer -->
    <ChatDrawer
      v-if="chatState && chatTask && chatContext"
      :messages="chatTask.chatMessages"
      :context="chatContext"
      :current-role="'employee'"
      :current-sender="auth.user.name"
      @close="closeChat"
      @send="handleSend"
      @mark-read="handleMarkRead"
    />

    <!-- Close Out Day Modal -->
    <ConfirmModal
      v-if="closingDayId"
      title="Close Out Workday"
      message="You are about to close out your workday. You will no longer be able to edit today's schedule unless your supervisor reopens it."
      confirm-label="Confirm Close Out"
      @confirm="confirmCloseOutDay"
      @cancel="closingDayId = null"
    />
  </div>
</template>
