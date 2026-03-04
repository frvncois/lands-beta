<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import type { Land } from '@/types/land'
import type { Section } from '@/types/section'
import SectionRenderer from '@/components/sections/SectionRenderer.vue'
import SectionInserter from '@/components/sections/editor/SectionInserter.vue'
import { sortByPosition } from '@/lib/utils/position'
import { getMockListItems, getMockCollections, mockState } from '@/lib/mock/provider'
import { useDragSort } from '@/composables/useDragSort'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  land: Land
  mode: 'display' | 'editor'
}>()

const theme = computed(() => props.land.theme)
const { wrapperStyle } = useTheme(theme)

const sortedSections = computed(() => sortByPosition(props.land.sections))

// Local ref for vuedraggable v-model (reflects drag order)
const localSections = ref<Section[]>([...sortedSections.value])

watch(sortedSections, (val) => {
  localSections.value = [...val]
})

const { isDragging, onDragStart, onDragEnd } = useDragSort(
  () => localSections.value,
  (sectionId, newPosition) => {
    const land = mockState.lands.find((l) => l.id === props.land.id)
    const section = land?.sections.find((s) => s.id === sectionId)
    if (section) section.position = newPosition
  },
)

</script>

<template>
  <div class="min-h-full" :class="isDragging && 'drag-active'" :style="wrapperStyle">
    <!-- Editor mode: draggable sections -->
    <template v-if="mode === 'editor'">


      <draggable
        v-model="localSections"
        item-key="id"
        handle=".section-drag-handle"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element: section, index }">
          <div>
            <SectionRenderer
              :section="section"
              :land="land"
              :list-items="getMockListItems(section.id)"
              :collections="getMockCollections(section.id)"
              mode="editor"
            />
            <SectionInserter
              :before="section.position"
              :after="localSections[index + 1]?.position || null"
            />
          </div>
        </template>
      </draggable>
    </template>

    <!-- Display mode: static list -->
    <template v-else>
      <SectionRenderer
        v-for="section in sortedSections"
        :key="section.id"
        :section="section"
        :land="land"
        :list-items="getMockListItems(section.id)"
        :collections="getMockCollections(section.id)"
        mode="display"
      />
    </template>

    <div
      v-if="sortedSections.length === 0 && mode === 'display'"
      class="flex items-center justify-center py-32 text-gray-400 text-sm"
    >
      This Land is empty.
    </div>
  </div>
</template>
