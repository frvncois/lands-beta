<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref, computed, watch } from 'vue'
import { PlusIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/vue/24/outline'
import draggable from 'vuedraggable'
import SectionEditorWrapper from './SectionEditorWrapper.vue'
import EditCollectionModal from '@/components/modals/EditCollectionModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDragHandle from '@/components/ui/BaseDragHandle.vue'
import { sortByPosition } from '@/lib/utils/position'
import { useDragSort } from '@/composables/useDragSort'
import type { Section, CollectionSettings } from '@/types/section'
import { COLLECTION_DISPLAY_STYLES } from '@/types/section'
import type { Collection, CollectionItem } from '@/types/collection'
import { useEditorStore } from '@/stores/editor'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  section: Section
  settings: CollectionSettings
  collections?: Collection[]
}>()

const editorStore = useEditorStore()
const { addCollectionItem, updateCollectionItem, deleteCollectionItem, reorderCollectionItem } = useEditorActions()

const isActive = computed(() => editorStore.activeSection?.id === props.section.id)

// A collection section has exactly one implicit collection as the data container
const defaultCollection = computed(() => props.collections?.[0])

const sortedItems = computed(() => sortByPosition(defaultCollection.value?.items ?? []))
const localItems = ref<CollectionItem[]>([...sortedItems.value])

watch(sortedItems, (val) => {
  localItems.value = [...val]
})

const showItemModal = ref(false)
const editingItem = ref<CollectionItem | null>(null)

const gridColsClass = computed(() => {
  const cols = props.settings?.columns ?? 3
  if (cols === 2) return 'grid-cols-1 md:grid-cols-2'
  if (cols === 4) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
})

const { isDragging, onDragStart, onDragEnd } = useDragSort(
  () => localItems.value,
  (itemId, newPosition) => {
    if (!defaultCollection.value) return
    reorderCollectionItem(props.section.id, defaultCollection.value.id, itemId, newPosition)
  },
)

function handleSelect() {
  editorStore.setActiveSection(props.section)
}

function openAdd() {
  editingItem.value = null
  showItemModal.value = true
}

function openEdit(item: CollectionItem) {
  editingItem.value = item
  showItemModal.value = true
}

function handleSaveItem(item: CollectionItem) {
  if (!defaultCollection.value) return
  if (editingItem.value) {
    updateCollectionItem(props.section.id, defaultCollection.value.id, item.id, {
      title: item.title,
      description: item.description,
      media_url: item.media_url,
      external_url: item.external_url,
    })
  } else {
    addCollectionItem(props.section.id, defaultCollection.value.id, {
      title: item.title,
      description: item.description,
      media_url: item.media_url,
      external_url: item.external_url,
    })
  }
  showItemModal.value = false
}

function handleDeleteItem() {
  if (!defaultCollection.value || !editingItem.value) return
  deleteCollectionItem(props.section.id, defaultCollection.value.id, editingItem.value.id)
  showItemModal.value = false
}
</script>

<template>
  <SectionEditorWrapper
    :section="section"
    :is-active="isActive"
    @select="handleSelect"
  >
    <div class="px-6 md:px-8 py-8">
      <draggable
        v-model="localItems"
        item-key="id"
        handle=".item-drag-handle"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        :disabled="!isActive"
        :class="[
          isDragging && 'drag-active',
          settings?.style === COLLECTION_DISPLAY_STYLES.grid ? `grid gap-4 ${gridColsClass}` : '',
          settings?.style === COLLECTION_DISPLAY_STYLES.list ? 'flex flex-col gap-2' : '',
          settings?.style === COLLECTION_DISPLAY_STYLES.cards ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : '',
        ]"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element: item }">
          <div class="relative group/item">
            <BaseDragHandle
              v-if="isActive"
              class="item-drag-handle absolute top-1 left-1 z-10 opacity-0 group-hover/item:opacity-100"
            />

            <!-- Thumbnail -->
            <div
              :class="[
                'overflow-hidden rounded-md bg-gray-100',
                settings?.style === COLLECTION_DISPLAY_STYLES.cards ? 'aspect-video' :
                settings?.style === COLLECTION_DISPLAY_STYLES.list ? 'w-12 h-12 shrink-0' :
                'aspect-square',
              ]"
            >
              <img v-if="item.media_url" :src="item.media_url" :alt="item.title" class="w-full h-full object-cover" />
            </div>
            <p class="text-sm font-medium text-gray-900 mt-2 truncate">{{ item.title }}</p>

            <!-- Edit/delete overlay -->
            <div
              v-if="isActive"
              class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-fast"
            >
              <button
                class="p-1.5 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-gray-700 transition-colors duration-fast"
                @click.stop="openEdit(item)"
              >
                <Cog6ToothIcon class="h-3.5 w-3.5" />
              </button>
              <button
                class="p-1.5 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-danger transition-colors duration-fast"
                @click.stop="deleteCollectionItem(section.id, defaultCollection?.id ?? '', item.id)"
              >
                <TrashIcon class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </template>
      </draggable>

      <!-- Add item -->
      <BaseButton
        v-if="isActive"
        variant="ghost"
        class="mt-4 border border-dashed border-gray-200 w-full justify-center"
        @click.stop="openAdd"
      >
        <PlusIcon class="h-4 w-4" />
        Add item
      </BaseButton>
    </div>
  </SectionEditorWrapper>

  <EditCollectionModal
    v-model="showItemModal"
    :edit-item="editingItem"
    @save="handleSaveItem"
    @delete="handleDeleteItem"
  />
</template>
