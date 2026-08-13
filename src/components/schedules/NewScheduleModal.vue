<script setup lang="ts">
import { ref } from 'vue'
import { useSchedulesStore } from '../../stores/schedules'
import { useKpiStore } from '../../stores/kpi'
import DatePicker from '../common/DatePicker.vue'
import DateTimePicker from '../common/DateTimePicker.vue'

const emit = defineEmits<{ close: [] }>()
const store = useSchedulesStore()
const kpiStore = useKpiStore()

const form = ref({
  date: new Date().toISOString().split('T')[0],
})

interface TaskForm {
  kpiId: string
  objective: string
  description: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  isMeeting: boolean
}

const tasks = ref<TaskForm[]>([
  { kpiId: '', objective: '', description: '', startTime: '', endTime: '', startDate: '', endDate: '', isMeeting: false },
])

const activeTimePickerId = ref<'start' | 'end' | null>(null)
const selectedStartDateTime = ref('')
const selectedEndDateTime = ref('')

const addTask = () => {
  tasks.value.push({ kpiId: '', objective: '', description: '', startTime: '', endTime: '', startDate: '', endDate: '', isMeeting: false })
}

const removeTask = (i: number) => {
  if (tasks.value.length > 1) tasks.value.splice(i, 1)
}

const getObjectives = (kpiId: string) => {
  const kpi = kpiStore.kpiRows.find(k => k.id === kpiId)
  return kpi?.objectives || []
}

const openStartTimePicker = () => {
  activeTimePickerId.value = 'start'
}

const openEndTimePicker = () => {
  activeTimePickerId.value = 'end'
}

const closeTimePicker = () => {
  activeTimePickerId.value = null
}

const confirmDateTime = (dateTime: string) => {
  if (activeTimePickerId.value === 'start') {
    selectedStartDateTime.value = dateTime
    const { date, time } = extractDateAndTime(dateTime)
    tasks.value[0].startDate = date
    tasks.value[0].startTime = time
  } else if (activeTimePickerId.value === 'end') {
    selectedEndDateTime.value = dateTime
    const { date, time } = extractDateAndTime(dateTime)
    tasks.value[0].endDate = date
    tasks.value[0].endTime = time
  }
  closeTimePicker()
}

const extractDateAndTime = (dateTime: string): { date: string; time: string } => {
  // dateTime format: "25 Jul 2026 • 9:30 AM"
  const parts = dateTime.split(' • ')
  if (parts.length !== 2) return { date: '', time: '' }
  
  const dateStr = parts[0]
  const timeStr = parts[1]
  
  // Parse date: "25 Jul 2026"
  const dateMatch = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/)
  if (!dateMatch) return { date: '', time: '' }
  
  const monthMap: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
  }
  
  const day = dateMatch[1].padStart(2, '0')
  const month = monthMap[dateMatch[2]] || '01'
  const year = dateMatch[3]
  const date = `${year}-${month}-${day}`
  
  // Parse time: "9:30 AM"
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s(AM|PM)/)
  if (!timeMatch) return { date, time: '' }
  
  return { date, time: `${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3]}` }
}

const submit = () => {
  const date = new Date(form.value.date)
  const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  store.addSchedule({
    date: form.value.date,
    dateLabel: label,
    dateGroup: form.value.date === today ? 'Today' : form.value.date === yesterday ? 'Yesterday' : 'Earlier',
    status: 'Pending',
    dayClosedOut: false,
    tasks: tasks.value.map((t, i) => {
      const kpi = kpiStore.kpiRows.find(k => k.id === t.kpiId)
      const startDate = t.startDate || form.value.date
      const endDate = t.endDate || form.value.date
      const isMultiDay = startDate !== endDate
      const status = isMultiDay ? 'Ongoing' : 'Pending'
      
      return {
        id: `t${Date.now()}${i}`,
        kpiId: t.kpiId,
        kpiName: kpi?.kpi || 'General',
        objective: t.objective,
        description: t.description,
        startTime: t.startTime,
        endTime: t.endTime,
        startDate,
        endDate,
        isMeeting: t.isMeeting,
        status,
        isMultiDay,
        chatMessages: [],
      }
    }),
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal panel: flex column, fixed max-height -->
      <div class="modal-schedule-panel relative z-10 bg-white w-full max-w-2xl">

        <!-- ── Fixed Header ── -->
        <div class="modal-schedule-header">
          <h2 class="text-base font-semibold text-gray-900">New Daily Schedule</h2>
          <button
            @click="emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- ── Scrollable Body ── -->
        <div class="modal-schedule-body">
          <!-- Date -->
          <DatePicker v-model="form.date" label="Schedule Date" />

          <!-- Tasks -->
          <div class="mt-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold text-gray-900">Tasks</p>
              <button @click="addTask" class="btn-ghost text-xs gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Another Task
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(task, i) in tasks"
                :key="i"
                class="p-4 border border-gray-200 rounded-xl space-y-4"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Task {{ i + 1 }}</span>
                  <button
                    v-if="tasks.length > 1"
                    @click="removeTask(i)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="label text-xs">KPI</label>
                    <select v-model="task.kpiId" class="select">
                      <option value="">Select KPI</option>
                      <option v-for="kpi in kpiStore.kpiRows" :key="kpi.id" :value="kpi.id">{{ kpi.kpi }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="label text-xs">Objective</label>
                    <select v-model="task.objective" class="select" :disabled="!task.kpiId">
                      <option value="">Select Objective</option>
                      <option v-for="obj in getObjectives(task.kpiId)" :key="obj.text" :value="obj.text">{{ obj.text }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="label text-xs">Task Description</label>
                  <textarea
                    v-model="task.description"
                    rows="2"
                    placeholder="Describe the task..."
                    class="input text-sm resize-none"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <!-- Start Date & Time Field -->
                  <div>
                    <label class="label text-xs">Start Date & Time <span class="text-red-500">*</span></label>
                    <button
                      @click="openStartTimePicker"
                      class="w-full px-3 py-2 text-left text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                    >
                      {{ selectedStartDateTime || 'Select start date & time' }}
                    </button>
                  </div>

                  <!-- End Date & Time Field -->
                  <div>
                    <label class="label text-xs">End Date & Time <span class="text-red-500">*</span></label>
                    <button
                      @click="openEndTimePicker"
                      class="w-full px-3 py-2 text-left text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                    >
                      {{ selectedEndDateTime || 'Select end date & time' }}
                    </button>
                  </div>
                </div>

                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input
                    v-model="task.isMeeting"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary-200 cursor-pointer"
                  />
                  <span class="text-sm text-gray-700">This is a meeting</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Fixed Footer ── -->
        <div class="modal-schedule-footer">
          <button @click="emit('close')" class="btn-secondary">Cancel</button>
          <button @click="submit" class="btn-primary">Create Schedule</button>
        </div>
      </div>

      <!-- Date & Time Picker Popup -->
      <DateTimePicker
        v-if="activeTimePickerId"
        @confirm="confirmDateTime"
        @close="closeTimePicker"
      />
    </div>
  </Teleport>
</template>

<style scoped>
/* Modal container: flex column with capped height */
.modal-schedule-panel {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* clip children to rounded corners */
}

/* Fixed header: never scrolls */
.modal-schedule-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
}

/* Scrollable body: takes all remaining space */
.modal-schedule-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  /* Ensure scrollbar appears inside the body, not over the header */
  min-height: 0;
}

/* Fixed footer: never scrolls */
.modal-schedule-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f3f4f6;
  background: #fff;
}

/* Full-screen on mobile */
@media (max-width: 640px) {
  .modal-schedule-panel {
    position: fixed;
    inset: 0;
    border-radius: 0;
    max-height: 100%;
    width: 100%;
    max-width: 100%;
  }
}
</style>
