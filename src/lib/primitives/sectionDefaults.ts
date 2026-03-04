import {
  SECTION_TYPES,
  TEXT_STYLES,
  COLLECTION_DISPLAY_STYLES,
  MEDIA_STYLES,
  LIST_STYLES,
  HEADER_COVER_SIZES,
  HEADER_PROFILE_POSITIONS,
  type SectionType,
  type SectionSettings,
  type HeaderContent,
  type TextContent,
  type MediaContent,
} from '@/types/section'

interface SectionDefault {
  style_variant: string
  settings_json: SectionSettings
  content: HeaderContent | TextContent | MediaContent | null
}

export const SECTION_DEFAULTS: Record<SectionType, SectionDefault> = {
  [SECTION_TYPES.header]: {
    style_variant: '',
    settings_json: {
      cover_size: HEADER_COVER_SIZES.half,
      profile_position: HEADER_PROFILE_POSITIONS.below,
    },
    content: {
      title: '',
      subtitle: '',
    },
  },
  [SECTION_TYPES.text]: {
    style_variant: TEXT_STYLES.default,
    settings_json: { style: TEXT_STYLES.default },
    content: {
      body: '',
    },
  },
  [SECTION_TYPES.collection]: {
    style_variant: COLLECTION_DISPLAY_STYLES.grid,
    settings_json: { style: COLLECTION_DISPLAY_STYLES.grid, columns: 3 },
    content: null,
  },
  [SECTION_TYPES.media]: {
    style_variant: MEDIA_STYLES.default,
    settings_json: { style: MEDIA_STYLES.default },
    content: {
      items: [],
    },
  },
  [SECTION_TYPES.list]: {
    style_variant: LIST_STYLES.default,
    settings_json: { style: LIST_STYLES.default },
    content: null,
  },
}
