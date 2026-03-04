<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { ChevronRightIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BaseDragHandle from '@/components/ui/BaseDragHandle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AddSectionModal from '@/components/modals/AddSectionModal.vue'
import EditListItemModal from '@/components/modals/EditListItemModal.vue'
import SectionSettingsModal from '@/components/modals/SectionSettingsModal.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { useLandStore } from '@/stores/land'
import { useEditorStore } from '@/stores/editor'
import { useEditorActions } from '@/composables/useEditorActions'
import { useDragSort } from '@/composables/useDragSort'
import { sortByPosition, generatePositionAfter } from '@/lib/utils/position'
import { mockState, getMockListItems, getMockCollections } from '@/lib/mock/provider'
import { SECTION_TYPES, type Section, type SectionType } from '@/types/section'
import type { ListItem } from '@/types/list'

const landStore = useLandStore()
const editorStore = useEditorStore()
const { addSection, deleteSection, deleteListItem, deleteCollectionItem, updateListItem } = useEditorActions()

const showAddModal = ref(false)
const expanded = ref<Record<string, boolean>>({})

const showSectionSettings = ref(false)
const settingsSection = ref<Section | null>(null)
const showDeleteSection = ref(false)
const deletingSection = ref<Section | null>(null)

function openSectionSettings(section: Section) {
  settingsSection.value = section
  showSectionSettings.value = true
}

function confirmDeleteSection(section: Section) {
  deletingSection.value = section
  showDeleteSection.value = true
}

const showEditListItem = ref(false)
const editingListItem = ref<ListItem | null>(null)
const editingListSectionId = ref<string | null>(null)

function openEditListItem(sectionId: string, item: ListItem) {
  editingListSectionId.value = sectionId
  editingListItem.value = item
  showEditListItem.value = true
}

function handleSaveListItem(item: ListItem) {
  if (!editingListSectionId.value) return
  updateListItem(editingListSectionId.value, item.id, {
    title: item.title,
    url: item.url,
    description: item.description,
    icon: item.icon,
  })
  showEditListItem.value = false
}

function handleDeleteListItem() {
  if (editingListSectionId.value && editingListItem.value) {
    deleteListItem(editingListSectionId.value, editingListItem.value.id)
  }
  showEditListItem.value = false
}

function handleAdd(type: SectionType) {
  const position = generatePositionAfter(sortedSections.value[sortedSections.value.length - 1]?.position ?? null)
  addSection(type, position)
}

const sortedSections = computed(() => {
  if (!landStore.activeLand) return []
  return sortByPosition(landStore.activeLand.sections)
})

const localSections = ref<Section[]>([...sortedSections.value])

watch(sortedSections, (val) => {
  localSections.value = [...val]
})

const { isDragging, onDragStart, onDragEnd } = useDragSort(
  () => localSections.value,
  (sectionId, newPosition) => {
    const land = mockState.lands.find((l) => l.id === landStore.activeLandId)
    const section = land?.sections.find((s) => s.id === sectionId)
    if (section) section.position = newPosition
  },
)

function getSectionLabel(type: string): string {
  const labels: Record<string, string> = {
    [SECTION_TYPES.header]: 'Header',
    [SECTION_TYPES.text]: 'Text',
    [SECTION_TYPES.media]: 'Media',
    [SECTION_TYPES.list]: 'Links',
    [SECTION_TYPES.collection]: 'Collection',
  }
  return labels[type] || type
}

function getChildren(section: Section) {
  if (section.type === SECTION_TYPES.list) {
    return sortByPosition(getMockListItems(section.id)).map((item) => ({
      id: item.id,
      label: item.title || item.url || 'Untitled link',
      type: 'list' as const,
      raw: item,
    }))
  }
  if (section.type === SECTION_TYPES.collection) {
    const col = getMockCollections(section.id)[0]
    if (!col) return []
    return sortByPosition(col.items).map((item) => ({
      id: item.id,
      label: item.title || 'Untitled item',
      type: 'collection' as const,
      collectionId: col.id,
      raw: item,
    }))
  }
  return []
}

function selectSection(section: Section) {
  editorStore.setActiveSection(section)
  document
    .querySelector(`[data-section-id="${section.id}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
</script>

<template>
  <div>
    <draggable
      v-model="localSections"
      item-key="id"
      handle=".panel-drag-handle"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
      class="flex flex-col gap-0.5"
      :class="isDragging && 'drag-active'"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <template #item="{ element: section }">
        <div>
          <!-- Section row -->
          <div
            :class="[
              'group/section flex items-center gap-1 w-full rounded-md text-sm transition-all duration-fast',
              editorStore.activeSection?.id === section.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50',
            ]"
          >
            <!-- Expand toggle (only for list/collection with children) -->
            <button
              v-if="getChildren(section).length > 0"
              class="flex items-center justify-center h-8 w-5 shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-fast"
              @click.stop="expanded[section.id] = !expanded[section.id]"
            >
              <ChevronRightIcon
                :class="['h-3 w-3 transition-transform duration-fast', expanded[section.id] && 'rotate-90']"
              />
            </button>
            <span v-else class="w-5 shrink-0" />

            <!-- Drag handle + label (click selects section) -->
            <button
              class="flex items-center gap-2 flex-1 py-2 text-left"
              :class="editorStore.activeSection?.id === section.id ? 'font-medium' : 'font-normal'"
              @click="selectSection(section)"
            >
              <BaseDragHandle class="panel-drag-handle" />
              <span>{{ getSectionLabel(section.type) }}</span>
            </button>

            <!-- Section actions -->
            <div class="flex items-center gap-0.5 opacity-0 group-hover/section:opacity-100 transition-opacity duration-fast shrink-0 pr-1">
              <button
                class="p-1 text-gray-400 hover:text-gray-700 rounded-sm hover:bg-gray-200 transition-colors duration-fast"
                @click.stop="openSectionSettings(section)"
              >
                <Cog6ToothIcon class="h-3 w-3" />
              </button>
              <button
                class="p-1 text-gray-400 hover:text-danger rounded-sm hover:bg-gray-200 transition-colors duration-fast"
                @click.stop="confirmDeleteSection(section)"
              >
                <TrashIcon class="h-3 w-3" />
              </button>
            </div>
          </div>

          <!-- Children -->
          <div v-if="expanded[section.id] && getChildren(section).length > 0" class="ml-6 mt-0.5 flex flex-col gap-0.5">
            <div
              v-for="child in getChildren(section)"
              :key="child.id"
              class="group/child flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-fast cursor-pointer"
              @click="selectSection(section)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              <span class="flex-1 truncate">{{ child.label }}</span>
              <div class="flex items-center gap-0.5 opacity-0 group-hover/child:opacity-100 transition-opacity duration-fast shrink-0">
                <button
                  class="p-1 text-gray-400 hover:text-gray-700 rounded-sm hover:bg-gray-200 transition-colors duration-fast"
                  @click.stop="child.type === 'list' ? openEditListItem(section.id, child.raw) : selectSection(section)"
                >
                  <Cog6ToothIcon class="h-3 w-3" />
                </button>
                <button
                  class="p-1 text-gray-400 hover:text-danger rounded-sm hover:bg-gray-200 transition-colors duration-fast"
                  @click.stop="child.type === 'list' ? deleteListItem(section.id, child.id) : deleteCollectionItem(section.id, (child as any).collectionId, child.id)"
                >
                  <TrashIcon class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <div v-if="sortedSections.length === 0" class="text-center py-6">
      <p class="text-sm text-gray-400">No sections yet</p>
    </div>

    <BaseButton
      variant="ghost"
      size="sm"
      class="mt-3 w-full border border-dashed border-gray-200 justify-center"
      @click="showAddModal = true"
    >
      + Add section
    </BaseButton>
  </div>

  <AddSectionModal v-model="showAddModal" @add="handleAdd" />

  <SectionSettingsModal
    v-if="settingsSection"
    v-model="showSectionSettings"
    :section="settingsSection"
  />

  <ConfirmDialog
    v-model="showDeleteSection"
    title="Delete section"
    message="Delete this section? This cannot be undone."
    confirm-label="Delete"
    :destructive="true"
    @confirm="deletingSection && deleteSection(deletingSection.id)"
  />

  <EditListItemModal
    v-model="showEditListItem"
    :edit-item="editingListItem"
    @save="handleSaveListItem"
    @delete="handleDeleteListItem"
  />
</template>
