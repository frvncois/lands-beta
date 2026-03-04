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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

async function handleSubmit() {
  authStore.setLoading(true)
  try {
    const { user, lands, needsOnboarding } = await authService.register({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
    })
    userStore.setUser(user)
    landStore.setLands(lands)
    authStore.needsOnboarding = needsOnboarding
    router.push(needsOnboarding ? '/onboarding' : '/dashboard')
  } catch (err) {
    authStore.setError(err instanceof Error ? err.message : 'Registration failed.')
  }
}
</script>

<template>
  <AuthLayout heading="Create your account" subheading="Start building your Land">
    <form class="space-y-4 max-w-sm" @submit.prevent="handleSubmit">
      <AuthFormError v-if="authStore.error" :message="authStore.error" />
      <div class="flex gap-3">
        <BaseInput v-model="firstName" label="First name" placeholder="Jane" />
        <BaseInput v-model="lastName" label="Last name" placeholder="Doe" />
      </div>
      <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
      <PasswordInput v-model="password" label="Password" placeholder="••••••••" />
      <BaseButton type="submit" variant="solid" size="lg" :loading="authStore.isLoading" class="w-full">
        Create account
      </BaseButton>
    </form>

    <template #footer>
      Already have an account?
      <RouterLink to="/login" class="text-gray-900 font-medium hover:underline">Sign in</RouterLink>
    </template>
  </AuthLayout>
</template>
