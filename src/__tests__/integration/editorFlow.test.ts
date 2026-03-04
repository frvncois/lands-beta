import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEditorStore } from '@/stores/editor'
import { useLandStore } from '@/stores/land'
import { mockLand, mockTextSection, mockHeaderSection } from '../helpers/mockData'

describe('Editor flow integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('entering edit mode enables isEditMode', () => {
    const editor = useEditorStore()
    editor.enterEditMode()
    expect(editor.isEditMode).toBe(true)
  })

  it('full edit session: enter → set section → change tab → exit', () => {
    const editor = useEditorStore()

    editor.enterEditMode()
    expect(editor.isEditMode).toBe(true)

    editor.setActiveSection(mockTextSection)
    expect(editor.activeSection?.id).toBe('section-1')

    editor.setLeftPanelTab('theme')
    expect(editor.leftPanelTab).toBe('theme')

    editor.markDirty()
    expect(editor.isDirty).toBe(true)

    editor.exitEditMode()
    expect(editor.isEditMode).toBe(false)
    expect(editor.activeSection).toBeNull()
    expect(editor.leftPanelTab).toBe('sections')
  })

  it('switching active section mid-session', () => {
    const editor = useEditorStore()
    editor.enterEditMode()

    editor.setActiveSection(mockTextSection)
    expect(editor.activeSection?.id).toBe('section-1')

    editor.setActiveSection(mockHeaderSection)
    expect(editor.activeSection?.id).toBe('section-2')
  })

  it('editor state is independent of land store', () => {
    const editor = useEditorStore()
    const lands = useLandStore()

    lands.setLands([mockLand])
    editor.enterEditMode()

    expect(lands.activeLand?.id).toBe('land-1')
    expect(editor.isEditMode).toBe(true)

    editor.exitEditMode()
    expect(lands.activeLand?.id).toBe('land-1')
  })
})
