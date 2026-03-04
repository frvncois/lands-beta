import { describe, it, expect } from 'vitest'
import { isValidSectionType } from '@/lib/validators/section.validator'
import { isValidLand } from '@/lib/validators/land.validator'
import { SECTION_TYPES } from '@/types/section'

describe('isValidSectionType', () => {
  it('returns true for all valid section types', () => {
    for (const type of Object.values(SECTION_TYPES)) {
      expect(isValidSectionType(type)).toBe(true)
    }
  })

  it('returns false for an unknown type', () => {
    expect(isValidSectionType('unknown')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidSectionType('')).toBe(false)
  })

  it('returns false for a partial match', () => {
    expect(isValidSectionType('tex')).toBe(false)
  })

  it('is case-sensitive', () => {
    expect(isValidSectionType('Text')).toBe(false)
    expect(isValidSectionType('TEXT')).toBe(false)
  })
})

describe('isValidLand', () => {
  const validLand = { id: 'land-1', user_id: 'user-1', title: 'My Land' }

  it('returns true for a land with id, user_id, and title', () => {
    expect(isValidLand(validLand)).toBe(true)
  })

  it('returns false when id is missing', () => {
    expect(isValidLand({ ...validLand, id: '' })).toBe(false)
  })

  it('returns false when user_id is missing', () => {
    expect(isValidLand({ ...validLand, user_id: '' })).toBe(false)
  })

  it('returns false when title is missing', () => {
    expect(isValidLand({ ...validLand, title: '' })).toBe(false)
  })

  it('returns false for an empty object', () => {
    expect(isValidLand({})).toBe(false)
  })
})
