import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const AUTH_PAGES = ['login', 'register', 'forgot-password', 'reset-password']

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const userStore = useUserStore()
    const authStore = useAuthStore()

    const isAuthenticated = userStore.isAuthenticated
    const needsOnboarding = authStore.needsOnboarding

    // Onboarding gate: authenticated but hasn't completed onboarding
    if (isAuthenticated && needsOnboarding && to.name !== 'onboarding') {
      return { name: 'onboarding' }
    }

    // Auth gate: route requires auth but user is not authenticated
    if (to.meta.requiresAuth && !isAuthenticated) {
      return { name: 'login' }
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && AUTH_PAGES.includes(to.name as string)) {
      return needsOnboarding ? { name: 'onboarding' } : { name: 'dashboard-home' }
    }
  })
}
