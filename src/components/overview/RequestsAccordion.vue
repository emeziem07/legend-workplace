<script setup lang="ts">
import { ref } from 'vue'
import type { RequestItem } from '../../stores/requests'
import StatusBadge from '../common/StatusBadge.vue'

defineProps<{ requests: RequestItem[] }>()

const expandedId = ref<string | null>(null)

const toggle = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="card">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
      <div class="min-w-0">
        <h2 class="section-title">My Requests</h2>
        <p class="text-xs text-gray-500 mt-0.5 truncate">Recent requests and their approval status</p>
      </div>
      <RouterLink
        to="/workplace/requests"
        class="text-xs font-medium text-primary hover:text-primary-600 transition-colors shrink-0 ml-3"
      >
        View All
      </RouterLink>
    </div>

    <!-- Desktop: list rows (unchanged) -->
    <div class="hidden sm:block divide-y divide-gray-100">
      <div v-for="req in requests" :key="req.id">
        <button @click="toggle(req.id)" class="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors text-left">
          <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <svg v-if="req.type === 'Leave'" class="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24
