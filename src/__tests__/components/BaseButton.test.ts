import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('defaults to ghost variant and md size', () => {
    const wrapper = mount(BaseButton)
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('hover:bg-gray-100')
    expect(classes).toContain('text-sm')
  })

  it('applies solid variant classes', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'solid' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('bg-gray-900')
  })

  it('applies outline variant classes', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'outline' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('border')
  })

  it('applies sm size classes', () => {
    const wrapper = mount(BaseButton, { props: { size: 'sm' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('text-xs')
  })

  it('applies lg size classes', () => {
    const wrapper = mount(BaseButton, { props: { size: 'lg' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('px-6')
  })

  it('adds disabled attribute when disabled prop is true', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('adds opacity class when disabled', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    expect(wrapper.find('button').classes()).toContain('opacity-50')
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('adds disabled attribute when loading', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
