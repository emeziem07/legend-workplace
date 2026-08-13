<script setup lang="ts">
import { ref, computed } from 'vue'
import { useResourcesStore } from '../stores/resources'
import StatusBadge from '../components/common/StatusBadge.vue'
import { useRouter } from 'vue-router'

const store = useResourcesStore()
const router = useRouter()

type DmsTab = 'all' | 'upload' | 'pending'
const activeTab = ref<DmsTab>('all')
const searchQuery = ref('')
const typeFilter = ref('')
const dragOver = ref(false)

// Preview Modal
const showPreviewModal = ref(false)
const selectedDocument = ref<any>(null)

const uploadForm = ref({
  title: '',
  type: '',
  department: '',
  description: '',
  file: null as File | null,
})

const uploadProgress = ref(0)
const uploadState = ref<'idle' | 'uploading' | 'done'>('idle')

const filtered = computed(() => {
  let docs = store.documents
  if (activeTab.value === 'pending') docs = docs.filter(d => d.status === 'Pending')
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    docs = docs.filter(d => d.title.toLowerCase().includes(q) || d.department.toLowerCase().includes(q))
  }
  if (typeFilter.value) docs = docs.filter(d => d.type === typeFilter.value)
  return docs
})

const docTypes = [...new Set(store.documents.map(d => d.type))]

const handleDrop = (e: DragEvent) => {
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (files?.[0]) uploadForm.value.file = files[0]
}

const handleFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) uploadForm.value.file = input.files[0]
}

const simulateUpload = () => {
  uploadState.value = 'uploading'
  uploadProgress.value = 0
  const interval = setInterval(() => {
    uploadProgress.value += 20
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploadState.value = 'done'
      store.addDocument({
        title: uploadForm.value.title,
        type: uploadForm.value.type,
        department: uploadForm.value.department,
        description: uploadForm.value.description,
        fileName: uploadForm.value.file?.name || 'document.pdf',
        fileSize: uploadForm.value.file ? `${(uploadForm.value.file.size / 1024).toFixed(0)} KB` : 'Unknown',
        uploadedBy: 'Alex Johnson',
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending',
        version: 'v1.0',
      })
      setTimeout(() => {
        uploadState.value = 'idle'
        uploadForm.value = { title: '', type: '', department: '', description: '', file: null }
        activeTab.value = 'all'
      }, 1500)
    }
  }, 300)
}

const typeIcon = (type: string) => {
  if (type.toLowerCase().includes('policy') || type.toLowerCase().includes('hr')) return '#ef4444'
  if (type.toLowerCase().includes('strategic') || type.toLowerCase().includes('minute')) return '#3b82f6'
  if (type.toLowerCase().includes('compliance') || type.toLowerCase().includes('finance')) return '#f59e0b'
  return '#6b7280'
}

const openPreview = (doc: any) => {
  selectedDocument.value = doc
  showPreviewModal.value = true
}

const closePreview = () => {
  showPreviewModal.value = false
  selectedDocument.value = null
}

const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

const isPdf = computed(() => {
  if (!selectedDocument.value) return false
  return getFileExtension(selectedDocument.value.fileName) === 'pdf'
})

const isImage = computed(() => {
  if (!selectedDocument.value) return false
  const ext = getFileExtension(selectedDocument.value.fileName)
  return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
})
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-4 overflow-x-auto no-scrollbar">
      <button @click="router.push('/resources')" class="hover:text-gray-800 transition-colors shrink-0">Resources</button>
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
      <span class="text-gray-900 font-medium shrink-0">Document Management System</span>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Document Management System</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ store.documents.length }} documents · {{ store.documents.filter(d => d.status === 'Pending').length }} pending approval</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tab-strip -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      <button @click="activeTab = 'all'" :class="['tab-btn', activeTab === 'all' ? 'active' : '']">All Documents</button>
      <button @click="activeTab = 'upload'" :class="['tab-btn', activeTab === 'upload' ? 'active' : '']">Upload Document</button>
      <button @click="activeTab = 'pending'" :class="['tab-btn', activeTab === 'pending' ? 'active' : '']">
        Pending Approval
        <span class="ml-1.5 badge badge-amber">{{ store.documents.filter(d => d.status === 'Pending').length }}</span>
      </button>
    </div>

    <!-- All Documents -->
    <div v-if="activeTab === 'all' || activeTab === 'pending'">
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-5">
        <div class="relative flex-1 min-w-0 sm:min-w-48">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Search documents..." class="input pl-9" />
        </div>
        <select v-model="typeFilter" class="select w-full sm:w-48">
          <option value="">All Types</option>
          <option v-for="t in docTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div class="card overflow-hidden">
        <!-- Desktop: Table -->
        <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Document</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Type</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Department</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Uploaded</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Version</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 pr-6">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="doc in filtered" :key="doc.id" class="hover:bg-gray-50/60 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div :style="{ color: typeIcon(doc.type) }" class="shrink-0">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" opacity="0.15">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ doc.title }}</p>
                    <p class="text-xs text-gray-400">{{ doc.fileName }} · {{ doc.fileSize }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span class="text-xs text-gray-600">{{ doc.type }}</span>
              </td>
              <td class="px-4 py-4">
                <span class="text-xs text-gray-600">{{ doc.department }}</span>
              </td>
              <td class="px-4 py-4">
                <p class="text-xs text-gray-600">{{ doc.uploadedAt }}</p>
                <p class="text-xs text-gray-400">by {{ doc.uploadedBy }}</p>
              </td>
              <td class="px-4 py-4">
                <span class="badge badge-gray text-xs">{{ doc.version }}</span>
              </td>
              <td class="px-4 py-4 pr-6">
                <div class="flex items-center gap-2">
                  <StatusBadge :status="doc.status" size="sm" />
                  <button @click="openPreview(doc)" class="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost text-xs p-1" title="View document">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <!-- Mobile: Card layout -->
        <div class="md:hidden divide-y divide-gray-50">
          <div v-for="doc in filtered" :key="doc.id" class="px-4 py-4">
            <div class="flex items-start gap-3 mb-2">
              <div :style="{ color: typeIcon(doc.type) }" class="shrink-0">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" opacity="0.15">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ doc.title }}</p>
                <p class="text-xs text-gray-400 truncate">{{ doc.fileName }} · {{ doc.fileSize }}</p>
              </div>
              <StatusBadge :status="doc.status" size="sm" />
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500 pl-10">
              <span>{{ doc.type }}</span>
              <span>·</span>
              <span>{{ doc.department }}</span>
              <span>·</span>
              <span>{{ doc.uploadedAt }}</span>
            </div>
          </div>
        </div>

        <div v-if="!filtered.length" class="py-12 text-center">
          <p class="text-sm text-gray-400">No documents found</p>
        </div>
      </div>
    </div>

    <!-- Upload Tab -->
    <div v-if="activeTab === 'upload'">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Left: Form -->
        <div class="space-y-4">
          <div>
            <label class="label">Document Title <span class="text-red-500">*</span></label>
            <input v-model="uploadForm.title" type="text" placeholder="Enter document title" class="input" />
          </div>
          <div>
            <label class="label">Document Type <span class="text-red-500">*</span></label>
            <select v-model="uploadForm.type" class="select">
              <option value="">Select type</option>
              <option>Strategic Document</option>
              <option>HR Policy</option>
              <option>IT Policy</option>
              <option>Finance Policy</option>
              <option>Compliance Document</option>
              <option>Meeting Minutes</option>
              <option>Report</option>
              <option>Procedure Manual</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label class="label">Department</label>
            <select v-model="uploadForm.department" class="select">
              <option value="">Select department</option>
              <option>Strategy & Operations</option>
              <option>Human Resources</option>
              <option>Finance</option>
              <option>Information Technology</option>
              <option>Risk & Compliance</option>
              <option>Executive</option>
              <option>Marketing</option>
              <option>Sales</option>
            </select>
          </div>
          <div>
            <label class="label">Description</label>
            <textarea v-model="uploadForm.description" rows="4" placeholder="Brief description of this document..." class="input resize-none"></textarea>
          </div>
        </div>

        <!-- Right: Upload Area -->
        <div class="flex flex-col gap-4">
          <div>
            <label class="label">Document File <span class="text-red-500">*</span></label>
            <label
              @dragover.prevent="dragOver = true"
              @dragleave="dragOver = false"
              @drop.prevent="handleDrop"
              :class="[
                'flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all',
                dragOver ? 'border-primary bg-primary-50' : uploadForm.file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
              ]"
            >
              <input type="file" class="hidden" @change="handleFileInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg" />

              <div v-if="!uploadForm.file" class="flex flex-col items-center gap-3 p-6 text-center">
                <div class="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
                  <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700">Drag & drop or click to upload</p>
                  <p class="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, PPT, PNG, JPG</p>
                  <p class="text-xs text-gray-400">Max 50 MB per file</p>
                </div>
              </div>

              <div v-else class="flex flex-col items-center gap-3 p-6 text-center">
                <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ uploadForm.file.name }}</p>
                  <p class="text-xs text-gray-400">{{ (uploadForm.file.size / 1024).toFixed(0) }} KB · Click to change</p>
                </div>
              </div>
            </label>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploadState !== 'idle'" class="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-700">{{ uploadState === 'done' ? 'Upload complete!' : 'Uploading...' }}</span>
              <span class="text-xs text-gray-500">{{ uploadProgress }}%</span>
            </div>
            <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-300', uploadState === 'done' ? 'bg-green-500' : 'bg-primary']"
                :style="{ width: `${uploadProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Supported formats -->
          <div class="grid grid-cols-3 gap-2">
            <div v-for="fmt in ['PDF', 'Word', 'Excel', 'PowerPoint', 'PNG', 'JPG']" :key="fmt" class="flex items-center gap-1.5 px-2 py-1.5 bg-gray-100 rounded-lg">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              <span class="text-xs text-gray-500">{{ fmt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
        <button @click="activeTab = 'all'" class="btn-secondary w-full sm:w-auto justify-center">Cancel</button>
        <button
          @click="simulateUpload"
          :disabled="!uploadForm.title || !uploadForm.file || uploadState !== 'idle'"
          :class="['btn-primary w-full sm:w-auto justify-center', (!uploadForm.title || !uploadForm.file) ? 'opacity-40 cursor-not-allowed' : '']"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload Document
        </button>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPreviewModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold text-gray-900 truncate">{{ selectedDocument?.title }}</h2>
                <p class="text-xs text-gray-500 mt-0.5">{{ selectedDocument?.fileName }}</p>
              </div>
              <button @click="closePreview" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
              <!-- PDF Preview -->
              <div v-if="isPdf" class="w-full h-full">
                <iframe
                  :src="selectedDocument?.fileName"
                  class="w-full h-full border-none"
                  title="PDF Preview"
                ></iframe>
              </div>

              <!-- Image Preview -->
              <div v-else-if="isImage" class="flex items-center justify-center p-6">
                <img
                  :src="selectedDocument?.fileName"
                  :alt="selectedDocument?.title"
                  class="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              <!-- Text/Markdown Preview -->
              <div v-else-if="['txt', 'md'].includes(getFileExtension(selectedDocument?.fileName))" class="w-full h-full p-6 overflow-auto">
                <pre class="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">Document content would be loaded here</pre>
              </div>

              <!-- Fallback: Cannot Preview -->
              <div v-else class="flex flex-col items-center justify-center p-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                </svg>
                <p class="text-gray-600 font-medium mb-1">This document cannot be previewed</p>
                <p class="text-sm text-gray-500">You can download it instead</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button @click="closePreview" class="btn-secondary">Close</button>
              <button class="btn-primary flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
