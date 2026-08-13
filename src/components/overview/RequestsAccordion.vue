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
            <svg v-if="req.type === 'Leave'" class="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <svg v-else-if="req.type === 'Trip'" class="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
            <svg v-else class="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900 truncate">{{ req.title }}</span>
              <span class="badge badge-gray text-xs shrink-0">{{ req.type }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">Submitted {{ req.date }}</p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <StatusBadge :status="req.status" />
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', expandedId === req.id ? 'rotate-180' : '']"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </button>

        <!-- Expanded Content (desktop) -->
        <Transition name="slide-down">
          <div v-if="expandedId === req.id" class="border-t border-gray-100 bg-gray-50/40">
            <div class="px-6 py-5 grid md:grid-cols-3 gap-6">
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Request Details</p>
                <dl class="space-y-2">
                  <div v-for="(val, key) in req.details" :key="key" class="flex flex-col gap-0.5">
                    <dt class="text-xs text-gray-500">{{ key }}</dt>
                    <dd class="text-sm text-gray-900 font-medium">{{ val }}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Attached Documents</p>
                <div v-if="req.documents.length" class="space-y-2">
                  <div
                    v-for="doc in req.documents"
                    :key="doc.name"
                    class="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-primary-200 transition-colors"
                  >
                    <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-gray-800 truncate">{{ doc.name }}</p>
                      <p class="text-xs text-gray-400">{{ doc.size }}</p>
                    </div>
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 italic">No documents attached</p>
                <div v-if="req.supervisorComment" class="mt-4">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supervisor Comment</p>
                  <div class="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p class="text-xs text-amber-900 leading-relaxed">{{ req.supervisorComment }}</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Approval Timeline</p>
                <div class="relative">
                  <div class="absolute left-2.5 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div class="space-y-4">
                    <div v-for="(step, i) in req.timeline" :key="i" class="relative pl-8">
                      <div :class="[
                        'absolute left-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center',
                        step.status === 'Approved' ? 'bg-green-500' :
                        step.status === 'Rejected' ? 'bg-red-500' :
                        step.status === 'Pending' ? 'bg-amber-400' : 'bg-gray-200'
                      ]">
                        <svg v-if="step.status === 'Approved'" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <svg v-else-if="step.status === 'Rejected'" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-900">{{ step.name }}</p>
                      <p class="text-xs text-gray-500">{{ step.role }}</p>
                      <p v-if="step.date" class="text-xs text-gray-400 mt-0.5">{{ step.date }}</p>
                      <p v-if="step.comment" class="text-xs text-gray-600 italic mt-1 bg-white px-2 py-1 rounded border border-gray-100">"{{ step.comment }}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Mobile: proper request cards -->
    <div class="sm:hidden p-3 space-y-3">
      <div
        v-for="req in requests"
        :key="req.id"
        class="rounded-xl border border-gray-100 bg-white overflow-hidden"
      >
        <button @click="toggle(req.id)" class="w-full p-4 text-left">
          <!-- Row 1: Icon + Title + Status badge -->
          <div class="flex items-center gap-3 mb-2.5">
            <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <svg v-if="req.type === 'Leave'" class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <svg v-else-if="req.type === 'Trip'" class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
              <svg v-else class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 flex-1 min-w-0 leading-snug">{{ req.title }}</p>
            <StatusBadge :status="req.status" size="sm" />
          </div>

          <!-- Row 2: Type badge + Submission date -->
          <div class="flex items-center gap-2 mb-2.5 pl-12">
            <span class="badge badge-gray text-xs">{{ req.type }}</span>
            <span class="text-xs text-gray-500">Submitted {{ req.date }}</span>
          </div>

          <!-- Row 3: Chevron -->
          <div class="flex items-center justify-end pl-12">
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', expandedId === req.id ? 'rotate-180' : '']"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </button>

        <!-- Expanded Content (mobile) -->
        <Transition name="slide-down">
          <div v-if="expandedId === req.id" class="border-t border-gray-100 bg-gray-50/40 px-4 py-4 space-y-5">
            <!-- Details -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Request Details</p>
              <dl class="space-y-2">
                <div v-for="(val, key) in req.details" :key="key" class="flex flex-col gap-0.5">
                  <dt class="text-xs text-gray-500">{{ key }}</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ val }}</dd>
                </div>
              </dl>
            </div>

            <!-- Documents -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Attached Documents</p>
              <div v-if="req.documents.length" class="space-y-2">
                <div
                  v-for="doc in req.documents"
                  :key="doc.name"
                  class="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200"
                >
                  <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-800 truncate">{{ doc.name }}</p>
                    <p class="text-xs text-gray-400">{{ doc.size }}</p>
                  </div>
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 italic">No documents attached</p>
            </div>

            <!-- Supervisor Comment -->
            <div v-if="req.supervisorComment">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supervisor Comment</p>
              <div class="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p class="text-xs text-amber-900 leading-relaxed">{{ req.supervisorComment }}</p>
              </div>
            </div>

            <!-- Approval Timeline -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Approval Timeline</p>
              <div class="relative">
                <div class="absolute left-2.5 top-0 bottom-0 w-px bg-gray-200"></div>
                <div class="space-y-4">
                  <div v-for="(step, i) in req.timeline" :key="i" class="relative pl-8">
                    <div :class="[
                      'absolute left-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center',
                      step.status === 'Approved' ? 'bg-green-500' :
                      step.status === 'Rejected' ? 'bg-red-500' :
                      step.status === 'Pending' ? 'bg-amber-400' : 'bg-gray-200'
                    ]">
                      <svg v-if="step.status === 'Approved'" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <svg v-else-if="step.status === 'Rejected'" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </div>
                    <p class="text-sm font-medium text-gray-900">{{ step.name }}</p>
                    <p class="text-xs text-gray-500">{{ step.role }}</p>
                    <p v-if="step.date" class="text-xs text-gray-400 mt-0.5">{{ step.date }}</p>
                    <p v-if="step.comment" class="text-xs text-gray-600 italic mt-1 bg-white px-2 py-1 rounded border border-gray-100">"{{ step.comment }}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
