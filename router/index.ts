import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded layouts
const DashboardLayout = () => import('../../layouts/DashboardLayout.vue')
const EditorLayout = () => import('../../layouts/EditorLayout.vue')
const PublicLayout = () => import('../../layouts/PublicLayout.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth routes (no layout)
    {
      path: '/login',
      name: 'login',
      component: () => import('../../views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../../views/auth/RegisterView.vue')
    },

    // Dashboard routes
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('../../views/dashboard/DashboardHome.vue')
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: () => import('../../views/dashboard/DashboardSettings.vue')
        },
        {
          path: 'watchlist',
          name: 'dashboard-watchlist',
          component: () => import('../../views/dashboard/DashboardWatchlist.vue')
        }
      ]
    },

    // Editor routes
    {
      path: '/editor',
      component: EditorLayout,
      children: [
        {
          path: '',
          name: 'editor',
          component: () => import('../../views/editor/EditorView.vue')
        }
      ]
    },

    // Public Land view (catch-all for username slugs)
    {
      path: '/:username',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'land',
          component: () => import('../../views/public/LandView.vue'),
          props: true
        }
      ]
    }
  ]
})

export default router
