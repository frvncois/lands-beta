<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ColorPicker from '@/components/theme/ColorPicker.vue'
import ThemePreview from '@/components/theme/ThemePreview.vue'
import { THEME_PRESETS, COLOR_MODES, TYPOGRAPHY_STYLES, type LandTheme } from '@/types/theme'
import { THEME_PRESET_DEFINITIONS } from '@/lib/primitives/themePresets'

const props = defineProps<{
  modelValue: boolean
  theme: LandTheme
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [theme: LandTheme]
}>()

const localTheme = ref<LandTheme>({ ...props.theme })

watch(() => props.modelValue, (open) => {
  if (open) localTheme.value = { ...props.theme }
})

function applyPreset(preset: keyof typeof THEME_PRESETS) {
  const def = THEME_PRESET_DEFINITIONS[preset]
  localTheme.value = { ...localTheme.value, ...def.defaults }
}

function save() {
  emit('save', { ...localTheme.value })
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Appearance" size="md" @update:model-value="emit('update:modelValue', $event)">
    <div class="space-y-6">
      <!-- Preview -->
      <ThemePreview :theme="localTheme" />

      <!-- Presets -->
      <div>
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Preset</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(def, key) in THEME_PRESET_DEFINITIONS"
            :key="key"
            :class="[
              'p-3 rounded-md border text-left transition-colors duration-fast',
              localTheme.theme_preset === key
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-100 hover:border-gray-200',
            ]"
            @click="applyPreset(key as keyof typeof THEME_PRESETS)"
          >
            <p class="text-sm font-medium text-gray-900">{{ def.label }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ def.description }}</p>
          </button>
        </div>
      </div>

      <!-- Color palette -->
      <div class="space-y-4">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Color Palette</p>
        <div>
          <p class="text-xs text-gray-500 mb-1.5">Main</p>
          <ColorPicker v-model="localTheme.color_main" />
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1.5">Accent</p>
          <ColorPicker v-model="localTheme.color_accent" />
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1.5">Surface</p>
          <ColorPicker v-model="localTheme.color_surface" />
        </div>
      </div>

      <!-- Color mode -->
      <div>
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Color mode</p>
        <div class="flex gap-2">
          <button
            v-for="mode in Object.values(COLOR_MODES)"
            :key="mode"
            :class="[
              'flex-1 py-2 text-sm rounded-md border transition-colors duration-fast capitalize',
              localTheme.color_mode === mode
                ? 'border-gray-900 bg-gray-50 font-medium'
                : 'border-gray-100 hover:border-gray-200',
            ]"
            @click="localTheme.color_mode = mode"
          >
            {{ mode }}
          </button>
        </div>
      </div>

      <!-- Typography -->
      <div>
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Typography</p>
        <div class="flex gap-2">
          <button
            v-for="style in Object.values(TYPOGRAPHY_STYLES)"
            :key="style"
            :class="[
              'flex-1 py-2 text-sm rounded-md border transition-colors duration-fast capitalize',
              localTheme.typography_style === style
                ? 'border-gray-900 bg-gray-50 font-medium'
                : 'border-gray-100 hover:border-gray-200',
            ]"
            @click="localTheme.typography_style = style"
          >
            {{ style }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <BaseButton variant="ghost" @click="emit('update:modelValue', false)">Cancel</BaseButton>
      <BaseButton variant="solid" @click="save">Apply</BaseButton>
    </div>
  </BaseModal>
</template>
