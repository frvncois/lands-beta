<script setup lang="ts">
import { computed } from 'vue'
import type { HeaderContent, HeaderSettings } from '@/types/section'
import type { Land } from '@/types/land'
import { useLandTheme } from '@/composables/useLandTheme'
import { onImageError } from '@/lib/utils/imageFallback'

const props = defineProps<{
  content?: HeaderContent | null
  settings: HeaderSettings
  land?: Land
}>()

const { isThemedContext, textColor, textMutedColor } = useLandTheme()

const coverHeightClass = computed(() =>
  props.settings?.cover_size === 'full' ? 'h-screen' : 'h-[50vh]'
)

const isOverlapping = computed(() => props.settings?.profile_position === 'overlapping')

const title = computed(() => props.content?.title || props.land?.title || '')
const subtitle = computed(() => props.content?.subtitle || '')
const initial = computed(() => title.value.charAt(0).toUpperCase() || '?')
</script>

<template>
  <section>
    <!-- Cover image -->
    <div :class="['w-full relative overflow-hidden', coverHeightClass]">
      <img
        v-if="land?.cover_image"
        :src="land.cover_image"
        alt="Cover"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div v-else class="w-full h-full bg-gray-100" />

      <!-- Overlapping avatar: rendered inside cover, pulled half-out via translate -->
      <div v-if="isOverlapping" class="absolute bottom-0 left-0 px-6 md:px-8 translate-y-1/2">
        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 shrink-0">
          <img v-if="land?.avatar_image" :src="land.avatar_image" alt="Avatar" class="w-full h-full object-cover" @error="onImageError" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">{{ initial }}</div>
        </div>
      </div>
    </div>

    <!-- Content below cover -->
    <div class="px-6 md:px-8 max-w-4xl">
      <div v-if="isOverlapping" class="pt-14 md:pt-18" />
      <div v-else class="mt-6">
        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
          <img v-if="land?.avatar_image" :src="land.avatar_image" alt="Avatar" class="w-full h-full object-cover" @error="onImageError" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">{{ initial }}</div>
        </div>
      </div>

      <h1
        class="text-2xl md:text-4xl font-bold mt-4"
        :class="!isThemedContext && 'text-gray-900'"
        :style="isThemedContext ? { color: textColor } : {}"
      >
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="text-lg mt-2"
        :class="!isThemedContext && 'text-gray-500'"
        :style="isThemedContext ? { color: textMutedColor } : {}"
      >
        {{ subtitle }}
      </p>
      <p
        v-if="land?.description"
        class="text-base mt-3"
        :class="!isThemedContext && 'text-gray-600'"
        :style="isThemedContext ? { color: textMutedColor } : {}"
      >
        {{ land.description }}
      </p>
    </div>
  </section>
</template>
