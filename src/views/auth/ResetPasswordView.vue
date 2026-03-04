<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthFormError from '@/components/auth/AuthFormError.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/auth.service'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const confirm = ref('')

async function handleSubmit() {
  if (password.value !== confirm.value) {
    authStore.setError('Passwords do not match.')
    return
  }
  authStore.setLoading(true)
  try {
    const token = route.query.token as string
    await authService.resetPassword(token, password.value)
    authStore.passwordResetSuccess = true
    authStore.setLoading(false)
  } catch (err) {
    authStore.setError(err instanceof Error ? err.message : 'Something went wrong.')
  }
}
</script>

<template>
  <AuthLayout heading="Set new password" subheading="Choose a strong password">
    <div v-if="authStore.passwordResetSuccess" class="max-w-sm space-y-4">
      <div class="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
        Password updated! You can now sign in.
      </div>
      <RouterLink to="/login" class="block text-sm text-gray-900 font-medium hover:underline">
        Go to login →
      </RouterLink>
    </div>
    <form v-else class="space-y-4 max-w-sm" @submit.prevent="handleSubmit">
      <AuthFormError v-if="authStore.error" :message="authStore.error" />
      <PasswordInput v-model="password" label="New password" placeholder="••••••••" />
      <PasswordInput v-model="confirm" label="Confirm password" placeholder="••••••••" />
      <BaseButton type="submit" variant="solid" size="lg" :loading="authStore.isLoading" class="w-full">
        Update password
      </BaseButton>
    </form>

    <template #footer>
      <RouterLink to="/login" class="text-gray-900 font-medium hover:underline">← Back to login</RouterLink>
    </template>
  </AuthLayout>
</template>
