<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalsStore } from '../../stores/approvals'
import AvatarInitials from '../common/AvatarInitials.vue'
import ChatDrawer from '../common/ChatDrawer.vue'
import ChatButton from '../common/ChatButton.vue'
import type { ChatContext } from '../common/ChatDrawer.vue'

const store = useApprovalsStore()
const expandedId = ref<string | null>(store.pendingSchedules[0]?.id || null)
const chatState = ref<{ scheduleId: string; taskId: string } | null>(null)

const toggle = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const allTasksReviewed = (sch: typeof store.pendingSchedules[0]) =>
  sch.tasks.every(t => t.approved !== null)

const chatTask = computed(() => {
  if (!chatState.value) return null
  const sch = store.pendingSchedules.find(s => s.id === chatState.value!.scheduleId)
  return sch?.tasks.find(t => t.id === chatState.value!.taskId) || null
})

const chatSchedule = computed(() => {
  if (!chatState.value) return null
  return store.pendingSchedules.find(s => s.id === chatState.value!.scheduleId) || null
})

const chatContext = computed<ChatContext | null>(() => {
  const t = chatTask.value
  const s = chatSchedule.value
  if (!t || !s) return null
  return {
    kpi: t.kpiName,
    objective: t.objective,
    taskTitle: t.description,
    time: `${t.startTime} – ${t.endTime}`,
    status: t.approved === true ? 'Approved' : t.approved === false ? 'Rejected' : 'Pending Approval',
    participantName: s.employeeName,
    participantRole: s.employeeRole,
  }
})

const handleSend = (message: string) => {
  if (!chatState.value) return
  store.addScheduleMessage(chatState.value.scheduleId, chatState.value.taskId, message)
}

const handleMarkRead = () => {
  if (!chatState.value) return
  store.markScheduleMessagesRead(chatState.value.scheduleId, chatState.value.taskId, 'supervisor')
}

const getUnread = (scheduleId: string, taskId: string) =>
  store.getScheduleUnreadCount(scheduleId, taskId, 'supervisor')

const updateComment = (scheduleId: string, taskId: string, comment: string) =>
  store.setScheduleComment(scheduleId, taskId, comment)
</script>

<template>
  <div class="space-y-4">
    <div v-if="!store.pendingSchedules.length" class="card p-12 text-center">
      <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <p class="text-sm text-gray-500">No schedules pending approval</p>
    </div>

    <div v-for="sch in store.pendingSchedules" :key="sch.id" class="card">
      <!-- Employee header -->
      <button @click="toggle(sch.id)" class="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors text-left">
        <AvatarInitials :name="sch.employeeName" size="md" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ sch.employeeName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ sch.employeeRole }} · {{ sch.date }}</p>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <span v-if="sch.scheduleApproved === true" class="badge badge-green text-xs">Approved</span>
          <span v-else-if="sch.scheduleApproved === false" class="badge badge-red text-xs">Rejected</span>
          <span v-else class="badge badge-amber text-xs">{{ sch.status }}</span>
          <svg :class="['w-4 h-4 text-gray-400 transition-transform', expandedId === sch.id ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>

      <!-- Tasks -->
      <Transition name="slide-down">
        <div v-if="expandedId === sch.id" class="border-t border-gray-100">
          <div class="divide-y divide-gray-50">
            <div v-for="task in sch.tasks" :key="task.id" class="px-4 sm:px-6 py-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded-full">{{ task.kpiName }}</span>
                    <span v-if="task.isMeeting" class="badge badge-blue text-xs">Meeting</span>
                  </div>
                  <p class="text-xs text-gray-500 mb-1">{{ task.objective }}</p>
                  <p class="text-sm font-medium text-gray-900">{{ task.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ task.startTime }} – {{ task.endTime }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0 flex-wrap">
                  <ChatButton
                    :unread-count="getUnread(sch.id, task.id)"
                    @click="chatState = { scheduleId: sch.id, taskId: task.id }"
                  />
                  <span v-if="task.approved === true" class="badge badge-green">Approved</span>
                  <span v-else-if="task.approved === false" class="badge badge-red">Rejected</span>
                </div>
              </div>

              <!-- Approve / Reject actions -->
              <div v-if="task.approved === null" class="flex flex-col sm:flex-row gap-2 mt-4">
                <button @click="store.approveScheduleTask(sch.id, task.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors border border-green-100 min-h-11">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Approve Task
                </button>
                <button @click="store.rejectScheduleTask(sch.id, task.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-100 min-h-11">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Reject Task
                </button>
              </div>

              <!-- Task Comment -->
              <div class="mt-4">
                <label class="text-xs font-medium text-gray-500 mb-1.5 block">Comment <span class="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  :value="task.comment"
                  @input="updateComment(sch.id, task.id, ($event.target as HTMLTextAreaElement).value)"
                  rows="2"
                  placeholder="Leave a review note for this task..."
                  class="input text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Accept Schedule footer -->
          <div class="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p class="text-sm text-gray-600">
              {{ sch.tasks.filter(t => t.approved !== null).length }} / {{ sch.tasks.length }} tasks reviewed
            </p>
            <button
              v-if="sch.scheduleApproved === null"
              @click="store.approveSchedule(sch.id)"
              :disabled="!allTasksReviewed(sch)"
              :class="['btn-primary text-sm w-full sm:w-auto justify-center', !allTasksReviewed(sch) ? 'opacity-40 cursor-not-allowed' : '']"
            >
              Accept Schedule
            </button>
            <span v-else class="badge badge-green text-sm px-3 py-1.5">Schedule Accepted</span>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Shared Chat Drawer -->
    <ChatDrawer
      v-if="chatState && chatTask && chatContext"
      :messages="chatTask.conversation"
      :context="chatContext"
      :current-role="'supervisor'"
      :current-sender="'Sarah Mitchell'"
      @close="chatState = null"
      @send="handleSend"
      @mark-read="handleMarkRead"
    />
  </div>
</template>
