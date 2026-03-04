import { apiRequest } from './api'
import type { WatchlistEntry } from '@/types/watchlist'

export const watchlistService = {
  async getMyWatchlist(): Promise<WatchlistEntry[]> {
    return apiRequest<WatchlistEntry[]>('/watchlist')
  },

  async addToWatchlist(landId: string): Promise<WatchlistEntry> {
    return apiRequest<WatchlistEntry>('/watchlist', {
      method: 'POST',
      body: { land_id: landId },
    })
  },

  async removeFromWatchlist(landId: string): Promise<void> {
    return apiRequest<void>(`/watchlist/${landId}`, { method: 'DELETE' })
  },
}
