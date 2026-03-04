<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { generateId } from '@/lib/utils/formatting'
import { getEmbedUrl } from '@/lib/utils/videoEmbed'
import { generatePositionAfter } from '@/lib/utils/position'
import type { MediaItem } from '@/types/section'
import { MEDIA_TYPES } from '@/types/section'

const props = defineProps<{
  modelValue: boolean
  editItem?: MediaItem | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [item: MediaItem]
}>()

const activeTab = ref<'image' | 'video'>('image')
const url = ref('')
const caption = ref('')

watch(() => props.modelValue, (open) => {
  if (open) {
    if (props.editItem) {
      url.value = props.editItem.url
      caption.value = props.editItem.caption
      activeTab.value = props.editItem.media_type === MEDIA_TYPES.video ? 'video' : 'image'
    } else {
      url.value = ''
      caption.value = ''
      activeTab.value = 'image'
    }
  }
})

const isValidUrl = computed(() => {
  if (!url.value) return false
  try { new URL(url.value); return true } catch { return false }
})

const embedUrl = computed(() => activeTab.value === 'video' ? getEmbedUrl(url.value) : null)

function save() {
  if (!isValidUrl.value) return
  const item: MediaItem = {
    id: props.editItem?.id ?? generateId(),
    media_type: activeTab.value === 'video' ? MEDIA_TYPES.video : MEDIA_TYPES.image,
    url: url.value,
    caption: caption.value,
    position: props.editItem?.position ?? generatePositionAfter(null),
  }
  emit('save', item)
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Add media" size="md" @update:model-value="emit('update:modelValue', $event)">
    <!-- Tabs -->
    <div class="flex gap-1 p-1 bg-gray-100 rounded-md mb-4">
      <button
        v-for="tab in ['image', 'video']"
        :key="tab"
        :class="[
          'flex-1 py-1.5 text-sm rounded-sm transition-colors duration-fast capitalize',
          activeTab === tab
            ? 'bg-white shadow-sm font-medium text-gray-900'
            : 'text-gray-500 hover:text-gray-700',
        ]"
        @click="activeTab = tab as 'image' | 'video'"
      >
        {{ tab }}
      </button>
    </div>

    <div class="space-y-3">
      <BaseInput
        v-model="url"
        :label="activeTab === 'image' ? 'Image URL' : 'Video URL'"
        :placeholder="activeTab === 'image' ? 'https://...' : 'YouTube or Vimeo URL'"
      />
      <BaseInput v-model="caption" label="Caption" placeholder="Optional caption..." />

      <!-- Preview -->
      <div v-if="isValidUrl && activeTab === 'image'" class="rounded-md overflow-hidden bg-gray-100 aspect-video">
        <img :src="url" alt="Preview" class="w-full h-full object-cover" @error="() => {}" />
      </div>
      <div v-else-if="embedUrl" class="rounded-md overflow-hidden aspect-video">
        <iframe :src="embedUrl" class="w-full h-full" frameborder="0" allowfullscreen />
      </div>
      <p v-else-if="activeTab === 'video' && url && !embedUrl" class="text-sm text-danger">
        Enter a valid YouTube or Vimeo URL.
      </p>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <BaseButton variant="ghost" @click="emit('update:modelValue', false)">Cancel</BaseButton>
      <BaseButton variant="solid" :disabled="!isValidUrl" @click="save">Save</BaseButton>
    </div>
  </BaseModal>
</template>
