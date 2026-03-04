<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { toSlug } from '@/lib/utils/slug'

const props = defineProps<{
  title: string
  handle: string
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:handle': [value: string]
}>()

const localTitle = ref(props.title)
const localHandle = ref(props.handle)
const handleEdited = ref(false)

const previewHandle = computed(() => toSlug(localHandle.value) || 'your-handle')

watch(localTitle, (val) => {
  emit('update:title', val)
  if (!handleEdited.value) {
    localHandle.value = toSlug(val)
    emit('update:handle', localHandle.value)
  }
})

function onHandleInput(val: string) {
  handleEdited.value = true
  localHandle.value = val
  emit('update:handle', val)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Name your Land</h2>
      <p class="text-sm text-gray-500 mt-1">This is how your page will appear to visitors.</p>
    </div>
    <div class="space-y-4">
      <BaseInput v-model="localTitle" label="Title" placeholder="Jane Doe" />
      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 block">Handle</label>
        <div class="flex items-center border border-gray-200 rounded-md overflow-hidden focus-within:border-gray-400 focus-within:ring-[3px] focus-within:ring-black/[0.04]">
          <span class="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0 select-none">
            lands.app/
          </span>
          <input
            :value="localHandle"
            type="text"
            placeholder="your-handle"
            class="flex-1 px-3 py-3 text-base bg-white focus:outline-none"
            @input="onHandleInput(($event.target as HTMLInputElement).value)"
          />
        </div>
        <p class="text-xs text-gray-400 mt-1.5">
          Your URL: <span class="font-mono text-gray-500">{{ previewHandle }}.lands.app</span>
        </p>
      </div>
    </div>
  </div>
</template>
