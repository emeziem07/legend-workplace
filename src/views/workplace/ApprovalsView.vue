<script setup lang="ts">
import { ref } from 'vue'
import ScheduleApprovalTab from '../../components/approvals/ScheduleApprovalTab.vue'
import CloseOutApprovalTab from '../../components/approvals/CloseOutApprovalTab.vue'
import OtherRequestsTab from '../../components/approvals/OtherRequestsTab.vue'

const activeTab = ref<'schedule' | 'closeout' | 'other'>('schedule')
const tabs = [
  { key: 'schedule', label: 'Schedule Approval' },
  { key: 'closeout', label: 'Schedule Close Out' },
  { key: 'other', label: 'Other Requests' },
] as const
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Approvals</h1>
        <p class="text-sm text-gray-500 mt-0.5">Review and approve employee schedules and requests</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tab-strip -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="['tab-btn', activeTab === tab.key ? 'active' : '']"
      >
        {{ tab.label }}
      </button>
    </div>

    <ScheduleApprovalTab v-if="activeTab === 'schedule'" />
    <CloseOutApprovalTab v-else-if="activeTab === 'closeout'" />
    <OtherRequestsTab v-else-if="activeTab === 'other'" />
  </div>
</template>
