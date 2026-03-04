<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ThemeProvider from '@/components/theme/ThemeProvider.vue'
import SectionRenderer from '@/components/sections/SectionRenderer.vue'
import PublicWatchButton from '@/components/public/PublicWatchButton.vue'
import PublicNotFound from '@/components/public/PublicNotFound.vue'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'
import SectionSkeleton from '@/components/shared/SectionSkeleton.vue'
import { sortByPosition } from '@/lib/utils/position'
import { getMockLandByHandle, getMockListItems, getMockCollections } from '@/lib/mock/provider'
import { useUserStore } from '@/stores/user'
import { usePageMeta } from '@/composables/usePageMeta'
import type { Land } from '@/types/land'

const route = useRoute()
const userStore = useUserStore()

const land = ref<Land | null>(null)
const isLoading = ref(true)
const notFound = ref(false)

const pageMeta = computed(() => {
  if (!land.value) return null
  return {
    title: land.value.title || land.value.handle,
    description: land.value.description || undefined,
    image: land.value.cover_image || land.value.avatar_image || undefined,
  }
})

usePageMeta(pageMeta)

onMounted(() => {
  const handle = route.params.handle as string
  const found = getMockLandByHandle(handle)
  if (found) {
    land.value = found
  } else {
    notFound.value = true
  }
  isLoading.value = false
})
</script>

<template>
  <!-- Loading skeletons -->
  <div v-if="isLoading" class="min-h-screen">
    <SkeletonBlock width="100%" height="50vh" rounded="none" />
    <SectionSkeleton />
    <SectionSkeleton />
    <SectionSkeleton />
  </div>

  <!-- Not found -->
  <PublicNotFound v-else-if="notFound" />

  <!-- Land view -->
  <ThemeProvider v-else-if="land" :theme="land.theme">
    <PublicWatchButton
      v-if="userStore.isAuthenticated"
      :land-id="land.id"
    />

    <div>
      <SectionRenderer
        v-for="section in sortByPosition(land.sections)"
        :key="section.id"
        :section="section"
        :land="land"
        :list-items="getMockListItems(section.id)"
        :collections="getMockCollections(section.id)"
        mode="display"
      />
    </div>

    <div
      v-if="land.sections.length === 0"
      class="flex items-center justify-center py-32 text-sm"
      style="color: var(--land-text-muted)"
    >
      Nothing here yet.
    </div>
  </ThemeProvider>
</template>
