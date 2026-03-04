<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-6 right-6 z-toast flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="slide-up">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-xs cursor-pointer',
          toast.type === 'success' && 'bg-gray-900 text-white',
          toast.type === 'error' && 'bg-danger text-white',
          toast.type === 'info' && 'bg-white text-gray-900 border border-gray-200',
        ]"
        @click="removeToast(toast.id)"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
