import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/user'
import type { RolePermissions } from '../stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    permissions?: (keyof RolePermissions)[]
    redirectTo?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workplace/overview',
  },
  {
    path: '/workplace',
    component: () => import('../views/workplace/WorkplaceLayout.vue'),
    redirect: '/workplace/overview',
    children: [
      {
        path: 'overview',
        component: () => import('../views/workplace/OverviewView.vue'),
      },
      {
        path: 'schedules',
        component: () => import('../views/workplace/SchedulesView.vue'),
      },
      {
        path: 'approvals',
        component: () => import('../views/workplace/ApprovalsView.vue'),
        meta: { permissions: ['approve_schedule'] },
      },
      {
        path: 'requests',
        component: () => import('../views/workplace/RequestsView.vue'),
      },
    ],
  },
  {
    path: '/strategy-insights',
    component: () => import('../views/StrategyInsightsView.vue'),
    meta: { breadcrumb: 'Strategy Insights' },
  },
  {
    path: '/obligations',
    component: () => import('../views/ObligationsView.vue'),
    meta: { breadcrumb: 'Obligations' },
  },
  {
    path: '/role-hub',
    component: () => import('../views/RoleHubView.vue'),
  },
  {
    path: '/role-hub/obligations',
    component: () => import('../views/ObligationsView.vue'),
    meta: { breadcrumb: 'Obligations' },
  },
  {
    path: '/role-hub/staff-insights',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Staff Insights' },
  },
  {
    path: '/role-hub/talent-recruitment',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Talent & Recruitment' },
  },
  {
    path: '/role-hub/performance-management',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Performance Management' },
  },
  {
    path: '/role-hub/rewards-welfare',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Rewards & Welfare' },
  },
  {
    path: '/role-hub/career-roadmap',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Career Roadmap' },
  },
  {
    path: '/role-hub/culture-management',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Culture Management' },
  },
  {
    path: '/role-hub/regions-teams',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Regions / Teams / Technicians' },
  },
  {
    path: '/role-hub/strategy-dashboard',
    component: () => import('../views/RoleHubView.vue'),
    meta: { breadcrumb: 'Strategy Dashboard' },
  },
  {
    path: '/resources',
    component: () => import('../views/ResourcesView.vue'),
  },
  {
    path: '/resources/dms',
    component: () => import('../views/DmsView.vue'),
  },
  {
    path: '/resources/customer-insights',
    component: () => import('../views/CustomerInsightsView.vue'),
  },
  {
    path: '/collaboration',
    component: () => import('../views/CollaborationView.vue'),
  },
  {
    path: '/survey/:id',
    component: () => import('../views/SurveyView.vue'),
  },
  {
    path: '/profile',
    component: () => import('../views/ProfileView.vue'),
  },
  {
    path: '/role-hub',
    component: () => import('../views/RoleHubView.vue'),
  },
  {
    path: '/installation-insights',
    component: () => import('../views/InstallationInsightsView.vue'),
  },
  {
    path: '/resources/installation-insights/installations',
    component: () => import('../views/InstallationsBrowseContent.vue'),
  },
  {
    path: '/resources/installation-insights/installations/:id',
    component: () => import('../views/InstallationDetailsView.vue'),
  },
  {
    path: '/resources/customer-profile/:id',
    component: () => import('../views/CustomerProfileView.vue'),
  },
  {
    path: '/resources/knowledge-base',
    component: () => import('../views/KnowledgeBaseView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const requiredPermissions = to.meta.permissions

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAll = requiredPermissions.every(p => userStore.hasPermission(p))
    if (!hasAll) {
      return { path: '/workplace/overview' }
    }
  }

  return true
})

export default router
