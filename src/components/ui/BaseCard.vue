<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}>(), {
  padding: 'md',
  hoverable: false,
})

const paddingClasses = computed(() => {
  const map = { none: '', sm: 'p-3', md: 'p-6', lg: 'p-8' }
  return map[props.padding]
})
</script>

<template>
  <div
    :class="[
      'bg-white border border-gray-100 rounded-lg shadow-sm',
      paddingClasses,
      hoverable && 'transition-all duration-fast hover:shadow-md hover:border-gray-200 cursor-pointer',
    ]"
  >
    <slot />
  </div>
</template>
