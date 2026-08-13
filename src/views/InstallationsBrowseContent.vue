<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerInsightsStore } from '../stores/customerInsights'
import type { Installation } from '../stores/customerInsights'
import StatusBadge from '../components/common/StatusBadge.vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const router = useRouter()
const store = useCustomerInsightsStore()

// ── Filter State ──────────────────────────────────────────────────────────────
const filters = ref({
  search: '',
  month: '',
  year: '',
  status: '',
  category: '',
  plan: '',
  area: '',
  installer: '',
  pickupPoint: '',
  mdu: '',
})

const filtersExpanded = ref(false)

// ── Pagination ────────────────────────────────────────────────────────────────
const rowsPerPage = ref(25)
const currentPage = ref(1)

// ── Sorting ────────────────────────────────────────────────────────────────────
const sortBy = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// ── Filtered & Sorted Data ────────────────────────────────────────────────────
const filtered = computed(() => {
  let result = store.installations

  // Search
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(i =>
      i.customerName.toLowerCase().includes(q) ||
      (i.address && i.address.toLowerCase().includes(q))
    )
  }

  // Status
  if (filters.value.status) {
    result = result.filter(i => i.status === filters.value.status)
  }

  // Category
  if (filters.value.category) {
    result = result.filter(i => i.category === filters.value.category)
  }

  // Plan
  if (filters.value.plan) {
    result = result.filter(i => i.plan === filters.value.plan)
  }

  // Area
  if (filters.value.area) {
    result = result.filter(i => i.area === filters.value.area)
  }

  // Installer
  if (filters.value.installer) {
    result = result.filter(i => i.installer === filters.value.installer)
  }

  // Pickup Point
  if (filters.value.pickupPoint) {
    result = result.filter(i => i.pickupPoint === filters.value.pickupPoint)
  }

  // MDU
  if (filters.value.mdu) {
    result = result.filter(i => i.mdu === filters.value.mdu)
  }

  // Sort
  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      let aVal: any = a[sortBy.value as keyof Installation]
      let bVal: any = b[sortBy.value as keyof Installation]

      if (aVal === undefined || aVal === null) aVal = ''
      if (bVal === undefined || bVal === null) bVal = ''

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

// ── Pagination ────────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.ceil(filtered.value.length / rowsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return filtered.value.slice(start, end)
})

const pageInfo = computed(() => {
  const start = filtered.value.length === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1
  const end = Math.min(currentPage.value * rowsPerPage.value, filtered.value.length)
  return { start, end, total: filtered.value.length }
})

// ── Reset pagination when filters change ───────────────────────────────────────
watch([filters, rowsPerPage], () => {
  currentPage.value = 1
}, { deep: true })

// ── Sort handler ───────────────────────────────────────────────────────────────
const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

// ── Filter handlers ────────────────────────────────────────────────────────────
const clearFilters = () => {
  filters.value = {
    search: '',
    month: '',
    year: '',
    status: '',
    category: '',
    plan: '',
    area: '',
    installer: '',
    pickupPoint: '',
    mdu: '',
  }
}

const statusOptions = ['Activated', 'Pending', 'Refunded']
const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

// ── Unique filter options ──────────────────────────────────────────────────────
const categoryOptions = computed(() => [...new Set(store.installations.map(i => i.category).filter(Boolean))])
const planOptions = computed(() => [...new Set(store.installations.map(i => i.plan).filter(Boolean))])
const areaOptions = computed(() => [...new Set(store.installations.map(i => i.area).filter(Boolean))])
const installerOptions = computed(() => [...new Set(store.installations.map(i => i.installer).filter(Boolean))])
const pickupPointOptions = computed(() => [...new Set(store.installations.map(i => i.pickupPoint).filter(Boolean))])
const mduOptions = computed(() => [...new Set(store.installations.map(i => i.mdu).filter(Boolean))])

// ── Column definitions ────────────────────────────────────────────────────────
const columns = [
  { key: 'customerName', label: 'Customer', sortable: true, pinned: true, width: 180 },
  { key: 'category', label: 'Category', sortable: true, pinned: false, width: 140 },
  { key: 'installer', label: 'Installer', sortable: true, pinned: false, width: 140 },
  { key: 'address', label: 'Address', sortable: true, pinned: false, width: 180 },
  { key: 'area', label: 'Area', sortable: true, pinned: false, width: 120 },
  { key: 'mdu', label: 'MDU', sortable: true, pinned: false, width: 100 },
  { key: 'installationDate', label: 'Requested On', sortable: true, pinned: false, width: 140 },
  { key: 'status', label: 'Installation Status', sortable: true, pinned: false, width: 140 },
  { key: 'durationDays', label: 'Duration (Days)', sortable: true, pinned: false, width: 130 },
  { key: 'plan', label: 'Plan', sortable: true, pinned: false, width: 120 },
  { key: 'requirements', label: 'Requirements', sortable: false, pinned: false, width: 140 },
  { key: 'pickupPoint', label: 'Pickup Point', sortable: true, pinned: false, width: 140 },
  { key: 'activationDate', label: 'Activation Date', sortable: true, pinned: false, width: 140 },
  { key: 'mst', label: 'MST', sortable: false, pinned: false, width: 100 },
  { key: 'hcLm', label: 'HC LM', sortable: false, pinned: false, width: 100 },
  { key: 'lm', label: 'LM', sortable: false, pinned: false, width: 100 },
  { key: 'pvcBundles', label: 'PVC (Bundles)', sortable: false, pinned: false, width: 130 },
  { key: 'accessCable', label: 'Access Cable', sortable: false, pinned: false, width: 130 },
  { key: 'accessPvc', label: 'Access PVC', sortable: false, pinned: false, width: 130 },
  { key: 'mstAccess', label: 'MST Access', sortable: false, pinned: false, width: 130 },
  { key: 'distributionCable', label: 'Distribution Cable', sortable: false, pinned: false, width: 150 },
  { key: 'flexible', label: 'Flexible', sortable: false, pinned: false, width: 120 },
  { key: 'atb', label: 'ATB', sortable: false, pinned: false, width: 100 },
  { key: 'patchCord', label: 'Patch Cord', sortable: false, pinned: false, width: 120 },
  { key: 'clip', label: 'Clip', sortable: false, pinned: false, width: 100 },
  { key: 'thrustboring', label: 'Thrustboring / Cutting', sortable: false, pinned: false, width: 160 },
]

// ── Count active filters ───────────────────────────────────────────────────────
const activeFilterCount = computed(() => {
  return Object.values(filters.value).filter(v => v !== '').length
})

const getCellValue = (installation: Installation, key: string): string => {
  switch (key) {
    case 'customerName': return installation.customerName
    case 'installationDate': return installation.installationDate || '—'
    case 'activationDate': return installation.activationDate || '—'
    case 'durationDays': return installation.durationDays ? String(installation.durationDays) : '—'
    case 'status': return installation.status
    case 'category': return installation.category || '—'
    case 'installer': return installation.installer || '—'
    case 'address': return installation.address || '—'
    case 'area': return installation.area || '—'
    case 'mdu': return installation.mdu || '—'
    case 'plan': return installation.plan || '—'
    case 'requirements': return installation.requirements || '—'
    case 'pickupPoint': return installation.pickupPoint || '—'
    case 'mst': return installation.mst || '—'
    case 'hcLm': return installation.hcLm || '—'
    case 'lm': return installation.lm || '—'
    case 'pvcBundles': return installation.pvcBundles || '—'
    case 'accessCable': return installation.accessCable || '—'
    case 'accessPvc': return installation.accessPvc || '—'
    case 'mstAccess': return installation.mstAccess || '—'
    case 'distributionCable': return installation.distributionCable || '—'
    case 'flexible': return installation.flexible || '—'
    case 'atb': return installation.atb || '—'
    case 'patchCord': return installation.patchCord || '—'
    case 'clip': return installation.clip || '—'
    case 'thrustboring': return installation.thrustboring || '—'
    default: return '—'
  }
}

// ── Toggle filters panel ───────────────────────────────────────────────────────
const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}

// ── Column Visibility Manager ──────────────────────────────────────────────────
const STORAGE_KEY = 'installations_visible_columns'
const REQUIRED_COLUMNS = ['customerName', 'status']

const defaultVisibleColumns = computed(() => {
  return columns.map(c => c.key)
})

const visibleColumns = ref<string[]>([])
const showColumnsPanel = ref(false)
const columnsRef = ref<HTMLElement | null>(null)

const initializeVisibleColumns = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      visibleColumns.value = JSON.parse(stored)
    } catch {
      visibleColumns.value = defaultVisibleColumns.value
    }
  } else {
    visibleColumns.value = defaultVisibleColumns.value
  }
}

const saveVisibleColumns = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns.value))
}

const toggleColumnVisibility = (key: string) => {
  if (REQUIRED_COLUMNS.includes(key)) return
  const idx = visibleColumns.value.indexOf(key)
  if (idx === -1) {
    visibleColumns.value.push(key)
  } else {
    visibleColumns.value.splice(idx, 1)
  }
  saveVisibleColumns()
}

const showAllColumns = () => {
  visibleColumns.value = defaultVisibleColumns.value
  saveVisibleColumns()
}

const resetToDefault = () => {
  visibleColumns.value = defaultVisibleColumns.value
  saveVisibleColumns()
}

const isColumnVisible = (key: string) => visibleColumns.value.includes(key)

const displayedColumns = computed(() => {
  return columns.filter(c => isColumnVisible(c.key))
})

const onDocClick = (e: MouseEvent) => {
  if (columnsRef.value && !columnsRef.value.contains(e.target as Node)) {
    showColumnsPanel.value = false
  }
}

onMounted(() => {
  initializeVisibleColumns()
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})

// ── Row click handler ───────────────────────────────────────────────────────────
const handleRowClick = (installation: Installation) => {
  router.push(`/resources/installation-insights/installations/${installation.id}`)
}

// ── Export Modal ───────────────────────────────────────────────────────────────
const showExportModal = ref(false)
const exportOptions = ref({
  dataSource: 'filtered' as 'filtered' | 'all',
  format: 'excel' as 'excel' | 'csv' | 'pdf',
  includeExecutiveSummary: true,
  includeFilters: true,
  includeTable: true,
  includeMetadata: true,
})

const toastMessage = ref('')
const showToast = ref(false)

const displayToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const generateFileName = (): string => {
  const now = new Date()
  const monthName = months[now.getMonth()].label
  const year = now.getFullYear()
  
  let prefix = 'Installation_Report'
  
  if (filters.value.status) {
    prefix = `${filters.value.status}_Installations`
  } else if (filters.value.area) {
    prefix = `${filters.value.area}_Installations`
  } else if (filters.value.installer) {
    prefix = `${filters.value.installer}_Installations`
  }
  
  const ext = exportOptions.value.format === 'excel' ? 'xlsx' : exportOptions.value.format === 'csv' ? 'csv' : 'pdf'
  return `${prefix}_${monthName}_${year}.${ext}`
}

const handleExport = async () => {
  const dataToExport = exportOptions.value.dataSource === 'filtered' ? filtered.value : store.installations
  const recordCount = dataToExport.length
  const fileName = generateFileName()
  
  try {
    if (exportOptions.value.format === 'excel') {
      await generateExcelExport(dataToExport, fileName)
    } else if (exportOptions.value.format === 'csv') {
      generateCSVExport(dataToExport, fileName)
    } else if (exportOptions.value.format === 'pdf') {
      await generatePDFExport(dataToExport, fileName)
    }
    
    showExportModal.value = false
    displayToast(`Installation report exported successfully. ${recordCount} installation records exported to ${exportOptions.value.format.toUpperCase()}.`)
  } catch (error) {
    console.error('Export failed:', error)
    displayToast(`Export failed. Please try again.`)
  }
}

const generateExcelExport = async (data: Installation[], fileName: string) => {
  const workbook = XLSX.utils.book_new()
  
  // Create summary sheet
  const summaryData = [
    ['Installation Report'],
    [''],
    ['Export Date', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
    ['Total Records', data.length],
    ['Data Source', exportOptions.value.dataSource === 'filtered' ? 'Filtered Results' : 'Complete Dataset'],
    [''],
  ]
  
  if (activeFilterCount.value > 0) {
    summaryData.push(['Applied Filters:'])
    if (filters.value.search) summaryData.push(['  Search', filters.value.search])
    if (filters.value.status) summaryData.push(['  Status', filters.value.status])
    if (filters.value.category) summaryData.push(['  Category', filters.value.category])
    if (filters.value.area) summaryData.push(['  Area', filters.value.area])
    if (filters.value.installer) summaryData.push(['  Installer', filters.value.installer])
    summaryData.push([''])
  }
  
  summaryData.push(['Summary Statistics'])
  summaryData.push(['Total Installations', data.length])
  summaryData.push(['Activated', data.filter(d => d.status === 'Activated').length])
  summaryData.push(['Pending', data.filter(d => d.status === 'Pending').length])
  summaryData.push(['Refunded', data.filter(d => d.status === 'Refunded').length])
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 40 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  
  // Create data sheet
  const tableData = data.map(inst => ({
    'Customer Name': inst.customerName,
    'Category': inst.category || '—',
    'Installer': inst.installer || '—',
    'Address': inst.address || '—',
    'Area': inst.area || '—',
    'MDU': inst.mdu || '—',
    'Installation Date': inst.installationDate || '—',
    'Status': inst.status,
    'Duration (Days)': inst.durationDays || '—',
    'Plan': inst.plan || '—',
    'Pickup Point': inst.pickupPoint || '—',
    'Activation Date': inst.activationDate || '—',
  }))
  
  const dataSheet = XLSX.utils.json_to_sheet(tableData)
  dataSheet['!cols'] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 16 },
    { wch: 16 },
  ]
  
  // Bold header row
  const range = XLSX.utils.decode_range(dataSheet['!ref'] || 'A1')
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1'
    if (!dataSheet[address]) continue
    dataSheet[address].s = { font: { bold: true }, fill: { fgColor: { rgb: 'FFF3EE' } } }
  }
  
  XLSX.utils.book_append_sheet(workbook, dataSheet, 'Installations')
  
  // Trigger download
  XLSX.writeFile(workbook, fileName)
}

const generateCSVExport = (data: Installation[], fileName: string) => {
  const headers = [
    'Customer Name',
    'Category',
    'Installer',
    'Address',
    'Area',
    'MDU',
    'Installation Date',
    'Status',
    'Duration (Days)',
    'Plan',
    'Pickup Point',
    'Activation Date',
  ]
  
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...data.map(inst => [
      inst.customerName,
      inst.category || '—',
      inst.installer || '—',
      inst.address || '—',
      inst.area || '—',
      inst.mdu || '—',
      inst.installationDate || '—',
      inst.status,
      inst.durationDays || '—',
      inst.plan || '—',
      inst.pickupPoint || '—',
      inst.activationDate || '—',
    ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const generatePDFExport = async (data: Installation[], fileName: string) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = margin
  
  // Header with branding
  doc.setFillColor(253, 79, 0)
  doc.rect(0, 0, pageWidth, 30, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('Legend Workplace', margin, 20)
  
  yPosition = 40
  
  // Title
  doc.setTextColor(17, 24, 39)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('Installation Report', margin, yPosition)
  yPosition += 10
  
  // Export info
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(107, 114, 128)
  doc.text(`Export Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, yPosition)
  yPosition += 6
  doc.text(`Total Records: ${data.length}`, margin, yPosition)
  yPosition += 6
  doc.text(`Data Source: ${exportOptions.value.dataSource === 'filtered' ? 'Filtered Results' : 'Complete Dataset'}`, margin, yPosition)
  yPosition += 10
  
  // Applied filters
  if (activeFilterCount.value > 0) {
    doc.setFont(undefined, 'bold')
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(11)
    doc.text('Applied Filters:', margin, yPosition)
    yPosition += 6
    
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    if (filters.value.search) {
      doc.text(`Search: ${filters.value.search}`, margin + 5, yPosition)
      yPosition += 5
    }
    if (filters.value.status) {
      doc.text(`Status: ${filters.value.status}`, margin + 5, yPosition)
      yPosition += 5
    }
    if (filters.value.category) {
      doc.text(`Category: ${filters.value.category}`, margin + 5, yPosition)
      yPosition += 5
    }
    if (filters.value.area) {
      doc.text(`Area: ${filters.value.area}`, margin + 5, yPosition)
      yPosition += 5
    }
    if (filters.value.installer) {
      doc.text(`Installer: ${filters.value.installer}`, margin + 5, yPosition)
      yPosition += 5
    }
    yPosition += 5
  }
  
  // Summary statistics
  doc.setFont(undefined, 'bold')
  doc.setTextColor(17, 24, 39)
  doc.setFontSize(11)
  doc.text('Summary Statistics', margin, yPosition)
  yPosition += 6
  
  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  const activated = data.filter(d => d.status === 'Activated').length
  const pending = data.filter(d => d.status === 'Pending').length
  const refunded = data.filter(d => d.status === 'Refunded').length
  
  doc.text(`Total Installations: ${data.length}`, margin, yPosition)
  yPosition += 5
  doc.text(`Activated: ${activated}`, margin, yPosition)
  yPosition += 5
  doc.text(`Pending: ${pending}`, margin, yPosition)
  yPosition += 5
  doc.text(`Refunded: ${refunded}`, margin, yPosition)
  yPosition += 10
  
  // Table
  const tableData = data.map(inst => [
    inst.customerName,
    inst.status,
    inst.installationDate || '—',
    inst.activationDate || '—',
    inst.category || '—',
    inst.installer || '—',
  ])
  
  ;(doc as any).autoTable({
    head: [['Customer', 'Status', 'Requested', 'Activated', 'Category', 'Installer']],
    body: tableData,
    startY: yPosition,
    margin: margin,
    headStyles: {
      fillColor: [253, 79, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [17, 24, 39],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
    },
    didDrawPage: (data: any) => {
      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages()
      const pageSize = doc.internal.pageSize
      const pageHeight = pageSize.getHeight()
      const pageWidth = pageSize.getWidth()
      
      doc.setFontSize(9)
      doc.setTextColor(107, 114, 128)
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    },
  })
  
  doc.save(fileName)
}
</script>

<template>
  <div>
    <!-- Compact Filter Bar -->
    <div class="bg-white border border-gray-200 rounded-lg mb-6">
      <div class="p-4">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Search Field -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by customer name or address..."
              class="input pl-9 w-full"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button @click="toggleFilters" class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">
              Filters
              <span v-if="activeFilterCount > 0" class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-primary text-white rounded-full">
                {{ activeFilterCount }}
              </span>
            </button>
            <div ref="columnsRef" class="relative">
              <button @click="showColumnsPanel = !showColumnsPanel" class="btn-secondary text-sm px-3 py-2 whitespace-nowrap flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z"/>
                </svg>
                Columns
              </button>
              <Transition name="slide-down">
                <div v-if="showColumnsPanel" class="absolute right-0 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50 w-64 max-h-96 overflow-y-auto">
                  <div class="p-3 space-y-2">
                    <div v-for="col in columns" :key="col.key" class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        :id="`col-${col.key}`"
                        :checked="isColumnVisible(col.key)"
                        :disabled="REQUIRED_COLUMNS.includes(col.key)"
                        @change="toggleColumnVisibility(col.key)"
                        class="w-4 h-4 text-primary rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <label :for="`col-${col.key}`" :class="['text-xs text-gray-700 cursor-pointer flex-1', REQUIRED_COLUMNS.includes(col.key) ? 'opacity-60' : '']">
                        {{ col.label }}
                        <span v-if="REQUIRED_COLUMNS.includes(col.key)" class="text-gray-400 text-xs ml-1">(always shown)</span>
                      </label>
                    </div>
                  </div>
                  <div class="border-t border-gray-100 px-3 py-2 flex gap-2">
                    <button @click="showAllColumns" class="btn-ghost text-xs flex-1 justify-center">Show All</button>
                    <button @click="resetToDefault" class="btn-ghost text-xs flex-1 justify-center">Reset</button>
                  </div>
                </div>
              </Transition>
            </div>
            <button @click="showExportModal = true" class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">
              Export
            </button>
            <button class="btn-secondary text-sm px-3 py-2 whitespace-nowrap">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Expandable Filter Panel -->
      <Transition name="expand">
        <div v-if="filtersExpanded" class="bg-gray-50 border-t border-gray-200 p-4">
          <div class="space-y-4">
            <!-- Filter Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label class="label text-xs mb-1">Month</label>
                <select v-model="filters.month" class="select text-sm">
                  <option value="">All Months</option>
                  <option v-for="m in months" :key="m.value" :value="String(m.value)">{{ m.label }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Year</label>
                <select v-model="filters.year" class="select text-sm">
                  <option value="">All Years</option>
                  <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Status</label>
                <select v-model="filters.status" class="select text-sm">
                  <option value="">All Statuses</option>
                  <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Category</label>
                <select v-model="filters.category" class="select text-sm">
                  <option value="">All Categories</option>
                  <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Plan</label>
                <select v-model="filters.plan" class="select text-sm">
                  <option value="">All Plans</option>
                  <option v-for="p in planOptions" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Area</label>
                <select v-model="filters.area" class="select text-sm">
                  <option value="">All Areas</option>
                  <option v-for="a in areaOptions" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Installer</label>
                <select v-model="filters.installer" class="select text-sm">
                  <option value="">All Installers</option>
                  <option v-for="i in installerOptions" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">Pickup Point</label>
                <select v-model="filters.pickupPoint" class="select text-sm">
                  <option value="">All Pickup Points</option>
                  <option v-for="pp in pickupPointOptions" :key="pp" :value="pp">{{ pp }}</option>
                </select>
              </div>

              <div>
                <label class="label text-xs mb-1">MDU</label>
                <select v-model="filters.mdu" class="select text-sm">
                  <option value="">All MDU</option>
                  <option v-for="m in mduOptions" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <button @click="clearFilters" class="btn-secondary text-sm w-full sm:w-auto justify-center">
                Clear Filters
              </button>
              <button class="btn-primary text-sm w-full sm:w-auto justify-center">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Table Container -->
    <div class="card overflow-hidden flex flex-col">
      <!-- Table Wrapper: horizontal scroll only on table, not page -->
      <div class="overflow-x-auto min-w-0">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th
                v-for="col in displayedColumns"
                :key="col.key"
                @click="col.sortable && handleSort(col.key)"
                :style="{ width: col.width + 'px', minWidth: col.width + 'px' }"
                :class="[
                  'text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3 whitespace-nowrap',
                  col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : '',
                  col.pinned ? 'sticky left-0 z-20 bg-gray-50 shadow-sm border-r border-gray-200' : ''
                ]"
              >
                <div class="flex items-center gap-2">
                  <span class="truncate">{{ col.label }}</span>
                  <svg
                    v-if="col.sortable && sortBy === col.key"
                    :class="['w-3.5 h-3.5 text-primary flex-shrink-0', sortOrder === 'desc' ? 'rotate-180' : '']"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4"/>
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(inst, idx) in paginatedData"
              :key="inst.id"
              @click="handleRowClick(inst)"
              :class="[
                'hover:bg-gray-50/60 transition-colors cursor-pointer',
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              ]"
            >
              <td
                v-for="col in displayedColumns"
                :key="col.key"
                :style="{ width: col.width + 'px', minWidth: col.width + 'px' }"
                :class="[
                  'px-4 py-3 text-sm text-gray-700',
                  col.pinned ? 'sticky left-0 z-10 bg-white shadow-sm border-r border-gray-200' : ''
                ]"
              >
                <div class="truncate">
                  <template v-if="col.key === 'status'">
                    <StatusBadge :status="inst.status" size="sm" />
                  </template>
                  <template v-else>
                    {{ getCellValue(inst, col.key) }}
                  </template>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td :colspan="displayedColumns.length" class="px-6 py-12 text-center">
                <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-sm text-gray-500">No installations found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">Rows per page:</span>
          <select v-model.number="rowsPerPage" class="select w-20 text-sm">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <div class="text-sm text-gray-600">
          Showing {{ pageInfo.start }}–{{ pageInfo.end }} of {{ pageInfo.total }} installations
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn-secondary text-sm px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div class="flex items-center gap-1">
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn-secondary text-sm px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>


    <!-- Export Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showExportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showExportModal = false"></div>
          <div class="modal-panel relative bg-white w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 class="text-base font-semibold text-gray-900">Export Installation Report</h2>
                <p class="text-xs text-gray-500 mt-0.5">Choose what you'd like to include in this report</p>
              </div>
              <button @click="showExportModal = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <!-- Data Source -->
              <div>
                <p class="text-sm font-semibold text-gray-900 mb-3">Data Source</p>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.dataSource" type="radio" value="filtered" class="w-4 h-4 text-primary" />
                    <span class="text-sm text-gray-700">Current Filtered Results ({{ filtered.length }} records)</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.dataSource" type="radio" value="all" class="w-4 h-4 text-primary" />
                    <span class="text-sm text-gray-700">Entire Dataset ({{ store.installations.length }} records)</span>
                  </label>
                </div>
              </div>

              <!-- File Format -->
              <div>
                <p class="text-sm font-semibold text-gray-900 mb-3">File Format</p>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.format" type="radio" value="excel" class="w-4 h-4 text-primary" />
                    <span class="text-sm text-gray-700">Excel (.xlsx)</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.format" type="radio" value="csv" class="w-4 h-4 text-primary" />
                    <span class="text-sm text-gray-700">CSV</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.format" type="radio" value="pdf" class="w-4 h-4 text-primary" />
                    <span class="text-sm text-gray-700">PDF Report</span>
                  </label>
                </div>
              </div>

              <!-- Report Information -->
              <div>
                <p class="text-sm font-semibold text-gray-900 mb-3">Report Information</p>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.includeExecutiveSummary" type="checkbox" class="w-4 h-4 text-primary rounded" />
                    <span class="text-sm text-gray-700">Executive Summary</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.includeFilters" type="checkbox" class="w-4 h-4 text-primary rounded" />
                    <span class="text-sm text-gray-700">Applied Filters</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.includeTable" type="checkbox" class="w-4 h-4 text-primary rounded" />
                    <span class="text-sm text-gray-700">Installation Table</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input v-model="exportOptions.includeMetadata" type="checkbox" class="w-4 h-4 text-primary rounded" />
                    <span class="text-sm text-gray-700">Export Date & Time</span>
                  </label>
                </div>
              </div>

              <!-- File Name Preview -->
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">File Name</p>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ generateFileName() }}</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
              <button @click="showExportModal = false" class="btn-secondary">Cancel</button>
              <button @click="handleExport" class="btn-primary">Export Report</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showToast" class="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg shadow-lg">
          <svg class="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p class="text-sm font-medium text-green-800">{{ toastMessage }}</p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
