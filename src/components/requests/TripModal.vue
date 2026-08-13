<script setup lang="ts">
import { ref } from 'vue'
import { useRequestsStore } from '../../stores/requests'
import DatePicker from '../common/DatePicker.vue'

const emit = defineEmits<{ close: [] }>()
const store = useRequestsStore()

const form = ref({
  destination: '',
  purpose: '',
  startDate: '',
  endDate: '',
  budget: '',
  accommodation: '',
  transport: '',
})

const submit = () => {
  store.addRequest({
    type: 'Trip',
    title: `Business Trip – ${form.value.destination}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    details: {
      'Destination': form.value.destination,
      'Purpose': form.value.purpose,
      'Travel Dates': `${form.value.startDate} – ${form.value.endDate}`,
      'Budget': form.value.budget,
      'Accommodation': form.value.accommodation,
      'Transport': form.value.transport,
    },
    documents: [],
    timeline: [
      { name: 'Alex Johnson', role: 'Employee', status: 'Approved', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
      { name: 'Sarah Mitchell', role: 'Line Manager', status: 'Awaiting', date: '' },
    ],
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')"></div>
      <div class="modal-panel relative bg-white w-full max-w-lg max-h-screen sm:max-h-[90vh] overflow-y-auto z-10">
        <div class="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl">
          <h2 class="text-base font-semibold text-gray-900">New Trip Request</h2>
          <button @click="emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="label">Destination</label>
            <input v-model="form.destination" type="text" placeholder="e.g. Lagos, Nigeria" class="input" />
          </div>
          <div>
            <label class="label">Purpose</label>
            <textarea v-model="form.purpose" rows="2" placeholder="Purpose of the trip..." class="input resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <DatePicker v-model="form.startDate" label="Departure Date" />
            <DatePicker v-model="form.endDate" label="Return Date" :min="form.startDate" />
          </div>
          <div>
            <label class="label">Budget</label>
            <input v-model="form.budget" type="text" placeholder="e.g. ₦250,000" class="input" />
          </div>
          <div>
            <label class="label">Accommodation</label>
            <input v-model="form.accommodation" type="text" placeholder="Hotel name / arrangement" class="input" />
          </div>
          <div>
            <label class="label">Transport</label>
            <select v-model="form.transport" class="select">
              <option value="">Select transport</option>
              <option>Flight</option>
              <option>Company Vehicle</option>
              <option>Train</option>
              <option>Self-Drive</option>
              <option>Flight + Company Vehicle</option>
            </select>
          </div>
          <div>
            <label class="label">Attachments <span class="text-gray-400 font-normal">(optional)</span></label>
            <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-3 hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <span class="text-sm text-gray-500">Attach conference invite, hotel booking, etc.</span>
              <input type="file" class="hidden" multiple />
            </label>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 rounded-b-2xl">
          <button @click="emit('close')" class="btn-secondary w-full sm:w-auto justify-center">Cancel</button>
          <button @click="submit" class="btn-primary w-full sm:w-auto justify-center">Submit Request</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
