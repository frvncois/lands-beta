<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon, ChartBarIcon, MegaphoneIcon } from '@heroicons/vue/24/outline'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const integrations = ref([
  {
    id: 'analytics',
    icon: ChartBarIcon,
    label: 'Analytics',
    description: 'Track visitors, page views, and engagement.',
    enabled: false,
  },
  {
    id: 'campaign',
    icon: MegaphoneIcon,
    label: 'Campaign',
    description: 'Email campaigns and newsletter sign-ups.',
    enabled: false,
  },
])
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-left">
      <div
        v-if="modelValue"
        class="fixed right-4 z-20 w-72 flex flex-col bg-white rounded-lg shadow-md border border-gray-100"
        style="top: 72px"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <p class="text-sm font-semibold text-gray-900">Integrations</p>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors duration-fast"
            @click="emit('update:modelValue', false)"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Integration cards -->
        <div class="p-3 flex flex-col gap-2">
          <div
            v-for="item in integrations"
            :key="item.id"
            class="flex items-start gap-3 p-3 rounded-md border border-gray-100 hover:border-gray-200 transition-colors duration-fast"
          >
            <component :is="item.icon" class="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ item.label }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ item.description }}</p>
            </div>
            <!-- Toggle -->
            <button
              :class="[
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-fast focus:outline-none mt-0.5',
                item.enabled ? 'bg-gray-900' : 'bg-gray-200',
              ]"
              @click="item.enabled = !item.enabled"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-fast',
                  item.enabled ? 'translate-x-4' : 'translate-x-0',
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
