import { faker } from '@faker-js/faker'
import { generatePositions } from '@/lib/utils/position'
import type { Land } from '@/types/land'
import type { ListItem } from '@/types/list'
import type { Collection } from '@/types/collection'
import {
  createMockTheme,
  createMockHeaderSection,
  createMockTextSection,
  createMockMediaSection,
  createMockListSection,
  createMockCollectionSection,
} from './generators'

export interface MockLandData {
  land: Land
  listItems: Record<string, ListItem[]>   // keyed by section id
  collections: Record<string, Collection[]> // keyed by section id
}

/**
 * Build a complete mock Land with a variety of sections.
 */
export function buildMockLand(overrides?: Partial<Land>): MockLandData {
  const landId = overrides?.id || faker.string.uuid()
  const positions = generatePositions(5)

  const header = createMockHeaderSection(landId, positions[0]!)
  const text = createMockTextSection(landId, positions[1]!)
  const media = createMockMediaSection(landId, positions[2]!)
  const { section: listSection, items: listItems } = createMockListSection(landId, positions[3]!)
  const { section: collectionSection, collections } = createMockCollectionSection(landId, positions[4]!)

  const land: Land = {
    id: landId,
    user_id: overrides?.user_id || faker.string.uuid(),
    handle:
      overrides?.handle ||
      faker.internet.username().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    title: overrides?.title || faker.person.fullName(),
    description: overrides?.description || faker.person.bio(),
    avatar_image: overrides?.avatar_image ?? faker.image.avatar(),
    cover_image: overrides?.cover_image ?? faker.image.urlPicsumPhotos({ width: 1200, height: 600 }),
    sections: [header, text, media, listSection, collectionSection],
    theme: createMockTheme(landId, { color_mode: 'light', theme_preset: 'minimal' }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  }

  return {
    land,
    listItems: { [listSection.id]: listItems },
    collections: { [collectionSection.id]: collections },
  }
}

/**
 * Build a minimal mock Land (header + text only).
 */
export function buildMinimalMockLand(overrides?: Partial<Land>): MockLandData {
  const landId = overrides?.id || faker.string.uuid()
  const positions = generatePositions(2)

  const header = createMockHeaderSection(landId, positions[0]!)
  const text = createMockTextSection(landId, positions[1]!)

  const land: Land = {
    id: landId,
    user_id: overrides?.user_id || faker.string.uuid(),
    handle: overrides?.handle || 'new-project',
    title: overrides?.title || 'New Project',
    description: '',
    avatar_image: '',
    cover_image: '',
    sections: [header, text],
    theme: createMockTheme(landId, {
      color_mode: 'light',
      theme_preset: 'minimal',
      color_main: '#18181B',
      color_accent: '#6366F1',
      color_surface: '#F4F4F5',
    }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }

  return {
    land,
    listItems: {},
    collections: {},
  }
}
