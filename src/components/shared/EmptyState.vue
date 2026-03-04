<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <component
      v-if="icon"
      :is="icon"
      class="h-12 w-12 text-gray-300"
    />
    <h3 class="mt-3 text-lg font-semibold text-gray-900">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-gray-500 max-w-sm">
      {{ description }}
    </p>
    <div class="mt-6">
      <slot />
    </div>
  </div>
</template>
