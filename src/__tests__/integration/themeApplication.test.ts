import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useLandStore } from '@/stores/land'
import { mockTheme, mockLand } from '../helpers/mockData'

describe('Theme application integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('setting theme makes it accessible', () => {
    const themeStore = useThemeStore()
    themeStore.setTheme({ ...mockTheme })
    expect(themeStore.theme?.color_main).toBe('#18181B')
    expect(themeStore.theme?.color_accent).toBe('#6366F1')
    expect(themeStore.theme?.color_mode).toBe('light')
  })

  it('updating a field does not reset other fields', () => {
    const themeStore = useThemeStore()
    themeStore.setTheme({ ...mockTheme })

    themeStore.updateThemeField('color_main', '#FF0000')
    expect(themeStore.theme?.color_main).toBe('#FF0000')
    expect(themeStore.theme?.color_accent).toBe('#6366F1')
    expect(themeStore.theme?.typography_style).toBe('sans')
    expect(themeStore.theme?.theme_preset).toBe('minimal')
  })

  it('switching to dark mode', () => {
    const themeStore = useThemeStore()
    themeStore.setTheme({ ...mockTheme })
    themeStore.updateThemeField('color_mode', 'dark')
    expect(themeStore.theme?.color_mode).toBe('dark')
  })

  it('land store theme is in sync with land data', () => {
    const landStore = useLandStore()
    landStore.setLands([{ ...mockLand, theme: { ...mockTheme } }])
    expect(landStore.activeLand?.theme.color_main).toBe('#18181B')
    expect(landStore.activeLand?.theme.color_accent).toBe('#6366F1')
  })

  it('updating land theme via updateLand', () => {
    const landStore = useLandStore()
    landStore.setLands([mockLand])

    const updatedTheme = { ...mockTheme, color_main: '#10B981' }
    landStore.updateLand('land-1', { theme: updatedTheme })

    expect(landStore.activeLand?.theme.color_main).toBe('#10B981')
  })
})
