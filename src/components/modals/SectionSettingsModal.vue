<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import {
  SECTION_TYPES,
  HEADER_COVER_SIZES,
  HEADER_PROFILE_POSITIONS,
  type Section,
  type HeaderSettings,
  type CollectionSettings,
} from '@/types/section'
import { STYLE_VARIANTS_BY_SECTION } from '@/lib/primitives/styleVariants'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  modelValue: boolean
  section: Section
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { updateSectionStyleVariant, updateSectionSettings } = useEditorActions()

const title = computed(() => ({
  [SECTION_TYPES.header]: 'Header settings',
  [SECTION_TYPES.text]: 'Text settings',
  [SECTION_TYPES.media]: 'Media settings',
  [SECTION_TYPES.list]: 'List settings',
  [SECTION_TYPES.collection]: 'Collection settings',
}[props.section.type] ?? 'Section settings'))

const variants = computed(() => STYLE_VARIANTS_BY_SECTION[props.section.type] ?? [])

const headerSettings = computed(() =>
  props.section.type === SECTION_TYPES.header
    ? (props.section.settings_json as HeaderSettings)
    : null
)

const collectionSettings = computed(() =>
  props.section.type === SECTION_TYPES.collection
    ? (props.section.settings_json as CollectionSettings)
    : null
)

const coverSizeOptions = [
  { value: HEADER_COVER_SIZES.half, label: 'Half' },
  { value: HEADER_COVER_SIZES.full, label: 'Full' },
]

const profilePositionOptions = [
  { value: HEADER_PROFILE_POSITIONS.overlapping, label: 'Overlapping' },
  { value: HEADER_PROFILE_POSITIONS.below, label: 'Below' },
]
</script>

<template>
  <BaseModal :model-value="modelValue" :title="title" size="sm" @update:model-value="emit('update:modelValue', $event)">
    <div class="space-y-6">

      <!-- Style variants (Text, Media, List, Collection) -->
      <div v-if="variants.length > 0" class="space-y-2">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Style</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="variant in variants"
            :key="variant.value"
            :class="[
              'px-3 py-1.5 text-sm rounded-md border transition-colors duration-fast',
              section.style_variant === variant.value
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:border-gray-300',
            ]"
            @click="updateSectionStyleVariant(section.id, variant.value)"
          >
            {{ variant.label }}
          </button>
        </div>
      </div>

      <!-- Header: cover size + profile position -->
      <template v-if="headerSettings">
        <div class="space-y-2">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Cover size</p>
          <div class="flex gap-2">
            <button
              v-for="opt in coverSizeOptions"
              :key="opt.value"
              :class="[
                'flex-1 py-1.5 text-sm rounded-md border transition-colors duration-fast',
                headerSettings.cover_size === opt.value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300',
              ]"
              @click="updateSectionSettings(section.id, { ...headerSettings, cover_size: opt.value })"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Profile position</p>
          <div class="flex gap-2">
            <button
              v-for="opt in profilePositionOptions"
              :key="opt.value"
              :class="[
                'flex-1 py-1.5 text-sm rounded-md border transition-colors duration-fast',
                headerSettings.profile_position === opt.value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300',
              ]"
              @click="updateSectionSettings(section.id, { ...headerSettings, profile_position: opt.value })"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </template>

      <!-- Collection: columns (only for grid style) -->
      <div v-if="collectionSettings && section.style_variant === 'grid'" class="space-y-2">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Columns</p>
        <div class="flex gap-2">
          <button
            v-for="n in [2, 3, 4]"
            :key="n"
            :class="[
              'flex-1 py-1.5 text-sm rounded-md border transition-colors duration-fast',
              (collectionSettings.columns ?? 3) === n
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:border-gray-300',
            ]"
            @click="updateSectionSettings(section.id, { ...collectionSettings, columns: n })"
          >
            {{ n }}
          </button>
        </div>
      </div>

    </div>
  </BaseModal>
</template>
