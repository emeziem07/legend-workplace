import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import type { RolePermissions } from '../stores/user'

export function usePermissions() {
  const userStore = useUserStore()

  const can = (permission: keyof RolePermissions): boolean => {
    return userStore.hasPermission(permission)
  }

  const canAny = (...perms: (keyof RolePermissions)[]): boolean => {
    return perms.some(p => userStore.hasPermission(p))
  }

  const isRole = computed(() => userStore.role)

  const isAdmin = computed(() => userStore.role === 'admin')
  const isHR = computed(() => userStore.role === 'hr')
  const isSupervisor = computed(() => userStore.role === 'supervisor')
  const isHOD = computed(() => userStore.role === 'hod')
  const isStaff = computed(() => userStore.role === 'staff')

  return { can, canAny, isRole, isAdmin, isHR, isSupervisor, isHOD, isStaff }
}
