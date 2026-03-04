<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthFormError from '@/components/auth/AuthFormError.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useLandStore } from '@/stores/land'
import authService from '@/services/auth.service'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const landStore = useLandStore()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  authStore.setLoading(true)
  try {
    const { user, lands, needsOnboarding } = await authService.login({
      email: email.value,
      password: password.value,
    })
    userStore.setUser(user)
    landStore.setLands(lands)
    authStore.needsOnboarding = needsOnboarding
    router.push(needsOnboarding ? '/onboarding' : '/dashboard')
  } catch (err) {
    authStore.setError(err instanceof Error ? err.message : 'Login failed.')
  }
}
</script>

<template>
  <AuthLayout heading="Welcome back" subheading="Sign in to your account">
    <form class="space-y-4 max-w-sm" @submit.prevent="handleSubmit">
      <AuthFormError v-if="authStore.error" :message="authStore.error" />
      <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
      <PasswordInput v-model="password" label="Password" placeholder="••••••••" />
      <div class="flex justify-end -mt-2">
        <RouterLink to="/forgot-password" class="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-fast">
          Forgot password?
        </RouterLink>
      </div>
      <BaseButton type="submit" variant="solid" size="lg" :loading="authStore.isLoading" class="w-full">
        Sign in
      </BaseButton>
    </form>

    <template #footer>
      Don't have an account?
      <RouterLink to="/register" class="text-gray-900 font-medium hover:underline">Sign up</RouterLink>
    </template>
  </AuthLayout>
</template>
