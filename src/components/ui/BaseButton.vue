<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'ghost' | 'outline' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  loading: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-fast rounded-md'

  const variants = {
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    outline: 'text-gray-700 border border-gray-200 hover:bg-gray-100 active:bg-gray-200',
    solid: 'text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  const state = (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return [base, variants[props.variant], sizes[props.size], state]
})
</script>

<template>
  <button :class="classes" :disabled="disabled || loading">
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>
