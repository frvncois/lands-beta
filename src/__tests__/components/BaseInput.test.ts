import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/ui/BaseInput.vue'

describe('BaseInput', () => {
  it('renders an input element', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('binds modelValue to input value', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: 'test' } })
    expect(wrapper.find('input').element.value).toBe('test')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('shows label when provided', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', label: 'Email' } })
    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Email')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('shows error message when error prop is provided', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', error: 'Required' } })
    expect(wrapper.find('span').text()).toBe('Required')
  })

  it('does not render error span without error prop', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('sets input as disabled when disabled prop is true', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('passes placeholder to input', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', placeholder: 'Enter name' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter name')
  })
})
