<script setup lang="ts">
import { computed, provide } from 'vue'
import type { LandTheme } from '@/types/theme'

const props = defineProps<{
  theme: LandTheme
}>()

provide('isThemedContext', true)
provide('landTheme', props.theme)

const themeStyles = computed(() => ({
  '--land-color-main': props.theme.color_main,
  '--land-color-accent': props.theme.color_accent,
  '--land-color-surface': props.theme.color_surface,
  '--land-bg': props.theme.color_mode === 'dark' ? '#18181B' : '#FFFFFF',
  '--land-text': props.theme.color_mode === 'dark' ? '#FAFAFA' : '#18181B',
  '--land-text-muted': props.theme.color_mode === 'dark' ? '#A1A1AA' : '#71717A',
  '--land-text-subtle': props.theme.color_mode === 'dark' ? '#71717A' : '#A1A1AA',
  '--land-border': props.theme.color_mode === 'dark' ? '#3F3F46' : '#E4E4E7',
  '--land-surface': props.theme.color_mode === 'dark' ? '#27272A' : '#F4F4F5',
  '--land-hover': props.theme.color_mode === 'dark' ? '#3F3F46' : '#F4F4F5',
  '--land-font': props.theme.typography_style === 'serif'
    ? 'Georgia, "Times New Roman", Times, serif'
    : props.theme.typography_style === 'mono'
      ? '"JetBrains Mono", "Fira Code", ui-monospace, monospace'
      : '"Satoshi", system-ui, -apple-system, sans-serif',
}))
</script>

<template>
  <div
    :style="themeStyles"
    class="min-h-screen transition-colors duration-slow"
    :class="theme.color_mode === 'dark' ? 'bg-zinc-950' : 'bg-white'"
    style="font-family: var(--land-font)"
  >
    <slot />
  </div>
</template>
