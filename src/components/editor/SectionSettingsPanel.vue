<script setup lang="ts">
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
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
import { useEditorStore } from '@/stores/editor'

const props = defineProps<{
  modelValue: boolean
  section: Section
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const editorStore = useEditorStore()
const { updateSectionStyleVariant, updateSectionSettings } = useEditorActions()

// Position panel to the left of the floating editor panel (settings w-64 = 256px, gap = 8px)
const panelStyle = computed(() => ({
  left: `${editorStore.panelPos.x - 256 - 8}px`,
  top: `${editorStore.panelPos.y}px`,
}))

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
  <Teleport to="body">
    <Transition name="slide-left">
      <div
        v-if="modelValue"
        class="fixed z-20 w-64 flex flex-col bg-white rounded-lg shadow-md border border-gray-100"
        :style="panelStyle"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <p class="text-sm font-semibold text-gray-900">{{ title }}</p>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors duration-fast"
            @click="emit('update:modelValue', false)"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-5 overflow-y-auto">

          <!-- Style variants -->
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

          <!-- Header: cover size -->
          <div v-if="headerSettings" class="space-y-2">
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

          <!-- Header: profile position -->
          <div v-if="headerSettings" class="space-y-2">
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

          <!-- Collection: columns -->
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
      </div>
    </Transition>
  </Teleport>
</template>
