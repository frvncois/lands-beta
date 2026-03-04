import { describe, it, expect } from 'vitest'
import { getFaviconUrl } from '@/lib/utils/favicon'

describe('getFaviconUrl', () => {
  it('returns a Google favicon URL for a valid URL', () => {
    const result = getFaviconUrl('https://example.com')
    expect(result).toContain('google.com/s2/favicons')
    expect(result).toContain('example.com')
  })

  it('includes the sz=32 parameter', () => {
    const result = getFaviconUrl('https://github.com')
    expect(result).toContain('sz=32')
  })

  it('returns empty string for invalid URL', () => {
    const result = getFaviconUrl('not-a-url')
    expect(result).toBe('')
  })

  it('returns empty string for empty string input', () => {
    const result = getFaviconUrl('')
    expect(result).toBe('')
  })

  it('extracts correct hostname from URL with path', () => {
    const result = getFaviconUrl('https://sub.example.com/path?query=1')
    expect(result).toContain('sub.example.com')
  })
})
