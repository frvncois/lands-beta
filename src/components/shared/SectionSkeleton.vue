<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue'
</script>

<template>
  <div class="px-6 md:px-8 py-8 max-w-2xl space-y-4">
    <SkeletonBlock width="40%" height="24px" />
    <SkeletonBlock height="14px" />
    <SkeletonBlock height="14px" />
    <SkeletonBlock width="75%" height="14px" />
  </div>
</template>
