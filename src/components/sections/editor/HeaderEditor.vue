<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref, computed } from 'vue'
import { PhotoIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import SectionEditorWrapper from './SectionEditorWrapper.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Section, HeaderContent, HeaderSettings, HeaderCoverSize, HeaderProfilePosition } from '@/types/section'
import { HEADER_COVER_SIZES, HEADER_PROFILE_POSITIONS } from '@/types/section'
import type { Land } from '@/types/land'
import { useEditorStore } from '@/stores/editor'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  section: Section
  content?: HeaderContent | null
  settings: HeaderSettings
  land?: Land
}>()

const editorStore = useEditorStore()
const { updateSectionContent, updateSectionSettings, updateLandImages } = useEditorActions()
const isActive = computed(() => editorStore.activeSection?.id === props.section.id)

const settingsOpen = ref(false)
const showCoverUrlModal = ref(false)
const showAvatarUrlModal = ref(false)
const localTitle = ref(props.content?.title ?? '')
const localSubtitle = ref(props.content?.subtitle ?? '')
const localCoverSize = ref<string>(props.settings.cover_size)
const localProfilePosition = ref<string>(props.settings.profile_position)
const coverUrlInput = ref(props.land?.cover_image ?? '')
const avatarUrlInput = ref(props.land?.avatar_image ?? '')

const coverSizeOptions = [
  { value: HEADER_COVER_SIZES.half, label: 'Half Screen' },
  { value: HEADER_COVER_SIZES.full, label: 'Full Screen' },
]
const profilePositionOptions = [
  { value: HEADER_PROFILE_POSITIONS.overlapping, label: 'Overlapping' },
  { value: HEADER_PROFILE_POSITIONS.below, label: 'Below' },
]

const isOverlapping = computed(() => props.settings.profile_position === 'overlapping')
const displayTitle = computed(() => props.content?.title || props.land?.title || '')
const initial = computed(() => displayTitle.value.charAt(0).toUpperCase() || '?')

function handleSelect() {
  editorStore.setActiveSection(props.section)
}

function saveContent() {
  updateSectionContent(props.section.id, { title: localTitle.value, subtitle: localSubtitle.value })
}

function saveSettings() {
  updateSectionSettings(props.section.id, {
    cover_size: localCoverSize.value as HeaderCoverSize,
    profile_position: localProfilePosition.value as HeaderProfilePosition,
  })
  settingsOpen.value = false
}

function saveCoverUrl() {
  updateLandImages({ cover_image: coverUrlInput.value })
  showCoverUrlModal.value = false
}

function saveAvatarUrl() {
  updateLandImages({ avatar_image: avatarUrlInput.value })
  showAvatarUrlModal.value = false
}
</script>

<template>
  <SectionEditorWrapper
    :section="section"
    :is-active="isActive"
    @select="handleSelect"
  >
    <!-- Cover -->
    <div :class="['relative w-full overflow-hidden group/cover', settings.cover_size === 'full' ? 'h-screen' : 'h-[50vh]']">
      <img v-if="land?.cover_image" :src="land.cover_image" alt="Cover" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full bg-gray-100" />

      <!-- Cover edit overlay -->
      <button
        v-if="isActive"
        class="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity duration-fast"
        @click.stop="coverUrlInput = land?.cover_image ?? ''; showCoverUrlModal = true"
      >
        <PhotoIcon class="h-8 w-8 text-white" />
        <span class="text-white text-sm mt-1">Change cover</span>
      </button>

      <!-- Overlapping avatar inside cover -->
      <div v-if="isOverlapping" class="absolute bottom-0 left-0 px-6 md:px-8 translate-y-1/2">
        <div class="relative group/avatar inline-block">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            <img v-if="land?.avatar_image" :src="land.avatar_image" alt="Avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">{{ initial }}</div>
          </div>
          <button
            v-if="isActive"
            class="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-fast"
            @click.stop="avatarUrlInput = land?.avatar_image ?? ''; showAvatarUrlModal = true"
          >
            <PhotoIcon class="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content area -->
    <div class="px-6 md:px-8 max-w-4xl">
      <div v-if="isOverlapping" class="pt-14 md:pt-18" />

      <!-- Below avatar -->
      <div v-else class="mt-6">
        <div class="relative group/avatar inline-block">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            <img v-if="land?.avatar_image" :src="land.avatar_image" alt="Avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">{{ initial }}</div>
          </div>
          <button
            v-if="isActive"
            class="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-fast"
            @click.stop="avatarUrlInput = land?.avatar_image ?? ''; showAvatarUrlModal = true"
          >
            <PhotoIcon class="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      <!-- Title -->
      <div class="mt-4">
        <input
          v-if="isActive"
          v-model="localTitle"
          class="w-full text-2xl md:text-4xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
          placeholder="Title"
          @blur="saveContent"
          @click.stop
        />
        <h1 v-else class="text-2xl md:text-4xl font-bold text-gray-900">{{ displayTitle }}</h1>
      </div>

      <!-- Subtitle -->
      <div class="mt-2">
        <input
          v-if="isActive"
          v-model="localSubtitle"
          class="w-full text-lg text-gray-500 bg-transparent border-none outline-none focus:ring-0 p-0"
          placeholder="Subtitle"
          @blur="saveContent"
          @click.stop
        />
        <p v-else-if="content?.subtitle" class="text-lg text-gray-500">{{ content.subtitle }}</p>
      </div>

      <p v-if="land?.description" class="text-base text-gray-600 mt-3">{{ land.description }}</p>

    </div>
  </SectionEditorWrapper>

  <!-- Settings modal -->
  <BaseModal v-model="settingsOpen" title="Header Settings" size="sm">
    <div class="space-y-4">
      <BaseSelect v-model="localCoverSize" label="Cover Size" :options="coverSizeOptions" />
      <BaseSelect v-model="localProfilePosition" label="Profile Position" :options="profilePositionOptions" />
    </div>
    <div class="flex justify-end gap-3 mt-6">
      <BaseButton variant="ghost" @click="settingsOpen = false">Cancel</BaseButton>
      <BaseButton variant="solid" @click="saveSettings">Apply</BaseButton>
    </div>
  </BaseModal>

  <!-- Cover URL modal -->
  <BaseModal v-model="showCoverUrlModal" title="Set cover image" size="sm">
    <BaseInput v-model="coverUrlInput" label="Image URL" placeholder="https://..." />
    <div class="flex justify-end gap-3 mt-6">
      <BaseButton variant="ghost" @click="showCoverUrlModal = false">Cancel</BaseButton>
      <BaseButton variant="solid" @click="saveCoverUrl">Apply</BaseButton>
    </div>
  </BaseModal>

  <!-- Avatar URL modal -->
  <BaseModal v-model="showAvatarUrlModal" title="Set avatar image" size="sm">
    <BaseInput v-model="avatarUrlInput" label="Image URL" placeholder="https://..." />
    <div class="flex justify-end gap-3 mt-6">
      <BaseButton variant="ghost" @click="showAvatarUrlModal = false">Cancel</BaseButton>
      <BaseButton variant="solid" @click="saveAvatarUrl">Apply</BaseButton>
    </div>
  </BaseModal>
</template>
