import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Payslip {
  id: string
  period: string
  payDate: string
  grossPay: string
  netPay: string
  deductions: string
  status: 'Paid' | 'Processing'
  breakdown: {
    basicSalary: string
    housing: string
    transport: string
    medicalAllowance: string
    performanceBonus: string
    pension: string
    tax: string
    nhf: string
  }
}

export const usePayslipsStore = defineStore('payslips', () => {
  const payslips = ref<Payslip[]>([
    {
      id: 'ps1',
      period: 'June 2025',
      payDate: 'Jun 28, 2025',
      grossPay: '₦1,250,000',
      netPay: '₦987,450',
      deductions: '₦262,550',
      status: 'Paid',
      breakdown: {
        basicSalary: '₦750,000',
        housing: '₦250,000',
        transport: '₦150,000',
        medicalAllowance: '₦50,000',
        performanceBonus: '₦50,000',
        pension: '₦112,500',
        tax: '₦137,550',
        nhf: '₦12,500',
      },
    },
    {
      id: 'ps2',
      period: 'May 2025',
      payDate: 'May 30, 2025',
      grossPay: '₦1,200,000',
      netPay: '₦951,000',
      deductions: '₦249,000',
      status: 'Paid',
      breakdown: {
        basicSalary: '₦750,000',
        housing: '₦250,000',
        transport: '₦150,000',
        medicalAllowance: '₦50,000',
        performanceBonus: '₦0',
        pension: '₦108,000',
        tax: '₦129,000',
        nhf: '₦12,000',
      },
    },
    {
      id: 'ps3',
      period: 'April 2025',
      payDate: 'Apr 30, 2025',
      grossPay: '₦1,200,000',
      netPay: '₦951,000',
      deductions: '₦249,000',
      status: 'Paid',
      breakdown: {
        basicSalary: '₦750,000',
        housing: '₦250,000',
        transport: '₦150,000',
        medicalAllowance: '₦50,000',
        performanceBonus: '₦0',
        pension: '₦108,000',
        tax: '₦129,000',
        nhf: '₦12,000',
      },
    },
    {
      id: 'ps4',
      period: 'July 2025',
      payDate: 'Jul 31, 2025',
      grossPay: '₦1,250,000',
      netPay: '₦987,450',
      deductions: '₦262,550',
      status: 'Processing',
      breakdown: {
        basicSalary: '₦750,000',
        housing: '₦250,000',
        transport: '₦150,000',
        medicalAllowance: '₦50,000',
        performanceBonus: '₦50,000',
        pension: '₦112,500',
        tax: '₦137,550',
        nhf: '₦12,500',
      },
    },
  ])

  return { payslips }
})
