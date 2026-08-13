<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { staffMockData } from '../mock/staff'
import { supervisorMockData } from '../mock/supervisor'
import { hodMockData } from '../mock/hod'
import { hrMockData } from '../mock/hr'
import { adminMockData } from '../mock/admin'
import AvatarInitials from '../components/common/AvatarInitials.vue'

const userStore = useUserStore()

const roleUserData = computed(() => {
  switch (userStore.role) {
    case 'staff': return staffMockData.user
    case 'supervisor': return supervisorMockData.user
    case 'hod': return hodMockData.user
    case 'hr': return hrMockData.user
    case 'admin': return adminMockData.user
    default: return staffMockData.user
  }
})

// ── Edit Drawer ──────────────────────────────────────────────────────────────
const drawerOpen = ref(false)

const editForm = ref({
  firstName: 'Alex',
  lastName: 'Johnson',
  displayName: 'Alex Johnson',
  phone: '+234 801 234 5678',
  extension: '2042',
  officeLocation: 'Lagos HQ – Floor 3',
  emergencyContact: 'Mary Johnson',
  emergencyPhone: '+234 802 345 6789',
})

const originalForm = ref({ ...editForm.value })
const formDirty = computed(() => JSON.stringify(editForm.value) !== JSON.stringify(originalForm.value))

const openDrawer = () => {
  originalForm.value = { ...editForm.value }
  drawerOpen.value = true
}

const closeDrawer = () => {
  editForm.value = { ...originalForm.value }
  drawerOpen.value = false
}

const saveDrawer = () => {
  originalForm.value = { ...editForm.value }
  drawerOpen.value = false
}

// Validation
const errors = ref<Record<string, string>>({})
const validate = () => {
  errors.value = {}
  if (!editForm.value.firstName.trim()) errors.value.firstName = 'First name is required'
  if (!editForm.value.lastName.trim()) errors.value.lastName = 'Last name is required'
  if (!editForm.value.phone.trim()) errors.value.phone = 'Phone number is required'
  return Object.keys(errors.value).length === 0
}

const handleSave = () => {
  if (!validate()) return
  saveDrawer()
}

watch(drawerOpen, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

// ── Status ───────────────────────────────────────────────────────────────────
const userStatus = ref<'Online' | 'Away'>('Online')

// ── Notification Preferences ─────────────────────────────────────────────────
const notifPrefs = ref({
  dailySchedule: true,
  approvalNotifications: true,
  requestUpdates: true,
  meetingReminders: false,
  collaborationMessages: true,
  departmentAnnouncements: true,
  systemMaintenance: false,
})

// ── Appearance ───────────────────────────────────────────────────────────────
const theme = ref<'Light' | 'Dark' | 'System'>('Light')
const compactMode = ref(false)
const reduceMotion = ref(false)
const language = ref('English (US)')
const timezone = ref('Africa/Lagos (WAT, UTC+1)')

// ── Workplace Preferences ────────────────────────────────────────────────────
const defaultLandingPage = ref('Overview')
const rememberLastPage = ref(true)
const defaultCalendarView = ref<'Week' | 'Month' | 'Agenda'>('Week')

// ── MFA ──────────────────────────────────────────────────────────────────────
const mfaEnabled = ref(true)
const showChangePassword = ref(false)
const passwordForm = ref({ current: '', newPass: '', confirm: '' })

// ── Activity ─────────────────────────────────────────────────────────────────
const activityLog = [
  { icon: 'login', label: 'Recent login', detail: 'Chrome on macOS · Lagos, Nigeria', time: 'Today, 8:42 AM', color: '#22c55e' },
  { icon: 'lock', label: 'Password changed', detail: 'Security update completed', time: 'Jul 10, 2025', color: '#3b82f6' },
  { icon: 'user', label: 'Profile updated', detail: 'Phone number and office location updated', time: 'Jul 8, 2025', color: '#FD4F00' },
  { icon: 'file', label: 'Request submitted', detail: 'Annual Leave Request – 5 days', time: 'Jul 5, 2025', color: '#f59e0b' },
  { icon: 'check', label: 'Schedule approved', detail: 'Jul 12 daily schedule approved', time: 'Jul 4, 2025', color: '#22c55e' },
  { icon: 'upload', label: 'Document uploaded', detail: 'Q3_Strategic_Plan_v2.pdf uploaded to DMS', time: 'Jul 1, 2025', color: '#8b5cf6' },
]

// ── Connected Resources ───────────────────────────────────────────────────────
const connectedResources = ref([
  { id: 'r1', name: 'Document Management System', description: 'Upload, manage and access company documents', status: 'Available', icon: 'folder' },
  { id: 'r2', name: 'Collaboration Workspace', description: 'Communicate with departments and project teams', status: 'Available', icon: 'chat' },
])

// ── Toggle helper ─────────────────────────────────────────────────────────────
const toggle = (obj: Record<string, boolean>, key: string) => {
  obj[key] = !obj[key]
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Profile</h1>
      <p class="text-sm text-gray-500 mt-0.5">Manage your personal information, workplace account and preferences.</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">

      <!-- ── LEFT COLUMN ── -->
      <div class="lg:col-span-1 space-y-6">

        <!-- Section 1: Profile Header Card -->
        <div class="card p-6">
          <div class="flex flex-col items-center text-center mb-6">
            <div class="relative mb-4">
              <AvatarInitials :name="roleUserData.name" size="lg" class="!w-20 !h-20 !text-2xl" />
              <span
                :class="['absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white', userStatus === 'Online' ? 'bg-green-500' : 'bg-amber-400']"
              ></span>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">{{ roleUserData.name }}</h2>
            <p class="text-sm text-gray-500">{{ roleUserData.jobTitle }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ roleUserData.department }}</p>

            <!-- Status toggle -->
            <div class="flex items-center gap-2 mt-3">
              <button
                @click="userStatus = 'Online'"
                :class="['px-3 py-1 rounded-full text-xs font-medium border transition-colors', userStatus === 'Online' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50']"
              >
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 align-middle"></span>Online
              </button>
              <button
                @click="userStatus = 'Away'"
                :class="['px-3 py-1 rounded-full text-xs font-medium border transition-colors', userStatus === 'Away' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50']"
              >
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 align-middle"></span>Away
              </button>
            </div>
          </div>

          <!-- Profile details -->
          <dl class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7h20l-6-4z"/></svg>
              <div class="min-w-0">
                <dt class="text-xs text-gray-400">Employee ID</dt>
                <dd class="font-medium text-gray-800">EMP-00142</dd>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div class="min-w-0">
                <dt class="text-xs text-gray-400">Role</dt>
                <dd class="font-medium text-gray-800">{{ userStore.roleLabel }}</dd>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="min-w-0">
                <dt class="text-xs text-gray-400">Office Location</dt>
                <dd class="font-medium text-gray-800">{{ editForm.officeLocation }}</dd>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div class="min-w-0">
                <dt class="text-xs text-gray-400">Date Joined</dt>
                <dd class="font-medium text-gray-800">Mar 15, 2022</dd>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <div class="min-w-0">
                <dt class="text-xs text-gray-400">Work Email</dt>
                <dd class="font-medium text-gray-800 truncate">alex.johnson@legend.com</dd>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div class="min-w-0">
                <dt class="text-xs text-gray-400">Phone</dt>
                <dd class="font-medium text-gray-800">{{ editForm.phone }}</dd>
              </div>
            </div>
          </dl>

          <button @click="openDrawer" class="btn-primary w-full justify-center mt-6 text-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Profile
          </button>
        </div>

        <!-- Section 8: Activity -->
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Activity</h3>
            <p class="text-xs text-gray-500 mt-0.5">Recent account activity</p>
          </div>
          <div class="px-5 py-4">
            <div class="relative">
              <div class="absolute left-2 top-0 bottom-0 w-px bg-gray-100"></div>
              <div class="space-y-4">
                <div v-for="item in activityLog" :key="item.label" class="relative pl-7">
                  <div
                    class="absolute left-0 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
                    :style="{ backgroundColor: item.color }"
                  >
                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                      <polyline v-if="item.icon === 'check'" points="20 6 9 17 4 12"/>
                      <path v-else-if="item.icon === 'login'" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                      <path v-else-if="item.icon === 'lock'" d="M12 1a3 3 0 0 0-3 3v4H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-3V4a3 3 0 0 0-3-3z"/>
                      <path v-else-if="item.icon === 'user'" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                      <path v-else-if="item.icon === 'file'" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path v-else-if="item.icon === 'upload'" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                  </div>
                  <p class="text-xs font-semibold text-gray-800">{{ item.label }}</p>
                  <p class="text-xs text-gray-500">{{ item.detail }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ item.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── RIGHT COLUMN ── -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Section 2: Personal Information -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-gray-900">Personal Information</h3>
              <p class="text-xs text-gray-500 mt-0.5">Update your personal details</p>
            </div>
            <button @click="openDrawer" class="btn-secondary text-xs gap-1.5">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
          </div>
          <div class="px-6 py-5">
            <div class="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <div v-for="field in [
                { label: 'First Name', value: editForm.firstName },
                { label: 'Last Name', value: editForm.lastName },
                { label: 'Display Name', value: editForm.displayName },
                { label: 'Phone Number', value: editForm.phone },
                { label: 'Extension', value: editForm.extension },
                { label: 'Office Location', value: editForm.officeLocation },
                { label: 'Emergency Contact', value: editForm.emergencyContact },
                { label: 'Emergency Phone', value: editForm.emergencyPhone },
              ]" :key="field.label">
                <div>
                  <dt class="text-xs text-gray-400 mb-0.5">{{ field.label }}</dt>
                  <dd class="text-sm font-medium text-gray-800">{{ field.value }}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Workplace Information (read-only) -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-semibold text-gray-900">Workplace Information</h3>
              <span class="badge badge-gray text-xs">Read-only</span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">These values are managed by HR and cannot be edited</p>
          </div>
          <div class="px-6 py-5">
            <div class="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <div v-for="field in [
                { label: 'Employee ID', value: 'EMP-00142' },
                { label: 'Department', value: roleUserData.department },
                { label: 'Reporting Manager', value: 'Sarah Mitchell' },
                { label: 'Role', value: userStore.roleLabel },
                { label: 'Employment Type', value: 'Full-Time' },
                { label: 'Business Unit', value: 'Strategy & Operations' },
                { label: 'Date Joined', value: 'Mar 15, 2022' },
              ]" :key="field.label">
                <div>
                  <dt class="text-xs text-gray-400 mb-0.5">{{ field.label }}</dt>
                  <dd class="text-sm font-medium text-gray-800">{{ field.value }}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Account & Security -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Account & Security</h3>
            <p class="text-xs text-gray-500 mt-0.5">Manage your password, MFA, and active sessions</p>
          </div>
          <div class="divide-y divide-gray-50">

            <!-- Password -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-800">Password</p>
                  <p class="text-xs text-gray-400 mt-0.5 font-mono tracking-widest">••••••••••••</p>
                </div>
                <button @click="showChangePassword = !showChangePassword" class="btn-secondary text-xs">Change Password</button>
              </div>
              <Transition name="slide-down">
                <div v-if="showChangePassword" class="mt-4 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <label class="label text-xs">Current Password</label>
                    <input v-model="passwordForm.current" type="password" placeholder="Enter current password" class="input text-sm" />
                  </div>
                  <div>
                    <label class="label text-xs">New Password</label>
                    <input v-model="passwordForm.newPass" type="password" placeholder="Enter new password" class="input text-sm" />
                  </div>
                  <div>
                    <label class="label text-xs">Confirm New Password</label>
                    <input v-model="passwordForm.confirm" type="password" placeholder="Confirm new password" class="input text-sm" />
                  </div>
                  <div class="flex gap-2 justify-end">
                    <button @click="showChangePassword = false" class="btn-ghost text-xs">Cancel</button>
                    <button class="btn-primary text-xs">Update Password</button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- MFA -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-800">Multi-factor Authentication</p>
                  <p class="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <div class="flex items-center gap-3">
                  <span :class="['badge text-xs', mfaEnabled ? 'badge-green' : 'badge-gray']">{{ mfaEnabled ? 'Enabled' : 'Disabled' }}</span>
                  <button
                    @click="mfaEnabled = !mfaEnabled"
                    :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', mfaEnabled ? 'bg-primary' : 'bg-gray-200']"
                  >
                    <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', mfaEnabled ? 'translate-x-6' : 'translate-x-1']"></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sessions -->
            <div class="px-6 py-4">
              <p class="text-sm font-medium text-gray-800 mb-3">Sessions</p>
              <div class="space-y-3">
                <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-800">Current Device</p>
                    <p class="text-xs text-gray-500">Chrome on macOS · Lagos, Nigeria</p>
                    <p class="text-xs text-green-600 mt-0.5">Last login: Today, 8:42 AM · Active now</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <svg class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-800">iPhone 14 Pro</p>
                    <p class="text-xs text-gray-500">Safari on iOS · Lagos, Nigeria</p>
                    <p class="text-xs text-gray-400 mt-0.5">Last login: Jul 12, 2025, 6:15 PM</p>
                  </div>
                </div>
              </div>
              <button class="mt-3 text-xs font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out of other devices
              </button>
            </div>
          </div>
        </div>

        <!-- Section 5: Notification Preferences -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Notification Preferences</h3>
            <p class="text-xs text-gray-500 mt-0.5">Choose what notifications you receive</p>
          </div>
          <div class="divide-y divide-gray-50">
            <div
              v-for="item in [
                { key: 'dailySchedule', label: 'Daily schedule reminders', desc: 'Get reminded about your daily task schedule' },
                { key: 'approvalNotifications', label: 'Approval notifications', desc: 'Notify when requests are approved or rejected' },
                { key: 'requestUpdates', label: 'Request updates', desc: 'Status changes on your submitted requests' },
                { key: 'meetingReminders', label: 'Meeting reminders', desc: 'Reminders before scheduled meetings' },
                { key: 'collaborationMessages', label: 'Collaboration messages', desc: 'New messages in your conversations' },
                { key: 'departmentAnnouncements', label: 'Department announcements', desc: 'Important announcements from your department' },
                { key: 'systemMaintenance', label: 'System maintenance notifications', desc: 'Planned downtime and system updates' },
              ]"
              :key="item.key"
              class="flex items-center justify-between px-6 py-3.5"
            >
              <div class="min-w-0 mr-4">
                <p class="text-sm font-medium text-gray-800">{{ item.label }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ item.desc }}</p>
              </div>
              <button
                @click="toggle(notifPrefs as unknown as Record<string, boolean>, item.key)"
                :class="['relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', (notifPrefs as Record<string, boolean>)[item.key] ? 'bg-primary' : 'bg-gray-200']"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', (notifPrefs as Record<string, boolean>)[item.key] ? 'translate-x-6' : 'translate-x-1']"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Section 6: Appearance -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Appearance</h3>
            <p class="text-xs text-gray-500 mt-0.5">Customize your interface preferences</p>
          </div>
          <div class="px-6 py-5 space-y-5">

            <!-- Theme -->
            <div>
              <label class="label text-xs mb-2">Theme</label>
              <div class="flex gap-2">
                <button
                  v-for="t in ['Light', 'Dark', 'System']"
                  :key="t"
                  @click="theme = t as 'Light' | 'Dark' | 'System'"
                  :class="['flex-1 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors', theme === t ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- Compact Mode -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800">Compact Mode</p>
                <p class="text-xs text-gray-500 mt-0.5">Reduce spacing for a denser layout</p>
              </div>
              <button
                @click="compactMode = !compactMode"
                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', compactMode ? 'bg-primary' : 'bg-gray-200']"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', compactMode ? 'translate-x-6' : 'translate-x-1']"></span>
              </button>
            </div>

            <!-- Reduce Motion -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800">Reduce Motion</p>
                <p class="text-xs text-gray-500 mt-0.5">Minimize animations and transitions</p>
              </div>
              <button
                @click="reduceMotion = !reduceMotion"
                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', reduceMotion ? 'bg-primary' : 'bg-gray-200']"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', reduceMotion ? 'translate-x-6' : 'translate-x-1']"></span>
              </button>
            </div>

            <!-- Language -->
            <div>
              <label class="label text-xs mb-1">Language</label>
              <select v-model="language" class="select text-sm">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>French</option>
              </select>
            </div>

            <!-- Timezone -->
            <div>
              <label class="label text-xs mb-1">Timezone</label>
              <select v-model="timezone" class="select text-sm">
                <option>Africa/Lagos (WAT, UTC+1)</option>
                <option>Africa/Accra (GMT, UTC+0)</option>
                <option>Europe/London (BST, UTC+1)</option>
                <option>America/New_York (EDT, UTC-4)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 7: Workplace Preferences -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Workplace Preferences</h3>
            <p class="text-xs text-gray-500 mt-0.5">Personal settings for your Workplace experience</p>
          </div>
          <div class="px-6 py-5 space-y-5">

            <!-- Default Landing Page -->
            <div>
              <label class="label text-xs mb-1">Default Landing Page</label>
              <select v-model="defaultLandingPage" class="select text-sm">
                <option>Overview</option>
                <option>Schedules</option>
                <option>Requests</option>
                <option>Collaboration</option>
              </select>
            </div>

            <!-- Remember Last Page -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800">Remember Last Visited Page</p>
                <p class="text-xs text-gray-500 mt-0.5">Resume where you left off on next login</p>
              </div>
              <button
                @click="rememberLastPage = !rememberLastPage"
                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', rememberLastPage ? 'bg-primary' : 'bg-gray-200']"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', rememberLastPage ? 'translate-x-6' : 'translate-x-1']"></span>
              </button>
            </div>

            <!-- Default Calendar View -->
            <div>
              <label class="label text-xs mb-2">Default Calendar View</label>
              <div class="flex gap-2">
                <button
                  v-for="v in ['Week', 'Month', 'Agenda']"
                  :key="v"
                  @click="defaultCalendarView = v as 'Week' | 'Month' | 'Agenda'"
                  :class="['flex-1 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors', defaultCalendarView === v ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
                >
                  {{ v }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 9: Connected Resources -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Connected Resources</h3>
            <p class="text-xs text-gray-500 mt-0.5">Workplace resources you have access to</p>
          </div>
          <div class="px-6 py-5">
            <div class="grid sm:grid-cols-2 gap-3">
              <div
                v-for="resource in connectedResources"
                :key="resource.id"
                class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
              >
                <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <svg v-if="resource.icon === 'folder'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <svg v-else-if="resource.icon === 'chat'" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <svg v-else class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ resource.name }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ resource.description }}</p>
                  <span class="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {{ resource.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ── Edit Profile Drawer ── -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="drawerOpen" class="fixed inset-0 z-50 flex">
        <div class="flex-1 bg-black/30 backdrop-blur-[2px]" @click="closeDrawer"></div>
        <Transition name="drawer" appear>
          <div v-if="drawerOpen" class="bg-white flex flex-col h-full border-l border-gray-200 shadow-2xl" style="width: 480px; max-width: 100vw;">

            <!-- Drawer Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 class="text-base font-semibold text-gray-900">Edit Profile</h2>
                <p class="text-xs text-gray-500 mt-0.5">Update your personal information</p>
              </div>
              <button @click="closeDrawer" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Drawer Body -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label text-xs">First Name <span class="text-red-500">*</span></label>
                  <input v-model="editForm.firstName" type="text" class="input text-sm" :class="errors.firstName ? 'border-red-400' : ''" />
                  <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
                </div>
                <div>
                  <label class="label text-xs">Last Name <span class="text-red-500">*</span></label>
                  <input v-model="editForm.lastName" type="text" class="input text-sm" :class="errors.lastName ? 'border-red-400' : ''" />
                  <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
                </div>
              </div>

              <div>
                <label class="label text-xs">Display Name</label>
                <input v-model="editForm.displayName" type="text" class="input text-sm" />
              </div>

              <div>
                <label class="label text-xs">Phone Number <span class="text-red-500">*</span></label>
                <input v-model="editForm.phone" type="tel" class="input text-sm" :class="errors.phone ? 'border-red-400' : ''" />
                <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
              </div>

              <div>
                <label class="label text-xs">Extension</label>
                <input v-model="editForm.extension" type="text" class="input text-sm" />
              </div>

              <div>
                <label class="label text-xs">Office Location</label>
                <input v-model="editForm.officeLocation" type="text" class="input text-sm" />
              </div>

              <div class="pt-2 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Emergency Contact</p>
                <div class="space-y-3">
                  <div>
                    <label class="label text-xs">Contact Name</label>
                    <input v-model="editForm.emergencyContact" type="text" class="input text-sm" />
                  </div>
                  <div>
                    <label class="label text-xs">Contact Phone</label>
                    <input v-model="editForm.emergencyPhone" type="tel" class="input text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
              <button @click="closeDrawer" class="btn-secondary">Cancel</button>
              <button
                @click="handleSave"
                :disabled="!formDirty"
                :class="['btn-primary', !formDirty ? 'opacity-40 cursor-not-allowed' : '']"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
