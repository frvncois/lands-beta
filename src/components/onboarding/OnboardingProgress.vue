<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      v-for="n in total"
      :key="n"
      :class="[
        'h-1.5 rounded-full transition-all duration-fast',
        n <= current ? 'w-6 bg-gray-900' : 'w-6 bg-gray-200',
      ]"
    />
  </div>
</template>
