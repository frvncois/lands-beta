import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'

// Teleport is stubbed globally in setup.ts

describe('ConfirmDialog', () => {
  const baseProps = {
    modelValue: true,
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
  }

  it('renders the message', () => {
    const wrapper = mount(ConfirmDialog, { props: baseProps })
    expect(wrapper.text()).toContain('This action cannot be undone.')
  })

  it('renders default confirm and cancel labels', () => {
    const wrapper = mount(ConfirmDialog, { props: baseProps })
    expect(wrapper.text()).toContain('Confirm')
    expect(wrapper.text()).toContain('Cancel')
  })

  it('renders custom labels', () => {
    const wrapper = mount(ConfirmDialog, {
      props: { ...baseProps, confirmLabel: 'Delete', cancelLabel: 'Go back' },
    })
    expect(wrapper.text()).toContain('Delete')
    expect(wrapper.text()).toContain('Go back')
  })

  it('emits confirm when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, { props: baseProps })
    const buttons = wrapper.findAll('button').filter((b) => b.text() === 'Confirm')
    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, { props: baseProps })
    const buttons = wrapper.findAll('button').filter((b) => b.text() === 'Cancel')
    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits update:modelValue false when confirmed', async () => {
    const wrapper = mount(ConfirmDialog, { props: baseProps })
    const buttons = wrapper.findAll('button').filter((b) => b.text() === 'Confirm')
    await buttons[0]?.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([false])
  })

  it('emits update:modelValue false when cancelled', async () => {
    const wrapper = mount(ConfirmDialog, { props: baseProps })
    const buttons = wrapper.findAll('button').filter((b) => b.text() === 'Cancel')
    await buttons[0]?.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([false])
  })
})
