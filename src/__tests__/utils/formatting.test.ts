import { describe, it, expect } from 'vitest'
import { formatDate, generateId } from '@/lib/utils/formatting'

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    // Use noon UTC to avoid timezone-shifting the day
    const result = formatDate('2024-06-15T12:00:00Z')
    expect(result).toContain('2024')
    expect(result).toMatch(/Jun/)
  })

  it('returns a non-empty string', () => {
    const result = formatDate('2024-01-01T00:00:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('generateId', () => {
  it('returns a string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
  })

  it('returns a UUID-formatted string (mocked)', () => {
    const id = generateId()
    expect(id).toBe('12345678-1234-1234-1234-123456789012')
  })
})
