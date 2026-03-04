import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextSection from '@/components/sections/display/TextSection.vue'

describe('TextSection', () => {
  const defaultSettings = { style: 'default' as const }

  it('renders markdown content as HTML', () => {
    const wrapper = mount(TextSection, {
      props: {
        content: { body: '# Title\n\nParagraph text.' },
        settings: defaultSettings,
      },
    })
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
  })

  it('renders empty when content is null', () => {
    const wrapper = mount(TextSection, {
      props: { content: null, settings: defaultSettings },
    })
    const div = wrapper.find('.prose')
    expect(div.html()).not.toContain('<h1>')
  })

  it('applies centered layout class for centered style', () => {
    const wrapper = mount(TextSection, {
      props: {
        content: { body: 'text' },
        settings: { style: 'centered' },
      },
    })
    expect(wrapper.find('.prose').classes()).toContain('text-center')
  })

  it('applies max-w-4xl class for wide style', () => {
    const wrapper = mount(TextSection, {
      props: {
        content: { body: 'text' },
        settings: { style: 'wide' },
      },
    })
    expect(wrapper.find('.prose').classes()).toContain('max-w-4xl')
  })

  it('applies max-w-2xl class for default style', () => {
    const wrapper = mount(TextSection, {
      props: {
        content: { body: 'text' },
        settings: defaultSettings,
      },
    })
    expect(wrapper.find('.prose').classes()).toContain('max-w-2xl')
  })

  it('does not add themed class outside ThemeProvider', () => {
    const wrapper = mount(TextSection, {
      props: { content: { body: 'text' }, settings: defaultSettings },
    })
    expect(wrapper.find('.prose').classes()).not.toContain('themed')
  })

  it('renders bold text', () => {
    const wrapper = mount(TextSection, {
      props: {
        content: { body: '**bold**' },
        settings: defaultSettings,
      },
    })
    expect(wrapper.find('strong').exists()).toBe(true)
  })
})
