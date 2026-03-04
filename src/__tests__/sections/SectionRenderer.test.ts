import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionRenderer from '@/components/sections/SectionRenderer.vue'
import { mockTextSection, mockHeaderSection } from '../helpers/mockData'

// Stub child display components to isolate SectionRenderer logic
const stubs = {
  HeaderSection: { template: '<div class="header-section" />' },
  TextSection: { template: '<div class="text-section" />' },
  MediaSection: { template: '<div class="media-section" />' },
  ListSection: { template: '<div class="list-section" />' },
  CollectionSection: { template: '<div class="collection-section" />' },
  HeaderEditor: { template: '<div class="header-editor" />' },
  TextEditor: { template: '<div class="text-editor" />' },
  MediaEditor: { template: '<div class="media-editor" />' },
  ListEditor: { template: '<div class="list-editor" />' },
  CollectionEditor: { template: '<div class="collection-editor" />' },
}

describe('SectionRenderer', () => {
  it('renders TextSection for text type in display mode', () => {
    const wrapper = mount(SectionRenderer, {
      props: { section: mockTextSection },
      global: { stubs },
    })
    expect(wrapper.find('.text-section').exists()).toBe(true)
  })

  it('renders HeaderSection for header type in display mode', () => {
    const wrapper = mount(SectionRenderer, {
      props: { section: mockHeaderSection },
      global: { stubs },
    })
    expect(wrapper.find('.header-section').exists()).toBe(true)
  })

  it('renders TextEditor for text type in editor mode', () => {
    const wrapper = mount(SectionRenderer, {
      props: { section: mockTextSection, mode: 'editor' },
      global: { stubs },
    })
    expect(wrapper.find('.text-editor').exists()).toBe(true)
  })

  it('renders HeaderEditor for header type in editor mode', () => {
    const wrapper = mount(SectionRenderer, {
      props: { section: mockHeaderSection, mode: 'editor' },
      global: { stubs },
    })
    expect(wrapper.find('.header-editor').exists()).toBe(true)
  })

  it('defaults to display mode', () => {
    const wrapper = mount(SectionRenderer, {
      props: { section: mockTextSection },
      global: { stubs },
    })
    expect(wrapper.find('.text-section').exists()).toBe(true)
    expect(wrapper.find('.text-editor').exists()).toBe(false)
  })

  it('renders nothing for unknown section type', () => {
    const unknownSection = { ...mockTextSection, type: 'unknown' as any }
    const wrapper = mount(SectionRenderer, {
      props: { section: unknownSection },
      global: { stubs },
    })
    expect(wrapper.html()).toBe('<!--v-if-->')
  })
})
