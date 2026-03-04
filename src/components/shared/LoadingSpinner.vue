<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const sizeClasses = computed(() => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return sizes[props.size]
})
</script>

<template>
  <div
    :class="['animate-spin rounded-full border-2 border-gray-200 border-t-gray-900', sizeClasses]"
  />
</template>
