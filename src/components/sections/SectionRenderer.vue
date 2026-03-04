<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { Section } from '@/types/section'
import type { Land } from '@/types/land'
import type { Collection } from '@/types/collection'
import type { ListItem } from '@/types/list'
import { SECTION_TYPES } from '@/types/section'

// Display components
import HeaderSection from './display/HeaderSection.vue'
import TextSection from './display/TextSection.vue'
import MediaSection from './display/MediaSection.vue'
import ListSection from './display/ListSection.vue'
import CollectionSection from './display/CollectionSection.vue'

// Editor components
import HeaderEditor from './editor/HeaderEditor.vue'
import TextEditor from './editor/TextEditor.vue'
import MediaEditor from './editor/MediaEditor.vue'
import ListEditor from './editor/ListEditor.vue'
import CollectionEditor from './editor/CollectionEditor.vue'

const props = withDefaults(defineProps<{
  section: Section
  land?: Land
  collections?: Collection[]
  listItems?: ListItem[]
  mode?: 'display' | 'editor'
}>(), {
  mode: 'display',
})

const displayComponents = {
  [SECTION_TYPES.header]: HeaderSection,
  [SECTION_TYPES.text]: TextSection,
  [SECTION_TYPES.media]: MediaSection,
  [SECTION_TYPES.list]: ListSection,
  [SECTION_TYPES.collection]: CollectionSection,
}

const editorComponents = {
  [SECTION_TYPES.header]: HeaderEditor,
  [SECTION_TYPES.text]: TextEditor,
  [SECTION_TYPES.media]: MediaEditor,
  [SECTION_TYPES.list]: ListEditor,
  [SECTION_TYPES.collection]: CollectionEditor,
}

const currentComponent = computed<Component | null>(() => {
  const map = props.mode === 'editor' ? editorComponents : displayComponents
  return map[props.section.type] || null
})
</script>

<template>
  <component
    :is="currentComponent"
    v-if="currentComponent"
    :section="section"
    :content="section.content"
    :settings="section.settings_json"
    :land="land"
    :collections="collections"
    :list-items="listItems"
  />
</template>
