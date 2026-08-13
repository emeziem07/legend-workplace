<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()
const searchQuery = ref('')
const selectedProduct = ref('all')
const currentPage = ref(1)
const itemsPerPage = 20

// Mock customer data
const mockCustomers = [
  { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '(555) 123-4567', username: 'acme_corp', product: 'fiber' },
  { id: 2, name: 'TechStart Inc', email: 'info@techstart.com', phone: '(555) 234-5678', username: 'techstart_inc', product: 'wifi' },
  { id: 3, name: 'Global Solutions Ltd', email: 'support@globalsol.com', phone: '(555) 345-6789', username: 'global_solutions', product: 'pay' },
  { id: 4, name: 'Innovation Hub', email: 'hello@innovhub.com', phone: '(555) 456-7890', username: 'innov_hub', product: 'fiber' },
  { id: 5, name: 'Digital Dynamics', email: 'contact@digdyn.com', phone: '(555) 567-8901', username: 'digital_dyn', product: 'wifi' },
  { id: 6, name: 'Enterprise Systems', email: 'info@entsys.com', phone: '(555) 678-9012', username: 'ent_systems', product: 'pay' },
  { id: 7, name: 'Future Networks', email: 'support@futurenet.com', phone: '(555) 789-0123', username: 'future_net', product: 'fiber' },
  { id: 8, name: 'Smart Business Co', email: 'contact@smartbiz.com', phone: '(555) 890-1234', username: 'smart_biz', product: 'wifi' },
  { id: 9, name: 'CloudFirst Industries', email: 'info@cloudfirst.com', phone: '(555) 901-2345', username: 'cloud_first', product: 'pay' },
  { id: 10, name: 'NextGen Solutions', email: 'support@nextgen.com', phone: '(555) 012-3456', username: 'nextgen_sol', product: 'fiber' },
]

const products = [
  { value: 'all', label: 'All Customers' },
  { value: 'fiber', label: 'Legend Fiber' },
  { value: 'wifi', label: 'Legend WiFi' },
  { value: 'pay', label: 'Legend Pay' },
]

const filteredCustomers = computed(() => {
  let result = mockCustomers

  if (selectedProduct.value !== 'all') {
    result = result.filter(c => c.product === selectedProduct.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.username.toLowerCase().includes(query)
    )
  }

  return result
})

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCustomers.value.slice(start, start + itemsPerPage)
})

const totalCustomers = 17932
const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredCustomers.value.length))

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getProductLabel = (product: string) => {
  const labels: Record<string, string> = {
    fiber: 'Legend Fiber',
    wifi: 'Legend WiFi',
    pay: 'Legend Pay',
  }
  return labels[product] || product
}

const handleRefresh = () => {
  // Refresh logic would go here
}

const handleViewProfile = (customerId: number) => {
  router.push(`/resources/customer-profile/${customerId}`)
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <!-- Breadcrumb -->
    <div class="mb-6 flex items-center gap-2 text-sm">
      <button
        @click="router.push('/resources')"
        class="text-gray-600 hover:text-gray-900 transition-colors"
      >
        Resources
      </button>
      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
      <span class="text-gray-900 font-medium">Customer Insights</span>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Customer Insights</h1>
      <p class="text-sm text-gray-500 mt-0.5">View, search and manage customer information across Legend products and services</p>
    </div>

    <!-- KPI Summary Cards -->
    <div class="grid sm:grid-cols-2 gap-3 mb-5">
      <div class="card p-3">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Total Customers</p>
            <p class="text-xl font-bold text-gray-900 mt-0.5">{{ totalCustomers.toLocaleString() }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM9 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-3">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Active Filter</p>
            <p class="text-xl font-bold text-gray-900 mt-0.5 truncate">{{ products.find(p => p.value === selectedProduct)?.label }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Unified Toolbar: Product Tabs + Search + Filter + Refresh -->
    <div class="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Product Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-0 flex-shrink-0">
        <button
          v-for="product in products"
          :key="product.value"
          @click="selectedProduct = product.value; currentPage = 1"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
            selectedProduct === product.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ product.label }}
        </button>
      </div>

      <!-- Search -->
      <div class="flex-1 relative min-w-0">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="m21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search customers…"
          class="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <!-- Filter & Refresh -->
      <div class="flex gap-2 flex-shrink-0">
        <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5 whitespace-nowrap">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z"/>
          </svg>
          Filter
        </button>

        <button
          @click="handleRefresh"
          class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Table Header -->
    <div class="mb-3 flex items-center justify-between">
      <div class="text-xs text-gray-600">
        <span v-if="filteredCustomers.length > 0">
          Showing {{ startIndex }}–{{ endIndex }} of {{ filteredCustomers.length }} customers
        </span>
        <span v-else>
          No customers found
        </span>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="hidden md:block card overflow-hidden">
      <div v-if="filteredCustomers.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-300 bg-gray-50">
              <th class="px-5 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Customer</th>
              <th class="px-5 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</th>
              <th class="px-5 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone</th>
              <th class="px-5 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Username</th>
              <th class="px-5 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(customer, idx) in paginatedCustomers" :key="customer.id" :class="['hover:bg-gray-50/60 transition-colors', idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30']">
              <td class="px-5 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-semibold text-primary">{{ getInitials(customer.name) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ customer.name }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ getProductLabel(customer.product) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3">
                <p class="text-sm text-gray-600 truncate">{{ customer.email }}</p>
              </td>
              <td class="px-5 py-3">
                <p class="text-sm text-gray-600 font-mono">{{ customer.phone }}</p>
              </td>
              <td class="px-5 py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  {{ customer.username }}
                </span>
              </td>
              <td class="px-5 py-3">
                <button
                  @click="handleViewProfile(customer.id)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  View
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM9 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        </svg>
        <p class="text-sm font-medium text-gray-900">No customers found</p>
        <p class="text-xs text-gray-500 mt-1">Try changing your search or filters.</p>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-2">
      <div v-if="filteredCustomers.length > 0">
        <div v-for="customer in paginatedCustomers" :key="customer.id" class="card p-3.5">
          <div class="flex items-start gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-semibold text-primary">{{ getInitials(customer.name) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ customer.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ getProductLabel(customer.product) }}</p>
            </div>
          </div>
          <div class="space-y-1.5 mb-3 text-xs">
            <div>
              <p class="text-gray-500">Email</p>
              <p class="text-gray-700 truncate">{{ customer.email }}</p>
            </div>
            <div>
              <p class="text-gray-500">Phone</p>
              <p class="text-gray-700 font-mono">{{ customer.phone }}</p>
            </div>
            <div>
              <p class="text-gray-500">Username</p>
              <p class="text-gray-700">{{ customer.username }}</p>
            </div>
          </div>
          <button
            @click="handleViewProfile(customer.id)"
            class="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Profile
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-else class="card p-8 text-center">
        <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM9 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        </svg>
        <p class="text-sm font-medium text-gray-900">No customers found</p>
        <p class="text-xs text-gray-500 mt-1">Try changing your search or filters.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <div class="text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
</template>
