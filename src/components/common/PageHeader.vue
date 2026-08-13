<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-6">
    <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
    <p v-if="subtitle" class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p>
  </div>
</template>
