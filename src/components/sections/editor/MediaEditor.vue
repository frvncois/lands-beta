<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/outline'
import SectionEditorWrapper from './SectionEditorWrapper.vue'
import MediaUploadModal from '@/components/modals/MediaUploadModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { sortByPosition } from '@/lib/utils/position'
import type { Section, MediaContent, MediaSettings, MediaItem } from '@/types/section'
import { MEDIA_TYPES } from '@/types/section'
import { useEditorStore } from '@/stores/editor'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  section: Section
  content?: MediaContent | null
  settings: MediaSettings
}>()

const editorStore = useEditorStore()
const { addMediaItem, updateMediaItem, deleteMediaItem } = useEditorActions()
const isActive = computed(() => editorStore.activeSection?.id === props.section.id)
const showUploadModal = ref(false)
const editingItem = ref<MediaItem | null>(null)
const sortedItems = computed(() => sortByPosition(props.content?.items ?? []))

function handleSelect() {
  editorStore.setActiveSection(props.section)
}

function openEdit(item: MediaItem) {
  editingItem.value = item
  showUploadModal.value = true
}

function openAdd() {
  editingItem.value = null
  showUploadModal.value = true
}

function handleSaveItem(item: MediaItem) {
  if (editingItem.value) {
    updateMediaItem(props.section.id, item.id, {
      media_type: item.media_type,
      url: item.url,
      caption: item.caption,
    })
  } else {
    addMediaItem(props.section.id, {
      media_type: item.media_type,
      url: item.url,
      caption: item.caption,
    })
  }
  showUploadModal.value = false
  editingItem.value = null
}
</script>

<template>
  <SectionEditorWrapper
    :section="section"
    :is-active="isActive"
    @select="handleSelect"
  >
    <div class="max-w-4xl px-6 md:px-8 py-8">
      <!-- Gallery with edit/delete overlays -->
      <div v-if="sortedItems.length > 0" :class="sortedItems.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''">
        <div v-for="item in sortedItems" :key="item.id" class="relative group/item">
          <img
            v-if="item.media_type === MEDIA_TYPES.image"
            :src="item.url"
            :alt="item.caption"
            class="rounded-md object-cover w-full"
            :class="sortedItems.length > 1 ? 'aspect-square' : ''"
          />
          <div v-else class="aspect-video rounded-md bg-gray-100" />
          <p v-if="item.caption" class="text-sm text-gray-500 mt-2">{{ item.caption }}</p>

          <!-- Edit/delete overlay -->
          <div
            v-if="isActive"
            class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-fast"
          >
            <button
              class="p-1.5 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-gray-700 transition-colors duration-fast"
              @click.stop="openEdit(item)"
            >
              <PencilIcon class="h-3.5 w-3.5" />
            </button>
            <button
              class="p-1.5 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-danger transition-colors duration-fast"
              @click.stop="deleteMediaItem(section.id, item.id)"
            >
              <TrashIcon class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Add media button -->
      <BaseButton
        v-if="isActive"
        variant="ghost"
        class="mt-4 border border-dashed border-gray-200 w-full justify-center"
        @click.stop="openAdd"
      >
        <PlusIcon class="h-4 w-4" />
        Add media
      </BaseButton>
    </div>
  </SectionEditorWrapper>

  <MediaUploadModal
    v-model="showUploadModal"
    :edit-item="editingItem"
    @save="handleSaveItem"
  />
</template>
