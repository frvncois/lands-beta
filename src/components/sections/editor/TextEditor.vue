<script setup lang="ts">
import { ref, computed } from 'vue'
import SectionEditorWrapper from './SectionEditorWrapper.vue'
import { renderMarkdown } from '@/lib/utils/markdown'
import type { Section, TextContent, TextSettings } from '@/types/section'
import { useEditorStore } from '@/stores/editor'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  section: Section
  content?: TextContent | null
  settings: TextSettings
}>()

const editorStore = useEditorStore()
const { updateSectionContent } = useEditorActions()
const isActive = computed(() => editorStore.activeSection?.id === props.section.id)
const localBody = ref(props.content?.body ?? '')

const layoutClass = computed(() => {
  const style = props.settings?.style
  if (style === 'centered') return 'max-w-2xl mx-auto text-center'
  if (style === 'wide') return 'max-w-4xl'
  return 'max-w-2xl'
})

function handleSelect() {
  editorStore.setActiveSection(props.section)
}

function saveContent() {
  updateSectionContent(props.section.id, { body: localBody.value })
}

function wrapSelection(before: string, after: string = before) {
  const textarea = document.querySelector<HTMLTextAreaElement>('.text-editor-textarea')
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = localBody.value.slice(start, end)
  localBody.value =
    localBody.value.slice(0, start) + before + selected + after + localBody.value.slice(end)
}

function insertHeading() {
  const textarea = document.querySelector<HTMLTextAreaElement>('.text-editor-textarea')
  if (!textarea) return
  const lineStart = localBody.value.lastIndexOf('\n', textarea.selectionStart - 1) + 1
  localBody.value = localBody.value.slice(0, lineStart) + '## ' + localBody.value.slice(lineStart)
}
</script>

<template>
  <SectionEditorWrapper
    :section="section"
    :is-active="isActive"
    @select="handleSelect"
  >
    <div class="px-6 md:px-8 py-8" :class="layoutClass">
      <template v-if="isActive">
        <!-- Toolbar -->
        <div class="flex items-center gap-1 p-1 border-b border-gray-100 mb-2">
          <button
            class="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors duration-fast"
            @click.stop="wrapSelection('**')"
          >B</button>
          <button
            class="px-2 py-1 text-xs italic text-gray-600 hover:bg-gray-100 rounded transition-colors duration-fast"
            @click.stop="wrapSelection('_')"
          >I</button>
          <button
            class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors duration-fast"
            @click.stop="insertHeading"
          >H2</button>
        </div>
        <!-- Textarea -->
        <textarea
          v-model="localBody"
          class="text-editor-textarea w-full min-h-[200px] font-mono text-sm text-gray-700 bg-transparent border-none outline-none resize-none focus:ring-0 p-0"
          placeholder="Write something..."
          @blur="saveContent"
          @click.stop
        />
      </template>
      <template v-else>
        <div class="prose" v-html="renderMarkdown(content?.body ?? '')" />
      </template>
    </div>
  </SectionEditorWrapper>
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
</style>
