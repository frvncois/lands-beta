<script setup lang="ts">
import { ref, computed } from 'vue'
import { EyeIcon } from '@heroicons/vue/24/outline'
import { EyeIcon as EyeIconSolid } from '@heroicons/vue/24/solid'
import { useWatchlistStore } from '@/stores/watchlist'

const props = defineProps<{
  landId: string
}>()

const watchlistStore = useWatchlistStore()
const isToggling = ref(false)

const isWatching = computed(() =>
  watchlistStore.entries.some((e) => e.land_id === props.landId)
)

async function toggleWatch() {
  if (isToggling.value) return
  isToggling.value = true
  try {
    if (isWatching.value) {
      watchlistStore.removeEntry(props.landId)
      // TODO: call API to remove
    } else {
      watchlistStore.addEntry({
        id: crypto.randomUUID(),
        user_id: '',
        land_id: props.landId,
        created_at: new Date().toISOString(),
      })
      // TODO: call API to add
    }
  } finally {
    isToggling.value = false
  }
}
</script>

<template>
  <button
    :class="[
      'fixed top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-fast backdrop-blur-sm',
      isWatching
        ? 'bg-white/90 text-gray-900 shadow-md hover:shadow-lg'
        : 'bg-black/5 text-gray-700 hover:bg-black/10',
    ]"
    :disabled="isToggling"
    @click="toggleWatch"
  >
    <component :is="isWatching ? EyeIconSolid : EyeIcon" class="h-4 w-4" />
    {{ isWatching ? 'Watching' : 'Watch' }}
  </button>
</template>
