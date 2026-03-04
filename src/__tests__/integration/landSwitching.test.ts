import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLandStore } from '@/stores/land'
import { mockLand, mockLand2 } from '../helpers/mockData'

describe('Land switching integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('switching active land updates activeLand computed', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])

    expect(store.activeLand?.handle).toBe('jane')

    store.setActiveLand('land-2')
    expect(store.activeLand?.handle).toBe('jane-second')
  })

  it('removing the active land auto-switches to next', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    store.setActiveLand('land-1')

    store.removeLand('land-1')
    expect(store.activeLand?.id).toBe('land-2')
    expect(store.landCount).toBe(1)
  })

  it('adding a new land makes it immediately active', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    expect(store.activeLandId).toBe('land-1')

    store.addLand(mockLand2)
    expect(store.activeLandId).toBe('land-2')
    expect(store.landCount).toBe(2)
  })

  it('updating a land title reflects in activeLand', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    store.updateLand('land-1', { title: 'Renamed Land' })
    expect(store.activeLand?.title).toBe('Renamed Land')
  })

  it('clearing lands leaves no active land', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    store.clearLands()
    expect(store.activeLand).toBeNull()
    expect(store.landCount).toBe(0)
  })
})
