<script setup lang="ts">
import { ref } from 'vue'
import type { DaySchedule } from '../../stores/schedules'
import StatusBadge from '../common/StatusBadge.vue'
import TaskRow from './TaskRow.vue'

const props = defineProps<{ schedule: DaySchedule }>()
const emit = defineEmits<{
  openChat: [scheduleId: string, taskId: string]
  closeOutDay: [scheduleId: string]
}>()

const expanded = ref(props.schedule.dateGroup === 'Today')

const allTasksClosed = () => props.schedule.tasks.every(t => t.status === 'Closed Out' || t.status === 'Completed')

const getOngoingTasks = () => props.schedule.tasks.filter(t => {
  if (!t.startDate || !t.endDate) return false
  const start = new Date(t.startDate)
  const end = new Date(t.endDate)
  return end > start
})

const allOngoingTasksUpdatedToday = () => {
  const ongoingTasks = getOngoingTasks()
  if (ongoingTasks.length === 0) return true
  const today = new Date().toISOString().split('T')[0]
  return ongoingTasks.every(t => t.lastProgressUpdate === today)
}

const canCloseDay = () => !props.schedule.dayClosedOut && allTasksClosed() && allOngoingTasksUpdatedToday() && props.schedule.dateGroup === 'Today'

const getCloseOutMessage = () => {
  if (!allTasksClosed()) {
    return 'Complete all tasks before closing out the day.'
  }
  if (!allOngoingTasksUpdatedToday()) {
    return 'You must update today\'s progress for all ongoing tasks before closing out your day.'
  }
  return 'All tasks complete. Ready to close out your day.'
}
</script>

<template>
  <div class="card">
    <!-- Header -->
    <button @click="expanded = !expanded" class="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50/50 transition-colors text-left">
      <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          <span class="text-sm font-semibold text-gray-900 truncate">{{ schedule.dateLabel }}</span>
          <span v-if="schedule.dayClosedOut" class="text-xs text-gray-400 shrink-0">· Day closed out</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500">{{ schedule.tasks.length }} task{{ schedule.tasks.length !== 1 ? 's' : '' }}</span>
          <span class="text-xs text-gray-500">·</span>
          <span class="text-xs text-gray-500">
            {{ schedule.tasks.filter(t => t.status === 'Completed' || t.status === 'Closed Out').length }} / {{ schedule.tasks.length }} done
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <StatusBadge :status="schedule.status" size="sm" />
        <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200', expanded ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </button>

    <!-- Expanded -->
    <Transition name="slide-down">
      <div v-if="expanded" class="border-t border-gray-100">
        <div class="divide-y divide-gray-50">
          <TaskRow
            v-for="task in schedule.tasks"
            :key="task.id"
            :task="task"
            :schedule-id="schedule.id"
            :locked="schedule.dayClosedOut"
            @open-chat="emit('openChat', schedule.id, task.id)"
          />
        </div>

        <!-- End of Day Close Out -->
        <div v-if="schedule.dateGroup === 'Today' && !schedule.dayClosedOut" class="px-4 sm:px-5 py-4 bg-gray-50 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800">End of Day Close Out</p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ getCloseOutMessage() }}
              </p>
            </div>
            <button
              @click="emit('closeOutDay', schedule.id)"
              :disabled="!canCloseDay()"
              :class="[
                'btn-primary text-xs w-full sm:w-auto justify-center',
                !canCloseDay() ? 'opacity-40 cursor-not-allowed' : ''
              ]"
            >
              Close Out Day
            </button>
          </div>
        </div>

        <div v-if="schedule.dayClosedOut" class="px-5 py-3 bg-green-50 border-t border-green-100 flex items-center gap-2">
          <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-xs font-medium text-green-700">Day closed out · {{ schedule.approvedBy ? `Approved by ${schedule.approvedBy}` : 'Awaiting supervisor review' }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
