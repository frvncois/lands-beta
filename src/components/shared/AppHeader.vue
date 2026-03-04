<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  PlusIcon,
  LinkIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  PuzzlePieceIcon,
  CloudArrowUpIcon,
} from '@heroicons/vue/24/outline'
import LandsLogo from '@/assets/LandsLogo.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import CreateLandModal from '@/components/modals/CreateLandModal.vue'
import IntegrationsPanel from '@/components/editor/IntegrationsPanel.vue'
import { useUserStore } from '@/stores/user'
import { useLandStore } from '@/stores/land'
import { useEditorStore } from '@/stores/editor'
import { useToast } from '@/composables/useToast'
import authService from '@/services/auth.service'

const router = useRouter()
const userStore = useUserStore()
const landStore = useLandStore()
const editorStore = useEditorStore()
const { addToast } = useToast()

const userMenuOpen = ref(false)
const showCreateLandModal = ref(false)
const showExitConfirm = ref(false)
const showIntegrations = ref(false)

const activeLand = computed(() => landStore.activeLand)

function switchLand(landId: string) {
  landStore.setActiveLand(landId)
  editorStore.exitEditMode()
  userMenuOpen.value = false
  router.push('/dashboard')
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

async function copyLink() {
  if (!activeLand.value) return
  const url = `https://${activeLand.value.handle}.lands.app`
  try {
    await navigator.clipboard.writeText(url)
    addToast('Link copied to clipboard')
  } catch {
    // silent fail
  }
}

function handleCancel() {
  if (editorStore.isDirty) {
    showExitConfirm.value = true
  } else {
    editorStore.exitEditMode()
  }
}

function confirmExit() {
  editorStore.markClean()
  editorStore.exitEditMode()
}

function handlePublish() {
  editorStore.markClean()
  editorStore.exitEditMode()
  addToast('Changes published')
}
</script>

<template>
  <header class="h-14 bg-white px-4 flex items-center gap-3 shrink-0">
    <!-- Logo + User + project dropdown -->
    <BaseDropdown v-model="userMenuOpen" placement="bottom-left">
      <template #trigger>
        <button class="flex items-center gap-5 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors duration-fast">
          <LandsLogo class="h-5 w-5 shrink-0" />
          <div class="text-left leading-tight">
            <p class="text-sm font-medium text-gray-900">{{ userStore.fullName }}</p>
            <p v-if="activeLand" class="text-xs text-gray-400">{{ activeLand.title || activeLand.handle }}</p>
          </div>
          <ChevronDownIcon class="h-3.5 w-3.5 text-gray-400 shrink-0" />
        </button>
      </template>
      <template #content>
        <!-- Project switcher -->
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
          <div class="text-left min-w-0">
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

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Preview mode actions -->
    <template v-if="activeLand && !editorStore.isEditMode">
      <BaseButton variant="ghost" size="sm" @click="copyLink">
        <LinkIcon class="h-4 w-4" />
        <span class="hidden sm:inline">{{ activeLand.handle }}.lands.app</span>
      </BaseButton>
      <BaseButton variant="outline" size="sm" @click="showIntegrations = !showIntegrations">
        <PuzzlePieceIcon class="h-4 w-4" />
        <span class="hidden sm:inline">Integrations</span>
      </BaseButton>
      <BaseButton variant="solid" size="sm" @click="showIntegrations = false; editorStore.enterEditMode()">
        <PencilSquareIcon class="h-4 w-4" />
        Edit
      </BaseButton>
    </template>

    <!-- Edit mode actions -->
    <template v-else-if="activeLand && editorStore.isEditMode">
      <Transition name="fade">
        <span v-if="editorStore.isDirty" class="flex items-center gap-1.5 text-xs text-gray-400">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
          Unsaved changes
        </span>
      </Transition>
      <BaseButton variant="ghost" size="sm" @click="copyLink">
        <LinkIcon class="h-4 w-4" />
        <span class="hidden sm:inline">{{ activeLand.handle }}.lands.app</span>
      </BaseButton>
      <BaseButton variant="outline" size="sm" @click="handleCancel">
        Cancel
      </BaseButton>
      <BaseButton variant="solid" size="sm" @click="handlePublish">
        <CloudArrowUpIcon class="h-4 w-4" />
        Publish
      </BaseButton>
    </template>
  </header>

  <IntegrationsPanel v-model="showIntegrations" />

  <CreateLandModal v-model="showCreateLandModal" @created="onLandCreated" />

  <ConfirmDialog
    v-model="showExitConfirm"
    title="Exit edit mode"
    message="Any unsaved changes will be lost. Exit anyway?"
    confirm-label="Exit"
    @confirm="confirmExit"
  />
</template>
