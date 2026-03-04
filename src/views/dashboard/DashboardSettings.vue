<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const firstName = ref(userStore.user?.first_name || '')
const lastName = ref(userStore.user?.last_name || '')
const email = ref(userStore.user?.email || '')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showDeleteConfirm = ref(false)

function saveProfile() {
  if (!userStore.user) return
  userStore.setUser({
    ...userStore.user,
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
  })
  // TODO: call API to update profile
}

function changePassword() {
  // TODO: call API to change password
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

function handleDeleteAccount() {
  // TODO: call API to delete account
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="max-w-xl m-auto overflow-y-auto h-full">
    <h1 class="text-xl font-bold text-gray-900 mb-6">Settings</h1>

    <!-- Avatar section -->
    <div class="flex items-center gap-4 mb-8">
      <BaseAvatar
        :src="userStore.user?.avatar_image"
        :alt="userStore.fullName || 'User'"
        size="lg"
      />
      <div>
        <BaseButton variant="outline" size="sm">
          Change avatar
        </BaseButton>
        <p class="text-xs text-gray-400 mt-1">JPG, PNG. Max 2MB.</p>
      </div>
    </div>

    <!-- Profile form -->
    <div class="space-y-4 mb-8">
      <h2 class="text-sm font-semibold text-gray-900">Profile</h2>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="firstName" label="First name" placeholder="First name" />
        <BaseInput v-model="lastName" label="Last name" placeholder="Last name" />
      </div>
      <BaseInput v-model="email" label="Email" type="email" placeholder="you@example.com" />
      <BaseButton variant="solid" size="sm" @click="saveProfile">
        Save profile
      </BaseButton>
    </div>

    <!-- Password form -->
    <div class="space-y-4 mb-8 pt-8 border-t border-gray-100">
      <h2 class="text-sm font-semibold text-gray-900">Change password</h2>
      <BaseInput
        v-model="currentPassword"
        label="Current password"
        type="password"
        placeholder="Enter current password"
      />
      <BaseInput
        v-model="newPassword"
        label="New password"
        type="password"
        placeholder="Enter new password"
      />
      <BaseInput
        v-model="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Confirm new password"
      />
      <BaseButton variant="solid" size="sm" @click="changePassword">
        Update password
      </BaseButton>
    </div>

    <!-- Danger zone -->
    <div class="pt-8 border-t border-gray-100">
      <h2 class="text-sm font-semibold text-danger mb-2">Danger zone</h2>
      <p class="text-xs text-gray-500 mb-3">
        Permanently delete your account and all your Lands. This action cannot be undone.
      </p>
      <BaseButton
        variant="outline"
        size="sm"
        class="!text-danger !border-danger/30 hover:!bg-danger/5"
        @click="showDeleteConfirm = true"
      >
        Delete account
      </BaseButton>
    </div>

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Delete account"
      message="Are you sure? This will permanently delete your account and all your Lands."
      confirm-label="Delete my account"
      :destructive="true"
      @confirm="handleDeleteAccount"
    />
  </div>
</template>
