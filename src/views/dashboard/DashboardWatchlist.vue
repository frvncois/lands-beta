<script setup lang="ts">
import { computed } from 'vue'
import { EyeSlashIcon, EyeIcon } from '@heroicons/vue/24/outline'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { mockState } from '@/lib/mock/provider'
import { onImageError } from '@/lib/utils/imageFallback'

const watchlist = computed(() => mockState.watchlist)

function removeFromWatchlist(landId: string) {
  const idx = mockState.watchlist.findIndex((w) => w.land_id === landId)
  if (idx !== -1) mockState.watchlist.splice(idx, 1)
}
</script>

<template>
  <div class="max-w-3xl">
    <h1 class="text-xl font-bold text-gray-900 mb-6">Watchlist</h1>

    <EmptyState
      v-if="watchlist.length === 0"
      title="Nothing here yet"
      description="Lands you watch will show up here. Browse around and save the ones you like."
      :icon="EyeIcon"
    />

    <div class="flex flex-col gap-4">
      <BaseCard
        v-for="entry in watchlist"
        :key="entry.id"
        padding="none"
        hoverable
      >
        <a
          :href="`/${entry.land.handle}`"
          class="block"
        >
          <!-- Cover image strip -->
          <div
            class="h-24 rounded-t-lg bg-cover bg-center"
            :class="!entry.land.cover_image && 'bg-gradient-to-br from-gray-100 to-gray-50'"
            :style="entry.land.cover_image ? { backgroundImage: `url(${entry.land.cover_image})` } : {}"
          />

          <!-- Content -->
          <div class="p-4 flex items-start gap-3">
            <BaseAvatar
              :src="entry.land.avatar_image"
              :alt="entry.land.title"
              size="md"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 truncate">
                {{ entry.land.title }}
              </h3>
              <p class="text-xs text-gray-400">{{ entry.land.handle }}.lands.app</p>
              <p
                v-if="entry.land.description"
                class="text-sm text-gray-500 mt-1 line-clamp-2"
              >
                {{ entry.land.description }}
              </p>
            </div>

            <!-- Remove button -->
            <button
              class="shrink-0 p-2 text-gray-400 hover:text-danger transition-colors duration-fast rounded-md hover:bg-gray-50"
              title="Remove from watchlist"
              @click.prevent="removeFromWatchlist(entry.land.id)"
            >
              <EyeSlashIcon class="h-4 w-4" />
            </button>
          </div>
        </a>
      </BaseCard>
    </div>
  </div>
</template>
