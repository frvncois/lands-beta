<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LandsLogo from '@/assets/LandsLogo.vue'
import AuthBranding from '@/components/auth/AuthBranding.vue'

defineProps<{
  heading: string
  subheading?: string
}>()
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left: Form -->
    <div class="flex-1 flex flex-col px-6 py-8 md:px-16 md:py-12 bg-white">
      <RouterLink to="/" class="mb-12 inline-block">
        <LandsLogo class="h-7 w-7" />
      </RouterLink>

      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">{{ heading }}</h1>
        <p v-if="subheading" class="text-sm text-gray-500 mt-1">{{ subheading }}</p>
      </div>

      <div class="flex-1">
        <slot />
      </div>

      <div class="mt-8 text-sm text-gray-500">
        <slot name="footer" />
      </div>
    </div>

    <!-- Right: Branding (hidden on mobile) -->
    <div class="hidden lg:flex w-[480px] shrink-0">
      <slot name="branding">
        <AuthBranding />
      </slot>
    </div>
  </div>
</template>
