import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { WatchlistEntry } from '@/types/watchlist'

export const useWatchlistStore = defineStore('watchlist', () => {
  const entries = ref<WatchlistEntry[]>([])
  const isLoading = ref(false)

  function setEntries(data: WatchlistEntry[]) {
    entries.value = data
  }

  function addEntry(entry: WatchlistEntry) {
    entries.value.push(entry)
  }

  function removeEntry(landId: string) {
    entries.value = entries.value.filter((e) => e.land_id !== landId)
  }

  return {
    entries,
    isLoading,
    setEntries,
    addEntry,
    removeEntry,
  }
})
