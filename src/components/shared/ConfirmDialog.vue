<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  destructive: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" :title="title" size="sm">
    <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
    <div class="flex items-center justify-end gap-3">
      <BaseButton variant="ghost" @click="handleCancel">
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton
        variant="solid"
        :class="destructive && '!bg-danger hover:!bg-red-600'"
        @click="handleConfirm"
      >
        {{ confirmLabel }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
