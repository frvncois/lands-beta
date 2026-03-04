<script setup lang="ts">
import { computed } from 'vue'
import { UserCircleIcon, DocumentTextIcon, PhotoIcon, ListBulletIcon, SquaresPlusIcon } from '@heroicons/vue/24/outline'
import BaseModal from '@/components/ui/BaseModal.vue'
import { SECTION_TYPES, type SectionType } from '@/types/section'
import { useLandStore } from '@/stores/land'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'add': [type: SectionType]
}>()

const landStore = useLandStore()

const hasHeader = computed(() =>
  landStore.activeLand?.sections.some((s) => s.type === SECTION_TYPES.header) ?? false
)

const ALL_OPTIONS = [
  {
    type: SECTION_TYPES.header,
    icon: UserCircleIcon,
    label: 'Header',
    description: 'Profile with cover image',
  },
  {
    type: SECTION_TYPES.text,
    icon: DocumentTextIcon,
    label: 'Text',
    description: 'Write with markdown support',
  },
  {
    type: SECTION_TYPES.media,
    icon: PhotoIcon,
    label: 'Media',
    description: 'Images and videos',
  },
  {
    type: SECTION_TYPES.list,
    icon: ListBulletIcon,
    label: 'List',
    description: 'Curated links with icons',
  },
  {
    type: SECTION_TYPES.collection,
    icon: SquaresPlusIcon,
    label: 'Collection',
    description: 'Items with thumbnails',
  },
]

const sectionOptions = computed(() =>
  ALL_OPTIONS.filter((o) => o.type !== SECTION_TYPES.header || !hasHeader.value)
)

function select(type: SectionType) {
  emit('add', type)
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Add section" size="sm" @update:model-value="emit('update:modelValue', $event)">
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="option in sectionOptions"
        :key="option.type"
        class="flex flex-col items-start gap-2 p-3 rounded-md border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-fast text-left"
        @click="select(option.type)"
      >
        <component :is="option.icon" class="h-5 w-5 text-gray-500" />
        <div>
          <p class="text-sm font-medium text-gray-900">{{ option.label }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ option.description }}</p>
        </div>
      </button>
    </div>
  </BaseModal>
</template>
