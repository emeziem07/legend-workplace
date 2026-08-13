<script setup lang="ts">
import { ref } from 'vue'
import { useApprovalsStore } from '../../stores/approvals'
import StatusBadge from '../common/StatusBadge.vue'
import AvatarInitials from '../common/AvatarInitials.vue'

const store = useApprovalsStore()
const activeTab = ref<'leave' | 'trip' | 'aie'>('leave')
const expandedId = ref<string | null>(null)

const tabs = [
  { key: 'leave', label: 'Leave' },
  { key: 'trip', label: 'Trip' },
  { key: 'aie', label: 'AIE' },
] as const

const currentList = () => store.otherRequests[activeTab.value]

const toggle = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div>
    <!-- Sub tabs -->
    <div class="tab-strip -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key; expandedId = null"
        :class="['tab-btn', activeTab === tab.key ? 'active' : '']"
      >
        {{ tab.label }}
        <span class="ml-1.5 badge" :class="store.otherRequests[tab.key].length ? 'badge-orange' : 'badge-gray'">
          {{ store.otherRequests[tab.key].length }}
        </span>
      </button>
    </div>

    <div class="space-y-3">
      <div v-if="!currentList().length" class="card p-12 text-center">
        <p class="text-sm text-gray-500">No {{ activeTab }} requests pending</p>
      </div>

      <div v-for="req in currentList()" :key="req.id" class="card">
        <button @click="toggle(req.id)" class="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors text-left">
          <AvatarInitials :name="req.employeeName" size="md" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ req.employeeName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ req.employeeRole }} · {{ req.title }} · {{ req.date }}</p>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <StatusBadge :status="req.status" size="sm" />
            <svg :class="['w-4 h-4 text-gray-400 transition-transform', expandedId === req.id ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </button>

        <Transition name="slide-down">
          <div v-if="expandedId === req.id" class="border-t border-gray-100 px-4 sm:px-6 py-5">
            <div class="grid md:grid-cols-2 gap-6 mb-5">
              <dl class="space-y-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Request Details</p>
                <div v-for="(val, key) in req.details" :key="String(key)" class="flex flex-col gap-0.5">
                  <dt class="text-xs text-gray-500">{{ key }}</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ val }}</dd>
                </div>
              </dl>
            </div>

            <div v-if="req.status === 'Pending'" class="flex flex-col sm:flex-row gap-3">
              <button @click="store.approveOtherRequest(req.id, activeTab)" class="btn-primary text-sm gap-1.5 justify-center min-h-11">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Approve Request
              </button>
              <button @click="store.rejectOtherRequest(req.id, activeTab)" class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-100 min-h-11">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Reject Request
              </button>
            </div>
            <div v-else class="flex items-center gap-2 text-sm" :class="req.status === 'Approved' ? 'text-green-600' : 'text-red-600'">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <polyline v-if="req.status === 'Approved'" points="20 6 9 17 4 12"/>
                <path v-else d="M18 6 6 18M6 6l12 12"/>
              </svg>
              Request {{ req.status }}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
