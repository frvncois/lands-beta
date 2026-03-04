<script setup lang="ts">
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  label?: string
  error?: string
}>(), {
  placeholder: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const show = ref(false)
</script>

<template>
  <div class="flex flex-col">
    <label v-if="label" class="text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="relative">
      <input
        :value="modelValue"
        :type="show ? 'text' : 'password'"
        :placeholder="placeholder"
        class="w-full px-4 py-3 pr-10 text-base border border-gray-200 rounded-md bg-white
               transition-all duration-fast placeholder:text-gray-400
               focus:outline-none focus:border-gray-400 focus:ring-[3px] focus:ring-black/[0.04]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-fast"
        @click="show = !show"
      >
        <EyeSlashIcon v-if="show" class="h-4 w-4" />
        <EyeIcon v-else class="h-4 w-4" />
      </button>
    </div>
    <span v-if="error" class="text-xs text-danger mt-1">{{ error }}</span>
  </div>
</template>
