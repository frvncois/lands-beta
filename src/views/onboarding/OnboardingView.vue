<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LandsLogo from '@/assets/LandsLogo.vue'
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue'
import OnboardingStepHandle from '@/components/onboarding/OnboardingStepHandle.vue'
import OnboardingStepTheme from '@/components/onboarding/OnboardingStepTheme.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUserStore } from '@/stores/user'
import { useLandStore } from '@/stores/land'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/auth.service'
import { THEME_PRESETS, type ThemePreset } from '@/types/theme'
import { THEME_PRESET_DEFINITIONS } from '@/lib/primitives/themePresets'

const TOTAL_STEPS = 2

const router = useRouter()
const userStore = useUserStore()
const landStore = useLandStore()
const authStore = useAuthStore()

const step = ref(1)
const title = ref('')
const handle = ref('')
const selectedPreset = ref<ThemePreset>(THEME_PRESETS.minimal)

const canProceed = computed(() => {
  if (step.value === 1) return title.value.trim().length > 0 && handle.value.trim().length > 0
  return true
})

async function finish() {
  if (!userStore.user) return
  authStore.setLoading(true)
  try {
    const land = await authService.completeOnboarding(userStore.user.id, {
      handle: handle.value,
      title: title.value,
      themeDefaults: THEME_PRESET_DEFINITIONS[selectedPreset.value].defaults,
    })
    landStore.addLand(land)
    authStore.needsOnboarding = false
    router.push('/dashboard')
  } catch (err) {
    authStore.setError(err instanceof Error ? err.message : 'Something went wrong.')
    authStore.setLoading(false)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <LandsLogo class="h-6 w-6" />
      <OnboardingProgress :current="step" :total="TOTAL_STEPS" />
    </header>

    <main class="flex-1 flex items-start justify-center px-6 pt-16 pb-16">
      <div class="w-full max-w-md">
        <Transition name="fade" mode="out-in">
          <OnboardingStepHandle
            v-if="step === 1"
            :title="title"
            :handle="handle"
            @update:title="title = $event"
            @update:handle="handle = $event"
          />
          <OnboardingStepTheme
            v-else
            :selected="selectedPreset"
            @update:selected="selectedPreset = $event"
          />
        </Transition>

        <div class="mt-8 flex justify-end gap-3">
          <BaseButton
            v-if="step > 1"
            variant="outline"
            size="lg"
            @click="step--"
          >
            Back
          </BaseButton>
          <BaseButton
            v-if="step < TOTAL_STEPS"
            variant="solid"
            size="lg"
            :disabled="!canProceed"
            @click="step++"
          >
            Continue
          </BaseButton>
          <BaseButton
            v-else
            variant="solid"
            size="lg"
            :loading="authStore.isLoading"
            :disabled="!canProceed"
            @click="finish"
          >
            Create my Land
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>
