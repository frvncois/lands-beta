import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'

describe('BaseAvatar', () => {
  it('renders img when src is provided', () => {
    const wrapper = mount(BaseAvatar, { props: { src: 'https://example.com/photo.jpg', alt: 'Jane' } })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/photo.jpg')
  })

  it('shows initials fallback when src is not provided', () => {
    const wrapper = mount(BaseAvatar, { props: { alt: 'Jane Doe' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('J')
  })

  it('shows ? when alt is empty', () => {
    const wrapper = mount(BaseAvatar, { props: { alt: '' } })
    expect(wrapper.text()).toContain('?')
  })

  it('applies md size classes by default', () => {
    const wrapper = mount(BaseAvatar, { props: { alt: 'Jane' } })
    expect(wrapper.classes().join(' ')).toContain('h-10')
  })

  it('applies sm size classes', () => {
    const wrapper = mount(BaseAvatar, { props: { alt: 'Jane', size: 'sm' } })
    expect(wrapper.classes().join(' ')).toContain('h-8')
  })

  it('applies lg size classes', () => {
    const wrapper = mount(BaseAvatar, { props: { alt: 'Jane', size: 'lg' } })
    expect(wrapper.classes().join(' ')).toContain('h-14')
  })

  it('uppercases the initial', () => {
    const wrapper = mount(BaseAvatar, { props: { alt: 'jane' } })
    expect(wrapper.text()).toContain('J')
  })
})
