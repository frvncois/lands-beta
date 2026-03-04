<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

withDefaults(defineProps<{
  modelValue: string
  options: Array<{ value: string; label: string }>
  label?: string
  placeholder?: string
}>(), {
  placeholder: 'Select...',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col">
    <label v-if="label" class="text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        class="w-full appearance-none px-4 py-3 pr-10 text-base border border-gray-200 rounded-md bg-white
               transition-all duration-fast
               focus:outline-none focus:border-gray-400 focus:ring-[3px] focus:ring-black/[0.04]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  </div>
</template>
