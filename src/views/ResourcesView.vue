<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { computed } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const showCustomerInsights = computed(() => {
  return ['hr', 'supervisor', 'admin'].includes(userStore.role)
})
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Resources</h1>
      <p class="text-sm text-gray-500 mt-0.5">Access company tools, documents, and resources</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <!-- Document Management System -->
      <div
        @click="router.push('/resources/dms')"
        class="card p-6 cursor-pointer hover:border-primary-200 hover:shadow-sm transition-all group"
      >
        <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">Document Management System</h3>
        <p class="text-xs text-gray-500 leading-relaxed">Upload, manage, and access company documents with approval workflows.</p>
        <div class="mt-4 flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Open Module
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>

      <!-- Corporate Planning -->
      <div class="card p-6 cursor-pointer hover:border-primary-200 hover:shadow-sm transition-all group">
        <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">Corporate Planning</h3>
        <p class="text-xs text-gray-500 leading-relaxed">Strategic business unit planning.</p>
        <div class="mt-4 flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Open Module
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>

      <!-- Knowledge Base -->
      <div
        @click="router.push('/resources/knowledge-base')"
        class="card p-6 cursor-pointer hover:border-primary-200 hover:shadow-sm transition-all group"
      >
        <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">Knowledge Base</h3>
        <p class="text-xs text-gray-500 leading-relaxed">Access organizational knowledge, policies and strategic documentation.</p>
        <div class="mt-4 flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Open Module
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>

      <!-- Installation Insights (conditional) -->
      <div
        v-if="showCustomerInsights"
        @click="router.push('/installation-insights')"
        class="card p-6 cursor-pointer hover:border-primary-200 hover:shadow-sm transition-all group"
      >
        <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">Installation Insights</h3>
        <p class="text-xs text-gray-500 leading-relaxed">Monitor customer installations, activations, provisioning and operational performance.</p>
        <div class="mt-4 flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Open Module
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>

      <!-- Customer Insights -->
      <div
        @click="router.push('/resources/customer-insights')"
        class="card p-6 cursor-pointer hover:border-primary-200 hover:shadow-sm transition-all group"
      >
        <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM9 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">Customer Insights</h3>
        <p class="text-xs text-gray-500 leading-relaxed">View, search and manage customer information across Legend products and services.</p>
        <div class="mt-4 flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Open Module
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>
