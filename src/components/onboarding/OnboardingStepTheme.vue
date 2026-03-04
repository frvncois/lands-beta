<script setup lang="ts">
import { THEME_PRESET_DEFINITIONS } from '@/lib/primitives/themePresets'
import { THEME_PRESETS, type ThemePreset } from '@/types/theme'

const props = defineProps<{
  selected: ThemePreset
}>()

const emit = defineEmits<{
  'update:selected': [value: ThemePreset]
}>()

const presets = Object.values(THEME_PRESETS) as ThemePreset[]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Choose your style</h2>
      <p class="text-sm text-gray-500 mt-1">You can always change this later.</p>
    </div>
    <div class="space-y-3">
      <button
        v-for="preset in presets"
        :key="preset"
        :class="[
          'w-full flex items-start gap-4 p-4 rounded-md border text-left transition-colors duration-fast',
          preset === props.selected
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        ]"
        @click="emit('update:selected', preset)"
      >
        <div
          :class="[
            'mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition-colors duration-fast',
            preset === props.selected ? 'border-gray-900 bg-gray-900' : 'border-gray-300',
          ]"
        />
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ THEME_PRESET_DEFINITIONS[preset].label }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ THEME_PRESET_DEFINITIONS[preset].description }}</p>
        </div>
        <div class="flex gap-1 shrink-0">
          <div class="w-3 h-3 rounded-full border border-gray-200" :style="{ backgroundColor: THEME_PRESET_DEFINITIONS[preset].defaults.color_main }" />
          <div class="w-3 h-3 rounded-full border border-gray-200" :style="{ backgroundColor: THEME_PRESET_DEFINITIONS[preset].defaults.color_accent }" />
          <div class="w-3 h-3 rounded-full border border-gray-200" :style="{ backgroundColor: THEME_PRESET_DEFINITIONS[preset].defaults.color_surface }" />
        </div>
      </button>
    </div>
  </div>
</template>
