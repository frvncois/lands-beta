export const SECTION_TYPES = {
  header: 'header',
  text: 'text',
  media: 'media',
  list: 'list',
  collection: 'collection',
} as const

export type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES]

// --- Style variants per section type ---

export const TEXT_STYLES = {
  default: 'default',
  centered: 'centered',
  wide: 'wide',
} as const

export type TextStyle = typeof TEXT_STYLES[keyof typeof TEXT_STYLES]

export const COLLECTION_DISPLAY_STYLES = {
  grid: 'grid',
  list: 'list',
  cards: 'cards',
} as const

export type CollectionDisplayStyle = typeof COLLECTION_DISPLAY_STYLES[keyof typeof COLLECTION_DISPLAY_STYLES]

export const MEDIA_STYLES = {
  default: 'default',
  fullwidth: 'fullwidth',
  compact: 'compact',
} as const

export type MediaStyle = typeof MEDIA_STYLES[keyof typeof MEDIA_STYLES]

export const LIST_STYLES = {
  default: 'default',
  compact: 'compact',
} as const

export type ListStyle = typeof LIST_STYLES[keyof typeof LIST_STYLES]

// --- Header-specific constants ---

export const HEADER_COVER_SIZES = {
  half: 'half',
  full: 'full',
} as const

export type HeaderCoverSize = typeof HEADER_COVER_SIZES[keyof typeof HEADER_COVER_SIZES]

export const HEADER_PROFILE_POSITIONS = {
  overlapping: 'overlapping',
  below: 'below',
} as const

export type HeaderProfilePosition = typeof HEADER_PROFILE_POSITIONS[keyof typeof HEADER_PROFILE_POSITIONS]

// --- Settings JSON types per section ---

export interface HeaderSettings {
  cover_size: HeaderCoverSize
  profile_position: HeaderProfilePosition
}

export interface TextSettings {
  style: TextStyle
}

export interface CollectionSettings {
  style: CollectionDisplayStyle
  columns?: number // only relevant for grid
}

export interface MediaSettings {
  style: MediaStyle
}

export interface ListSettings {
  style: ListStyle
}

export type SectionSettings =
  | HeaderSettings
  | TextSettings
  | CollectionSettings
  | MediaSettings
  | ListSettings

// --- Section content types ---

export interface HeaderContent {
  title: string
  subtitle: string
}

export interface TextContent {
  body: string // markdown
}

export const MEDIA_TYPES = {
  image: 'image',
  video: 'video',
} as const

export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES]

export interface MediaItem {
  id: string
  media_type: MediaType
  url: string
  caption: string
  position: string // fractional index
}

export interface MediaContent {
  items: MediaItem[]
}

// --- Base section ---

export interface Section {
  id: string
  land_id: string
  type: SectionType
  position: string // fractional index
  style_variant: string
  settings_json: SectionSettings
  content: HeaderContent | TextContent | MediaContent | null
  created_at: string
}
