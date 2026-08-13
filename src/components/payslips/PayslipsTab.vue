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
            <p class="text-sm font-bold text-gray-900">{{ payslip.netPay }}</p>
            <p class="text-xs text-gray-400">Net Pay</p>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <StatusBadge :status="payslip.status" size="sm" />
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200', expanded === payslip.id ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </button>

        <Transition name="slide-down">
          <div v-if="expanded === payslip.id" class="border-t border-gray-100 px-4 sm:px-6 py-5 bg-gray-50/40">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Earnings -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Earnings</p>
                <div class="space-y-2">
                  <div v-for="[key, val] in [
                    ['Basic Salary', payslip.breakdown.basicSalary],
                    ['Housing Allowance', payslip.breakdown.housing],
                    ['Transport Allowance', payslip.breakdown.transport],
                    ['Medical Allowance', payslip.breakdown.medicalAllowance],
                    ['Performance Bonus', payslip.breakdown.performanceBonus],
                  ]" :key="key" class="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span class="text-sm text-gray-600">{{ key }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ val }}</span>
                  </div>
                  <div class="flex items-center justify-between py-1.5 mt-2 border-t-2 border-gray-200">
                    <span class="text-sm font-semibold text-gray-900">Gross Pay</span>
                    <span class="text-sm font-bold text-gray-900">{{ payslip.grossPay }}</span>
                  </div>
                </div>
              </div>

              <!-- Deductions -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Deductions</p>
                <div class="space-y-2">
                  <div v-for="[key, val] in [
                    ['Pension (7.5%)', payslip.breakdown.pension],
                    ['Income Tax (PAYE)', payslip.breakdown.tax],
                    ['NHF (2.5%)', payslip.breakdown.nhf],
                  ]" :key="key" class="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span class="text-sm text-gray-600">{{ key }}</span>
                    <span class="text-sm font-medium text-red-600">-{{ val }}</span>
                  </div>
                  <div class="flex items-center justify-between py-1.5 mt-2 border-t-2 border-gray-200">
                    <span class="text-sm font-semibold text-gray-900">Total Deductions</span>
                    <span class="text-sm font-bold text-red-600">-{{ payslip.deductions }}</span>
                  </div>
                </div>

                <!-- Net -->
                <div class="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-gray-900">Net Pay</span>
                    <span class="text-lg font-bold text-gray-900">{{ payslip.netPay }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row gap-2">
              <button class="btn-secondary text-xs gap-1.5 justify-center">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </button>
              <button class="btn-secondary text-xs gap-1.5 justify-center">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
