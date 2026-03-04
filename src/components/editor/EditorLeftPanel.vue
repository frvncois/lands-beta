<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import {
  Bars3BottomLeftIcon,
  SwatchIcon,
  Cog6ToothIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import { useEditorStore } from '@/stores/editor'
import EditorPanelSections from '@/components/editor/EditorPanelSections.vue'
import EditorPanelTheme from '@/components/editor/EditorPanelTheme.vue'
import EditorPanelSettings from '@/components/editor/EditorPanelSettings.vue'

const editorStore = useEditorStore()

const tabs = [
  { id: 'sections' as const, label: 'Content', icon: Bars3BottomLeftIcon },
  { id: 'theme' as const, label: 'Theme', icon: SwatchIcon },
  { id: 'settings' as const, label: 'Settings', icon: Cog6ToothIcon },
]

const minimized = ref(false)

// --- Drag logic ---
// x: 16px from left edge. y: header (h-14 = 56px) + 16px gap = 72px
const pos = ref({ x: 16, y: 72 })
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

function onDragStart(e: MouseEvent) {
  dragging.value = true
  dragOffset.value = { x: e.clientX - pos.value.x, y: e.clientY - pos.value.y }
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  pos.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y,
  }
}

function onDragEnd() {
  dragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
})
</script>

<template>
  <!-- Desktop: draggable floating panel -->
  <div
    class="editor-left-panel hidden md:flex fixed z-20 w-72 max-h-[calc(100vh-2rem)] flex-col bg-white rounded-lg shadow-md border border-gray-100"
    :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
    :class="dragging ? 'select-none shadow-lg' : ''"
  >
    <!-- Drag handle -->
    <div
      class="flex items-center justify-center h-5 shrink-0 cursor-grab active:cursor-grabbing rounded-t-lg"
      :class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
      @mousedown.prevent="onDragStart"
    >
      <div class="flex gap-0.5">
        <span v-for="i in 6" :key="i" class="h-1 w-1 rounded-full bg-gray-200" />
      </div>
    </div>

    <!-- Tab bar -->
    <div class="flex border-y border-gray-100 shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors duration-fast',
          editorStore.leftPanelTab === tab.id
            ? 'text-gray-900 border-b-2 border-gray-900'
            : 'text-gray-400 hover:text-gray-600',
        ]"
        @click="editorStore.setLeftPanelTab(tab.id)"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
      <button
        class="px-3 text-gray-400 hover:text-gray-600 transition-colors duration-fast border-l border-gray-100"
        @click="minimized = !minimized"
      >
        <ChevronUpIcon v-if="!minimized" class="h-3.5 w-3.5" />
        <ChevronDownIcon v-else class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Tab content -->
    <div v-if="!minimized" class="flex-1 min-h-0 overflow-y-auto p-4">
      <EditorPanelSections v-if="editorStore.leftPanelTab === 'sections'" />
      <EditorPanelTheme v-if="editorStore.leftPanelTab === 'theme'" />
      <EditorPanelSettings v-if="editorStore.leftPanelTab === 'settings'" />
    </div>
  </div>

  <!-- Mobile bottom sheet -->
  <Teleport to="body">
    <div class="md:hidden fixed inset-x-0 bottom-0 z-modal bg-white rounded-t-2xl shadow-xl flex flex-col" style="max-height: 70vh">
      <div class="flex justify-center pt-3 pb-1 shrink-0">
        <div class="w-8 h-1 rounded-full bg-gray-200" />
      </div>
      <div class="flex border-b border-gray-100 shrink-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors duration-fast',
            editorStore.leftPanelTab === tab.id
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600',
          ]"
          @click="editorStore.setLeftPanelTab(tab.id)"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <EditorPanelSections v-if="editorStore.leftPanelTab === 'sections'" />
        <EditorPanelTheme v-if="editorStore.leftPanelTab === 'theme'" />
        <EditorPanelSettings v-if="editorStore.leftPanelTab === 'settings'" />
      </div>
    </div>
  </Teleport>
</template>
