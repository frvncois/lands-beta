<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const PRESET_COLORS = [
  '#18181B', '#374151', '#6B7280',
  '#2563EB', '#6366F1', '#7C3AED',
  '#EC4899', '#F43F5E', '#DC2626',
  '#EA580C', '#F59E0B', '#B45309',
  '#059669', '#10B981', '#0891B2',
  '#F4F4F5', '#FAF9F6', '#FFFFFF',
  '#1E293B', '#1E1E1E', '#0F172A',
]
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-7 gap-1.5">
      <button
        v-for="color in PRESET_COLORS"
        :key="color"
        class="w-7 h-7 rounded-full border-2 transition-transform duration-fast hover:scale-110"
        :style="{
          backgroundColor: color,
          borderColor: modelValue === color ? '#18181B' : 'transparent',
          outline: (color === '#FFFFFF' || color === '#F4F4F5' || color === '#FAF9F6') ? '1px solid #E5E7EB' : 'none',
        }"
        @click="emit('update:modelValue', color)"
      />
    </div>
    <div class="flex items-center gap-2">
      <input
        type="color"
        :value="modelValue"
        class="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <input
        type="text"
        :value="modelValue"
        class="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 font-mono focus:outline-none focus:ring-[3px] focus:ring-black/[0.04]"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
