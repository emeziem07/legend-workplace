import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: 'u1',
    name: 'Alex Johnson',
    role: 'Senior Analyst',
    department: 'Strategy & Operations',
    isSupervisor: true,
    employeeId: 'EMP-00142',
  })

  return { user }
})
