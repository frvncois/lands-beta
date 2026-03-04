<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}>(), {
  placement: 'bottom-right',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dropdownRef = ref<HTMLElement | null>(null)

const panelClass = computed(() => {
  const classes: Record<string, string> = {
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
  }
  return classes[props.placement]
})

function toggle() {
  emit('update:modelValue', !props.modelValue)
}

function onClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    emit('update:modelValue', false)
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <div @click="toggle">
      <slot name="trigger" />
    </div>
    <Transition name="scale">
      <div
        v-if="modelValue"
        :class="['absolute min-w-[250px] bg-white border border-gray-100 rounded-md shadow-lg p-2 z-dropdown', panelClass]"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>
