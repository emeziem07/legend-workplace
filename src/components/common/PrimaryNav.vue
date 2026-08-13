<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const userStore = useUserStore()

interface NavLink {
  label: string
  path: string
}

const links = computed(() => {
  const baseLinks: NavLink[] = [
    { label: 'My Workplace', path: '/workplace' },
    { label: 'Obligations', path: '/obligations' },
    { label: 'Resources', path: '/resources' },
    { label: 'Collaboration', path: '/collaboration' },
  ]
  if (userStore.role === 'hr') {
    baseLinks.splice(1, 0, { label: 'Strategy Insights', path: '/strategy-insights' })
    baseLinks[2] = { label: 'Role Hub', path: '/role-hub' }
  }
  return baseLinks
})

const isActive = (path: string) => {
  if (path === '/workplace') return route.path.startsWith('/workplace')
  return route.path.startsWith(path)
}

// Mobile drawer
const mobileOpen = ref(false)

const closeMobile = () => { mobileOpen.value = false }

// Close drawer on route change
watch(() => route.path, closeMobile)

// Lock body scroll when drawer open
watch(mobileOpen, (v) => {
  if (v) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})

const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMobile() }
onMounted(() => document.addEventListener('keydown', onEsc))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
})

// suppress unused warning — userStore is available for future use
void userStore
</script>

<template>
  <div class="bg-white border-b border-gray-200">
    <!-- Desktop / Tablet nav -->
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6">
      <nav class="hidden sm:flex items-stretch -mb-px no-scrollbar" style="height: 52px;">
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="primary-nav-link"
          :class="isActive(link.path) ? 'active' : ''"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>

    <!-- Mobile nav bar -->
    <div class="sm:hidden">
      <div class="flex items-center justify-between px-4" style="height: 48px;">
        <span class="text-sm font-semibold text-gray-900">Menu</span>
        <button @click="mobileOpen = true" class="flex items-center justify-center rounded-lg w-9 h-9 text-gray-600 hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mobileOpen" class="fixed inset-0 z-50 sm:hidden" @click="closeMobile">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
      </Transition>
      <Transition name="mobile-nav">
        <div v-if="mobileOpen" class="fixed top-0 left-0 bottom-0 z-50 bg-white shadow-2xl sm:hidden safe-top" style="width: 280px; max-width: 85vw;" @click.stop>
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span class="text-base font-semibold text-gray-900">Navigation</span>
            <button @click="closeMobile" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <nav class="py-2">
            <RouterLink
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              class="flex items-center justify-between px-5 py-3.5 text-sm transition-colors"
              :class="isActive(link.path) ? 'text-primary font-semibold bg-primary-50' : 'text-gray-600 hover:bg-gray-50'"
            >
              {{ link.label }}
              <svg class="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </RouterLink>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.primary-nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  margin-right: 44px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease;
  position: relative;
}
.primary-nav-link:last-child { margin-right: 0; }
.primary-nav-link:hover { color: #111827; }
.primary-nav-link.active {
  color: #111827;
  font-weight: 600;
  border-bottom-color: #FD4F00;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.mobile-nav-enter-active, .mobile-nav-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.mobile-nav-enter-from, .mobile-nav-leave-to { transform: translateX(-100%); }
</style>
