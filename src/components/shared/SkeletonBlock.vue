<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}>(), {
  width: '100%',
  height: '16px',
  rounded: 'md',
})
</script>

<template>
  <div
    class="animate-pulse bg-gray-100"
    :class="`rounded-${rounded}`"
    :style="{ width, height }"
  />
</template>
