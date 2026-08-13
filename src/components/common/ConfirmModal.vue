<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('cancel')"></div>
      <div class="modal-panel relative bg-white p-6 z-10 w-full max-w-md">
        <div class="mb-4">
          <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
          <p class="text-sm text-gray-600 mt-2 leading-relaxed">{{ message }}</p>
        </div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6">
          <button @click="emit('cancel')" class="btn-secondary w-full sm:w-auto justify-center">
            {{ cancelLabel || 'Cancel' }}
          </button>
          <button
            @click="emit('confirm')"
            :class="danger ? 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto' : 'btn-primary w-full sm:w-auto justify-center'"
          >
            {{ confirmLabel || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
