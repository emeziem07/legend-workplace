<script setup lang="ts">
defineProps<{
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  subtitle?: string
  icon: string
  color?: string
}>()
</script>

<template>
  <div class="card p-5">
    <div class="flex items-start justify-between mb-4">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', color || 'bg-primary-50']">
        <!-- Chart Bar -->
        <svg v-if="icon === 'chart-bar'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
        <!-- Calendar -->
        <svg v-else-if="icon === 'calendar'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <!-- Document -->
        <svg v-else-if="icon === 'document'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <!-- Trending up -->
        <svg v-else-if="icon === 'trending-up'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
        <!-- Star -->
        <svg v-else-if="icon === 'star'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <!-- Check -->
        <svg v-else-if="icon === 'check'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <!-- Clock -->
        <svg v-else-if="icon === 'clock'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <!-- Default -->
        <svg v-else class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>

      <span v-if="delta" :class="['inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', deltaPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600']">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path v-if="deltaPositive" d="M18 15l-6-6-6 6"/>
          <path v-else d="M6 9l6 6 6-6"/>
        </svg>
        {{ delta }}
      </span>
    </div>

    <div>
      <p class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{{ value }}</p>
      <p class="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">{{ label }}</p>
      <p v-if="subtitle" class="text-xs text-gray-400 mt-0.5">{{ subtitle }}</p>
    </div>
  </div>
</template>
