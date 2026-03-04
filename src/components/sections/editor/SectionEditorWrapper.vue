<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref } from 'vue'
import { TrashIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import BaseDragHandle from '@/components/ui/BaseDragHandle.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import SectionSettingsModal from '@/components/modals/SectionSettingsModal.vue'
import type { Section } from '@/types/section'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  section: Section
  isActive: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const { deleteSection } = useEditorActions()

const showDeleteConfirm = ref(false)
const showSettings = ref(false)
</script>

<template>
  <div
    :data-section-id="section.id"
    :class="[
      'relative group transition-all duration-fast',
      isActive
        ? 'ring-2 ring-gray-900 rounded-lg'
        : 'hover:ring-1 hover:ring-gray-200 hover:ring-offset-4 hover:rounded-lg',
    ]"
    @click.stop="emit('select')"
  >
    <!-- Floating toolbar — visible on hover or when active -->
    <div
      :class="[
        'absolute top-2 left-4 flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-md px-2 py-1 z-10 transition-opacity duration-fast',
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ]"
    >
      <BaseDragHandle class="section-drag-handle" />

      <button
        class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors duration-fast rounded-full hover:bg-gray-100"
        title="Style settings"
        @click.stop="showSettings = true"
      >
        <Cog6ToothIcon class="h-4 w-4" />
      </button>

      <button
        class="p-1.5 text-gray-400 hover:text-danger transition-colors duration-fast rounded-full hover:bg-gray-100"
        title="Delete section"
        @click.stop="showDeleteConfirm = true"
      >
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- Section content -->
    <div>
      <slot />
    </div>
  </div>

  <SectionSettingsModal v-model="showSettings" :section="section" />

  <ConfirmDialog
    v-model="showDeleteConfirm"
    title="Delete section"
    message="Delete this section? This cannot be undone."
    confirm-label="Delete"
    :destructive="true"
    @confirm="deleteSection(section.id)"
  />
</template>
