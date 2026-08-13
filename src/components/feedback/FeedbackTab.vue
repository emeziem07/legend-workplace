<script setup lang="ts">
import { useFeedbackStore } from '../../stores/feedback'
import StatusBadge from '../common/StatusBadge.vue'
import { useRouter } from 'vue-router'

const store = useFeedbackStore()
const router = useRouter()

const getStatusColor = (status: string) => {
  if (status === 'Completed') return 'text-green-600'
  if (status === 'In Progress') return 'text-amber-600'
  return 'text-gray-500'
}

const totalQuestions = (survey: typeof store.surveys[0]) =>
  survey.sections.reduce((a, s) => a + s.questions.length, 0)

const answeredQuestions = (survey: typeof store.surveys[0]) =>
  survey.sections.reduce((a, s) => a + s.questions.filter(q => q.answer !== undefined && q.answer !== '').length, 0)

const openSurvey = (surveyId: string) => {
  router.push(`/survey/${surveyId}`)
}
</script>

<template>
  <div>
    <div class="section-header mb-6">
      <div>
        <h2 class="section-title">Surveys & Feedback</h2>
        <p class="text-xs text-gray-500 mt-0.5">Company surveys assigned to you</p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="survey in store.surveys"
        :key="survey.id"
        class="card flex flex-col"
      >
        <!-- Top -->
        <div class="p-5 flex-1">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            </div>
            <StatusBadge :status="survey.status" size="sm" />
          </div>

          <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ survey.title }}</h3>
          <p class="text-xs text-gray-500 leading-relaxed mb-4">{{ survey.description }}</p>

          <!-- Progress -->
          <div v-if="survey.status !== 'Not Started'" class="mb-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500">{{ answeredQuestions(survey) }} / {{ totalQuestions(survey) }} questions</span>
              <span :class="['text-xs font-medium', getStatusColor(survey.status)]">
                {{ Math.round((answeredQuestions(survey) / totalQuestions(survey)) * 100) }}%
              </span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full', survey.status === 'Completed' ? 'bg-green-500' : 'bg-primary']"
                :style="{ width: `${Math.round((answeredQuestions(survey) / totalQuestions(survey)) * 100)}%` }"
              ></div>
            </div>
          </div>

          <div class="flex items-center gap-1 text-xs text-gray-400">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Due {{ survey.dueDate }}
            <span v-if="survey.submittedAt" class="ml-2 text-green-600">· Submitted {{ survey.submittedAt }}</span>
          </div>
        </div>

        <!-- Footer CTA -->
        <div class="border-t border-gray-100 px-5 py-3">
          <button
            v-if="survey.status !== 'Completed'"
            @click="openSurvey(survey.id)"
            class="btn-primary w-full justify-center text-xs"
          >
            {{ survey.status === 'In Progress' ? 'Continue Survey' : 'Start Survey' }}
          </button>
          <div v-else class="flex items-center justify-center gap-2 py-0.5">
            <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span class="text-xs font-medium text-green-600">Survey Completed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
