<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthFormError from '@/components/auth/AuthFormError.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/auth.service'

const authStore = useAuthStore()
const email = ref('')

async function handleSubmit() {
  authStore.setLoading(true)
  try {
    await authService.forgotPassword(email.value)
    authStore.resetEmailSent = true
    authStore.setLoading(false)
  } catch (err) {
    authStore.setError(err instanceof Error ? err.message : 'Something went wrong.')
  }
}
</script>

<template>
  <AuthLayout heading="Reset your password" subheading="We'll send you a link to reset it">
    <div v-if="authStore.resetEmailSent" class="max-w-sm space-y-4">
      <div class="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
        Check your email — we sent a reset link to <strong>{{ email }}</strong>.
      </div>
      <RouterLink to="/login" class="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-fast">
        ← Back to login
      </RouterLink>
    </div>
    <form v-else class="space-y-4 max-w-sm" @submit.prevent="handleSubmit">
      <AuthFormError v-if="authStore.error" :message="authStore.error" />
      <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
      <BaseButton type="submit" variant="solid" size="lg" :loading="authStore.isLoading" class="w-full">
        Send reset link
      </BaseButton>
    </form>

    <template #footer>
      <RouterLink to="/login" class="text-gray-900 font-medium hover:underline">← Back to login</RouterLink>
    </template>
  </AuthLayout>
</template>
