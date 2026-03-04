<script setup lang="ts">
import { computed } from 'vue'
import { sortByPosition } from '@/lib/utils/position'
import { getEmbedUrl } from '@/lib/utils/videoEmbed'
import type { MediaContent, MediaSettings } from '@/types/section'
import { MEDIA_TYPES } from '@/types/section'
import { useLandTheme } from '@/composables/useLandTheme'

const props = defineProps<{
  content?: MediaContent | null
  settings: MediaSettings
}>()

const { isThemedContext, textMutedColor } = useLandTheme()

const sortedItems = computed(() => sortByPosition(props.content?.items ?? []))

const gridClass = computed(() => {
  const count = sortedItems.value.length
  if (count >= 3) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
  return 'grid grid-cols-1 md:grid-cols-2 gap-4'
})

const wrapperClass = computed(() => {
  const style = props.settings?.style
  if (style === 'fullwidth') return ''
  if (style === 'compact') return 'max-w-2xl mx-auto px-6 md:px-8'
  return 'max-w-4xl px-6 md:px-8'
})
</script>

<template>
  <section class="py-8" :class="wrapperClass">
    <!-- Single item -->
    <div v-if="sortedItems.length === 1">
      <div v-for="item in sortedItems" :key="item.id">
        <template v-if="item.media_type === MEDIA_TYPES.image">
          <img :src="item.url" :alt="item.caption" class="rounded-md object-cover w-full" />
        </template>
        <template v-else>
          <div class="aspect-video rounded-md overflow-hidden bg-gray-100">
            <iframe
              v-if="getEmbedUrl(item.url)"
              :src="getEmbedUrl(item.url) ?? ''"
              class="w-full h-full"
              frameborder="0"
              allowfullscreen
            />
          </div>
        </template>
        <p
          v-if="item.caption"
          class="text-sm mt-2"
          :class="!isThemedContext && 'text-gray-500'"
          :style="isThemedContext ? { color: textMutedColor } : {}"
        >
          {{ item.caption }}
        </p>
      </div>
    </div>

    <!-- Multiple items — grid -->
    <div v-else-if="sortedItems.length > 1" :class="gridClass">
      <div v-for="item in sortedItems" :key="item.id">
        <template v-if="item.media_type === MEDIA_TYPES.image">
          <img :src="item.url" :alt="item.caption" class="rounded-md object-cover w-full aspect-square" />
        </template>
        <template v-else>
          <div class="aspect-video rounded-md overflow-hidden bg-gray-100">
            <iframe
              v-if="getEmbedUrl(item.url)"
              :src="getEmbedUrl(item.url) ?? ''"
              class="w-full h-full"
              frameborder="0"
              allowfullscreen
            />
          </div>
        </template>
        <p
          v-if="item.caption"
          class="text-sm mt-2"
          :class="!isThemedContext && 'text-gray-500'"
          :style="isThemedContext ? { color: textMutedColor } : {}"
        >
          {{ item.caption }}
        </p>
      </div>
    </div>
  </section>
</template>
