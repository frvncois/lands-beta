<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRightIcon } from '@heroicons/vue/24/outline'
import { sortByPosition } from '@/lib/utils/position'
import { getFaviconUrl } from '@/lib/utils/favicon'
import type { ListItem } from '@/types/list'
import type { ListSettings } from '@/types/section'
import { LIST_STYLES } from '@/types/section'
import { useLandTheme } from '@/composables/useLandTheme'

const props = defineProps<{
  listItems?: ListItem[]
  settings: ListSettings
}>()

const { isThemedContext, textColor, textMutedColor, surfaceColor, hoverColor } = useLandTheme()

const sortedItems = computed(() => sortByPosition(props.listItems ?? []))
const isCompact = computed(() => props.settings?.style === LIST_STYLES.compact)

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
  <section class="px-6 md:px-8 max-w-2xl py-8">
    <div class="flex flex-col gap-1">
      <a
        v-for="item in sortedItems"
        :key="item.id"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        :class="[
          'flex items-center gap-3 rounded-md transition-colors duration-fast',
          isCompact ? 'p-2 gap-2' : 'p-3',
          !isThemedContext && 'hover:bg-gray-50',
        ]"
        :style="isThemedContext ? { color: textColor } : {}"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <!-- Icon -->
        <div
          class="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 overflow-hidden"
          :class="!isThemedContext && 'bg-gray-100'"
          :style="isThemedContext ? { backgroundColor: surfaceColor } : {}"
        >
          <img
            v-if="item.icon || item.url"
            :src="item.icon || getFaviconUrl(item.url)"
            :alt="item.title"
            class="w-4 h-4 object-contain"
            @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
          />
        </div>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <p
            :class="['font-medium truncate', isCompact ? 'text-xs' : 'text-sm', !isThemedContext && 'text-gray-900']"
            :style="isThemedContext ? { color: textColor } : {}"
          >
            {{ item.title }}
          </p>
          <p
            v-if="!isCompact && item.description"
            class="text-sm truncate"
            :class="!isThemedContext && 'text-gray-500'"
            :style="isThemedContext ? { color: textMutedColor } : {}"
          >
            {{ item.description }}
          </p>
        </div>

        <!-- External link indicator -->
        <ArrowUpRightIcon class="h-4 w-4 shrink-0 opacity-40" />
      </a>
    </div>
  </section>
</template>
