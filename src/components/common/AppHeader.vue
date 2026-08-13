<script setup lang="ts">
import { useUserStore } from '../../stores/user'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import AvatarInitials from './AvatarInitials.vue'
import ConfirmModal from './ConfirmModal.vue'
import { staffMockData } from '../../mock/staff'
import { supervisorMockData } from '../../mock/supervisor'
import { hodMockData } from '../../mock/hod'
import { hrMockData } from '../../mock/hr'
import { adminMockData } from '../../mock/admin'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const notifOpen = ref(false)
const notifRef = ref<HTMLElement | null>(null)
const avatarOpen = ref(false)
const avatarRef = ref<HTMLElement | null>(null)
const showLogoutModal = ref(false)

const isStaff = computed(() => userStore.role === 'staff')

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

const onDocClick = (e: MouseEvent) => {
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) notifOpen.value = false
  if (avatarRef.value && !avatarRef.value.contains(e.target as Node)) avatarOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

const goToProfile = () => {
  avatarOpen.value = false
  router.push('/profile')
}

const handleLogout = () => {
  avatarOpen.value = false
  showLogoutModal.value = true
}

const confirmLogout = () => {
  showLogoutModal.value = false
  // In production: clear auth tokens and redirect to login
  alert('Logged out successfully.')
}
</script>

<template>
  <div class="bg-white border-b border-gray-100">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between" style="height: 60px;">

        <!-- Logo: hidden for staff (sidebar has the logo) -->
        <RouterLink v-if="!isStaff" to="/" class="flex items-center shrink-0">
          <img src="/legend-logo.png" alt="Legend" style="height:30px;width:auto;" />
        </RouterLink>

        <!-- Spacer for staff so right-side content stays right-aligned -->
        <div v-if="isStaff" class="flex-1"></div>

        <!-- Right: icons + user -->
        <div class="flex items-center" style="gap: 4px;">

          <!-- Search (hidden on very small screens, hidden for staff) -->
          <button v-if="!isStaff" class="hidden sm:flex items-center justify-center rounded-lg transition-colors w-9 h-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <!-- Notifications -->
          <div ref="notifRef" class="relative">
            <button @click="notifOpen = !notifOpen"
              class="relative flex items-center justify-center rounded-lg transition-colors w-9 h-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="absolute rounded-full bg-primary" style="top:8px;right:8px;width:7px;height:7px;"></span>
            </button>

            <!-- Notification dropdown -->
            <Transition name="slide-down">
              <div v-if="notifOpen" class="absolute card shadow-lg z-50 py-2 max-w-[calc(100vw-2rem)] sm:w-80" style="right:0;top:44px;width:320px;">
                <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <span class="text-sm font-semibold text-gray-900">Notifications</span>
                  <span class="badge badge-orange">3 new</span>
                </div>
                <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  <div v-for="n in [
                    { title: 'Schedule approved', sub: 'Jul 12 schedule approved by Sarah Mitchell', time: '10m ago', dot: '#22c55e' },
                    { title: 'New survey available', sub: 'Q3 Engagement Survey due Jul 20', time: '2h ago', dot: '#FD4F00' },
                    { title: 'Request under review', sub: 'Annual leave request is under HR review', time: '1d ago', dot: '#f59e0b' },
                  ]" :key="n.title" class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <span class="rounded-full shrink-0" :style="{ backgroundColor: n.dot, width: '8px', height: '8px', marginTop: '6px' }"></span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900">{{ n.title }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ n.sub }}</p>
                    </div>
                    <span class="text-xs text-gray-400 shrink-0">{{ n.time }}</span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Chat (hidden on very small screens) -->
          <button class="hidden sm:flex items-center justify-center rounded-lg transition-colors w-9 h-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          <!-- Divider -->
          <div class="hidden sm:block" style="width:1px;height:20px;background:#e5e7eb;margin:0 8px;"></div>

          <!-- User profile + Avatar Dropdown -->
          <div ref="avatarRef" class="relative">
            <button
              @click="avatarOpen = !avatarOpen"
              class="flex items-center cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
              style="gap: 10px;"
            >
              <div class="hidden md:block text-right" style="line-height: 1;">
                <p class="text-sm font-semibold text-gray-900" style="margin-bottom: 2px;">{{ roleUserData.name }}</p>
                <p class="text-xs text-gray-500">{{ roleUserData.jobTitle }}</p>
              </div>
              <AvatarInitials :name="roleUserData.name" size="md" />
            </button>

            <!-- Avatar Dropdown -->
            <Transition name="slide-down">
              <div v-if="avatarOpen" class="absolute right-0 z-50 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden" style="top: 48px; width: 240px;">
                <!-- User info header -->
                <div class="px-4 py-4 border-b border-gray-100">
                  <div class="flex items-center gap-3">
                    <AvatarInitials :name="roleUserData.name" size="lg" />
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ roleUserData.name }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ roleUserData.jobTitle }}</p>
                      <p class="text-xs text-gray-400 truncate">{{ roleUserData.department }}</p>
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div class="h-px bg-gray-100"></div>

                <!-- Menu items -->
                <div class="py-1">
                  <button
                    @click="goToProfile"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                  </button>
                </div>

                <!-- Divider -->
                <div class="h-px bg-gray-100"></div>

                <!-- Logout -->
                <div class="py-1">
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <ConfirmModal
    v-if="showLogoutModal"
    title="Sign out?"
    message="You're about to sign out of your Workplace account."
    confirm-label="Sign Out"
    cancel-label="Cancel"
    @confirm="confirmLogout"
    @cancel="showLogoutModal = false"
  />
</template>
