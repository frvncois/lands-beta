import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '@/lib/utils/markdown'

describe('renderMarkdown', () => {
  it('returns empty string for empty input', () => {
    expect(renderMarkdown('')).toBe('')
  })

  it('renders h1 heading', () => {
    const result = renderMarkdown('# Hello')
    expect(result).toContain('<h1>')
    expect(result).toContain('Hello')
  })

  it('renders h2 heading', () => {
    const result = renderMarkdown('## Section')
    expect(result).toContain('<h2>')
  })

  it('renders paragraph text', () => {
    const result = renderMarkdown('Hello world')
    expect(result).toContain('<p>')
    expect(result).toContain('Hello world')
  })

  it('renders bold text', () => {
    const result = renderMarkdown('**bold**')
    expect(result).toContain('<strong>')
  })

  it('renders italic text', () => {
    const result = renderMarkdown('*italic*')
    expect(result).toContain('<em>')
  })

  it('renders unordered list', () => {
    const result = renderMarkdown('- item 1\n- item 2')
    expect(result).toContain('<ul>')
    expect(result).toContain('<li>')
  })

  it('renders links', () => {
    const result = renderMarkdown('[click](https://example.com)')
    expect(result).toContain('<a ')
    expect(result).toContain('https://example.com')
  })

  it('returns a string', () => {
    const result = renderMarkdown('# Test')
    expect(typeof result).toBe('string')
  })
})
