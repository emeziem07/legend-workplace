<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'
import type { UserRole } from '../../stores/user'

const userStore = useUserStore()
const open = ref(false)

const roles: { key: UserRole; label: string }[] = [
  { key: 'staff', label: 'Staff' },
  { key: 'supervisor', label: 'Supervisor' },
  { key: 'hod', label: 'Head of Department' },
  { key: 'hr', label: 'Head of Strategy' },
  { key: 'admin', label: 'Administrator' },
]

const selectRole = (key: UserRole) => {
  userStore.setRole(key)
  open.value = false
}
</script>

<template>
  <!-- DEV ONLY: Remove this component before production -->
  <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

    <!-- Popup menu -->
    <Transition name="role-popup">
      <div
        v-if="open"
        class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        style="min-width: 220px;"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-xs font-bold text-gray-400 tracking-widest uppercase">DEV · ROLE PREVIEW</p>
        </div>

        <!-- Role list -->
        <div class="py-1.5">
          <button
            v-for="r in roles"
            :key="r.key"
            @click="selectRole(r.key)"
            class="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors"
            :class="userStore.role === r.key
              ? 'bg-orange-50 text-orange-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50'"
          >
            <span>{{ r.label }}</span>
            <!-- Orange checkmark for selected -->
            <svg
              v-if="userStore.role === r.key"
              width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round"
              class="text-orange-500 shrink-0"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Floating pill trigger -->
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-gray-200 text-sm font-medium text-gray-700 hover:shadow-xl transition-shadow select-none"
    >
      <!-- User icon -->
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      <span>Role: <span class="font-semibold">{{ userStore.roleLabel }}</span></span>
      <!-- Chevron -->
      <svg
        width="14" height="14" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="2"
        class="text-gray-400 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.role-popup-enter-active,
.role-popup-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.role-popup-enter-from,
.role-popup-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
