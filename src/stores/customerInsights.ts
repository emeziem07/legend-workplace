import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Installation {
  id: string
  customerId: string
  customerName: string
  installationDate: string
  activationDate?: string
  status: 'Activated' | 'Pending' | 'Refunded'
  durationDays?: number
}

export interface MonthlyData {
  month: string
  year: number
  total: number
  activated: number
  refunded: number
  pending: number
}

export const useCustomerInsightsStore = defineStore('customerInsights', () => {
  const installations = ref<Installation[]>([
    { id: 'inst1', customerId: 'cust001', customerName: 'Acme Corp', installationDate: '2025-01-05', activationDate: '2025-01-08', status: 'Activated', durationDays: 3 },
    { id: 'inst2', customerId: 'cust002', customerName: 'TechStart Inc', installationDate: '2025-01-12', activationDate: '2025-01-15', status: 'Activated', durationDays: 3 },
    { id: 'inst3', customerId: 'cust003', customerName: 'Global Solutions', installationDate: '2025-01-18', status: 'Pending' },
    { id: 'inst4', customerId: 'cust004', customerName: 'Enterprise Ltd', installationDate: '2025-02-02', activationDate: '2025-02-05', status: 'Activated', durationDays: 3 },
    { id: 'inst5', customerId: 'cust005', customerName: 'Digital Ventures', installationDate: '2025-02-10', status: 'Refunded' },
    { id: 'inst6', customerId: 'cust006', customerName: 'Cloud Systems', installationDate: '2025-02-14', activationDate: '2025-02-18', status: 'Activated', durationDays: 4 },
    { id: 'inst7', customerId: 'cust007', customerName: 'NextGen Corp', installationDate: '2025-03-01', activationDate: '2025-03-04', status: 'Activated', durationDays: 3 },
    { id: 'inst8', customerId: 'cust008', customerName: 'Innovation Labs', installationDate: '2025-03-08', status: 'Pending' },
    { id: 'inst9', customerId: 'cust009', customerName: 'Future Tech', installationDate: '2025-03-15', activationDate: '2025-03-19', status: 'Activated', durationDays: 4 },
    { id: 'inst10', customerId: 'cust010', customerName: 'Smart Industries', installationDate: '2025-04-02', status: 'Pending' },
    { id: 'inst11', customerId: 'cust011', customerName: 'Data Dynamics', installationDate: '2025-04-10', activationDate: '2025-04-13', status: 'Activated', durationDays: 3 },
    { id: 'inst12', customerId: 'cust012', customerName: 'Quantum Solutions', installationDate: '2025-04-18', status: 'Refunded' },
    { id: 'inst13', customerId: 'cust013', customerName: 'Velocity Systems', installationDate: '2025-05-05', activationDate: '2025-05-08', status: 'Activated', durationDays: 3 },
    { id: 'inst14', customerId: 'cust014', customerName: 'Nexus Group', installationDate: '2025-05-12', status: 'Pending' },
    { id: 'inst15', customerId: 'cust015', customerName: 'Apex Solutions', installationDate: '2025-05-20', activationDate: '2025-05-24', status: 'Activated', durationDays: 4 },
    { id: 'inst16', customerId: 'cust016', customerName: 'Horizon Tech', installationDate: '2025-06-03', status: 'Pending' },
    { id: 'inst17', customerId: 'cust017', customerName: 'Catalyst Inc', installationDate: '2025-06-10', activationDate: '2025-06-13', status: 'Activated', durationDays: 3 },
    { id: 'inst18', customerId: 'cust018', customerName: 'Prism Digital', installationDate: '2025-06-18', status: 'Refunded' },
    { id: 'inst19', customerId: 'cust019', customerName: 'Zenith Corp', installationDate: '2025-07-02', activationDate: '2025-07-05', status: 'Activated', durationDays: 3 },
    { id: 'inst20', customerId: 'cust020', customerName: 'Stellar Systems', installationDate: '2025-07-10', status: 'Pending' },
  ])

  const monthlyData = computed<MonthlyData[]>(() => {
    const months: Record<string, MonthlyData> = {}
    
    installations.value.forEach(inst => {
      const date = new Date(inst.installationDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthName,
          year: date.getFullYear(),
          total: 0,
          activated: 0,
          refunded: 0,
          pending: 0,
        }
      }
      
      months[monthKey].total++
      if (inst.status === 'Activated') months[monthKey].activated++
      else if (inst.status === 'Refunded') months[monthKey].refunded++
      else if (inst.status === 'Pending') months[monthKey].pending++
    })
    
    return Object.values(months).sort((a, b) => {
      const aDate = new Date(`${a.month} 1`)
      const bDate = new Date(`${b.month} 1`)
      return aDate.getTime() - bDate.getTime()
    })
  })

  const summaryStats = computed(() => {
    const total = installations.value.length
    const activated = installations.value.filter(i => i.status === 'Activated').length
    const pending = installations.value.filter(i => i.status === 'Pending').length
    const refunded = installations.value.filter(i => i.status === 'Refunded').length
    const activationRate = total > 0 ? Math.round((activated / total) * 100) : 0
    
    const activatedWithDuration = installations.value.filter(i => i.status === 'Activated' && i.durationDays)
    const avgDuration = activatedWithDuration.length > 0
      ? Math.round(activatedWithDuration.reduce((sum, i) => sum + (i.durationDays || 0), 0) / activatedWithDuration.length)
      : 0
    
    return {
      totalInstallations: total,
      activated,
      pending,
      refunded,
      activationRate,
      averageInstallationDuration: avgDuration,
    }
  })

  return {
    installations,
    monthlyData,
    summaryStats,
  }
})
