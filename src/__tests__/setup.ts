import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Stub Teleport so modal/portal content renders inside the wrapper's DOM
config.global.stubs = {
  Teleport: { template: '<div><slot /></div>' },
}

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
})

// Mock crypto.randomUUID for deterministic test output
Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: vi.fn(() => '12345678-1234-1234-1234-123456789012'),
  writable: true,
  configurable: true,
})
