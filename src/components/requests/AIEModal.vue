<script setup lang="ts">
import { ref } from 'vue'
import { useRequestsStore } from '../../stores/requests'

const emit = defineEmits<{ close: [] }>()
const store = useRequestsStore()

const form = ref({
  title: '',
  category: '',
  amount: '',
  justification: '',
  vendor: '',
})

const submit = () => {
  store.addRequest({
    type: 'AIE',
    title: form.value.title || 'AIE Request',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    details: {
      'Title': form.value.title,
      'Category': form.value.category,
      'Amount': form.value.amount,
      'Justification': form.value.justification,
      'Vendor': form.value.vendor,
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
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="min-w-0">
            <h2 class="text-base font-semibold text-gray-900">New AIE Request</h2>
            <p class="text-xs text-gray-500 mt-0.5">Advance / Imprest / Expenditure</p>
          </div>
          <button @click="emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="label">Title</label>
            <input v-model="form.title" type="text" placeholder="Brief title for this request" class="input" />
          </div>
          <div>
            <label class="label">Category</label>
            <select v-model="form.category" class="select">
              <option value="">Select category</option>
              <option>Software & Tools</option>
              <option>Office Supplies</option>
              <option>Training & Development</option>
              <option>Client Entertainment</option>
              <option>Equipment</option>
              <option>Marketing & Events</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label class="label">Amount</label>
            <input v-model="form.amount" type="text" placeholder="e.g. ₦150,000" class="input" />
          </div>
          <div>
            <label class="label">Justification</label>
            <textarea v-model="form.justification" rows="3" placeholder="Explain why this expenditure is needed..." class="input resize-none"></textarea>
          </div>
          <div>
            <label class="label">Vendor / Supplier</label>
            <input v-model="form.vendor" type="text" placeholder="Vendor or supplier name" class="input" />
          </div>
          <div>
            <label class="label">Attachments <span class="text-gray-400 font-normal">(optional)</span></label>
            <label class="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-3 hover:bg-gray-50">
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <span class="text-sm text-gray-500">Attach quotes, invoices, or receipts</span>
              <input type="file" class="hidden" multiple />
            </label>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button @click="emit('close')" class="btn-secondary w-full sm:w-auto justify-center">Cancel</button>
          <button @click="submit" class="btn-primary w-full sm:w-auto justify-center">Submit Request</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
