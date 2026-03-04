import { describe, it, expect } from 'vitest'
import { getEmbedUrl } from '@/lib/utils/videoEmbed'

describe('getEmbedUrl', () => {
  describe('YouTube', () => {
    it('handles watch?v= URL', () => {
      const result = getEmbedUrl('https://www.youtube.com/watch?v=abc123')
      expect(result).toBe('https://www.youtube.com/embed/abc123')
    })

    it('handles youtu.be short URL', () => {
      const result = getEmbedUrl('https://youtu.be/abc123')
      expect(result).toBe('https://www.youtube.com/embed/abc123')
    })

    it('handles YouTube shorts URL', () => {
      const result = getEmbedUrl('https://youtube.com/shorts/abc123')
      expect(result).toBe('https://www.youtube.com/embed/abc123')
    })

    it('handles embed URL passthrough', () => {
      const result = getEmbedUrl('https://www.youtube.com/embed/abc123')
      expect(result).toBe('https://www.youtube.com/embed/abc123')
    })
  })

  describe('Vimeo', () => {
    it('handles standard Vimeo URL', () => {
      const result = getEmbedUrl('https://vimeo.com/123456789')
      expect(result).toBe('https://player.vimeo.com/video/123456789')
    })
  })

  describe('unrecognized URLs', () => {
    it('returns null for empty string', () => {
      expect(getEmbedUrl('')).toBeNull()
    })

    it('returns null for arbitrary URL', () => {
      expect(getEmbedUrl('https://example.com/video')).toBeNull()
    })

    it('returns null for non-video URL', () => {
      expect(getEmbedUrl('https://twitter.com/user/status/123')).toBeNull()
    })
  })
})
