import { reactive } from 'vue'
import type { User } from '@/types/user'
import type { Land } from '@/types/land'
import type { ListItem } from '@/types/list'
import type { Collection } from '@/types/collection'
import type { WatchlistEntry } from '@/types/watchlist'
import { createMockUser, createMockWatchlistEntry } from './generators'
import { buildMockLand, buildMinimalMockLand } from './landBuilder'

// A watchlist entry extended with the full Land object for display
export type WatchlistEntryWithLand = WatchlistEntry & { land: Land }

interface MockState {
  user: User
  lands: Land[]
  listItems: Record<string, ListItem[]>
  collections: Record<string, Collection[]>
  watchlist: WatchlistEntryWithLand[]
}

function createMockState(): MockState {
  const user = createMockUser({
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@lands.app',
  })

  const fullLand = buildMockLand({
    user_id: user.id,
    handle: 'janedoe',
    title: 'Jane Doe',
    description: 'Designer, developer, and occasional photographer.',
  })

  const minimalLand = buildMinimalMockLand({
    user_id: user.id,
    handle: 'side-project',
    title: 'Side Project',
  })

  const otherUser = createMockUser({ first_name: 'Alex', last_name: 'Rivera' })
  const otherLand = buildMockLand({
    user_id: otherUser.id,
    handle: 'alexrivera',
    title: 'Alex Rivera',
    description: 'Photographer and filmmaker based in NYC.',
  })

  const watchlistEntry = createMockWatchlistEntry(user.id, otherLand.land.id)

  return {
    user,
    lands: [fullLand.land, minimalLand.land],
    listItems: {
      ...fullLand.listItems,
      ...minimalLand.listItems,
    },
    collections: {
      ...fullLand.collections,
      ...minimalLand.collections,
    },
    watchlist: [{ ...watchlistEntry, land: otherLand.land }],
  }
}

export const mockState = reactive(createMockState())

/** Reset mock state (useful for testing). */
export function resetMockState() {
  const fresh = createMockState()
  Object.assign(mockState, fresh)
}

/** Get list items for a specific section. */
export function getMockListItems(sectionId: string): ListItem[] {
  return mockState.listItems[sectionId] || []
}

/** Get collections for a specific section. */
export function getMockCollections(sectionId: string): Collection[] {
  return mockState.collections[sectionId] || []
}

/** Find a land by handle — checks user's lands then watchlist lands. */
export function getMockLandByHandle(handle: string): Land | null {
  const userLand = mockState.lands.find((l) => l.handle === handle)
  if (userLand) return userLand
  const watchEntry = mockState.watchlist.find((w) => w.land.handle === handle)
  if (watchEntry) return watchEntry.land
  return null
}
