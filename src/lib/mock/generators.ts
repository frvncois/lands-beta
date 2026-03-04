import { faker } from '@faker-js/faker'
import { generatePositions } from '@/lib/utils/position'
import type { User } from '@/types/user'
import type { LandTheme } from '@/types/theme'
import type { Section, MediaItem, HeaderContent, TextContent, MediaContent } from '@/types/section'
import type { ListItem } from '@/types/list'
import type { Collection, CollectionItem } from '@/types/collection'
import type { WatchlistEntry } from '@/types/watchlist'

// ─── User ───

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    avatar_image: faker.image.avatar(),
    created_at: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,
  }
}

// ─── Theme ───

const PRESET_OPTIONS = ['minimal', 'bold', 'editorial'] as const
const MODE_OPTIONS = ['light', 'dark'] as const
const TYPO_OPTIONS = ['sans', 'serif', 'mono'] as const
const MAIN_COLORS = ['#18181B', '#2563EB', '#1E1E1E', '#7C3AED']
const ACCENT_COLORS = ['#6366F1', '#F59E0B', '#EC4899', '#0891B2', '#B45309']
const SURFACE_COLORS = ['#F4F4F5', '#FAF9F6', '#1E293B', '#FEF3C7']

export function createMockTheme(landId: string, overrides?: Partial<LandTheme>): LandTheme {
  return {
    id: faker.string.uuid(),
    land_id: landId,
    theme_preset: faker.helpers.arrayElement([...PRESET_OPTIONS]),
    color_main: faker.helpers.arrayElement(MAIN_COLORS),
    color_accent: faker.helpers.arrayElement(ACCENT_COLORS),
    color_surface: faker.helpers.arrayElement(SURFACE_COLORS),
    color_mode: faker.helpers.arrayElement([...MODE_OPTIONS]),
    typography_style: faker.helpers.arrayElement([...TYPO_OPTIONS]),
    ...overrides,
  }
}

// ─── Sections ───

export function createMockHeaderSection(landId: string, position: string): Section {
  return {
    id: faker.string.uuid(),
    land_id: landId,
    type: 'header',
    position,
    style_variant: '',
    settings_json: {
      cover_size: faker.helpers.arrayElement(['half', 'full']),
      profile_position: faker.helpers.arrayElement(['overlapping', 'below']),
    },
    content: {
      title: faker.person.fullName(),
      subtitle: faker.person.jobTitle(),
    } as HeaderContent,
    created_at: faker.date.past().toISOString(),
  }
}

export function createMockTextSection(landId: string, position: string): Section {
  const paragraphs = faker.helpers.multiple(
    () => faker.lorem.paragraph(),
    { count: { min: 1, max: 3 } }
  )
  const body = [
    `## ${faker.company.buzzPhrase()}`,
    '',
    paragraphs.join('\n\n'),
    '',
    `**${faker.lorem.sentence()}**`,
    '',
    `_${faker.lorem.sentence()}_`,
    '',
    `[${faker.company.name()}](https://example.com)`,
  ].join('\n')

  return {
    id: faker.string.uuid(),
    land_id: landId,
    type: 'text',
    position,
    style_variant: faker.helpers.arrayElement(['default', 'centered', 'wide']),
    settings_json: { style: 'default' },
    content: { body } as TextContent,
    created_at: faker.date.past().toISOString(),
  }
}

export function createMockMediaSection(landId: string, position: string): Section {
  const itemCount = faker.number.int({ min: 1, max: 6 })
  const itemPositions = generatePositions(itemCount)

  const items: MediaItem[] = itemPositions.map((pos, i) => {
    const isVideo = i === 0 && faker.datatype.boolean()
    return {
      id: faker.string.uuid(),
      media_type: isVideo ? 'video' : 'image',
      url: isVideo
        ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        : faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
      caption: faker.datatype.boolean() ? faker.lorem.sentence() : '',
      position: pos,
    }
  })

  return {
    id: faker.string.uuid(),
    land_id: landId,
    type: 'media',
    position,
    style_variant: faker.helpers.arrayElement(['default', 'fullwidth', 'compact']),
    settings_json: { style: 'default' },
    content: { items } as MediaContent,
    created_at: faker.date.past().toISOString(),
  }
}

export function createMockListItems(sectionId: string, count: number = 5): ListItem[] {
  const positions = generatePositions(count)
  const sites = [
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'Twitter', url: 'https://twitter.com' },
    { title: 'LinkedIn', url: 'https://linkedin.com' },
    { title: 'Dribbble', url: 'https://dribbble.com' },
    { title: 'Behance', url: 'https://behance.net' },
    { title: 'Medium', url: 'https://medium.com' },
    { title: 'YouTube', url: 'https://youtube.com' },
    { title: 'Instagram', url: 'https://instagram.com' },
    { title: 'Personal Site', url: 'https://example.com' },
    { title: 'Newsletter', url: 'https://buttondown.email' },
  ]

  return positions.map((pos, i) => {
    const site = sites[i % sites.length]!
    return {
      id: faker.string.uuid(),
      section_id: sectionId,
      title: site.title,
      url: `${site.url}/${faker.internet.username()}`,
      description: faker.datatype.boolean() ? faker.lorem.sentence() : '',
      icon: '',
      position: pos,
    }
  })
}

export function createMockListSection(
  landId: string,
  position: string
): { section: Section; items: ListItem[] } {
  const sectionId = faker.string.uuid()
  const section: Section = {
    id: sectionId,
    land_id: landId,
    type: 'list',
    position,
    style_variant: faker.helpers.arrayElement(['default', 'compact']),
    settings_json: { style: 'default' },
    content: null,
    created_at: faker.date.past().toISOString(),
  }
  const items = createMockListItems(sectionId, faker.number.int({ min: 3, max: 7 }))
  return { section, items }
}

export function createMockCollectionItems(
  collectionId: string,
  count: number = 4
): CollectionItem[] {
  const positions = generatePositions(count)
  return positions.map((pos) => ({
    id: faker.string.uuid(),
    collection_id: collectionId,
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    media_url: faker.datatype.boolean({ probability: 0.8 })
      ? faker.image.urlPicsumPhotos({ width: 600, height: 400 })
      : '',
    external_url: faker.datatype.boolean({ probability: 0.7 }) ? faker.internet.url() : '',
    position: pos,
    created_at: faker.date.past().toISOString(),
  }))
}

export function createMockCollection(sectionId: string, position: string): Collection {
  const collectionId = faker.string.uuid()
  return {
    id: collectionId,
    section_id: sectionId,
    title: faker.helpers.arrayElement([
      'Projects',
      'Work',
      'Photography',
      'Writing',
      'Experiments',
      'Highlights',
    ]),
    description: faker.datatype.boolean() ? faker.lorem.sentence() : '',
    position,
    items: createMockCollectionItems(collectionId, faker.number.int({ min: 3, max: 6 })),
  }
}

export function createMockCollectionSection(
  landId: string,
  position: string
): { section: Section; collections: Collection[] } {
  const sectionId = faker.string.uuid()
  const collectionCount = faker.number.int({ min: 1, max: 2 })
  const collectionPositions = generatePositions(collectionCount)

  const section: Section = {
    id: sectionId,
    land_id: landId,
    type: 'collection',
    position,
    style_variant: faker.helpers.arrayElement(['grid', 'list', 'cards']),
    settings_json: {
      style: faker.helpers.arrayElement(['grid', 'list', 'cards']),
      columns: faker.helpers.arrayElement([2, 3, 4]),
    },
    content: null,
    created_at: faker.date.past().toISOString(),
  }

  const collections = collectionPositions.map((pos) => createMockCollection(sectionId, pos))
  return { section, collections }
}

// ─── Watchlist ───

export function createMockWatchlistEntry(userId: string, landId: string): WatchlistEntry {
  return {
    id: faker.string.uuid(),
    user_id: userId,
    land_id: landId,
    created_at: faker.date.past().toISOString(),
  }
}
