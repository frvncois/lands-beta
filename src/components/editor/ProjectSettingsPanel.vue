<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import EditorPanelSettings from '@/components/editor/EditorPanelSettings.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-left">
      <div
        v-if="modelValue"
        class="fixed right-4 z-20 w-72 flex flex-col bg-white rounded-lg shadow-md border border-gray-100"
        style="top: 72px"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <p class="text-sm font-semibold text-gray-900">Project settings</p>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors duration-fast"
            @click="emit('update:modelValue', false)"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 overflow-y-auto">
          <EditorPanelSettings />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
