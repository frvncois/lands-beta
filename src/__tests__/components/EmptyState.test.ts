import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FolderIcon } from '@heroicons/vue/24/outline'
import EmptyState from '@/components/shared/EmptyState.vue'

describe('EmptyState', () => {
  it('renders the title', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Nothing here' } })
    expect(wrapper.find('h3').text()).toBe('Nothing here')
  })

  it('renders description when provided', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Empty', description: 'No items yet' },
    })
    expect(wrapper.find('p').text()).toBe('No items yet')
  })

  it('does not render description when not provided', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Empty' } })
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders icon when provided', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Empty', icon: FolderIcon },
    })
    // FolderIcon renders as an svg
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('does not render icon slot when no icon', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Empty' } })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('renders default slot content', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Empty' },
      slots: { default: '<button class="cta">Add item</button>' },
    })
    expect(wrapper.find('.cta').exists()).toBe(true)
  })
})
