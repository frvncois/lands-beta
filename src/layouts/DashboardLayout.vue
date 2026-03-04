<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue'
</script>

<template>
    <main class="flex-1 h-screen overflow-hidden">
      <AppHeader />
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
</template>
