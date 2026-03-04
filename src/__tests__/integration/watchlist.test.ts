import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlist'
import { mockWatchlistEntry } from '../helpers/mockData'

const entry2 = {
  id: 'watch-2',
  user_id: 'user-1',
  land_id: 'land-2',
  created_at: '2024-01-02T00:00:00Z',
}

describe('Watchlist integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('can add and then remove an entry', () => {
    const store = useWatchlistStore()
    store.addEntry(mockWatchlistEntry)
    expect(store.entries).toHaveLength(1)

    store.removeEntry('land-1')
    expect(store.entries).toHaveLength(0)
  })

  it('isWatching check via entries array', () => {
    const store = useWatchlistStore()
    store.addEntry(mockWatchlistEntry)

    const isWatching = store.entries.some((e) => e.land_id === 'land-1')
    expect(isWatching).toBe(true)

    const notWatching = store.entries.some((e) => e.land_id === 'land-99')
    expect(notWatching).toBe(false)
  })

  it('loading multiple entries and selectively removing', () => {
    const store = useWatchlistStore()
    store.setEntries([mockWatchlistEntry, entry2])
    expect(store.entries).toHaveLength(2)

    store.removeEntry('land-1')
    expect(store.entries).toHaveLength(1)
    expect(store.entries[0]?.land_id).toBe('land-2')
  })

  it('replacing entries via setEntries resets state', () => {
    const store = useWatchlistStore()
    store.addEntry(mockWatchlistEntry)
    store.setEntries([entry2])
    expect(store.entries).toHaveLength(1)
    expect(store.entries[0]?.land_id).toBe('land-2')
  })
})
