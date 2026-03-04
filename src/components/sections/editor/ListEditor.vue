<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref, computed, watch } from 'vue'
import { PlusIcon, Cog6ToothIcon, TrashIcon, ArrowUpRightIcon } from '@heroicons/vue/24/outline'
import draggable from 'vuedraggable'
import SectionEditorWrapper from './SectionEditorWrapper.vue'
import EditListItemModal from '@/components/modals/EditListItemModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDragHandle from '@/components/ui/BaseDragHandle.vue'
import { sortByPosition } from '@/lib/utils/position'
import { getFaviconUrl } from '@/lib/utils/favicon'
import { useDragSort } from '@/composables/useDragSort'
import type { Section, ListSettings } from '@/types/section'
import { LIST_STYLES } from '@/types/section'
import type { ListItem } from '@/types/list'
import { useEditorStore } from '@/stores/editor'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  section: Section
  settings: ListSettings
  listItems?: ListItem[]
}>()

const editorStore = useEditorStore()
const { addListItem, updateListItem, deleteListItem, reorderListItem } = useEditorActions()
const isActive = computed(() => editorStore.activeSection?.id === props.section.id)
const showItemModal = ref(false)
const editingItem = ref<ListItem | null>(null)

const sortedItems = computed(() => sortByPosition(props.listItems ?? []))
const localItems = ref<ListItem[]>([...sortedItems.value])

watch(sortedItems, (val) => {
  localItems.value = [...val]
})

const isCompact = computed(() => props.settings?.style === LIST_STYLES.compact)

const { isDragging, onDragStart, onDragEnd } = useDragSort(
  () => localItems.value,
  (itemId, newPosition) => {
    reorderListItem(props.section.id, itemId, newPosition)
  },
)

function handleSelect() {
  editorStore.setActiveSection(props.section)
}

function openEdit(item: ListItem) {
  editingItem.value = item
  showItemModal.value = true
}

function openAdd() {
  editingItem.value = null
  showItemModal.value = true
}

function handleSave(item: ListItem) {
  if (editingItem.value) {
    updateListItem(props.section.id, item.id, {
      title: item.title,
      url: item.url,
      description: item.description,
      icon: item.icon,
    })
  } else {
    addListItem(props.section.id, {
      title: item.title,
      url: item.url,
      description: item.description,
      icon: item.icon,
    })
  }
  showItemModal.value = false
}

function handleDeleteItem() {
  if (editingItem.value) deleteListItem(props.section.id, editingItem.value.id)
  showItemModal.value = false
}
</script>

<template>
  <SectionEditorWrapper
    :section="section"
    :is-active="isActive"
    @select="handleSelect"
  >
    <div class="px-6 md:px-8 max-w-2xl py-8">
      <draggable
        v-model="localItems"
        item-key="id"
        handle=".list-drag-handle"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        class="flex flex-col gap-1"
        :class="isDragging && 'drag-active'"
        :disabled="!isActive"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element: item }">
          <div
            :class="['flex items-center gap-2 rounded-md hover:bg-gray-50 transition-colors duration-fast group/item', isCompact ? 'p-2' : 'p-3']"
          >
            <BaseDragHandle v-if="isActive" class="list-drag-handle opacity-0 group-hover/item:opacity-100 shrink-0" />

            <!-- Icon -->
            <div class="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                v-if="item.icon || item.url"
                :src="item.icon || getFaviconUrl(item.url)"
                :alt="item.title"
                class="w-4 h-4 object-contain"
                @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
              />
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <p :class="['font-medium text-gray-900 truncate', isCompact ? 'text-xs' : 'text-sm']">
                {{ item.title }}
              </p>
              <p v-if="!isCompact && item.description" class="text-sm text-gray-500 truncate">
                {{ item.description }}
              </p>
            </div>

            <!-- Item actions (editor) or arrow (display) -->
            <div v-if="isActive" class="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-fast shrink-0">
              <button
                class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors duration-fast rounded-sm hover:bg-gray-100"
                @click.stop="openEdit(item)"
              >
                <Cog6ToothIcon class="h-4 w-4" />
              </button>
              <button
                class="p-1.5 text-gray-400 hover:text-danger transition-colors duration-fast rounded-sm hover:bg-gray-100"
                @click.stop="deleteListItem(section.id, item.id)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <ArrowUpRightIcon v-else class="h-4 w-4 text-gray-400 shrink-0" />
          </div>
        </template>
      </draggable>

      <!-- Add link button -->
      <BaseButton
        v-if="isActive"
        variant="ghost"
        class="mt-4 border border-dashed border-gray-200 w-full justify-center"
        @click.stop="openAdd"
      >
        <PlusIcon class="h-4 w-4" />
        Add link
      </BaseButton>
    </div>
  </SectionEditorWrapper>

  <EditListItemModal
    v-model="showItemModal"
    :edit-item="editingItem"
    @save="handleSave"
    @delete="handleDeleteItem"
  />
</template>
