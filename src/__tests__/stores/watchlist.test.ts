import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlist'
import { mockWatchlistEntry } from '../helpers/mockData'

const entry2 = { id: 'watch-2', user_id: 'user-1', land_id: 'land-2', created_at: '2024-01-02T00:00:00Z' }

describe('useWatchlistStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useWatchlistStore()
    expect(store.entries).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it('setEntries replaces entries', () => {
    const store = useWatchlistStore()
    store.setEntries([mockWatchlistEntry, entry2])
    expect(store.entries).toHaveLength(2)
    expect(store.entries[0]?.land_id).toBe('land-1')
  })

  it('addEntry appends an entry', () => {
    const store = useWatchlistStore()
    store.addEntry(mockWatchlistEntry)
    expect(store.entries).toHaveLength(1)
    expect(store.entries[0]).toEqual(mockWatchlistEntry)
  })

  it('removeEntry removes by land_id', () => {
    const store = useWatchlistStore()
    store.setEntries([mockWatchlistEntry, entry2])
    store.removeEntry('land-1')
    expect(store.entries).toHaveLength(1)
    expect(store.entries[0]?.land_id).toBe('land-2')
  })

  it('removeEntry does nothing for unknown land_id', () => {
    const store = useWatchlistStore()
    store.setEntries([mockWatchlistEntry])
    store.removeEntry('unknown')
    expect(store.entries).toHaveLength(1)
  })
})
