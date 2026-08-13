<script setup lang="ts">
import AppHeader from './components/common/AppHeader.vue'
import PrimaryNav from './components/common/PrimaryNav.vue'
import StaffSidebar from './components/common/StaffSidebar.vue'
import RoleSwitcher from './components/dev/RoleSwitcher.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from './stores/user'

const route = useRoute()
const userStore = useUserStore()

const isSurveyPage = computed(() => route.path.startsWith('/survey'))
const isStaff = computed(() => userStore.role === 'staff')

// Set to false before deploying to production
const isDev = true
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- ── STAFF LAYOUT: sidebar in flow via CSS Grid ── -->
    <template v-if="!isSurveyPage && isStaff">
      <div class="staff-layout">
        <!-- Sidebar column -->
        <StaffSidebar />

        <!-- Main column: header + content -->
        <div class="staff-main">
          <div class="sticky top-0 z-30">
            <AppHeader />
          </div>
          <main class="flex-1 min-w-0">
            <RouterView />
          </main>
        </div>
      </div>
    </template>

    <!-- ── NON-STAFF LAYOUT: existing top navigation ── -->
    <template v-else-if="!isSurveyPage">
      <div class="sticky top-0 z-40">
        <AppHeader />
        <PrimaryNav />
      </div>
      <main class="flex-1">
        <RouterView />
      </main>
    </template>

    <!-- ── SURVEY LAYOUT: no nav ── -->
    <template v-else>
      <main class="flex-1">
        <RouterView />
      </main>
    </template>

    <!-- DEV ONLY: Role Switcher -->
    <RoleSwitcher v-if="isDev" />
  </div>
</template>

<style>
/* Staff two-column layout using CSS Grid */
.staff-layout {
  display: grid;
  grid-template-columns: 228px 1fr;
  min-height: 100vh;
}

.staff-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

/* On screens narrower than lg (1024px), collapse to single column */
@media (max-width: 1023px) {
  .staff-layout {
    grid-template-columns: 1fr;
  }
}
</style>
