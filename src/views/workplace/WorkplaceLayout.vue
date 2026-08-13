<script setup lang="ts">
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router'
import { computed, watchEffect } from 'vue'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface SubLink {
  label: string
  path: string
}

const subLinks = computed<SubLink[]>(() => {
  const links: SubLink[] = [
    { label: 'Overview', path: '/workplace/overview' },
    { label: 'Daily Schedules', path: '/workplace/schedules' },
  ]

  if (userStore.role !== 'staff') {
    links.push({ label: 'Approvals', path: '/workplace/approvals' })
  }

  links.push({ label: 'Requests', path: '/workplace/requests' })

  return links
})

const isActive = (path: string) => route.path === path

watchEffect(() => {
  const paths = subLinks.value.map(l => l.path)
  if (route.path.startsWith('/workplace/') && !paths.includes(route.path)) {
    router.replace('/workplace/overview')
  }
})

const isStaff = computed(() => userStore.role === 'staff')
</script>

<template>
  <div class="w-full min-w-0">
    <!-- Workplace Module Navigation — hidden for Staff (sidebar handles it) -->
    <div v-if="!isStaff" class="bg-white border-b border-gray-200">
      <div class="px-4 sm:px-6">
        <nav class="flex items-stretch -mb-px overflow-x-auto no-scrollbar" style="height: 46px;">
          <RouterLink
            v-for="link in subLinks"
            :key="link.path"
            :to="link.path"
            class="module-nav-link"
            :class="isActive(link.path) ? 'active' : ''"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- Page Content: full width of the available column -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 w-full min-w-0">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.module-nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  margin-right: 36px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease;
  flex-shrink: 0;
}
.module-nav-link:last-child {
  margin-right: 0;
}
.module-nav-link:hover {
  color: #374151;
}
.module-nav-link.active {
  color: #111827;
  font-weight: 600;
  border-bottom-color: #FD4F00;
}
</style>
