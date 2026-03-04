<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/lib/utils/markdown'
import type { TextContent, TextSettings } from '@/types/section'
import { useLandTheme } from '@/composables/useLandTheme'

const props = defineProps<{
  content?: TextContent | null
  settings: TextSettings
}>()

const { isThemedContext } = useLandTheme()

const rendered = computed(() => renderMarkdown(props.content?.body ?? ''))

const layoutClass = computed(() => {
  const style = props.settings?.style
  if (style === 'centered') return 'max-w-2xl mx-auto text-center'
  if (style === 'wide') return 'max-w-4xl'
  return 'max-w-2xl'
})
</script>

<template>
  <section class="px-6 md:px-8 py-8">
    <div :class="['prose', layoutClass, isThemedContext && 'themed']" v-html="rendered" />
  </section>
</template>

<style scoped>
@reference "../../../assets/styles/main.css";

.prose :deep(h1) { @apply text-2xl font-bold mt-8 mb-4 text-gray-900; }
.prose :deep(h2) { @apply text-xl font-semibold mt-6 mb-3 text-gray-900; }
.prose :deep(h3) { @apply text-lg font-semibold mt-4 mb-2 text-gray-900; }
.prose :deep(p) { @apply text-base leading-relaxed text-gray-700 mb-4; }
.prose :deep(a) { @apply text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors duration-fast; }
.prose :deep(strong) { @apply font-semibold text-gray-900; }
.prose :deep(em) { @apply italic; }
.prose :deep(ul) { @apply list-disc pl-6 mb-4 text-gray-700; }
.prose :deep(ol) { @apply list-decimal pl-6 mb-4 text-gray-700; }
.prose :deep(li) { @apply mb-1; }
.prose :deep(blockquote) { @apply border-l-2 border-gray-200 pl-4 italic text-gray-500 my-4; }

/* Themed overrides — active only inside ThemeProvider */
.themed :deep(h1),
.themed :deep(h2),
.themed :deep(h3),
.themed :deep(strong) {
  color: var(--land-color-main);
}
.themed :deep(p),
.themed :deep(li) {
  color: var(--land-text-muted);
}
.themed :deep(a) {
  color: var(--land-color-accent);
}
.themed :deep(blockquote) {
  border-color: var(--land-color-accent);
  color: var(--land-text-subtle);
}
</style>
