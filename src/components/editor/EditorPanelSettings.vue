<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { useLandStore } from '@/stores/land'
import { useEditorActions } from '@/composables/useEditorActions'

const landStore = useLandStore()
const { updateLandSettings, deleteLand } = useEditorActions()

const land = computed(() => landStore.activeLand)

const handle = ref('')
const title = ref('')
const description = ref('')
const showDeleteConfirm = ref(false)

watch(
  land,
  (newLand) => {
    if (newLand) {
      handle.value = newLand.handle
      title.value = newLand.title
      description.value = newLand.description
    }
  },
  { immediate: true }
)

function saveLandSettings() {
  updateLandSettings({
    handle: handle.value,
    title: title.value,
    description: description.value,
  })
}

function handleDeleteLand() {
  deleteLand()
  showDeleteConfirm.value = false
}
</script>

<template>
  <div v-if="land" class="space-y-6">
    <div>
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Land settings</h3>

      <div class="space-y-4">
        <div>
          <BaseInput v-model="handle" label="Handle" placeholder="your-handle" />
          <p class="text-xs text-gray-400 mt-1">{{ handle }}.lands.app</p>
        </div>

        <BaseInput v-model="title" label="Title" placeholder="My Land" />

        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">Description</label>
          <textarea
            v-model="description"
            placeholder="A short description"
            rows="3"
            class="w-full px-4 py-3 text-base border border-gray-200 rounded-md bg-white transition-all duration-fast placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-[3px] focus:ring-black/[0.04] resize-none"
          />
        </div>

        <BaseButton variant="solid" size="sm" @click="saveLandSettings">
          Save changes
        </BaseButton>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="pt-6 border-t border-gray-100">
      <h3 class="text-sm font-semibold text-danger mb-2">Danger zone</h3>
      <p class="text-xs text-gray-500 mb-3">
        Permanently delete this Land and all its content. This action cannot be undone.
      </p>
      <BaseButton
        variant="outline"
        size="sm"
        class="!text-danger !border-danger/30 hover:!bg-danger/5"
        @click="showDeleteConfirm = true"
      >
        Delete Land
      </BaseButton>
    </div>

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Delete Land"
      message="Are you sure you want to delete this Land? All sections and content will be permanently removed."
      confirm-label="Delete"
      :destructive="true"
      @confirm="handleDeleteLand"
    />
  </div>
</template>
