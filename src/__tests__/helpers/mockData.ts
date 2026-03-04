import type { User } from '@/types/user'
import type { Land } from '@/types/land'
import type { LandTheme } from '@/types/theme'
import type { Section } from '@/types/section'
import type { WatchlistEntry } from '@/types/watchlist'
import type { ListItem } from '@/types/list'
import type { Collection } from '@/types/collection'

export const mockUser: User = {
  id: 'user-1',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@example.com',
  avatar_image: '',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockTheme: LandTheme = {
  id: 'theme-1',
  land_id: 'land-1',
  theme_preset: 'minimal',
  color_main: '#18181B',
  color_accent: '#6366F1',
  color_surface: '#F4F4F5',
  color_mode: 'light',
  typography_style: 'sans',
}

export const mockTextSection: Section = {
  id: 'section-1',
  land_id: 'land-1',
  type: 'text',
  position: 'a0',
  style_variant: 'default',
  settings_json: { style: 'default' },
  content: { body: '# Hello\n\nThis is markdown.' },
  created_at: '2024-01-01T00:00:00Z',
}

export const mockHeaderSection: Section = {
  id: 'section-2',
  land_id: 'land-1',
  type: 'header',
  position: 'a1',
  style_variant: 'default',
  settings_json: { cover_size: 'half', profile_position: 'overlapping' },
  content: { title: 'Jane Doe', subtitle: 'Designer & Developer' },
  created_at: '2024-01-01T00:00:00Z',
}

export const mockLand: Land = {
  id: 'land-1',
  user_id: 'user-1',
  handle: 'jane',
  title: "Jane's Land",
  description: 'A personal page',
  avatar_image: '',
  cover_image: '',
  sections: [mockTextSection],
  theme: mockTheme,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockLand2: Land = {
  id: 'land-2',
  user_id: 'user-1',
  handle: 'jane-second',
  title: 'Second Land',
  description: '',
  avatar_image: '',
  cover_image: '',
  sections: [],
  theme: { ...mockTheme, id: 'theme-2', land_id: 'land-2' },
  created_at: '2024-01-02T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
}

export const mockWatchlistEntry: WatchlistEntry = {
  id: 'watch-1',
  user_id: 'user-1',
  land_id: 'land-1',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockListItem: ListItem = {
  id: 'item-1',
  section_id: 'section-1',
  title: 'Example Link',
  url: 'https://example.com',
  description: 'An example website',
  icon: '',
  position: 'a0',
}

export const mockCollection: Collection = {
  id: 'col-1',
  section_id: 'section-1',
  title: 'My Collection',
  description: 'A group of items',
  position: 'a0',
  items: [],
}
