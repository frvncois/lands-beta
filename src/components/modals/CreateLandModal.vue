<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { toSlug } from '@/lib/utils/slug'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'created': [data: { handle: string; title: string }]
}>()

const title = ref('')
const handle = ref('')
const handleTouched = ref(false)

const displayHandle = computed(() => {
  if (handleTouched.value) return handle.value
  return toSlug(title.value)
})

function onHandleInput(value: string) {
  handle.value = value
  handleTouched.value = true
}

function handleCreate() {
  const finalHandle = handleTouched.value ? handle.value : toSlug(title.value)
  emit('created', { handle: finalHandle, title: title.value })
  emit('update:modelValue', false)
  title.value = ''
  handle.value = ''
  handleTouched.value = false
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Create new Land"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <BaseInput v-model="title" label="Title" placeholder="My new project" />

      <div>
        <BaseInput
          :model-value="displayHandle"
          label="Handle"
          placeholder="my-new-project"
          @update:model-value="onHandleInput"
        />
        <p class="text-xs text-gray-400 mt-1">
          {{ displayHandle || 'handle' }}.lands.app
        </p>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="ghost" @click="emit('update:modelValue', false)">
          Cancel
        </BaseButton>
        <BaseButton variant="solid" :disabled="!title.trim()" @click="handleCreate">
          Create
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
