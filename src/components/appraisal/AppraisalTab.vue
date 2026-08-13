<script setup lang="ts">
import { ref } from 'vue'
import { useAppraisalStore } from '../../stores/appraisal'
import StatusBadge from '../common/StatusBadge.vue'

const store = useAppraisalStore()
const expanded = ref<string | null>('ap1')

const toggle = (id: string) => {
  expanded.value = expanded.value === id ? null : id
}

const getScoreColor = (score: number | null) => {
  if (score === null) return 'bg-gray-200'
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

const getRatingColor = (rating: string | null) => {
  if (!rating) return 'badge-gray'
  if (rating.includes('Exceeds')) return 'badge-blue'
  if (rating.includes('Meets')) return 'badge-green'
  return 'badge-amber'
}
</script>

<template>
  <div>
    <div class="section-header mb-6">
      <div>
        <h2 class="section-title">Performance Appraisals</h2>
        <p class="text-xs text-gray-500 mt-0.5">Your appraisal history and current cycle progress</p>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="cycle in store.cycles" :key="cycle.id" class="card">
        <!-- Header -->
        <button @click="toggle(cycle.id)" class="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 text-left hover:bg-gray-50/50 transition-colors">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', cycle.status === 'Completed' ? 'bg-green-50' : 'bg-amber-50']">
            <svg :class="['w-5 h-5', cycle.status === 'Completed' ? 'text-green-600' : 'text-amber-600']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path v-if="cycle.status === 'Completed'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              <path v-else d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-semibold text-gray-900">{{ cycle.period }}</span>
              <StatusBadge :status="cycle.status" size="sm" />
              <span v-if="cycle.rating" :class="['badge text-xs', getRatingColor(cycle.rating)]">{{ cycle.rating }}</span>
            </div>
            <div class="flex items-center gap-4 mt-1 flex-wrap">
              <p v-if="cycle.overallScore" class="text-xs text-gray-500">Score: <span class="font-semibold text-gray-800">{{ cycle.overallScore }}%</span></p>
              <p v-if="cycle.reviewedBy" class="text-xs text-gray-500">Reviewed by {{ cycle.reviewedBy }}</p>
              <p v-if="cycle.completedDate" class="text-xs text-gray-400">{{ cycle.completedDate }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <button v-if="cycle.status === 'Completed'" class="btn-secondary text-xs hidden sm:inline-flex" @click.stop>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200', expanded === cycle.id ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </button>

        <!-- Expanded -->
        <Transition name="slide-down">
          <div v-if="expanded === cycle.id" class="border-t border-gray-100 px-4 sm:px-6 py-5">
            <!-- Score visualization -->
            <div v-if="cycle.overallScore" class="mb-5 p-4 bg-gray-50 rounded-xl flex items-center gap-4 sm:gap-6">
              <div class="relative w-20 h-20 shrink-0">
                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle class="text-gray-200" stroke="currentColor" stroke-width="3" fill="none" cx="18" cy="18" r="15.9"/>
                  <circle
                    :class="cycle.overallScore >= 90 ? 'text-green-500' : cycle.overallScore >= 80 ? 'text-blue-500' : 'text-amber-500'"
                    stroke="currentColor" stroke-width="3" fill="none" cx="18" cy="18" r="15.9"
                    :stroke-dasharray="`${cycle.overallScore} 100`"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-base font-bold text-gray-900">{{ cycle.overallScore }}%</span>
                </div>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900">Overall Performance Score</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ cycle.rating }}</p>
                <p v-if="cycle.reviewedBy" class="text-xs text-gray-400 mt-1">Appraised by {{ cycle.reviewedBy }} · {{ cycle.completedDate }}</p>
              </div>
            </div>

            <!-- Objectives breakdown -->
            <div class="mb-5">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Objective Scores</p>
              <div class="space-y-3">
                <div v-for="obj in cycle.objectives" :key="obj.name" class="flex items-center gap-3 sm:gap-4">
                  <span class="text-xs text-gray-700 w-40 sm:w-52 shrink-0">{{ obj.name }}</span>
                  <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-0">
                    <div
                      v-if="obj.score"
                      :class="['h-full rounded-full transition-all duration-500', getScoreColor(obj.score)]"
                      :style="{ width: `${obj.score}%` }"
                    ></div>
                  </div>
                  <span class="text-xs font-medium text-gray-800 w-12 text-right shrink-0">{{ obj.score !== null ? `${obj.score}%` : 'TBD' }}</span>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div v-if="cycle.supervisorComments">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supervisor Comments</p>
              <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p class="text-sm text-blue-900 leading-relaxed">{{ cycle.supervisorComments }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
