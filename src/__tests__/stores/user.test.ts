import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { mockUser } from '../helpers/mockData'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.isLoading).toBe(false)
  })

  it('fullName returns empty string when no user', () => {
    const store = useUserStore()
    expect(store.fullName).toBe('')
  })

  it('initials returns ? when no user', () => {
    const store = useUserStore()
    expect(store.initials).toBe('?')
  })

  it('setUser sets user and marks authenticated', () => {
    const store = useUserStore()
    store.setUser(mockUser)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('fullName computes from first and last name', () => {
    const store = useUserStore()
    store.setUser(mockUser)
    expect(store.fullName).toBe('Jane Doe')
  })

  it('initials computes uppercase first chars', () => {
    const store = useUserStore()
    store.setUser(mockUser)
    expect(store.initials).toBe('JD')
  })

  it('initials falls back to ? when names are empty', () => {
    const store = useUserStore()
    store.setUser({ ...mockUser, first_name: '', last_name: '' })
    expect(store.initials).toBe('?')
  })

  it('clearUser resets user and auth state', () => {
    const store = useUserStore()
    store.setUser(mockUser)
    store.clearUser()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
