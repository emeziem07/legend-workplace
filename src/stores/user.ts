import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserRole = 'staff' | 'supervisor' | 'hod' | 'hr' | 'admin'

export interface RolePermissions {
  submit_schedule: boolean
  approve_schedule: boolean
  approve_closeout: boolean
  submit_request: boolean
  approve_leave: boolean
  manage_resources: boolean
  view_team_kpis: boolean
  view_org_metrics: boolean
  approve_aie: boolean
  manage_users: boolean
}

const rolePermissionMap: Record<UserRole, (keyof RolePermissions)[]> = {
  staff: [
    'submit_schedule',
    'submit_request',
    'manage_resources',
  ],
  supervisor: [
    'submit_schedule',
    'approve_schedule',
    'approve_closeout',
    'submit_request',
    'view_team_kpis',
    'manage_resources',
  ],
  hod: [
    'submit_schedule',
    'approve_schedule',
    'approve_closeout',
    'submit_request',
    'approve_leave',
    'view_team_kpis',
    'manage_resources',
  ],
  hr: [
    'submit_schedule',
    'submit_request',
    'approve_leave',
    'approve_aie',
    'view_org_metrics',
    'manage_resources',
    'approve_schedule',
    'approve_closeout',
  ],
  admin: [
    'submit_schedule',
    'approve_schedule',
    'approve_closeout',
    'submit_request',
    'approve_leave',
    'manage_resources',
    'view_team_kpis',
    'view_org_metrics',
    'approve_aie',
    'manage_users',
  ],
}

export const useUserStore = defineStore('user', () => {
  const role = ref<UserRole>('supervisor')

  const permissions = computed<(keyof RolePermissions)[]>(() => {
    return rolePermissionMap[role.value] ?? []
  })

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions.value.includes(permission)
  }

  const setRole = (newRole: UserRole) => {
    role.value = newRole
  }

  const roleLabel = computed(() => {
    const labels: Record<UserRole, string> = {
      staff: 'Staff',
      supervisor: 'Supervisor',
      hod: 'Head of Department',
      hr: 'Head of Strategy',
      admin: 'Administrator',
    }
    return labels[role.value]
  })

  return { role, permissions, hasPermission, setRole, roleLabel }
})
