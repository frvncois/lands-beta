<script setup lang="ts">
import { computed } from 'vue'
import { onImageError } from '@/lib/utils/imageFallback'

const props = withDefaults(defineProps<{
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  }
  return sizes[props.size]
})

const initial = computed(() => props.alt?.charAt(0)?.toUpperCase() || '?')
</script>

<template>
  <div :class="['rounded-full overflow-hidden shrink-0', sizeClasses]">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      @error="onImageError"
    />
    <div
      v-else
      class="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 font-semibold"
    >
      {{ initial }}
    </div>
  </div>
</template>
