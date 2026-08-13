<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  unreadCount?: number
}>()

const emit = defineEmits<{ click: [] }>()

const displayCount = computed(() => {
  const c = props.unreadCount ?? 0
  if (c >= 100) return '99+'
  return String(c)
})
</script>

<template>
  <button class="chat-btn" @click="emit('click')">
    <svg class="chat-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span class="chat-btn-label">Chat</span>
    <span v-if="unreadCount && unreadCount > 0" class="chat-badge">{{ displayCount }}</span>
  </button>
</template>

<style scoped>
.chat-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.chat-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}
.chat-btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.chat-btn-label {
  font-size: 0.875rem;
  line-height: 1;
}

.chat-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 9999px;
  background: #FD4F00;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(253, 79, 0, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>
