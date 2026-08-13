import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DocStatus = 'Approved' | 'Pending' | 'Rejected'

export interface Document {
  id: string
  title: string
  type: string
  department: string
  description: string
  fileName: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  status: DocStatus
  version: string
}

export const useResourcesStore = defineStore('resources', () => {
  const documents = ref<Document[]>([
    {
      id: 'd1',
      title: 'Q3 2025 Strategic Plan',
      type: 'Strategic Document',
      department: 'Strategy & Operations',
      description: 'Comprehensive strategic plan for Q3 2025 covering objectives, initiatives, and KPIs.',
      fileName: 'Q3_2025_Strategic_Plan_v2.pdf',
      fileSize: '2.4 MB',
      uploadedBy: 'Sarah Mitchell',
      uploadedAt: 'Jul 1, 2025',
      status: 'Approved',
      version: 'v2.0',
    },
    {
      id: 'd2',
      title: 'Employee Handbook 2025',
      type: 'HR Policy',
      department: 'Human Resources',
      description: 'Updated employee handbook covering all policies, benefits, and procedures for 2025.',
      fileName: 'Employee_Handbook_2025.pdf',
      fileSize: '5.1 MB',
      uploadedBy: 'HR Department',
      uploadedAt: 'Jan 15, 2025',
      status: 'Approved',
      version: 'v1.0',
    },
    {
      id: 'd3',
      title: 'IT Security Policy',
      type: 'IT Policy',
      department: 'Information Technology',
      description: 'Mandatory IT security guidelines and acceptable use policies for all staff.',
      fileName: 'IT_Security_Policy_v3.pdf',
      fileSize: '892 KB',
      uploadedBy: 'IT Department',
      uploadedAt: 'Mar 20, 2025',
      status: 'Approved',
      version: 'v3.1',
    },
    {
      id: 'd4',
      title: 'June 2025 Board Meeting Minutes',
      type: 'Meeting Minutes',
      department: 'Executive',
      description: 'Official minutes from the June board meeting including resolutions passed.',
      fileName: 'Board_Minutes_June_2025.pdf',
      fileSize: '645 KB',
      uploadedBy: 'Company Secretary',
      uploadedAt: 'Jul 2, 2025',
      status: 'Approved',
      version: 'v1.0',
    },
    {
      id: 'd5',
      title: 'Procurement Guidelines v4',
      type: 'Finance Policy',
      department: 'Finance',
      description: 'Updated procurement and vendor management guidelines with new approval thresholds.',
      fileName: 'Procurement_Guidelines_v4.pdf',
      fileSize: '1.2 MB',
      uploadedBy: 'Finance Team',
      uploadedAt: 'Jun 28, 2025',
      status: 'Pending',
      version: 'v4.0',
    },
    {
      id: 'd6',
      title: 'Risk Management Framework 2025',
      type: 'Compliance Document',
      department: 'Risk & Compliance',
      description: 'Enterprise risk management framework and operational risk register template.',
      fileName: 'Risk_Management_Framework_2025.pdf',
      fileSize: '3.7 MB',
      uploadedBy: 'Compliance Team',
      uploadedAt: 'Jul 8, 2025',
      status: 'Pending',
      version: 'v1.0',
    },
  ])

  const addDocument = (doc: Omit<Document, 'id'>) => {
    documents.value.push({ ...doc, id: `d${Date.now()}` })
  }

  return { documents, addDocument }
})
