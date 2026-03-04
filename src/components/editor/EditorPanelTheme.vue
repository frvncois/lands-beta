<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useLandStore } from '@/stores/land'
import { useEditorActions } from '@/composables/useEditorActions'
import ColorPicker from '@/components/theme/ColorPicker.vue'
import {
  THEME_PRESETS,
  TYPOGRAPHY_STYLES,
  type ThemePreset,
  type TypographyStyle,
} from '@/types/theme'
import { THEME_PRESET_DEFINITIONS } from '@/lib/primitives/themePresets'

const landStore = useLandStore()
const { updateTheme } = useEditorActions()

const theme = computed(() => landStore.activeLand?.theme || null)

const open = ref({ preset: false, palette: false, typography: false })

function toggle(key: keyof typeof open.value) {
  open.value[key] = !open.value[key]
}

// --- Color picker popover ---
type ColorField = 'color_main' | 'color_accent' | 'color_surface'
const activePicker = ref<ColorField | null>(null)
const pickerPos = ref({ x: 0, y: 0 })

const colorLabels: Record<ColorField, string> = {
  color_main: 'Main',
  color_accent: 'Accent',
  color_surface: 'Surface',
}

function openPicker(field: ColorField, event: MouseEvent) {
  const panel = (event.currentTarget as HTMLElement).closest('.editor-left-panel')
  const rect = panel?.getBoundingClientRect()
  if (rect) {
    pickerPos.value = { x: rect.right + 8, y: rect.top }
  }
  activePicker.value = field
}

function closePicker() {
  activePicker.value = null
}

function onPickerColor(color: string) {
  if (!activePicker.value) return
  updateTheme({ [activePicker.value]: color })
}

// --- Theme actions ---
function setPreset(preset: ThemePreset) {
  if (!theme.value) return
  updateTheme(THEME_PRESET_DEFINITIONS[preset].defaults)
}

function setTypography(style: TypographyStyle) {
  updateTheme({ typography_style: style })
}
</script>

<template>
  <div v-if="theme" class="flex flex-col divide-y divide-gray-100">

    <!-- Preset -->
    <div>
      <button
        class="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900"
        @click="toggle('preset')"
      >
        Preset
        <ChevronDownIcon :class="['h-4 w-4 text-gray-400 transition-transform duration-fast', open.preset && 'rotate-180']" />
      </button>
      <div v-if="open.preset" class="pb-4 grid grid-cols-1 gap-2">
        <button
          v-for="(def, key) in THEME_PRESET_DEFINITIONS"
          :key="key"
          :class="[
            'flex items-center gap-3 p-3 rounded-md border text-left transition-all duration-fast',
            theme.theme_preset === key
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-100 hover:border-gray-200',
          ]"
          @click="setPreset(key as ThemePreset)"
        >
          <div class="flex gap-1 shrink-0">
            <div class="w-3 h-3 rounded-full border border-gray-200" :style="{ backgroundColor: def.defaults.color_main }" />
            <div class="w-3 h-3 rounded-full border border-gray-200" :style="{ backgroundColor: def.defaults.color_accent }" />
            <div class="w-3 h-3 rounded-full border border-gray-200" :style="{ backgroundColor: def.defaults.color_surface }" />
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900">{{ def.label }}</div>
            <div class="text-xs text-gray-500">{{ def.description }}</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Color Palette -->
    <div>
      <button
        class="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900"
        @click="toggle('palette')"
      >
        Color Palette
        <ChevronDownIcon :class="['h-4 w-4 text-gray-400 transition-transform duration-fast', open.palette && 'rotate-180']" />
      </button>
      <div v-if="open.palette" class="pb-3 flex flex-col gap-1">
        <div
          v-for="field in (['color_main', 'color_accent', 'color_surface'] as ColorField[])"
          :key="field"
          class="flex items-center gap-3 py-2"
        >
          <span class="text-sm text-gray-700 flex-1">{{ colorLabels[field] }}</span>
          <button
            class="w-6 h-6 rounded-full border-2 shrink-0 transition-transform duration-fast hover:scale-110 focus:outline-none"
            :style="{
              backgroundColor: theme[field],
              borderColor: activePicker === field ? '#18181B' : 'transparent',
              outline: '1px solid #E4E4E7',
            }"
            @click="openPicker(field, $event)"
          />
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div>
      <button
        class="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900"
        @click="toggle('typography')"
      >
        Typography
        <ChevronDownIcon :class="['h-4 w-4 text-gray-400 transition-transform duration-fast', open.typography && 'rotate-180']" />
      </button>
      <div v-if="open.typography" class="pb-4 grid grid-cols-3 gap-2">
        <button
          v-for="style in Object.values(TYPOGRAPHY_STYLES)"
          :key="style"
          :class="[
            'py-3 rounded-md border text-center transition-all duration-fast',
            theme.typography_style === style
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-100 hover:border-gray-200',
          ]"
          @click="setTypography(style)"
        >
          <span
            :class="[
              'text-sm',
              style === 'serif' && 'font-serif',
              style === 'mono' && 'font-mono',
            ]"
          >
            {{ style.charAt(0).toUpperCase() + style.slice(1) }}
          </span>
        </button>
      </div>
    </div>

  </div>

  <!-- Color picker popover (Teleport'd to body) -->
  <Teleport to="body">
    <div v-if="activePicker" class="fixed inset-0 z-30" @click="closePicker" />
    <div
      v-if="activePicker && theme"
      class="fixed z-40 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
      :style="{ left: `${pickerPos.x}px`, top: `${pickerPos.y}px` }"
    >
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm font-semibold text-gray-900">{{ colorLabels[activePicker] }}</p>
        <button class="text-gray-400 hover:text-gray-600 transition-colors duration-fast" @click="closePicker">
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
      <ColorPicker :model-value="theme[activePicker]" @update:model-value="onPickerColor" />
    </div>
  </Teleport>
</template>
