<script setup lang="ts">
import { computed } from 'vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import EditorLeftPanel from '@/components/editor/EditorLeftPanel.vue'
import LandPreview from '@/components/editor/LandPreview.vue'
import { useLandStore } from '@/stores/land'
import { useEditorStore } from '@/stores/editor'
import { useKeyboardShortcuts } from '@/composables/useKeyboard'

const landStore = useLandStore()
const editorStore = useEditorStore()

const activeLand = computed(() => landStore.activeLand)

useKeyboardShortcuts()
</script>

<template>
  <div class="h-full flex flex-col px-2">
    
    <EmptyState
      v-if="!activeLand"
      title="No Land selected"
      description="Create a new Land or select one from the dropdown above."
    />

    <template v-else>

      <div class="relative flex-1 overflow-hidden rounded-md overflow-y-auto h-full">
        <Transition name="slide-right">
          <EditorLeftPanel v-if="editorStore.isEditMode" />
        </Transition>

        <LandPreview
          :land="activeLand"
          :mode="editorStore.isEditMode ? 'editor' : 'display'"
        />

      </div>

    </template>

  </div>
</template>
