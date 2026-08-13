<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomerInsightsStore } from '../stores/customerInsights'
import StatusBadge from '../components/common/StatusBadge.vue'

const router = useRouter()
const route = useRoute()
const store = useCustomerInsightsStore()

const installationId = route.params.id as string

const installation = computed(() => {
  return store.installations.find(i => i.id === installationId) || null
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="goBack"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Installation Details</h1>
              <p class="text-sm text-gray-500 mt-1" v-if="installation">{{ installation.customerName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="installation" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Information -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Customer Name</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.customerName }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Customer ID</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.customerId }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.address || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Area</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.area || '—' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Installation Details -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Installation Details</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1"><StatusBadge :status="installation.status" size="md" /></dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Installation Date</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.installationDate || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Activation Date</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.activationDate || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Duration (Days)</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.durationDays || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Category</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.category || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Plan</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.plan || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Installer</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.installer || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Pickup Point</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.pickupPoint || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">MDU</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.mdu || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Requirements</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.requirements || '—' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Materials & Equipment -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Materials & Equipment</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">MST</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.mst || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">HC LM</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.hcLm || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">LM</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.lm || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">PVC (Bundles)</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.pvcBundles || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Access Cable</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.accessCable || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Access PVC</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.accessPvc || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">MST Access</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.mstAccess || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Distribution Cable</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.distributionCable || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Flexible</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.flexible || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">ATB</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.atb || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Patch Cord</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.patchCord || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Clip</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.clip || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Thrustboring / Cutting</dt>
                <dd class="text-base font-semibold text-gray-900 mt-1">{{ installation.thrustboring || '—' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Timeline -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div class="relative">
              <div class="absolute left-2 top-0 bottom-0 w-px bg-gray-200"></div>
              <div class="space-y-4">
                <div class="relative pl-8">
                  <div class="absolute left-0 w-4 h-4 rounded-full border-2 border-white bg-primary"></div>
                  <p class="text-sm font-medium text-gray-700">Installation Requested</p>
                  <p class="text-sm text-gray-500 mt-1">{{ installation.installationDate || 'N/A' }}</p>
                </div>
                <div v-if="installation.activationDate" class="relative pl-8">
                  <div class="absolute left-0 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                  <p class="text-sm font-medium text-gray-700">Installation Activated</p>
                  <p class="text-sm text-gray-500 mt-1">{{ installation.activationDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</dt>
                <dd class="mt-2"><StatusBadge :status="installation.status" size="md" /></dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Installation ID</dt>
                <dd class="text-sm font-mono text-gray-900 mt-1">{{ installation.id }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</dt>
                <dd class="text-sm text-gray-900 mt-1">{{ installation.category || '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Installer</dt>
                <dd class="text-sm text-gray-900 mt-1">{{ installation.installer || '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Installation Not Found</h3>
        <p class="text-sm text-gray-500 mb-6">The installation you're looking for doesn't exist or has been removed.</p>
        <button @click="goBack" class="btn-primary">Go Back</button>
      </div>
    </div>
  </div>
</template>
