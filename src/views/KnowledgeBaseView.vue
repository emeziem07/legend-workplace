<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortBy = ref('date-desc')

const showUploadModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploadFormData = ref({
  documentName: '',
  documentType: '',
  category: '',
  department: '',
  description: ''
})

let nextDocId = 9

interface Document {
  id: string
  name: string
  category: string
  type: string
  status: 'Published' | 'Draft'
  dateUploaded: string
  uploadedBy: string
  addedThisWeek?: boolean
}

const documents: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook.pdf',
    category: 'Policies',
    type: 'PDF',
    status: 'Published',
    dateUploaded: '12 Jul 2026',
    uploadedBy: 'Sarah Mitchell'
  },
  {
    id: '2',
    name: 'IT Security Policy.pdf',
    category: 'Policies',
    type: 'PDF',
    status: 'Published',
    dateUploaded: '04 Jul 2026',
    uploadedBy: 'James Wilson'
  },
  {
    id: '3',
    name: 'Expense Claim Form.docx',
    category: 'Templates',
    type: 'DOCX',
    status: 'Published',
    dateUploaded: '22 Jun 2026',
    uploadedBy: 'Helen Musa'
  },
  {
    id: '4',
    name: 'Q2 Financial Report.pdf',
    category: 'Reports',
    type: 'PDF',
    status: 'Published',
    dateUploaded: '18 Jun 2026',
    uploadedBy: 'Michael Adams'
  },
  {
    id: '5',
    name: 'Brand Guidelines.pdf',
    category: 'Templates',
    type: 'PDF',
    status: 'Published',
    dateUploaded: '15 May 2026',
    uploadedBy: 'Aisha Bello'
  },
  {
    id: '6',
    name: 'Customer Support SOP.docx',
    category: 'Procedures',
    type: 'DOCX',
    status: 'Published',
    dateUploaded: '08 May 2026',
    uploadedBy: 'Grace Ibrahim'
  },
  {
    id: '7',
    name: 'Remote Work Policy.pdf',
    category: 'Policies',
    type: 'PDF',
    status: 'Draft',
    dateUploaded: '03 Aug 2026',
    uploadedBy: 'Sarah Mitchell'
  },
  {
    id: '8',
    name: 'Leave Request Template.docx',
    category: 'Templates',
    type: 'DOCX',
    status: 'Published',
    dateUploaded: '01 Aug 2026',
    uploadedBy: 'John Peters'
  }
]

const summaryCards = [
  { label: 'Total Documents', value: '248', added: '+12' },
  { label: 'Policies', value: '42', added: '+5' },
  { label: 'Procedures', value: '36', added: '+2' },
  { label: 'Reports', value: '58', added: '+8' },
  { label: 'Templates', value: '74', added: '+3' },
  { label: 'FAQs', value: '38', added: '+1' }
]

const filteredDocuments = computed(() => {
  let filtered = documents

  if (searchQuery.value) {
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(doc => doc.category === selectedCategory.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(doc => doc.status === selectedStatus.value)
  }

  if (sortBy.value === 'date-desc') {
    filtered.sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime())
  } else if (sortBy.value === 'date-asc') {
    filtered.sort((a, b) => new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime())
  } else if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'PDF': 'bg-red-50 text-red-700',
    'DOCX': 'bg-blue-50 text-blue-700',
    'XLSX': 'bg-green-50 text-green-700',
    'PPTX': 'bg-orange-50 text-orange-700',
    'TXT': 'bg-gray-50 text-gray-700',
    'CSV': 'bg-purple-50 text-purple-700',
    'MD': 'bg-slate-50 text-slate-700'
  }
  return colors[type] || 'bg-gray-50 text-gray-700'
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Policies': 'bg-indigo-50 text-indigo-700',
    'Procedures': 'bg-cyan-50 text-cyan-700',
    'Reports': 'bg-amber-50 text-amber-700',
    'Templates': 'bg-emerald-50 text-emerald-700',
    'FAQs': 'bg-pink-50 text-pink-700'
  }
  return colors[category] || 'bg-gray-50 text-gray-700'
}

const getStatusColor = (status: string) => {
  return status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
}

const getFileExtension = (filename: string) => {
  const ext = filename.split('.').pop()?.toUpperCase() || 'TXT'
  return ext
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const handleFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (file) {
    selectedFile.value = file
    uploadFormData.value.documentName = file.name.replace(/\.[^/.]+$/, '')
    uploadFormData.value.documentType = getFileExtension(file.name)
    uploadFormData.value.category = ''
    uploadFormData.value.department = ''
    uploadFormData.value.description = ''
    showUploadModal.value = true
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadFormData.value = {
    documentName: '',
    documentType: '',
    category: '',
    department: '',
    description: ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitUpload = () => {
   if (!uploadFormData.value.category) {
     return
   }

   const newDocument: Document = {
     id: String(nextDocId++),
     name: `${uploadFormData.value.documentName}.${uploadFormData.value.documentType.toLowerCase()}`,
     category: uploadFormData.value.category,
     type: uploadFormData.value.documentType,
     status: 'Published',
     dateUploaded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
     uploadedBy: 'Current User'
   }

   documents.push(newDocument)
   closeUploadModal()
}

interface DMSDocument {
  id: string
  name: string
  category: string
  department: string
  uploadedBy: string
  dateUploaded: string
  status: 'Approved'
}

const dmsDocuments: DMSDocument[] = [
  {
    id: 'dms-1',
    name: 'Data Protection Policy.pdf',
    category: 'Policies',
    department: 'Legal',
    uploadedBy: 'Emma Thompson',
    dateUploaded: '28 Jul 2026',
    status: 'Approved'
  },
  {
    id: 'dms-2',
    name: 'Onboarding Checklist.docx',
    category: 'Templates',
    department: 'HR',
    uploadedBy: 'Lisa Chen',
    dateUploaded: '25 Jul 2026',
    status: 'Approved'
  },
  {
    id: 'dms-3',
    name: 'Budget Planning Guide.xlsx',
    category: 'Procedures',
    department: 'Finance',
    uploadedBy: 'Robert Martinez',
    dateUploaded: '20 Jul 2026',
    status: 'Approved'
  },
  {
    id: 'dms-4',
    name: 'Marketing Campaign Template.pptx',
    category: 'Templates',
    department: 'Marketing',
    uploadedBy: 'Sophie Laurent',
    dateUploaded: '18 Jul 2026',
    status: 'Approved'
  },
  {
    id: 'dms-5',
    name: 'IT Infrastructure Standards.pdf',
    category: 'Procedures',
    department: 'IT',
    uploadedBy: 'David Kumar',
    dateUploaded: '15 Jul 2026',
    status: 'Approved'
  },
  {
    id: 'dms-6',
    name: 'Customer Service Guidelines.docx',
    category: 'Procedures',
    department: 'Operations',
    uploadedBy: 'Maria Santos',
    dateUploaded: '12 Jul 2026',
    status: 'Approved'
  }
]

const showImportModal = ref(false)
const importSearchQuery = ref('')
const importSelectedDepartment = ref('')
const importSelectedCategory = ref('')
const importSelectedStatus = ref('')
const selectedDMSDocuments = ref<Set<string>>(new Set())

const filteredDMSDocuments = computed(() => {
  let filtered = dmsDocuments

  if (importSearchQuery.value) {
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(importSearchQuery.value.toLowerCase())
    )
  }

  if (importSelectedDepartment.value) {
    filtered = filtered.filter(doc => doc.department === importSelectedDepartment.value)
  }

  if (importSelectedCategory.value) {
    filtered = filtered.filter(doc => doc.category === importSelectedCategory.value)
  }

  if (importSelectedStatus.value) {
    filtered = filtered.filter(doc => doc.status === importSelectedStatus.value)
  }

  return filtered
})

const openImportModal = () => {
  showImportModal.value = true
  selectedDMSDocuments.value.clear()
  importSearchQuery.value = ''
  importSelectedDepartment.value = ''
  importSelectedCategory.value = ''
  importSelectedStatus.value = ''
}

const closeImportModal = () => {
  showImportModal.value = false
  selectedDMSDocuments.value.clear()
}

const toggleDMSDocumentSelection = (docId: string) => {
  if (selectedDMSDocuments.value.has(docId)) {
    selectedDMSDocuments.value.delete(docId)
  } else {
    selectedDMSDocuments.value.add(docId)
  }
}

const importSelectedDocuments = () => {
  const toImport = dmsDocuments.filter(doc => selectedDMSDocuments.value.has(doc.id))

  toImport.forEach(dmsDoc => {
    const newDocument: Document = {
      id: String(nextDocId++),
      name: dmsDoc.name,
      category: dmsDoc.category,
      type: dmsDoc.name.split('.').pop()?.toUpperCase() || 'PDF',
      status: 'Published',
      dateUploaded: dmsDoc.dateUploaded,
      uploadedBy: dmsDoc.uploadedBy
    }
    documents.push(newDocument)
  })

  closeImportModal()

  // Show success toast
  const toastMessage = `Successfully imported ${toImport.length} document${toImport.length !== 1 ? 's' : ''}`
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-4 right-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-lg border border-green-200 z-50'
  toast.textContent = toastMessage
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

const getUniqueDepartments = () => {
  return Array.from(new Set(dmsDocuments.map(doc => doc.department))).sort()
}

const getUniqueCategories = () => {
  return Array.from(new Set(dmsDocuments.map(doc => doc.category))).sort()
}

// View Modal
const showViewModal = ref(false)
const viewingDocument = ref<Document | null>(null)

const openViewModal = (doc: Document) => {
  viewingDocument.value = doc
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingDocument.value = null
}

const downloadFromPreview = () => {
  if (viewingDocument.value) {
    triggerDownload(viewingDocument.value)
  }
}

// Edit Modal
const showEditModal = ref(false)
const editingDocument = ref<Document | null>(null)
const editFormData = ref({
  documentName: '',
  category: '',
  department: '',
  description: ''
})

const openEditModal = (doc: Document) => {
  editingDocument.value = doc
  editFormData.value = {
    documentName: doc.name.replace(/\.[^/.]+$/, ''),
    category: doc.category,
    department: '',
    description: ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingDocument.value = null
  editFormData.value = {
    documentName: '',
    category: '',
    department: '',
    description: ''
  }
}

const saveDocumentChanges = () => {
  if (!editingDocument.value) return

  const docIndex = documents.findIndex(d => d.id === editingDocument.value!.id)
  if (docIndex !== -1) {
    const ext = documents[docIndex].name.split('.').pop()
    documents[docIndex].name = `${editFormData.value.documentName}.${ext}`
    documents[docIndex].category = editFormData.value.category
  }

  closeEditModal()

  // Show success toast
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-4 right-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-lg border border-green-200 z-50'
  toast.textContent = 'Document updated successfully'
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Download
const triggerDownload = (doc: Document) => {
  const link = document.createElement('a')
  link.href = '#'
  link.download = doc.name
  link.click()
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <!-- Breadcrumb -->
    <div class="mb-6 flex items-center gap-2 text-sm">
      <button @click="router.push('/resources')" class="text-gray-600 hover:text-gray-900 transition-colors">
        Resources
      </button>
      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="text-gray-900 font-medium">Knowledge Base</span>
    </div>

    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Knowledge Base Management</h1>
        <p class="text-sm text-gray-500 mt-1">Organize, upload and securely manage company documents for employees.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Refresh
        </button>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          Upload Document
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <div v-for="card in summaryCards" :key="card.label" class="card p-4">
        <p class="text-xs text-gray-500 font-medium mb-2">{{ card.label }}</p>
        <p class="text-2xl font-semibold text-gray-900 mb-2">{{ card.value }}</p>
        <p class="text-xs text-gray-500">{{ card.added }} this week</p>
      </div>
    </div>

    <!-- Add to Knowledge Base Section -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Add to Knowledge Base</h2>
      <p class="text-sm text-gray-500 mb-4">Upload new company documents or import existing documents from the Document Management System.</p>

      <!-- Info Banner -->
      <div class="card p-4 mb-4 border-l-4 border-primary-200 bg-primary-50">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Automatic Secure Storage</h3>
            <p class="text-xs text-gray-600">Every uploaded document is automatically indexed and made available inside the Workplace Knowledge Base.</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
              Knowledge Base
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
              DMS Backup
            </span>
          </div>
        </div>
      </div>

      <!-- Upload Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Upload New Files -->
        <div class="card p-6 border-2 border-dashed border-gray-300 hover:border-primary-300 transition-colors cursor-pointer" @click="openFilePicker">
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            @change="handleFileSelected"
          />
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Upload New Files</h3>
            <p class="text-xs text-gray-500 mb-3">Drag and drop files here or browse.</p>
            <p class="text-xs text-gray-400 mb-3">Supported formats:</p>
            <div class="flex flex-wrap gap-1 justify-center mb-4">
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">PDF</span>
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">DOCX</span>
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">XLSX</span>
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">PPTX</span>
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">TXT</span>
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">CSV</span>
              <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">MD</span>
            </div>
            <button @click.stop="openFilePicker" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              Browse Files
            </button>
          </div>
        </div>

        <!-- Import from DMS -->
        <div class="card p-6 border-2 border-dashed border-gray-300 hover:border-primary-300 transition-colors">
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4m0 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7m18 0H3" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Import from DMS</h3>
            <p class="text-xs text-gray-500 mb-3">Import documents already stored in the company's Document Management System.</p>
            <p class="text-xs text-gray-400 mb-4">No duplicate uploads.<br>Original files remain linked.</p>
            <button @click="openImportModal" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              Import Documents
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Library -->
    <div>
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Document Library</h2>
        <p class="text-sm text-gray-500">{{ documents.length }} documents</p>
      </div>

      <!-- Toolbar -->
      <div class="mb-4 flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documents..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div class="flex gap-2 flex-wrap sm:flex-nowrap">
          <select
            v-model="selectedCategory"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Category filter</option>
            <option value="Policies">Policies</option>
            <option value="Procedures">Procedures</option>
            <option value="Reports">Reports</option>
            <option value="Templates">Templates</option>
            <option value="FAQs">FAQs</option>
          </select>
          <select
            v-model="selectedStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Status filter</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div v-if="filteredDocuments.length > 0" class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Document Name</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date Uploaded</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Uploaded By</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in filteredDocuments" :key="doc.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm text-gray-900 font-medium">{{ doc.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getCategoryColor(doc.category)]">
                    {{ doc.category }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getTypeColor(doc.type)]">
                    {{ doc.type }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(doc.status)]">
                    {{ doc.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ doc.dateUploaded }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-xs font-semibold text-primary">{{ getInitials(doc.uploadedBy) }}</span>
                    </div>
                    <span class="text-sm text-gray-600">{{ doc.uploadedBy }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                   <div class="flex gap-2">
                     <button @click="openViewModal(doc)" class="text-xs text-primary hover:text-primary-600 font-medium transition-colors">View</button>
                     <button @click="openEditModal(doc)" class="text-xs text-primary hover:text-primary-600 font-medium transition-colors">Edit</button>
                     <button @click="triggerDownload(doc)" class="text-xs text-primary hover:text-primary-600 font-medium transition-colors">Download</button>
                   </div>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">No documents available.</h3>
        <p class="text-sm text-gray-500 mb-6">Upload your first document to begin building the company's Knowledge Base.</p>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          Upload Document
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/25 backdrop-blur-sm" @click="closeUploadModal"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Upload Document</h2>

          <div class="space-y-4">
            <!-- Document Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
              <input
                v-model="uploadFormData.documentName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Document Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <input
                :value="uploadFormData.documentType"
                type="text"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category <span class="text-red-500">*</span></label>
              <select
                v-model="uploadFormData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Policy">Policy</option>
                <option value="Procedure">Procedure</option>
                <option value="Meeting Minutes">Meeting Minutes</option>
                <option value="Manual">Manual</option>
                <option value="Report">Report</option>
                <option value="Template">Template</option>
                <option value="Training Material">Training Material</option>
                <option value="Reference Material">Reference Material</option>
                <option value="Compliance">Compliance</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Legal">Legal</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                v-model="uploadFormData.department"
                type="text"
                placeholder="Optional"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="uploadFormData.description"
                rows="3"
                placeholder="Optional"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-6">
            <button
              @click="closeUploadModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitUpload"
              :disabled="!uploadFormData.category"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload to Knowledge Base
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal && viewingDocument" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/25 backdrop-blur-sm" @click="closeViewModal"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 z-10 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ viewingDocument.name }}</h2>
            <div class="mt-2">
              <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getTypeColor(viewingDocument.type)]">
                {{ viewingDocument.type }}
              </span>
            </div>
          </div>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-gray-600 mb-4">This document cannot be previewed. You can download it instead.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            @click="downloadFromPreview"
            class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Download
          </button>
          <button
            @click="closeViewModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && editingDocument" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/25 backdrop-blur-sm" @click="closeEditModal"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Edit Document</h2>

          <div class="space-y-4">
            <!-- Document Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
              <input
                v-model="editFormData.documentName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Document Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <input
                :value="editingDocument.type"
                type="text"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="editFormData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Policies">Policies</option>
                <option value="Procedures">Procedures</option>
                <option value="Reports">Reports</option>
                <option value="Templates">Templates</option>
                <option value="FAQs">FAQs</option>
              </select>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                v-model="editFormData.department"
                type="text"
                placeholder="Optional"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="editFormData.description"
                rows="3"
                placeholder="Optional"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-6">
            <button
              @click="closeEditModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveDocumentChanges"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/25 backdrop-blur-sm" @click="closeImportModal"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 z-10 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Import Documents from DMS</h2>
            <p class="text-sm text-gray-500 mt-1">Select approved documents to add into the Knowledge Base.</p>
          </div>
          <button @click="closeImportModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Info Banner -->
          <div class="card p-4 mb-6 border-l-4 border-blue-200 bg-blue-50">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-1">DMS Integration</h3>
              <p class="text-xs text-gray-600">Approved documents can be linked into the Knowledge Base. Original documents remain stored in DMS. No duplicate files are created.</p>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="mb-4 flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="importSearchQuery"
                type="text"
                placeholder="Search documents..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div class="flex gap-2 flex-wrap sm:flex-nowrap">
              <select
                v-model="importSelectedDepartment"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Department filter</option>
                <option v-for="dept in getUniqueDepartments()" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <select
                v-model="importSelectedCategory"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Category filter</option>
                <option v-for="cat in getUniqueCategories()" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <select
                v-model="importSelectedStatus"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Status filter</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>

          <!-- Table -->
          <div class="card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-12">
                      <input
                        type="checkbox"
                        :checked="selectedDMSDocuments.size === filteredDMSDocuments.length && filteredDMSDocuments.length > 0"
                        @change="() => {
                          if (selectedDMSDocuments.size === filteredDMSDocuments.length) {
                            selectedDMSDocuments.clear()
                          } else {
                            filteredDMSDocuments.forEach(doc => selectedDMSDocuments.add(doc.id))
                          }
                        }"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Document Name</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Uploaded By</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Upload Date</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="doc in filteredDMSDocuments"
                    :key="doc.id"
                    :class="['border-b border-gray-200 transition-colors', selectedDMSDocuments.has(doc.id) ? 'bg-orange-50' : 'hover:bg-gray-50']"
                  >
                    <td class="px-6 py-4">
                      <input
                        type="checkbox"
                        :checked="selectedDMSDocuments.has(doc.id)"
                        @change="() => toggleDMSDocumentSelection(doc.id)"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm text-gray-900 font-medium">{{ doc.name }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getCategoryColor(doc.category)]">
                        {{ doc.category }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ doc.department }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ doc.uploadedBy }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ doc.dateUploaded }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 flex items-center justify-between">
          <span class="text-sm text-gray-600">{{ selectedDMSDocuments.size }} selected</span>
          <div class="flex gap-3">
            <button
              @click="closeImportModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="importSelectedDocuments"
              :disabled="selectedDMSDocuments.size === 0"
              class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
