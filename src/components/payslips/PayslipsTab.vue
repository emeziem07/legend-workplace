<script setup lang="ts">
import { ref } from 'vue'
import { usePayslipsStore } from '../../stores/payslips'
import StatusBadge from '../common/StatusBadge.vue'

const store = usePayslipsStore()
const expanded = ref<string | null>(null)

const toggle = (id: string) => {
  expanded.value = expanded.value === id ? null : id
}
</script>

<template>
  <div>
    <div class="section-header mb-6">
      <div>
        <h2 class="section-title">Payslip History</h2>
        <p class="text-xs text-gray-500 mt-0.5">Your salary statements and earnings history</p>
      </div>
    </div>

    <div class="card divide-y divide-gray-100">
      <div v-for="payslip in store.payslips" :key="payslip.id">
        <button @click="toggle(payslip.id)" class="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50/60 transition-colors text-left">
          <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ payslip.period }}</p>
            <p class="text-xs text-gray-500 mt-0.5">Pay date: {{ payslip.payDate }}</p>
          </div>

          <div class="text-right mr-2 sm:mr-4 hidden sm:block">
