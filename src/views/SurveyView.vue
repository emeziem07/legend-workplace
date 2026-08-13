<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFeedbackStore } from '../stores/feedback'
import ConfirmModal from '../components/common/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const store = useFeedbackStore()

const survey = computed(() => store.surveys.find(s => s.id === route.params.id))
const activeSection = ref(0)
const showSubmitModal = ref(false)
const submitted = ref(false)

const totalSections = computed(() => survey.value?.sections.length || 0)
const currentSection = computed(() => survey.value?.sections[activeSection.value])

const answeredInSection = (si: number) => {
  const section = survey.value?.sections[si]
  if (!section) return 0
  return section.questions.filter(q => q.answer !== undefined && q.answer !== '' && !(Array.isArray(q.answer) && q.answer.length === 0)).length
}

const totalAnswered = computed(() => {
  return survey.value?.sections.reduce((a, s) => a + s.questions.filter(q => q.answer !== undefined && q.answer !== '').length, 0) || 0
})

const totalQuestions = computed(() => {
  return survey.value?.sections.reduce((a, s) => a + s.questions.length, 0) || 0
})

const progress = computed(() => totalQuestions.value ? Math.round((totalAnswered.value / totalQuestions.value) * 100) : 0)

const updateAnswer = (qId: string, val: string | string[]) => {
  if (survey.value) store.updateAnswer(survey.value.id, qId, val)
}

const toggleCheckbox = (qId: string, option: string, current: string | string[] | undefined) => {
  const arr = Array.isArray(current) ? [...current] : []
  const idx = arr.indexOf(option)
  if (idx === -1) arr.push(option)
  else arr.splice(idx, 1)
  updateAnswer(qId, arr)
}

const confirmSubmit = () => {
  if (survey.value) {
    store.submitSurvey(survey.value.id)
    submitted.value = true
    showSubmitModal.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Survey Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4">
        <button @click="router.back()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ survey?.title }}</p>
          <div class="flex items-center gap-3 mt-1">
            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="text-xs text-gray-500 shrink-0">{{ progress }}%</span>
          </div>
        </div>
        <button v-if="!submitted" @click="showSubmitModal = true" class="btn-primary text-sm shrink-0">Submit</button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
      <!-- Section Nav -->
      <div class="lg:w-56 shrink-0">
        <!-- Mobile: horizontal scroll; Desktop: sticky sidebar -->
        <div class="lg:card lg:p-4 lg:sticky lg:top-24">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 hidden lg:block">Sections</p>
          <div class="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar lg:overflow-visible">
            <button
              v-for="(section, si) in survey?.sections"
              :key="section.id"
              @click="activeSection = si"
              :class="[
                'text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink',
                activeSection === si ? 'bg-primary-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <span class="truncate">{{ section.title }}</span>
              <span :class="['text-xs shrink-0', answeredInSection(si) === section.questions.length ? 'text-green-500' : 'text-gray-400']">
                {{ answeredInSection(si) }}/{{ section.questions.length }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Survey Content -->
      <div class="flex-1 min-w-0">
        <div v-if="submitted" class="card p-12 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Survey Submitted!</h2>
          <p class="text-sm text-gray-500 mb-6">Thank you for completing the survey. Your responses have been recorded.</p>
          <button @click="router.back()" class="btn-primary">Back to Dashboard</button>
        </div>

        <div v-else-if="currentSection">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-medium text-primary">Section {{ activeSection + 1 }} of {{ totalSections }}</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">{{ currentSection.title }}</h2>
          </div>

          <div class="space-y-5">
            <div
              v-for="(q, qi) in currentSection.questions"
              :key="q.id"
              class="card p-6"
            >
              <p class="text-sm font-medium text-gray-900 mb-3">
                {{ qi + 1 }}. {{ q.text }}
                <span v-if="q.required" class="text-red-500 ml-0.5">*</span>
              </p>

              <!-- Radio -->
              <div v-if="q.type === 'radio'" class="space-y-2">
                <label v-for="opt in q.options" :key="opt" class="flex items-center gap-3 cursor-pointer group">
                  <div :class="['w-4 h-4 rounded-full border-2 shrink-0 transition-colors', q.answer === opt ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary-300']">
                    <div v-if="q.answer === opt" class="w-full h-full rounded-full bg-white scale-50 block"></div>
                  </div>
                  <input type="radio" :name="q.id" :value="opt" :checked="q.answer === opt" @change="updateAnswer(q.id, opt)" class="hidden" />
                  <span class="text-sm text-gray-700">{{ opt }}</span>
                </label>
              </div>

              <!-- True/False -->
              <div v-else-if="q.type === 'true-false'" class="flex gap-3">
                <button
                  v-for="opt in ['True', 'False']"
                  :key="opt"
                  @click="updateAnswer(q.id, opt)"
                  :class="['px-6 py-2 rounded-lg text-sm font-medium border-2 transition-colors', q.answer === opt ? (opt === 'True' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') : 'border-gray-200 text-gray-600 hover:border-gray-300']"
                >
                  {{ opt }}
                </button>
              </div>

              <!-- Checkbox -->
              <div v-else-if="q.type === 'checkbox'" class="space-y-2">
                <label v-for="opt in q.options" :key="opt" class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="opt"
                    :checked="Array.isArray(q.answer) && q.answer.includes(opt)"
                    @change="toggleCheckbox(q.id, opt, q.answer)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary-200"
                  />
                  <span class="text-sm text-gray-700">{{ opt }}</span>
                </label>
              </div>

              <!-- Multiple Choice (same as checkbox visually) -->
              <div v-else-if="q.type === 'multiple-choice'" class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in q.options"
                  :key="opt"
                  @click="toggleCheckbox(q.id, opt, q.answer)"
                  :class="['px-3 py-2 rounded-lg text-sm border-2 text-left transition-colors', Array.isArray(q.answer) && q.answer.includes(opt) ? 'border-primary bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
                >
                  {{ opt }}
                </button>
              </div>

              <!-- Dropdown -->
              <div v-else-if="q.type === 'dropdown'">
                <select :value="q.answer as string" @change="updateAnswer(q.id, ($event.target as HTMLSelectElement).value)" class="select">
                  <option value="">Select an option</option>
                  <option v-for="opt in q.options" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>

              <!-- Short Answer -->
              <div v-else-if="q.type === 'short-answer'">
                <input :value="q.answer as string" @input="updateAnswer(q.id, ($event.target as HTMLInputElement).value)" type="text" placeholder="Your answer..." class="input" />
              </div>

              <!-- Paragraph -->
              <div v-else-if="q.type === 'paragraph'">
                <textarea :value="q.answer as string" @input="updateAnswer(q.id, ($event.target as HTMLTextAreaElement).value)" rows="4" placeholder="Your answer..." class="input resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-6 gap-3">
            <button v-if="activeSection > 0" @click="activeSection--" class="btn-secondary w-full sm:w-auto justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              Previous
            </button>
            <div v-else></div>

            <button
              v-if="activeSection < totalSections - 1"
              @click="activeSection++"
              class="btn-primary w-full sm:w-auto justify-center"
            >
              Next Section
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <button v-else @click="showSubmitModal = true" class="btn-primary w-full sm:w-auto justify-center">
              Submit Survey
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Confirm -->
    <ConfirmModal
      v-if="showSubmitModal"
      title="Submit Survey"
      message="You are about to submit this survey. Once submitted, you will not be able to edit your responses unless the survey is reopened by an administrator."
      confirm-label="Submit Survey"
      @confirm="confirmSubmit"
      @cancel="showSubmitModal = false"
    />
  </div>
</template>
