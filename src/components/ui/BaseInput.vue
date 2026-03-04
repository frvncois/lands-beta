<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'url'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
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
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-4 py-3 text-base border border-gray-200 rounded-md bg-white
             transition-all duration-fast
             placeholder:text-gray-400
             focus:outline-none focus:border-gray-400 focus:ring-[3px] focus:ring-black/[0.04]
             disabled:opacity-50 disabled:cursor-not-allowed"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="text-xs text-danger mt-1">
      {{ error }}
    </span>
  </div>
</template>
