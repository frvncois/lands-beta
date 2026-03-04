<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { generateId } from '@/lib/utils/formatting'
import { generatePositionAfter } from '@/lib/utils/position'
import type { ListItem } from '@/types/list'

const props = defineProps<{
  modelValue: boolean
  editItem: ListItem | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [item: ListItem]
  'delete': []
}>()

const title = ref('')
const url = ref('')
const description = ref('')
const icon = ref('')

watch(() => props.modelValue, (open) => {
  if (open) {
    title.value = props.editItem?.title ?? ''
    url.value = props.editItem?.url ?? ''
    description.value = props.editItem?.description ?? ''
    icon.value = props.editItem?.icon ?? ''
  }
})

function save() {
  if (!title.value.trim()) return
  const item: ListItem = {
    id: props.editItem?.id ?? generateId(),
    section_id: props.editItem?.section_id ?? '',
    title: title.value.trim(),
    url: url.value.trim(),
    description: description.value.trim(),
    icon: icon.value.trim(),
    position: props.editItem?.position ?? generatePositionAfter(null),
  }
  emit('save', item)
}
</script>

<template>
  <BaseModal :model-value="modelValue" :title="editItem ? 'Edit link' : 'Add link'" size="sm" @update:model-value="emit('update:modelValue', $event)">
    <div class="space-y-3">
      <BaseInput v-model="title" label="Title" placeholder="Link title" />
      <BaseInput v-model="url" label="URL" placeholder="https://..." />
      <BaseInput v-model="description" label="Description" placeholder="Optional description..." />
      <BaseInput v-model="icon" label="Icon URL" placeholder="Custom icon URL (optional)" />
    </div>

    <div class="flex items-center justify-between mt-6">
      <BaseButton
        v-if="editItem"
        variant="ghost"
        class="text-danger hover:bg-red-50"
        @click="emit('delete')"
      >
        Delete
      </BaseButton>
      <div class="flex gap-3 ml-auto">
        <BaseButton variant="ghost" @click="emit('update:modelValue', false)">Cancel</BaseButton>
        <BaseButton variant="solid" :disabled="!title.trim()" @click="save">Save</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
