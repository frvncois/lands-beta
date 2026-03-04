import { mount, type MountingOptions } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import type { Component } from 'vue'

export function mountWithPlugins(
  component: Component,
  options: MountingOptions<Record<string, unknown>> = {},
) {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })

  const { global: globalOptions, ...rest } = options

  return mount(component, {
    global: {
      plugins: [pinia, router, ...(globalOptions?.plugins ?? [])],
      stubs: {
        Teleport: { template: '<div><slot /></div>' },
        ...globalOptions?.stubs,
      },
      ...globalOptions,
    },
    ...rest,
  })
}
