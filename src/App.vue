<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/shared/ToastContainer.vue'
import { initMockData } from '@/lib/mock/init'

onMounted(() => {
  initMockData()
})
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
