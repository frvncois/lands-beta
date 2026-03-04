<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AddSectionModal from '@/components/modals/AddSectionModal.vue'
import { generatePositionBetween } from '@/lib/utils/position'
import type { SectionType } from '@/types/section'
import { useEditorActions } from '@/composables/useEditorActions'

const props = withDefaults(defineProps<{
  before?: string | null
  after?: string | null
}>(), {
  before: null,
  after: null,
})

const { addSection } = useEditorActions()
const showModal = ref(false)

function handleAdd(type: SectionType) {
  const position = generatePositionBetween(props.before ?? null, props.after ?? null)
  addSection(type, position)
}
</script>

<template>
  <div class="relative h-0 group/inserter z-10">
    <div class="absolute inset-x-0 -top-3 -bottom-3" />
    <button
      class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 rounded-full bg-white border border-gray-200 shadow-sm transition-opacity duration-fast delay-100 opacity-0 group-hover/inserter:opacity-100"
      @click="showModal = true"
    >
      <PlusIcon class="h-3.5 w-3.5" />
      Add section
    </button>
  </div>

  <AddSectionModal v-model="showModal" @add="handleAdd" />
</template>
