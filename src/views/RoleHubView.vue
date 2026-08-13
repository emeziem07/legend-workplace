<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { hrMockData } from '../mock/hr'

const userStore = useUserStore()
const router = useRouter()

const modules = computed(() => {
  if (userStore.role === 'hr') {
    return hrMockData.roleHubModules
  }
  return []
})

const navigateToModule = (moduleId: string, path: string) => {
  if (moduleId === 'obligations') {
    router.push('/obligations')
  } else {
    router.push(path)
  }
}

const getIconComponent = (icon: string) => {
  const iconMap: Record<string, string> = {
    check: 'ClipboardCheck',
    users: 'Users',
    briefcase: 'Target',
    'chart-bar': 'BarChart3',
    gift: 'Trophy',
    'trending-up': 'Map',
    heart: 'Theater',
    'map-pin': 'Network',
    target: 'LineChart',
  }
  return iconMap[icon] || 'ClipboardCheck'
}

const renderIcon = (icon: string) => {
  const iconName = getIconComponent(icon)
  const iconPaths: Record<string, string> = {
    ClipboardCheck: 'M9 12l2 2 4-4M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
    Users: 'M17 20h5v-2a3 3 0 00-5.856-1.487M7 20H2v-2a3 3 0 015.856-1.487M15 7a3 3 0 11-6 0 3 3 0 016 0zM16 16a6 6 0 00-12 0v4h12v-4z',
    Target: 'M13 10V3L4 14h7v7l9-11h-7z',
    BarChart3: 'M18 20V10M12 20V4M6 20v-6',
    Trophy: 'M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z',
    Map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z',
    Theater: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-1-2-2-2zM3.3 6.5h17.4c.77 0 1.3-.63 1.3-1.3V3.5c0-.67-.53-1.3-1.3-1.3H3.3C2.53 2.2 2 2.83 2 3.5v1.7c0 .67.53 1.3 1.3 1.3zM17 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM16.5 5.1H3.5V19h13V5.1z',
    Network: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.13l8.73-5.17M12 22.77v-10.44',
    LineChart: 'M3 3v18h18M18 17V9m-5 8V5m-5 12v-3',
  }
  return iconPaths[iconName] || iconPaths.ClipboardCheck
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <!-- Page Header (no breadcrumb on landing page) -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Role Hub</h1>
      <p class="text-sm text-gray-500 mt-0.5">Strategic leadership modules and organizational management tools</p>
    </div>

    <!-- Modules Grid: 4 columns on desktop, 2 on tablet, 1 on mobile -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <button
        v-for="module in modules"
        :key="module.id"
        @click="navigateToModule(module.id, module.path)"
        class="card p-6 cursor-pointer hover:border-primary-200 hover:shadow-sm transition-all group text-left"
      >
        <!-- Icon: Lucide style matching Resources page -->
        <div class="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="renderIcon(module.icon)" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ module.title }}</h3>

        <!-- Description -->
        <p class="text-xs text-gray-500 leading-relaxed">{{ module.description }}</p>

        <!-- CTA -->
        <div class="mt-4 flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Open Module
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </button>
    </div>
  </div>
</template>
