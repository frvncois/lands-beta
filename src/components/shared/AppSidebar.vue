<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  HomeIcon,
  EyeIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import LandsLogo from '@/assets/LandsLogo.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import CreateLandModal from '@/components/modals/CreateLandModal.vue'
import { useUserStore } from '@/stores/user'
import { useLandStore } from '@/stores/land'
import { useEditorStore } from '@/stores/editor'
import authService from '@/services/auth.service'

const router = useRouter()
const userStore = useUserStore()
const landStore = useLandStore()
const editorStore = useEditorStore()

const collapsed = ref(false)
const userMenuOpen = ref(false)
const showCreateLandModal = ref(false)

function switchLand(landId: string) {
  landStore.setActiveLand(landId)
  editorStore.exitEditMode()
  userMenuOpen.value = false
}

function handleCreateLand() {
  userMenuOpen.value = false
  showCreateLandModal.value = true
}

function onLandCreated(data: { handle: string; title: string }) {
  console.log('Create land:', data)
}

async function handleLogout() {
  userMenuOpen.value = false
  await authService.logout()
  userStore.clearUser()
  landStore.clearLands()
  router.push('/login')
}

const navItems = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/dashboard/watchlist', label: 'Watchlist', icon: EyeIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon },
]
</script>

<template>
  <!-- Desktop sidebar — always visible -->
  <aside
    :class="[
      'hidden md:flex flex-col border-r border-gray-100 bg-white transition-all duration-slow shrink-0',
      collapsed ? 'w-[55px]' : 'w-50',
    ]"
  >
    <!-- Logo -->
    <div
      :class="[
        'flex items-center border-b border-gray-100 shrink-0 h-17',
        collapsed ? 'justify-center' : 'px-4',
      ]"
    >
      <RouterLink to="/dashboard">
        <LandsLogo class="h-6 w-6" />
      </RouterLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 space-y-0.5 p-2 mt-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-600 transition-all duration-fast',
          'hover:bg-gray-100 hover:text-gray-900',
          collapsed && 'justify-center',
        ]"
        active-class="!bg-gray-100 !text-gray-900 font-medium"
      >
        <component :is="item.icon" class="h-4.5 w-4.5 shrink-0" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Bottom: user + collapse -->
    <div class="border-t border-gray-100">
      <!-- User dropdown -->
      <BaseDropdown v-model="userMenuOpen" placement="top-left">
        <template #trigger>
          <button
            :class="[
              'flex items-center gap-3 w-full hover:bg-gray-50 transition-colors duration-fast text-left px-3 py-3',
              collapsed && 'justify-center px-0',
            ]"
          >
            <BaseAvatar
              :src="userStore.user?.avatar_image"
              :alt="userStore.fullName || 'User'"
              size="sm"
              class="shrink-0"
            />
            <div v-if="!collapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate leading-none">{{ userStore.fullName }}</p>
            </div>
          </button>
        </template>
        <template #content>
          <!-- Land switcher -->
          <div class="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Your Lands
          </div>
          <button
            v-for="land in landStore.lands"
            :key="land.id"
            :class="[
              'flex items-center gap-3 w-full px-3 py-2 text-sm rounded-sm transition-colors duration-fast',
              land.id === landStore.activeLandId
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
            @click="switchLand(land.id)"
          >
            <BaseAvatar :src="land.avatar_image" :alt="land.title || land.handle" size="sm" />
            <div class="text-left truncate">
              <div class="truncate">{{ land.title || land.handle }}</div>
              <div class="text-xs text-gray-400 truncate">{{ land.handle }}.lands.app</div>
            </div>
          </button>
          <button
            v-if="landStore.canCreateLand"
            class="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors duration-fast"
            @click="handleCreateLand"
          >
            <PlusIcon class="h-4 w-4" />
            Create new Land
          </button>

          <div class="my-1 border-t border-gray-100" />

          <RouterLink
            to="/dashboard/settings"
            class="block px-3 py-2 text-sm text-gray-700 rounded-sm hover:bg-gray-100 transition-colors duration-fast"
            @click="userMenuOpen = false"
          >
            Settings
          </RouterLink>
          <button
            class="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-sm hover:bg-gray-100 transition-colors duration-fast"
            @click="handleLogout"
          >
            Log out
          </button>
        </template>
      </BaseDropdown>

      <!-- Collapse toggle -->
      <button
        class="flex items-center justify-center py-2.5 w-full text-gray-400 hover:text-gray-600 transition-colors duration-fast border-t border-gray-100"
        @click="collapsed = !collapsed"
      >
        <component :is="collapsed ? ChevronRightIcon : ChevronLeftIcon" class="h-4 w-4" />
      </button>
    </div>
  </aside>

  <!-- Mobile bottom bar — always visible -->
  <nav
    class="md:hidden fixed bottom-0 inset-x-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-dropdown"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 text-gray-400 transition-colors duration-fast"
      active-class="!text-gray-900"
    >
      <component :is="item.icon" class="h-4 w-4" />
      <span class="text-[10px]">{{ item.label }}</span>
    </RouterLink>
  </nav>

  <CreateLandModal v-model="showCreateLandModal" @created="onLandCreated" />
</template>
