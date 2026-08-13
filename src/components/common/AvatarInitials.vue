<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
}>()

const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})

const brandColor = { bg: '#FEE7DC', text: '#FD4F00' }

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return { outer: 'w-6 h-6', text: 'text-xs' }
    case 'sm': return { outer: 'w-7 h-7', text: 'text-xs' }
    case 'lg': return { outer: 'w-12 h-12', text: 'text-base' }
    default: return { outer: 'w-9 h-9', text: 'text-sm' }
  }
})
</script>

<template>
  <div
    :class="[sizeClasses.outer, 'rounded-full flex items-center justify-center shrink-0 font-semibold select-none']"
    :style="{ backgroundColor: brandColor.bg, color: brandColor.text }"
    :title="name"
  >
    <span :class="sizeClasses.text">{{ initials }}</span>
  </div>
</template>
