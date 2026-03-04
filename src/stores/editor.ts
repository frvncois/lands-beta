import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Section } from '@/types/section'

export const useEditorStore = defineStore('editor', () => {
  const isEditMode = ref(false)
  const activeSection = ref<Section | null>(null)
  const isDirty = ref(false)
  const isDragging = ref(false)
  const leftPanelTab = ref<'sections' | 'theme' | 'settings'>('sections')

  function enterEditMode() {
    isEditMode.value = true
  }

  function exitEditMode() {
    isEditMode.value = false
    activeSection.value = null
    leftPanelTab.value = 'sections'
  }

  function setActiveSection(section: Section | null) {
    activeSection.value = section
  }

  function setLeftPanelTab(tab: 'sections' | 'theme' | 'settings') {
    leftPanelTab.value = tab
  }

  function markDirty() {
    isDirty.value = true
  }

  function markClean() {
    isDirty.value = false
  }

  function setDragging(dragging: boolean) {
    isDragging.value = dragging
  }

  return {
    isEditMode,
    activeSection,
    isDirty,
    isDragging,
    leftPanelTab,
    enterEditMode,
    exitEditMode,
    setActiveSection,
    setLeftPanelTab,
    markDirty,
    markClean,
    setDragging,
  }
})
