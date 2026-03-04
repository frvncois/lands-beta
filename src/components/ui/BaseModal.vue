<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const modalRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    nextTick(() => { modalRef.value?.focus() })
  }
})

const panelSize = computed(() => {
  const sizes = {
    sm: 'max-w-[400px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[640px]',
  }
  return sizes[props.size]
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-modal flex items-center justify-center bg-gray-100/50 backdrop-blur-lg"
        @click.self="close"
        @keydown="handleKeydown"
      >
        <Transition name="slide-up">
          <div
            v-if="modelValue"
            ref="modalRef"
            tabindex="-1"
            :class="['w-full mx-4 bg-white rounded-4xl p-6 outline-none', panelSize]"
          >
            <div v-if="title" class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              <button
                class="text-gray-400 hover:text-gray-600 transition-colors duration-fast p-1 rounded-sm hover:bg-gray-100"
                @click="close"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
            <div>
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
