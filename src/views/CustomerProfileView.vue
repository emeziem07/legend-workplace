<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AvatarInitials from '../components/common/AvatarInitials.vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const customerId = route.params.id as string

// Mock customer data
const customer = computed(() => ({
  id: customerId,
  name: 'Acme Corporation',
  username: 'acme_corp',
  email: 'contact@acme.com',
  phone: '(555) 123-4567',
  status: 'Active',
  product: 'Dual Play',
  serviceStatus: 'Active',
  customerSince: 'Jan 15, 2023',
  lastLogin: 'Today at 2:45 PM',
  address: 'No. 7 Mississippi Street, Maitama, Abuja',
  lastDownCause: 'Scheduled Maintenance',
  lastUpTime: 'Jul 12, 2025 at 10:30 AM',
  lastDownTime: 'Jul 12, 2025 at 9:00 AM',
  currentService: 'Fiber + Voice',
  scheduledDate: 'Jul 18, 2025',
  assignedTeam: 'Team Alpha',
  estimatedArrival: '09:00 AM - 12:00 PM',
  installationStatus: 'In Progress',
}))

const activeTab = ref<'installation' | 'payment' | 'checkout' | 'subscription' | 'fault' | 'conversations'>('installation')

const installationStages = [
  {
    name: 'Survey',
    status: 'Completed',
    date: 'Jul 5, 2025',
    technician: 'John Okafor',
    notes: 'Site survey completed. No obstacles found.',
  },
  {
    name: 'Outdoor Installation',
    status: 'Completed',
    date: 'Jul 8, 2025',
    technician: 'Chioma Adeyemi',
    notes: 'Fiber cable laid from pole to building.',
  },
  {
    name: 'Indoor Installation',
    status: 'In Progress',
    date: 'Jul 15, 2025',
    technician: 'Marcus Williams',
    notes: 'Internal wiring in progress.',
  },
  {
    name: 'Testing & Activation',
    status: 'Pending',
    date: 'N/A',
    technician: 'N/A',
    notes: 'Awaiting completion of indoor installation.',
  },
]

const paymentHistory = [
  { invoice: 'INV-2025-001', amount: '₦45,000', method: 'Bank Transfer', status: 'Paid', date: 'Jul 1, 2025' },
  { invoice: 'INV-2025-002', amount: '₦45,000', method: 'Card', status: 'Paid', date: 'Jun 1, 2025' },
  { invoice: 'INV-2025-003', amount: '₦45,000', method: 'Bank Transfer', status: 'Paid', date: 'May 1, 2025' },
]

const faultHistory = [
  {
    date: 'Jul 10, 2025',
    priority: 'High',
    category: 'Connection Loss',
    status: 'Resolved',
    engineer: 'Priya Sharma',
    notes: 'Loose fiber connection. Reconnected and tested.',
  },
  {
    date: 'Jun 28, 2025',
    priority: 'Medium',
    category: 'Slow Speed',
    status: 'Resolved',
    engineer: 'James Okafor',
    notes: 'Signal interference. Adjusted router placement.',
  },
]

const conversations = [
  {
    date: 'Jul 12, 2025',
    time: '2:30 PM',
    agent: 'Sarah Mitchell',
    message: 'Hi! How can I help you today?',
    sender: 'agent',
  },
  {
    date: 'Jul 12, 2025',
    time: '2:31 PM',
    agent: 'Customer',
    message: 'I have a question about my bill.',
    sender: 'customer',
  },
  {
    date: 'Jul 12, 2025',
    time: '2:32 PM',
    agent: 'Sarah Mitchell',
    message: 'Of course! I\'d be happy to help. What\'s your question?',
    sender: 'agent',
  },
]

const getPriorityColor = (priority: string) => {
  if (priority === 'High') return 'badge-red'
  if (priority === 'Medium') return 'badge-amber'
  return 'badge-green'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <nav class="flex items-center gap-2 text-sm">
          <button @click="router.push('/resources')" class="text-gray-600 hover:text-gray-800 transition-colors">
            Resources
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          <button @click="router.push('/resources/customer-insights')" class="text-gray-600 hover:text-gray-800 transition-colors">
            Customer Insights
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          <span class="text-gray-900 font-medium">{{ customer.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Page Content -->
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      <!-- Customer Header -->
      <div class="card mb-6 p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <!-- Left: Customer Info -->
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <AvatarInitials :name="customer.name" size="lg" />
            </div>
            <div class="min-w-0">
              <h1 class="text-xl font-semibold text-gray-900">{{ customer.name }}</h1>
              <p class="text-sm text-gray-500 mt-0.5">@{{ customer.username }}</p>
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <span class="text-xs text-gray-600">ID: {{ customer.id }}</span>
                <StatusBadge :status="customer.serviceStatus" size="sm" />
                <span class="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{{ customer.product }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button class="btn-secondary text-sm w-full sm:w-auto justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              More Actions
            </button>
            <button class="btn-primary text-sm w-full sm:w-auto justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H14v-2.172l8.586-8.586z"/></svg>
              Edit Customer
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Customer Status</p>
          <p class="text-lg font-semibold text-gray-900">{{ customer.status }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Product / Service</p>
          <p class="text-lg font-semibold text-gray-900">{{ customer.product }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Phone Number</p>
          <p class="text-lg font-semibold text-gray-900 font-mono">{{ customer.phone }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Email Address</p>
          <p class="text-sm font-semibold text-gray-900 truncate">{{ customer.email }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Customer Since</p>
          <p class="text-lg font-semibold text-gray-900">{{ customer.customerSince }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Last Login</p>
          <p class="text-sm font-semibold text-gray-900">{{ customer.lastLogin }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Last Down Cause</p>
          <p class="text-sm font-semibold text-gray-900">{{ customer.lastDownCause }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-1">Current Service</p>
          <p class="text-sm font-semibold text-gray-900">{{ customer.currentService }}</p>
        </div>
      </div>

      <!-- Service Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Last Up Time</p>
          <p class="text-base font-semibold text-gray-900">{{ customer.lastUpTime }}</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Last Down Time</p>
          <p class="text-base font-semibold text-gray-900">{{ customer.lastDownTime }}</p>
        </div>
      </div>

      <!-- Physical Address -->
      <div class="card p-6 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Physical Address</p>
            <p class="text-sm text-gray-900 leading-relaxed">{{ customer.address }}</p>
          </div>
        </div>
      </div>

      <!-- Tabbed Sections -->
      <div class="card overflow-hidden">
        <!-- Tab Strip -->
        <div class="tab-strip -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200 bg-white">
          <button
            v-for="tab in ['installation', 'payment', 'checkout', 'subscription', 'fault', 'conversations']"
            :key="tab"
            @click="activeTab = tab as any"
            :class="['tab-btn', activeTab === tab ? 'active' : '']"
          >
            {{ tab === 'installation' ? 'Installation History' : tab === 'payment' ? 'Payment History' : tab === 'checkout' ? 'Checkout History' : tab === 'subscription' ? 'Subscription Status' : tab === 'fault' ? 'Fault History' : 'Conversations' }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Installation History Tab -->
          <div v-if="activeTab === 'installation'" class="space-y-6">
            <!-- Installation Progress -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-gray-900">Installation Progress</h3>
                <button class="btn-secondary text-xs">Administrative Actions</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="stage in installationStages" :key="stage.name" class="card p-4">
                  <div class="flex items-start justify-between mb-3">
                    <h4 class="text-sm font-semibold text-gray-900">{{ stage.name }}</h4>
                    <StatusBadge :status="stage.status" size="sm" />
                  </div>
                  <dl class="space-y-2">
                    <div class="flex items-start justify-between">
                      <dt class="text-xs text-gray-500">Completion Date</dt>
                      <dd class="text-xs font-medium text-gray-700">{{ stage.date }}</dd>
                    </div>
                    <div class="flex items-start justify-between">
                      <dt class="text-xs text-gray-500">Technician</dt>
                      <dd class="text-xs font-medium text-gray-700">{{ stage.technician }}</dd>
                    </div>
                    <div class="flex items-start justify-between">
                      <dt class="text-xs text-gray-500">Notes</dt>
                      <dd class="text-xs text-gray-600 text-right max-w-xs">{{ stage.notes }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <!-- Scheduled Installation -->
            <div class="card p-5 bg-blue-50 border border-blue-100">
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Scheduled Installation</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1">Scheduled Date</p>
                  <p class="text-sm font-semibold text-gray-900">{{ customer.scheduledDate }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Assigned Team</p>
                  <p class="text-sm font-semibold text-gray-900">{{ customer.assignedTeam }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Estimated Arrival</p>
                  <p class="text-sm font-semibold text-gray-900">{{ customer.estimatedArrival }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Status</p>
                  <StatusBadge :status="customer.installationStatus" size="sm" />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History Tab -->
          <div v-if="activeTab === 'payment'" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="text-left text-xs font-medium text-gray-600 uppercase tracking-wide px-4 py-3">Invoice</th>
                  <th class="text-left text-xs font-medium text-gray-600 uppercase tracking-wide px-4 py-3">Amount</th>
                  <th class="text-left text-xs font-medium text-gray-600 uppercase tracking-wide px-4 py-3">Payment Method</th>
                  <th class="text-left text-xs font-medium text-gray-600 uppercase tracking-wide px-4 py-3">Status</th>
                  <th class="text-left text-xs font-medium text-gray-600 uppercase tracking-wide px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="payment in paymentHistory" :key="payment.invoice" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ payment.invoice }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ payment.amount }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ payment.method }}</td>
                  <td class="px-4 py-3"><StatusBadge :status="payment.status" size="sm" /></td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ payment.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Checkout History Tab -->
          <div v-if="activeTab === 'checkout'" class="text-center py-12">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p class="text-sm text-gray-500">No checkout history available</p>
          </div>

          <!-- Subscription Status Tab -->
          <div v-if="activeTab === 'subscription'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card p-4">
              <p class="text-xs text-gray-500 mb-1">Current Plan</p>
              <p class="text-lg font-semibold text-gray-900">Dual Play</p>
            </div>
            <div class="card p-4">
              <p class="text-xs text-gray-500 mb-1">Subscription Status</p>
              <p class="text-lg font-semibold text-green-600">Active</p>
            </div>
            <div class="card p-4">
              <p class="text-xs text-gray-500 mb-1">Renewal Date</p>
              <p class="text-lg font-semibold text-gray-900">Aug 15, 2025</p>
            </div>
            <div class="card p-4">
              <p class="text-xs text-gray-500 mb-1">Billing Cycle</p>
              <p class="text-lg font-semibold text-gray-900">Monthly</p>
            </div>
          </div>

          <!-- Fault History Tab -->
          <div v-if="activeTab === 'fault'" class="space-y-4">
            <div v-for="fault in faultHistory" :key="fault.date" class="card p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ fault.category }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ fault.date }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="['badge', getPriorityColor(fault.priority)]">{{ fault.priority }}</span>
                  <StatusBadge :status="fault.status" size="sm" />
                </div>
              </div>
              <dl class="space-y-2">
                <div class="flex items-start justify-between">
                  <dt class="text-xs text-gray-500">Assigned Engineer</dt>
                  <dd class="text-xs font-medium text-gray-700">{{ fault.engineer }}</dd>
                </div>
                <div class="flex items-start justify-between">
                  <dt class="text-xs text-gray-500">Resolution Notes</dt>
                  <dd class="text-xs text-gray-600 text-right max-w-xs">{{ fault.notes }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Conversations Tab -->
          <div v-if="activeTab === 'conversations'" class="space-y-4">
            <div v-for="(conv, idx) in conversations" :key="idx" :class="['p-4 rounded-lg', conv.sender === 'agent' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200']">
              <div class="flex items-start justify-between mb-2">
                <p class="text-xs font-semibold text-gray-900">{{ conv.agent }}</p>
                <p class="text-xs text-gray-500">{{ conv.date }} at {{ conv.time }}</p>
              </div>
              <p class="text-sm text-gray-700">{{ conv.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
