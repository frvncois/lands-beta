import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEditorStore } from '@/stores/editor'
import { mockTextSection } from '../helpers/mockData'

describe('useEditorStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useEditorStore()
    expect(store.isEditMode).toBe(false)
    expect(store.activeSection).toBeNull()
    expect(store.isDirty).toBe(false)
    expect(store.isDragging).toBe(false)
    expect(store.leftPanelTab).toBe('sections')
  })

  it('enterEditMode sets isEditMode to true', () => {
    const store = useEditorStore()
    store.enterEditMode()
    expect(store.isEditMode).toBe(true)
  })

  it('exitEditMode resets all edit state', () => {
    const store = useEditorStore()
    store.enterEditMode()
    store.setActiveSection(mockTextSection)
    store.setLeftPanelTab('theme')
    store.markDirty()
    store.exitEditMode()
    expect(store.isEditMode).toBe(false)
    expect(store.activeSection).toBeNull()
    expect(store.leftPanelTab).toBe('sections')
  })

  it('setActiveSection sets the active section', () => {
    const store = useEditorStore()
    store.setActiveSection(mockTextSection)
    expect(store.activeSection).toEqual(mockTextSection)
  })

  it('setActiveSection accepts null', () => {
    const store = useEditorStore()
    store.setActiveSection(mockTextSection)
    store.setActiveSection(null)
    expect(store.activeSection).toBeNull()
  })

  it('setLeftPanelTab updates the tab', () => {
    const store = useEditorStore()
    store.setLeftPanelTab('theme')
    expect(store.leftPanelTab).toBe('theme')
    store.setLeftPanelTab('settings')
    expect(store.leftPanelTab).toBe('settings')
  })

  it('markDirty and markClean toggle isDirty', () => {
    const store = useEditorStore()
    store.markDirty()
    expect(store.isDirty).toBe(true)
    store.markClean()
    expect(store.isDirty).toBe(false)
  })

  it('setDragging toggles isDragging', () => {
    const store = useEditorStore()
    store.setDragging(true)
    expect(store.isDragging).toBe(true)
    store.setDragging(false)
    expect(store.isDragging).toBe(false)
  })
})
