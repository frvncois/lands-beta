import { describe, it, expect } from 'vitest'
import {
  generatePositionAfter,
  generatePositionBefore,
  generatePositionBetween,
  generatePositions,
  sortByPosition,
} from '@/lib/utils/position'

describe('position utils', () => {
  describe('generatePositionAfter', () => {
    it('generates a valid string from null', () => {
      const pos = generatePositionAfter(null)
      expect(typeof pos).toBe('string')
      expect(pos.length).toBeGreaterThan(0)
    })

    it('generates a key after a given position', () => {
      const first = generatePositionAfter(null)
      const second = generatePositionAfter(first)
      expect(second > first).toBe(true)
    })
  })

  describe('generatePositionBefore', () => {
    it('generates a valid string from null', () => {
      const pos = generatePositionBefore(null)
      expect(typeof pos).toBe('string')
    })

    it('generates a key before a given position', () => {
      const second = generatePositionAfter(null)
      const first = generatePositionBefore(second)
      expect(first < second).toBe(true)
    })
  })

  describe('generatePositionBetween', () => {
    it('generates a key between two positions', () => {
      const a = generatePositionAfter(null)
      const b = generatePositionAfter(a)
      const mid = generatePositionBetween(a, b)
      expect(mid > a).toBe(true)
      expect(mid < b).toBe(true)
    })

    it('handles null before', () => {
      const b = generatePositionAfter(null)
      const pos = generatePositionBetween(null, b)
      expect(pos < b).toBe(true)
    })

    it('handles null after', () => {
      const a = generatePositionAfter(null)
      const pos = generatePositionBetween(a, null)
      expect(pos > a).toBe(true)
    })
  })

  describe('generatePositions', () => {
    it('returns the correct number of keys', () => {
      const keys = generatePositions(3)
      expect(keys).toHaveLength(3)
    })

    it('returns keys in sorted order', () => {
      const keys = generatePositions(4)
      for (let i = 1; i < keys.length; i++) {
        expect(keys[i]! > keys[i - 1]!).toBe(true)
      }
    })
  })

  describe('sortByPosition', () => {
    it('sorts items by position ascending', () => {
      const items = [
        { id: 'b', position: 'b' },
        { id: 'a', position: 'a' },
        { id: 'c', position: 'c' },
      ]
      const sorted = sortByPosition(items)
      expect(sorted.map((i) => i.id)).toEqual(['a', 'b', 'c'])
    })

    it('does not mutate the original array', () => {
      const items = [{ id: 'b', position: 'b' }, { id: 'a', position: 'a' }]
      const sorted = sortByPosition(items)
      expect(items[0]?.id).toBe('b')
      expect(sorted[0]?.id).toBe('a')
    })

    it('handles empty array', () => {
      expect(sortByPosition([])).toEqual([])
    })
  })
})
