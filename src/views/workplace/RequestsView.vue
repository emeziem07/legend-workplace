<script setup lang="ts">
import { ref } from 'vue'
import { useRequestsStore } from '../../stores/requests'
import RequestsAccordion from '../../components/overview/RequestsAccordion.vue'
import LeaveModal from '../../components/requests/LeaveModal.vue'
import TripModal from '../../components/requests/TripModal.vue'
import AIEModal from '../../components/requests/AIEModal.vue'

const store = useRequestsStore()
const showLeave = ref(false)
const showTrip = ref(false)
const showAIE = ref(false)
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Requests</h1>
        <p class="text-sm text-gray-500 mt-0.5">Submit and track leave, trip, and expense requests</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button @click="showLeave = true" class="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-9">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          New Leave Request
        </button>
        <button @click="showTrip = true" class="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-9">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          New Trip Request
        </button>
        <button @click="showAIE = true" class="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors min-h-9">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          New AIE Request
        </button>

        <button @click="showLeave = true" class="hidden sm:inline-flex btn-secondary text-sm gap-1.5 justify-center min-h-11">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          New Leave Request
        </button>
        <button @click="showTrip = true" class="hidden sm:inline-flex btn-secondary text-sm gap-1.5 justify-center min-h-11">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          New Trip Request
        </button>
        <button @click="showAIE = true" class="hidden sm:inline-flex btn-primary text-sm gap-1.5 justify-center min-h-11">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          New AIE Request
        </button>
      </div>
    </div>

    <RequestsAccordion :requests="store.requests" />

    <LeaveModal v-if="showLeave" @close="showLeave = false" />
    <TripModal v-if="showTrip" @close="showTrip = false" />
    <AIEModal v-if="showAIE" @close="showAIE = false" />
  </div>
</template>
