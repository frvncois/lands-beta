<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { generateId } from '@/lib/utils/formatting'
import { generatePositionAfter } from '@/lib/utils/position'
import type { CollectionItem } from '@/types/collection'

const props = defineProps<{
  modelValue: boolean
  editItem: CollectionItem | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [item: CollectionItem]
  'delete': []
}>()

const title = ref('')
const description = ref('')
const mediaUrl = ref('')
const externalUrl = ref('')

watch(() => props.modelValue, (open) => {
  if (open) {
    title.value = props.editItem?.title ?? ''
    description.value = props.editItem?.description ?? ''
    mediaUrl.value = props.editItem?.media_url ?? ''
    externalUrl.value = props.editItem?.external_url ?? ''
  }
})

function save() {
  if (!title.value.trim()) return
  const item: CollectionItem = {
    id: props.editItem?.id ?? generateId(),
    collection_id: props.editItem?.collection_id ?? '',
    title: title.value.trim(),
    description: description.value.trim(),
    media_url: mediaUrl.value.trim(),
    external_url: externalUrl.value.trim(),
    position: props.editItem?.position ?? generatePositionAfter(null),
    created_at: props.editItem?.created_at ?? new Date().toISOString(),
  }
  emit('save', item)
}
</script>

<template>
  <BaseModal :model-value="modelValue" :title="editItem ? 'Edit item' : 'Add item'" size="sm" @update:model-value="emit('update:modelValue', $event)">
    <div class="space-y-3">
      <BaseInput v-model="title" label="Title" placeholder="Item title" />
      <BaseInput v-model="description" label="Description" placeholder="Optional description..." />
      <BaseInput v-model="mediaUrl" label="Thumbnail URL" placeholder="https://..." />
      <BaseInput v-model="externalUrl" label="Link URL" placeholder="https://..." />
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
