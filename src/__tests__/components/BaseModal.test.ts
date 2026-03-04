import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '@/components/ui/BaseModal.vue'

// Teleport is stubbed globally in setup.ts

describe('BaseModal', () => {
  it('does not render content when modelValue is false', () => {
    const wrapper = mount(BaseModal, { props: { modelValue: false } })
    expect(wrapper.find('.bg-black\\/30').exists()).toBe(false)
  })

  it('renders content when modelValue is true', () => {
    const wrapper = mount(BaseModal, { props: { modelValue: true } })
    expect(wrapper.find('.bg-white').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(BaseModal, {
      props: { modelValue: true },
      slots: { default: '<p class="test-slot">Hello</p>' },
    })
    expect(wrapper.find('.test-slot').exists()).toBe(true)
  })

  it('renders title when provided', () => {
    const wrapper = mount(BaseModal, {
      props: { modelValue: true, title: 'My Modal' },
    })
    expect(wrapper.find('h3').text()).toBe('My Modal')
  })

  it('does not render h3 without title', () => {
    const wrapper = mount(BaseModal, { props: { modelValue: true } })
    expect(wrapper.find('h3').exists()).toBe(false)
  })

  it('emits update:modelValue false when close button is clicked', async () => {
    const wrapper = mount(BaseModal, {
      props: { modelValue: true, title: 'Test' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('applies md size by default', () => {
    const wrapper = mount(BaseModal, { props: { modelValue: true } })
    expect(wrapper.find('.max-w-\\[520px\\]').exists()).toBe(true)
  })

  it('applies sm size class when size=sm', () => {
    const wrapper = mount(BaseModal, { props: { modelValue: true, size: 'sm' } })
    expect(wrapper.find('.max-w-\\[400px\\]').exists()).toBe(true)
  })
})
