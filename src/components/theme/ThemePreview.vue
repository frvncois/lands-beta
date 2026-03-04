<script setup lang="ts">
import { computed } from 'vue'
import type { LandTheme } from '@/types/theme'

const props = defineProps<{
  theme: LandTheme
}>()

const bg = computed(() => props.theme.color_mode === 'dark' ? '#18181B' : '#FFFFFF')
const text = computed(() => props.theme.color_mode === 'dark' ? '#F4F4F5' : '#18181B')
const muted = computed(() => props.theme.color_mode === 'dark' ? '#71717A' : '#9CA3AF')

const fontFamily = computed(() => {
  if (props.theme.typography_style === 'serif') return 'Georgia, "Times New Roman", serif'
  if (props.theme.typography_style === 'mono') return '"Courier New", monospace'
  return 'system-ui, sans-serif'
})
</script>

<template>
  <div
    class="rounded-md overflow-hidden border border-gray-200 aspect-video select-none"
    :style="{ backgroundColor: bg, fontFamily }"
  >
    <!-- Cover stub -->
    <div class="h-1/3" :style="{ backgroundColor: theme.color_accent + '40' }" />
    <!-- Content -->
    <div class="px-4 pt-3 space-y-2">
      <div class="h-2 rounded-full w-20" :style="{ backgroundColor: text }" />
      <div class="h-1.5 rounded-full w-28" :style="{ backgroundColor: muted, opacity: 0.5 }" />
      <div class="h-px w-full my-2" :style="{ backgroundColor: muted, opacity: 0.2 }" />
      <div class="flex gap-2">
        <div class="h-1.5 rounded-full w-12" :style="{ backgroundColor: theme.color_main }" />
        <div class="h-1.5 rounded-full w-16" :style="{ backgroundColor: muted, opacity: 0.4 }" />
      </div>
    </div>
  </div>
</template>
