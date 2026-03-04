import { createRouter, createWebHistory } from 'vue-router'

const DashboardLayout = () => import('../layouts/DashboardLayout.vue')
const PublicLayout = () => import('../layouts/PublicLayout.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Root redirect
    {
      path: '/',
      redirect: '/dashboard',
    },

    // Auth routes (no layout)
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
    },

    // Onboarding
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/onboarding/OnboardingView.vue'),
      meta: { requiresAuth: true },
    },

    // Dashboard routes
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('../views/dashboard/DashboardHome.vue'),
        },
        {
          path: 'watchlist',
          name: 'dashboard-watchlist',
          component: () => import('../views/dashboard/DashboardWatchlist.vue'),
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: () => import('../views/dashboard/DashboardSettings.vue'),
        },
      ],
    },

    // Public Land view (handle-based)
    {
      path: '/:handle',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'land',
          component: () => import('../views/public/LandView.vue'),
          props: true,
        },
      ],
    },

    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../components/public/PublicNotFound.vue'),
    },
  ],
})

export default router
