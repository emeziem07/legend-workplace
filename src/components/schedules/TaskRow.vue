<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '../../stores/schedules'
import { useSchedulesStore } from '../../stores/schedules'
import StatusBadge from '../common/StatusBadge.vue'
import ChatButton from '../common/ChatButton.vue'

const props = defineProps<{
  task: Task
  scheduleId: string
  locked: boolean
}>()

const emit = defineEmits<{ openChat: [] }>()

const store = useSchedulesStore()
const closeOutNotes = ref(props.task.closeOutNotes || '')
const expandedPanel = ref<'closeOut' | 'progress' | 'complete' | null>(null)
const panelNotes = ref('')

const unreadCount = computed(() =>
  store.getUnreadCount(props.scheduleId, props.task.id, 'employee')
)

const isOngoing = computed(() => {
  if (!props.task.startDate || !props.task.endDate) return false
  const start = new Date(props.task.startDate)
  const end = new Date(props.task.endDate)
  return end > start
})

const dayProgress = computed(() => {
  if (!isOngoing.value || !props.task.startDate || !props.task.endDate) return null
  const start = new Date(props.task.startDate)
  const end = new Date(props.task.endDate)
  const today = new Date()
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const currentDay = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  return {
    current: Math.max(1, Math.min(currentDay, totalDays)),
    total: totalDays
  }
})

const dateRange = computed(() => {
  if (!props.task.startDate || !props.task.endDate) return null
  const start = new Date(props.task.startDate)
  const end = new Date(props.task.endDate)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }
  
  return `${formatDate(start)} → ${formatDate(end)}`
})

const submitCloseOut = () => {
  if (!closeOutNotes.value.trim()) return
  store.updateTask(props.scheduleId, props.task.id, {
    status: 'Closed Out',
    closeOutNotes: closeOutNotes.value,
  })
  expandedPanel.value = null
}

const submitProgress = () => {
  if (!panelNotes.value.trim()) return
  const progressUpdate = {
    date: new Date().toISOString().split('T')[0],
    notes: panelNotes.value,
    type: 'Progress Update',
  }
  const history = props.task.progressHistory || []
  store.updateTask(props.scheduleId, props.task.id, {
    progressHistory: [progressUpdate, ...history],
    lastProgressUpdate: new Date().toISOString().split('T')[0],
  })
  expandedPanel.value = null
  panelNotes.value = ''
}

const submitCompleteTask = () => {
  if (!panelNotes.value.trim()) return
  const completionEntry = {
    date: new Date().toISOString().split('T')[0],
    notes: panelNotes.value,
    type: 'Completed',
  }
  const history = props.task.progressHistory || []
  store.updateTask(props.scheduleId, props.task.id, {
    status: 'Completed',
    progressHistory: [completionEntry, ...history],
  })
  expandedPanel.value = null
  panelNotes.value = ''
}

const openProgressPanel = () => {
  expandedPanel.value = 'progress'
  panelNotes.value = ''
}

const openCompletePanel = () => {
  expandedPanel.value = 'complete'
  panelNotes.value = ''
}
</script>

<template>
  <!-- Desktop layout (unchanged) -->
  <div class="hidden sm:block px-5 py-4">
    <div class="flex items-start gap-4">
      <!-- Status indicator -->
      <div :class="[
        'w-2 h-2 rounded-full mt-2 shrink-0',
        task.status === 'Completed' || task.status === 'Closed Out' ? 'bg-green-500' :
        task.status === 'In Progress' ? 'bg-primary' :
        task.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300'
      ]"></div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded-full">{{ task.kpiName }}</span>
              <span v-if="task.isMeeting" class="badge badge-blue text-xs">Meeting</span>
              <span v-if="isOngoing" class="badge badge-purple text-xs">Ongoing</span>
            </div>
            <p class="text-xs text-gray-500 mb-1">{{ task.objective }}</p>
            <p class="text-sm font-medium text-gray-900">{{ task.description }}</p>

            <div class="flex items-center gap-3 mt-2">
              <span class="flex items-center gap-1 text-xs text-gray-400">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ task.startTime }} – {{ task.endTime }}
              </span>
            </div>

            <div v-if="isOngoing" class="mt-2 space-y-1">
              <p class="text-xs text-gray-600 font-medium">{{ dateRange }}</p>
              <p class="text-xs text-gray-500">Day {{ dayProgress?.current }} of {{ dayProgress?.total }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 flex-wrap">
          <StatusBadge :status="task.status" size="sm" />
          <div v-if="task.status !== 'Closed Out' && task.status !== 'Completed' && !locked" class="flex items-center gap-2">
            <div v-if="isOngoing" class="flex items-center gap-2">
              <button
                @click="openCompletePanel"
                class="btn-secondary text-xs"
              >
                Complete Task
              </button>
              <button
                @click="openProgressPanel"
                class="btn-secondary text-xs"
              >
                Update Progress
              </button>
            </div>
            <div v-else>
              <button
                @click="expandedPanel = 'closeOut'"
                class="btn-secondary text-xs"
              >
                Close Out
              </button>
            </div>
          </div>
            <button
              @click="emit('openChat')"
              class="relative w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="Open chat"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span v-if="unreadCount > 0" class="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-semibold rounded-full flex items-center justify-center -translate-y-1 translate-x-1">{{ unreadCount }}</span>
            </button>
          </div>
        </div>

        <Transition name="slide-down">
          <div v-if="expandedPanel === 'closeOut'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <p class="text-xs font-semibold text-gray-700">Task Close Out</p>
            <div>
              <label class="label text-xs">Close Out Notes <span class="text-red-500">*</span></label>
              <textarea
                v-model="closeOutNotes"
                rows="3"
                placeholder="Describe what was accomplished, outcomes, and any follow-up items..."
                class="input text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label class="label text-xs">Attach Evidence <span class="text-gray-400">(optional)</span></label>
              <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:bg-white transition-colors">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                <span class="text-xs text-gray-500">Attach file</span>
                <input type="file" class="hidden" />
              </label>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button @click="expandedPanel = null" class="btn-ghost text-xs">Cancel</button>
              <button @click="submitCloseOut" :disabled="!closeOutNotes.trim()" :class="['btn-primary text-xs', !closeOutNotes.trim() ? 'opacity-40 cursor-not-allowed' : '']">
                Submit Close Out
              </button>
            </div>
          </div>
        </Transition>

        <Transition name="slide-down">
          <div v-if="expandedPanel === 'progress'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <p class="text-xs font-semibold text-gray-700">Task Progress Update</p>
            <div>
              <label class="label text-xs">Today's Progress <span class="text-red-500">*</span></label>
              <textarea
                v-model="panelNotes"
                rows="3"
                placeholder="Describe what was accomplished today..."
                class="input text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label class="label text-xs">Attach Evidence <span class="text-gray-400">(optional)</span></label>
              <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:bg-white transition-colors">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                <span class="text-xs text-gray-500">Attach file</span>
                <input type="file" class="hidden" />
              </label>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button @click="expandedPanel = null" class="btn-ghost text-xs">Cancel</button>
              <button @click="submitProgress" :disabled="!panelNotes.trim()" :class="['btn-primary text-xs', !panelNotes.trim() ? 'opacity-40 cursor-not-allowed' : '']">
                Save Progress Update
              </button>
            </div>
          </div>
        </Transition>

        <Transition name="slide-down">
          <div v-if="expandedPanel === 'complete'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <p class="text-xs font-semibold text-gray-700">Complete Task</p>
            <div>
              <label class="label text-xs">Completion Notes <span class="text-red-500">*</span></label>
              <textarea
                v-model="panelNotes"
                rows="3"
                placeholder="Describe what was accomplished, outcomes, and any follow-up items..."
                class="input text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label class="label text-xs">Attach Evidence <span class="text-gray-400">(optional)</span></label>
              <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:bg-white transition-colors">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                <span class="text-xs text-gray-500">Attach file</span>
                <input type="file" class="hidden" />
              </label>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button @click="expandedPanel = null" class="btn-ghost text-xs">Cancel</button>
              <button @click="submitCompleteTask" :disabled="!panelNotes.trim()" :class="['btn-primary text-xs', !panelNotes.trim() ? 'opacity-40 cursor-not-allowed' : '']">
                Complete Task
              </button>
            </div>
          </div>
        </Transition>

        <!-- Progress Updates Timeline (chronological: oldest first) -->
        <div v-if="task.progressHistory && task.progressHistory.length > 0" class="mt-4 space-y-2">
          <div
            v-for="(update, index) in [...task.progressHistory].reverse()"
            :key="index"
            :class="[
              'px-3 py-2 rounded-lg border',
              update.type === 'Completed' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
            ]"
          >
            <p :class="['text-xs font-medium mb-1.5', update.type === 'Completed' ? 'text-green-700' : 'text-blue-700']">
              <span v-if="update.type === 'Completed'" class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 align-middle"></span>
              <span v-else class="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5 align-middle"></span>
              {{ update.type === 'Completed' ? 'Completed' : 'Progress Update' }}
              <span :class="['ml-2', update.type === 'Completed' ? 'text-green-600' : 'text-blue-600']">
                •
                {{ update.date ? new Date(update.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date' }}
              </span>
            </p>
            <p :class="['text-xs leading-relaxed', update.type === 'Completed' ? 'text-green-800' : 'text-blue-800']">
              {{ update.notes }}
            </p>
          </div>
        </div>

        <div v-if="task.status === 'Closed Out' && task.closeOutNotes" class="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <p class="text-xs font-medium text-green-700 mb-1">Close Out Notes</p>
          <p class="text-xs text-green-800">{{ task.closeOutNotes }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile layout: 5-row hierarchy -->
  <div class="sm:hidden px-4 py-4">
    <!-- Row 1: KPI badge + Status badge -->
    <div class="flex items-center gap-2 mb-3 flex-wrap">
      <span class="text-xs font-medium text-primary bg-primary-50 px-2.5 py-1 rounded-full">{{ task.kpiName }}</span>
      <span v-if="task.isMeeting" class="badge badge-blue text-xs">Meeting</span>
      <span v-if="isOngoing" class="badge badge-purple text-xs">Ongoing</span>
      <StatusBadge :status="task.status" size="sm" />
    </div>

    <!-- Row 2: Task title (full width) -->
    <p class="text-sm font-medium text-gray-900 mb-2 leading-snug">{{ task.description }}</p>

    <!-- Row 3: Objective (full width) -->
    <p class="text-xs text-gray-500 mb-3 leading-relaxed">{{ task.objective }}</p>

    <!-- Row 3b: Ongoing task info -->
    <div v-if="isOngoing" class="mb-3 space-y-1">
      <p class="text-xs text-gray-600 font-medium">{{ dateRange }}</p>
      <p class="text-xs text-gray-500">Day {{ dayProgress?.current }} of {{ dayProgress?.total }}</p>
    </div>

    <!-- Row 4: Time + Supervisor status -->
    <div class="flex items-center gap-3 mb-4 text-xs text-gray-400">
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {{ task.startTime }} – {{ task.endTime }}
      </span>
    </div>

    <!-- Row 5: Action buttons -->
    <div class="flex items-center gap-2">
      <div v-if="task.status !== 'Closed Out' && task.status !== 'Completed' && !locked" class="flex-1 flex items-center gap-2">
        <div v-if="isOngoing" class="flex-1 flex items-center gap-2">
          <button
            @click="openCompletePanel"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 min-h-11"
          >
            Complete Task
          </button>
          <button
            @click="openProgressPanel"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 min-h-11"
          >
            Update Progress
          </button>
        </div>
        <div v-else class="flex-1">
          <button
            @click="expandedPanel = 'closeOut'"
            class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 min-h-11"
          >
            Close Out
          </button>
        </div>
      </div>
      <button
        @click="emit('openChat')"
        class="relative w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center shrink-0"
        title="Open chat"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span v-if="unreadCount > 0" class="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-semibold rounded-full flex items-center justify-center -translate-y-1 translate-x-1">{{ unreadCount }}</span>
      </button>
    </div>

    <!-- Close Out Form (mobile) -->
    <Transition name="slide-down">
      <div v-if="expandedPanel === 'closeOut'" class="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <p class="text-xs font-semibold text-gray-700">Task Close Out</p>
        <div>
          <label class="label text-xs">Close Out Notes <span class="text-red-500">*</span></label>
          <textarea
            v-model="closeOutNotes"
            rows="3"
            placeholder="Describe what was accomplished, outcomes, and any follow-up items..."
            class="input text-sm resize-none"
          ></textarea>
        </div>
        <div>
          <label class="label text-xs">Attach Evidence <span class="text-gray-400">(optional)</span></label>
          <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:bg-white transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span class="text-xs text-gray-500">Attach file</span>
            <input type="file" class="hidden" />
          </label>
        </div>
        <div class="flex flex-col gap-2">
          <button @click="expandedPanel = null" class="btn-ghost text-xs min-h-11">Cancel</button>
          <button @click="submitCloseOut" :disabled="!closeOutNotes.trim()" :class="['btn-primary text-xs min-h-11', !closeOutNotes.trim() ? 'opacity-40 cursor-not-allowed' : '']">
            Submit Close Out
          </button>
        </div>
      </div>
    </Transition>

    <!-- Progress Update Form (mobile) -->
    <Transition name="slide-down">
      <div v-if="expandedPanel === 'progress'" class="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <p class="text-xs font-semibold text-gray-700">Task Progress Update</p>
        <div>
          <label class="label text-xs">Today's Progress <span class="text-red-500">*</span></label>
          <textarea
            v-model="panelNotes"
            rows="3"
            placeholder="Describe what was accomplished today..."
            class="input text-sm resize-none"
          ></textarea>
        </div>
        <div>
          <label class="label text-xs">Attach Evidence <span class="text-gray-400">(optional)</span></label>
          <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:bg-white transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span class="text-xs text-gray-500">Attach file</span>
            <input type="file" class="hidden" />
          </label>
        </div>
        <div class="flex flex-col gap-2">
          <button @click="expandedPanel = null" class="btn-ghost text-xs min-h-11">Cancel</button>
          <button @click="submitProgress" :disabled="!panelNotes.trim()" :class="['btn-primary text-xs min-h-11', !panelNotes.trim() ? 'opacity-40 cursor-not-allowed' : '']">
            Save Progress Update
          </button>
        </div>
      </div>
    </Transition>

    <!-- Complete Task Form (mobile) -->
    <Transition name="slide-down">
      <div v-if="expandedPanel === 'complete'" class="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <p class="text-xs font-semibold text-gray-700">Complete Task</p>
        <div>
          <label class="label text-xs">Completion Notes <span class="text-red-500">*</span></label>
          <textarea
            v-model="panelNotes"
            rows="3"
            placeholder="Describe what was accomplished, outcomes, and any follow-up items..."
            class="input text-sm resize-none"
          ></textarea>
        </div>
        <div>
          <label class="label text-xs">Attach Evidence <span class="text-gray-400">(optional)</span></label>
          <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:bg-white transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span class="text-xs text-gray-500">Attach file</span>
            <input type="file" class="hidden" />
          </label>
        </div>
        <div class="flex flex-col gap-2">
          <button @click="expandedPanel = null" class="btn-ghost text-xs min-h-11">Cancel</button>
          <button @click="submitCompleteTask" :disabled="!panelNotes.trim()" :class="['btn-primary text-xs min-h-11', !panelNotes.trim() ? 'opacity-40 cursor-not-allowed' : '']">
            Complete Task
          </button>
        </div>
      </div>
    </Transition>

    <!-- Progress Updates Timeline (mobile) -->
    <div v-if="task.progressHistory && task.progressHistory.length > 0" class="mt-4 space-y-3">
      <div
        v-for="(update, index) in task.progressHistory"
        :key="index"
        :class="[
          'p-3 rounded-lg border',
          update.type === 'Completed' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
        ]"
      >
        <p :class="['text-xs font-medium mb-1', update.type === 'Completed' ? 'text-green-700' : 'text-blue-700']">
          {{ update.type === 'Completed' ? 'Completed' : 'Progress Update' }}
        </p>
        <p v-if="update.date" :class="['text-xs mb-2', update.type === 'Completed' ? 'text-green-600' : 'text-blue-600']">
          {{ new Date(update.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}
        </p>
        <p :class="['text-xs', update.type === 'Completed' ? 'text-green-800' : 'text-blue-800']">
          {{ update.notes }}
        </p>
      </div>
    </div>

    <!-- Existing close out notes (mobile) -->
    <div v-if="task.status === 'Closed Out' && task.closeOutNotes" class="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
      <p class="text-xs font-medium text-green-700 mb-1">Close Out Notes</p>
      <p class="text-xs text-green-800">{{ task.closeOutNotes }}</p>
    </div>
  </div>
</template>
