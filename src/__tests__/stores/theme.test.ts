import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { mockTheme } from '../helpers/mockData'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useThemeStore()
    expect(store.theme).toBeNull()
  })

  it('setTheme stores the theme', () => {
    const store = useThemeStore()
    const copy = { ...mockTheme }
    store.setTheme(copy)
    expect(store.theme).toEqual(copy)
  })

  it('updateThemeField updates a single field', () => {
    const store = useThemeStore()
    store.setTheme({ ...mockTheme })
    store.updateThemeField('color_main', '#FF0000')
    expect(store.theme?.color_main).toBe('#FF0000')
    expect(store.theme?.theme_preset).toBe('minimal')
  })

  it('updateThemeField does nothing when theme is null', () => {
    const store = useThemeStore()
    // Should not throw
    store.updateThemeField('color_main', '#FF0000')
    expect(store.theme).toBeNull()
  })

  it('updateThemeField can update color_mode', () => {
    const store = useThemeStore()
    store.setTheme({ ...mockTheme })
    store.updateThemeField('color_mode', 'dark')
    expect(store.theme?.color_mode).toBe('dark')
  })

  it('updateThemeField can update typography_style', () => {
    const store = useThemeStore()
    store.setTheme({ ...mockTheme })
    store.updateThemeField('typography_style', 'serif')
    expect(store.theme?.typography_style).toBe('serif')
  })

  it('updateThemeField can update color_accent', () => {
    const store = useThemeStore()
    store.setTheme({ ...mockTheme })
    store.updateThemeField('color_accent', '#F59E0B')
    expect(store.theme?.color_accent).toBe('#F59E0B')
  })

  it('updateThemeField can update color_surface', () => {
    const store = useThemeStore()
    store.setTheme({ ...mockTheme })
    store.updateThemeField('color_surface', '#1E293B')
    expect(store.theme?.color_surface).toBe('#1E293B')
  })
})
