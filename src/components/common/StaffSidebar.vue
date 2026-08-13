<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Mobile drawer state
const drawerOpen = ref(false)
const openDrawer = () => { drawerOpen.value = true }
const closeDrawer = () => { drawerOpen.value = false }

watch(() => route.path, closeDrawer)
watch(drawerOpen, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
onMounted(() => document.addEventListener('keydown', onEsc))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
})

interface NavItem {
  label: string
  path: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Overview',        path: '/workplace/overview',  icon: 'overview' },
  { label: 'Daily Schedules', path: '/workplace/schedules', icon: 'schedules' },
  { label: 'Requests',        path: '/workplace/requests',  icon: 'requests' },
  { label: 'Obligations',     path: '/obligations',         icon: 'obligations' },
  { label: 'Resources',       path: '/resources',           icon: 'resources' },
  { label: 'Collaboration',   path: '/collaboration',       icon: 'collaboration' },
]

const isActive = (item: NavItem) => {
  if (item.path === '/workplace/overview') return route.path === '/workplace/overview' || route.path === '/workplace'
  return route.path.startsWith(item.path)
}
</script>

<template>
  <!-- ── Mobile hamburger (visible on small screens) ── -->
  <button
    @click="openDrawer"
    class="lg:hidden fixed top-4 left-4 z-40 flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
    aria-label="Open navigation"
  >
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>

  <!-- ── Backdrop (mobile only) ── -->
  <Transition name="sb-fade">
    <div
      v-if="drawerOpen"
      class="lg:hidden fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
      @click="closeDrawer"
    ></div>
  </Transition>

  <!--
    Desktop: sidebar is a normal grid column (position: sticky so it stays
    visible while scrolling, but does NOT use position:fixed which would
    remove it from flow and leave a ghost gap).

    Mobile: hidden by default; slides in as a fixed drawer when drawerOpen.
  -->
  <aside class="staff-sidebar" :class="{ 'drawer-open': drawerOpen }">
    <!-- Top: Logo -->
    <div class="flex items-center px-4 shrink-0" style="height: 60px; border-bottom: 1px solid #f3f4f6;">
      <RouterLink to="/workplace/overview" @click="closeDrawer">
        <img src="/legend-logo.png" alt="LEGEND Workplace" style="height: 28px; width: auto;" />
      </RouterLink>
      <!-- Mobile close -->
      <button
        @click="closeDrawer"
        class="lg:hidden ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Primary navigation -->
    <nav class="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="closeDrawer"
        :class="[
          'group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
          isActive(item)
            ? 'bg-orange-50 text-orange-600 font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        ]"
        style="text-decoration: none;"
      >
        <!-- Left active indicator -->
        <span
          v-if="isActive(item)"
          class="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style="width: 3px; height: 20px; background: #FD4F00;"
        ></span>

        <!-- Icon -->
        <span class="shrink-0 flex items-center justify-center" style="width: 20px; height: 20px;">
          <svg v-if="item.icon === 'overview'" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <svg v-else-if="item.icon === 'schedules'" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <svg v-else-if="item.icon === 'requests'" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <svg v-else-if="item.icon === 'obligations'" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <svg v-else-if="item.icon === 'resources'" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <svg v-else-if="item.icon === 'collaboration'" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </span>

        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Bottom: subtle branding -->
    <div class="px-4 py-3 shrink-0" style="border-top: 1px solid #f3f4f6;">
      <p class="text-xs text-gray-400">LEGEND Workplace</p>
      <p class="text-xs text-gray-300 mt-0.5">Employee Portal</p>
    </div>
  </aside>
</template>

<style scoped>
/* ── Desktop sidebar: in-flow, sticky ── */
.staff-sidebar {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  width: 228px;
  /* Sticky so it stays visible while the main column scrolls */
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  transition: transform 0.2s ease;
  z-index: 50;
}

/* ── Mobile: hide sidebar, show as fixed drawer ── */
@media (max-width: 1023px) {
  .staff-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  }
  .staff-sidebar.drawer-open {
    transform: translateX(0);
  }
}

.sb-fade-enter-active,
.sb-fade-leave-active {
  transition: opacity 0.2s ease;
}
.sb-fade-enter-from,
.sb-fade-leave-to {
  opacity: 0;
}
</style>
