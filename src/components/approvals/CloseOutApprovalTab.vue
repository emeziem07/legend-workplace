<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalsStore } from '../../stores/approvals'
import AvatarInitials from '../common/AvatarInitials.vue'
import ChatDrawer from '../common/ChatDrawer.vue'
import ChatButton from '../common/ChatButton.vue'
import type { ChatContext } from '../common/ChatDrawer.vue'

const store = useApprovalsStore()
const expandedId = ref<string | null>(store.closeOutApprovals[0]?.id || null)
const chatState = ref<{ caId: string; taskId: string } | null>(null)

const toggle = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const allTasksReviewed = (ca: typeof store.closeOutApprovals[0]) =>
  ca.tasks.every(t => t.approved !== null)

const chatTask = computed(() => {
  if (!chatState.value) return null
  const ca = store.closeOutApprovals.find(c => c.id === chatState.value!.caId)
  return ca?.tasks.find(t => t.id === chatState.value!.taskId) || null
})

const chatCA = computed(() => {
  if (!chatState.value) return null
  return store.closeOutApprovals.find(c => c.id === chatState.value!.caId) || null
})

const chatContext = computed<ChatContext | null>(() => {
  const t = chatTask.value
  const ca = chatCA.value
  if (!t || !ca) return null
  return {
    kpi: t.kpiName,
    objective: t.objective,
    taskTitle: t.description,
    status: t.approved === true ? 'Approved' : t.approved === false ? 'Rejected' : 'Pending Close Out',
    participantName: ca.employeeName,
    participantRole: ca.employeeRole,
  }
})

const handleSend = (message: string) => {
  if (!chatState.value) return
  store.addCloseOutMessage(chatState.value.caId, chatState.value.taskId, message)
}

const handleMarkRead = () => {
  if (!chatState.value) return
  store.markCloseOutMessagesRead(chatState.value.caId, chatState.value.taskId, 'supervisor')
}

const getUnread = (caId: string, taskId: string) =>
  store.getCloseOutUnreadCount(caId, taskId, 'supervisor')

const updateComment = (caId: string, taskId: string, comment: string) =>
  store.setCloseOutComment(caId, taskId, comment)
</script>

<template>
  <div class="space-y-4">
    <div v-if="!store.closeOutApprovals.length" class="card p-12 text-center">
      <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <p class="text-sm text-gray-500">No close out schedules pending review</p>
    </div>

    <div v-for="ca in store.closeOutApprovals" :key="ca.id" class="card">
      <button @click="toggle(ca.id)" class="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors text-left">
        <AvatarInitials :name="ca.employeeName" size="md" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ ca.employeeName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ ca.employeeRole }} · {{ ca.date }} · Day close out</p>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <span v-if="ca.dayApproved === true" class="badge badge-green text-xs">Approved</span>
          <span v-else-if="ca.dayApproved === false" class="badge badge-red text-xs">Rejected</span>
          <span v-else class="badge badge-amber text-xs">Pending Review</span>
          <svg :class="['w-4 h-4 text-gray-400 transition-transform', expandedId === ca.id ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>

      <Transition name="slide-down">
        <div v-if="expandedId === ca.id" class="border-t border-gray-100">
          <div class="divide-y divide-gray-50">
            <div v-for="task in ca.tasks" :key="task.id" class="px-4 sm:px-6 py-5">
              <div class="mb-4">
                <span class="text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded-full">{{ task.kpiName }}</span>
                <p class="text-xs text-gray-500 mt-2 mb-1">{{ task.objective }}</p>
                <p class="text-sm font-medium text-gray-900 mb-3">{{ task.description }}</p>

                <!-- Close Out Notes -->
                <div class="p-4 bg-green-50 rounded-xl border border-green-100 mb-3">
                  <p class="text-xs font-semibold text-green-700 mb-1.5">Employee Close Out Notes</p>
                  <p class="text-sm text-green-800 leading-relaxed">{{ task.closeOutNotes }}</p>
                </div>

                <!-- Evidence Files -->
                <div v-if="task.evidenceFiles?.length" class="mb-3">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Evidence Files</p>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="file in task.evidenceFiles"
                      :key="file"
                      class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 cursor-pointer hover:border-primary-200 transition-colors"
                    >
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      </svg>
                      {{ file }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Chat + Approve/Reject actions -->
              <div v-if="task.approved === null" class="flex flex-col sm:flex-row gap-2">
                <ChatButton
                  :unread-count="getUnread(ca.id, task.id)"
                  @click="chatState = { caId: ca.id, taskId: task.id }"
                />
                <button @click="store.approveCloseOutTask(ca.id, task.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors border border-green-100 min-h-11 flex-1 sm:flex-none">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Approve Close Out
                </button>
                <button @click="store.rejectCloseOutTask(ca.id, task.id)" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-100 min-h-11 flex-1 sm:flex-none">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Reject Close Out
                </button>
              </div>

              <!-- After approval: only badge + chat -->
              <div v-else class="flex items-center gap-2">
                <ChatButton
                  :unread-count="getUnread(ca.id, task.id)"
                  @click="chatState = { caId: ca.id, taskId: task.id }"
                />
                <span :class="['badge', task.approved ? 'badge-green' : 'badge-red']">{{ task.approved ? 'Approved' : 'Rejected' }}</span>
              </div>

              <!-- Task Comment -->
              <div class="mt-4">
                <label class="text-xs font-medium text-gray-500 mb-1.5 block">Comment <span class="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  :value="task.comment"
                  @input="updateComment(ca.id, task.id, ($event.target as HTMLTextAreaElement).value)"
                  rows="2"
                  placeholder="Leave a review note for this task..."
                  class="input text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Day approval footer -->
          <div class="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p class="text-sm text-gray-600">
              {{ ca.tasks.filter(t => t.approved !== null).length }} / {{ ca.tasks.length }} tasks reviewed
            </p>
            <div v-if="ca.dayApproved === null" class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button @click="store.rejectDay(ca.id)" :disabled="!allTasksReviewed(ca)" :class="['inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-100 min-h-11', !allTasksReviewed(ca) ? 'opacity-40 cursor-not-allowed' : '']">
                Reject Close Out
              </button>
              <button @click="store.approveDay(ca.id)" :disabled="!allTasksReviewed(ca)" :class="['btn-primary text-sm justify-center min-h-11', !allTasksReviewed(ca) ? 'opacity-40 cursor-not-allowed' : '']">
                Approve Close Out
              </button>
            </div>
            <span v-else-if="ca.dayApproved" class="badge badge-green text-sm px-3 py-1.5">Day Approved</span>
            <span v-else class="badge badge-red text-sm px-3 py-1.5">Day Rejected</span>
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
