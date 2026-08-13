<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import AvatarInitials from '../common/AvatarInitials.vue'

export interface ChatMessage {
  id: string
  sender: string
  role: 'employee' | 'supervisor'
  message: string
  timestamp: string
}

export interface ChatContext {
  kpi: string
  objective: string
  taskTitle: string
  time?: string
  status?: string
  participantName?: string
  participantRole?: string
}

const props = defineProps<{
  messages: ChatMessage[]
  context: ChatContext
  currentRole: 'employee' | 'supervisor'
  currentSender: string
}>()

const emit = defineEmits<{
  close: []
  send: [message: string]
  markRead: []
}>()

const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const drawerRef = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  const msg = newMessage.value.trim()
  if (!msg) return
  emit('send', msg)
  newMessage.value = ''
  scrollToBottom()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const onEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onEsc)
  document.body.style.overflow = 'hidden'
  emit('markRead')
  scrollToBottom()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
})

watch(() => props.messages.length, scrollToBottom)
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex">
      <!-- Backdrop -->
      <Transition name="fade" appear>
        <div class="flex-1 bg-black/30 backdrop-blur-[2px]" @click="emit('close')"></div>
      </Transition>

      <!-- Drawer -->
      <Transition name="chat-drawer" appear>
        <div
          ref="drawerRef"
          class="bg-white flex flex-col h-full border-l border-gray-200 shadow-2xl safe-top safe-bottom"
          style="width: 500px; max-width: 100vw;"
        >
          <!-- 1. Header (Fixed) -->
          <div class="px-4 sm:px-5 pt-4 sm:pt-5 pb-4 shrink-0">
            <div class="flex items-start gap-3">
              <button @click="emit('close')"
                class="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
              <div class="flex-1 min-w-0">
                <h2 class="text-base font-semibold text-gray-900 leading-tight">Chat</h2>
                <p class="text-xs text-gray-500 mt-0.5 truncate">
                  <span class="font-medium text-gray-600">{{ context.kpi }}</span>
                  <span class="text-gray-300 mx-1.5">·</span>
                  {{ context.objective }}
                </p>
              </div>
            </div>
          </div>

          <!-- 2. Task Context Card (Fixed) -->
          <div class="px-4 sm:px-5 pb-4 shrink-0">
            <div class="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
              <p class="text-sm font-medium text-gray-900 leading-snug">{{ context.taskTitle }}</p>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                <span v-if="context.time" class="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ context.time }}
                </span>
                <span v-if="context.status" class="flex items-center gap-1.5 text-xs text-gray-500">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :style="{ backgroundColor: context.status === 'Completed' || context.status === 'Closed Out' ? '#22c55e' : context.status === 'In Progress' ? '#FD4F00' : '#9ca3af' }"></span>
                  {{ context.status }}
                </span>
                <span v-if="context.participantName" class="flex items-center gap-1.5 text-xs text-gray-500">
                  <AvatarInitials :name="context.participantName" size="xs" />
                  <span>{{ context.participantName }}</span>
                  <span v-if="context.participantRole" class="text-gray-400">· {{ context.participantRole }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-gray-100 shrink-0"></div>

          <!-- 3. Conversation Area (Scrollable) -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 sm:px-5 py-5">
            <!-- Empty state -->
            <div v-if="!messages.length" class="flex flex-col items-center justify-center h-full text-center px-6">
              <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-600 mb-1">No conversation yet</p>
              <p class="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                Use Chat to discuss this task with your
                {{ currentRole === 'employee' ? 'supervisor' : 'employee' }}.
              </p>
            </div>

            <!-- Messages -->
            <div v-else class="space-y-5">
              <div
                v-for="msg in messages"
                :key="msg.id"
                :class="['flex gap-2.5', msg.role === currentRole ? 'flex-row-reverse' : '']"
              >
                <AvatarInitials :name="msg.sender" size="sm" class="mt-0.5 shrink-0" />
                <div :class="['flex flex-col gap-1 max-w-[78%]', msg.role === currentRole ? 'items-end' : 'items-start']">
                  <div class="flex items-center gap-2" :class="msg.role === currentRole ? 'flex-row-reverse' : ''">
                    <span class="text-xs font-medium text-gray-600">{{ msg.sender }}</span>
                    <span class="text-xs text-gray-400">{{ msg.timestamp }}</span>
                  </div>
                  <div
                    :class="[
                      'px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
                      msg.role === currentRole
                        ? 'bg-primary text-white rounded-2xl rounded-tr-md'
                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-md'
                    ]"
                  >
                    {{ msg.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Message Composer (Fixed) -->
          <div class="shrink-0 border-t border-gray-100 px-4 sm:px-5 py-4 safe-bottom">
            <div class="flex items-end gap-2">
              <button class="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors shrink-0" title="Attach file">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <textarea
                v-model="newMessage"
                @keydown="onKeydown"
                rows="1"
                placeholder="Type a message..."
                class="input text-sm resize-none flex-1 leading-relaxed"
                style="max-height: 120px; min-height: 42px;"
              ></textarea>
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                :class="[
                  'shrink-0 rounded-xl px-3.5 py-2.5 text-white transition-all',
                  newMessage.trim()
                    ? 'bg-primary hover:bg-primary-600 shadow-sm'
                    : 'bg-gray-200 cursor-not-allowed'
                ]"
                title="Send (Enter)"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-2 px-1 hidden sm:block">
              Press <kbd class="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-medium">Enter</kbd> to send,
              <kbd class="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-medium">Shift + Enter</kbd> for new line
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.chat-drawer-enter-active,
.chat-drawer-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-drawer-enter-from,
.chat-drawer-leave-to {
  transform: translateX(100%);
}
</style>
