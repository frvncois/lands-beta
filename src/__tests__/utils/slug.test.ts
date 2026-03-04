import { describe, it, expect } from 'vitest'
import { toSlug } from '@/lib/utils/slug'

describe('toSlug', () => {
  it('lowercases the input', () => {
    expect(toSlug('Hello')).toBe('hello')
  })

  it('replaces spaces with hyphens', () => {
    expect(toSlug('hello world')).toBe('hello-world')
  })

  it('trims leading and trailing whitespace', () => {
    expect(toSlug('  hello  ')).toBe('hello')
  })

  it('removes special characters', () => {
    expect(toSlug('hello!@#world')).toBe('helloworld')
  })

  it('collapses multiple spaces into one hyphen', () => {
    expect(toSlug('hello   world')).toBe('hello-world')
  })

  it('replaces underscores with hyphens', () => {
    expect(toSlug('hello_world')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(toSlug('hello--world')).toBe('hello-world')
  })

  it('strips leading and trailing hyphens', () => {
    expect(toSlug('-hello-')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(toSlug('')).toBe('')
  })

  it('handles a typical land handle', () => {
    expect(toSlug('Jane Doe')).toBe('jane-doe')
  })

  it('handles numbers', () => {
    expect(toSlug('My Page 2')).toBe('my-page-2')
  })
})
