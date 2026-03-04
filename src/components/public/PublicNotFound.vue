<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center">
    <div class="text-6xl font-bold text-gray-200 mb-4">404</div>
    <h1 class="text-xl font-semibold text-gray-900 mb-2">Land not found</h1>
    <p class="text-sm text-gray-500 mb-8 max-w-sm">
      This handle doesn't exist or may have been removed.
    </p>
    <RouterLink to="/dashboard">
      <BaseButton variant="solid">Go to Dashboard</BaseButton>
    </RouterLink>
  </div>
</template>
