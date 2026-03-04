<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRightIcon } from '@heroicons/vue/24/outline'
import { sortByPosition } from '@/lib/utils/position'
import type { Collection } from '@/types/collection'
import type { CollectionSettings } from '@/types/section'
import { COLLECTION_DISPLAY_STYLES } from '@/types/section'
import { useLandTheme } from '@/composables/useLandTheme'

const props = defineProps<{
  collections?: Collection[]
  settings: CollectionSettings
}>()

const { isThemedContext, textColor, textMutedColor, borderColor, surfaceColor, hoverColor } = useLandTheme()

// A collection section has one implicit collection — render its items directly
const items = computed(() =>
  sortByPosition(props.collections?.[0]?.items ?? [])
)

const gridColsClass = computed(() => {
  const cols = props.settings?.columns ?? 3
  if (cols === 2) return 'grid-cols-1 md:grid-cols-2'
  if (cols === 4) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
})

function onMouseEnter(e: MouseEvent) {
  if (isThemedContext && hoverColor.value) {
    (e.currentTarget as HTMLElement).style.backgroundColor = hoverColor.value
  }
}
function onMouseLeave(e: MouseEvent) {
  if (isThemedContext) {
    (e.currentTarget as HTMLElement).style.backgroundColor = ''
  }
}
</script>

<template>
  <section class="px-6 md:px-8 py-8">

    <!-- Grid display -->
    <div v-if="settings?.style === COLLECTION_DISPLAY_STYLES.grid" :class="['grid gap-4', gridColsClass]">
      <component
        v-for="item in items"
        :key="item.id"
        :is="item.external_url ? 'a' : 'div'"
        :href="item.external_url || undefined"
        :target="item.external_url ? '_blank' : undefined"
        :rel="item.external_url ? 'noopener noreferrer' : undefined"
      >
        <div class="aspect-square overflow-hidden rounded-md bg-gray-100">
          <img v-if="item.media_url" :src="item.media_url" :alt="item.title" class="w-full h-full object-cover" />
        </div>
        <p
          class="text-sm font-medium mt-2 truncate"
          :class="!isThemedContext && 'text-gray-900'"
          :style="isThemedContext ? { color: textColor } : {}"
        >
          {{ item.title }}
        </p>
      </component>
    </div>

    <!-- List display -->
    <div v-else-if="settings?.style === COLLECTION_DISPLAY_STYLES.list" class="flex flex-col gap-2">
      <component
        v-for="item in items"
        :key="item.id"
        :is="item.external_url ? 'a' : 'div'"
        :href="item.external_url || undefined"
        :target="item.external_url ? '_blank' : undefined"
        :rel="item.external_url ? 'noopener noreferrer' : undefined"
        class="flex items-center gap-3 p-3 rounded-md transition-colors duration-fast"
        :class="!isThemedContext && 'hover:bg-gray-50'"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <div
          class="w-12 h-12 rounded-sm overflow-hidden shrink-0"
          :class="!isThemedContext && 'bg-gray-100'"
          :style="isThemedContext ? { backgroundColor: surfaceColor } : {}"
        >
          <img v-if="item.media_url" :src="item.media_url" :alt="item.title" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium"
            :class="!isThemedContext && 'text-gray-900'"
            :style="isThemedContext ? { color: textColor } : {}"
          >
            {{ item.title }}
          </p>
          <p
            v-if="item.description"
            class="text-sm line-clamp-1"
            :class="!isThemedContext && 'text-gray-500'"
            :style="isThemedContext ? { color: textMutedColor } : {}"
          >
            {{ item.description }}
          </p>
        </div>
        <ArrowUpRightIcon v-if="item.external_url" class="h-4 w-4 shrink-0 opacity-40" />
      </component>
    </div>

    <!-- Cards display -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <component
        v-for="item in items"
        :key="item.id"
        :is="item.external_url ? 'a' : 'div'"
        :href="item.external_url || undefined"
        :target="item.external_url ? '_blank' : undefined"
        :rel="item.external_url ? 'noopener noreferrer' : undefined"
        class="rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-fast"
        :style="isThemedContext ? { border: `1px solid ${borderColor}` } : {}"
        :class="!isThemedContext && 'border border-gray-100'"
      >
        <div class="aspect-video overflow-hidden bg-gray-100">
          <img v-if="item.media_url" :src="item.media_url" :alt="item.title" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <p
            class="text-base font-semibold"
            :class="!isThemedContext && 'text-gray-900'"
            :style="isThemedContext ? { color: textColor } : {}"
          >
            {{ item.title }}
          </p>
          <p
            v-if="item.description"
            class="text-sm mt-1 line-clamp-2"
            :class="!isThemedContext && 'text-gray-500'"
            :style="isThemedContext ? { color: textMutedColor } : {}"
          >
            {{ item.description }}
          </p>
        </div>
      </component>
    </div>

  </section>
</template>
