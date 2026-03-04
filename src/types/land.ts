import type { Section } from './section'
import type { LandTheme } from './theme'

export interface Land {
  id: string
  user_id: string
  handle: string // URL slug — handle.lands.app
  title: string
  description: string
  avatar_image: string
  cover_image: string
  sections: Section[]
  theme: LandTheme
  created_at: string
  updated_at: string
}
