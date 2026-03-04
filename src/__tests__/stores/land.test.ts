import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLandStore } from '@/stores/land'
import { mockLand, mockLand2 } from '../helpers/mockData'

describe('useLandStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useLandStore()
    expect(store.lands).toEqual([])
    expect(store.activeLandId).toBeNull()
    expect(store.activeLand).toBeNull()
    expect(store.landCount).toBe(0)
    expect(store.canCreateLand).toBe(true)
  })

  it('setLands populates lands and sets first as active', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    expect(store.lands).toHaveLength(2)
    expect(store.activeLandId).toBe('land-1')
    expect(store.activeLand).toEqual(mockLand)
  })

  it('setLands does not override existing activeLandId', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    store.setActiveLand('land-1')
    store.setLands([mockLand, mockLand2])
    expect(store.activeLandId).toBe('land-1')
  })

  it('setActiveLand updates activeLandId', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    store.setActiveLand('land-2')
    expect(store.activeLand).toEqual(mockLand2)
  })

  it('addLand appends and sets it as active', () => {
    const store = useLandStore()
    store.addLand(mockLand)
    expect(store.lands).toHaveLength(1)
    expect(store.activeLandId).toBe('land-1')
  })

  it('updateLand patches the matching land', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    store.updateLand('land-1', { title: 'Updated Title' })
    expect(store.lands[0]?.title).toBe('Updated Title')
    expect(store.lands[0]?.handle).toBe('jane')
  })

  it('updateLand does nothing for unknown id', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    store.updateLand('unknown', { title: 'X' })
    expect(store.lands[0]?.title).toBe("Jane's Land")
  })

  it('removeLand removes the land', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    store.removeLand('land-1')
    expect(store.lands).toHaveLength(1)
    expect(store.lands[0]?.id).toBe('land-2')
  })

  it('removeLand switches active to next available', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    store.removeLand('land-1')
    expect(store.activeLandId).toBe('land-2')
  })

  it('removeLand sets activeLandId to null when list is empty', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    store.removeLand('land-1')
    expect(store.activeLandId).toBeNull()
  })

  it('clearLands resets all state', () => {
    const store = useLandStore()
    store.setLands([mockLand])
    store.clearLands()
    expect(store.lands).toEqual([])
    expect(store.activeLandId).toBeNull()
  })

  it('landCount reflects lands array length', () => {
    const store = useLandStore()
    store.setLands([mockLand, mockLand2])
    expect(store.landCount).toBe(2)
  })
})
