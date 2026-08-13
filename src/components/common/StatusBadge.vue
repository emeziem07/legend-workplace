<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  size?: 'sm' | 'md'
}>()

const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  // Installation Status
  'Activated': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  'Pending': { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Refunded': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  'In Progress': { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Cancelled': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  'Completed': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },

  // Provisioning Status
  'Awaiting Provisioning': { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Ready': { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Provisioned': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  'Blocked': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },

  // Activation Status
  'Waiting': { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Delayed': { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Failed': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },

  // Power Level & Indoor/Outdoor Status
  'Complete': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  'Missing': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },

  // Issues
  'Normal': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  'Attention Required': { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Critical': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },

  // Approval Status
  'Approved': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  'Rejected': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  'Under Review': { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Processing': { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Paid': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },

  // Fallback for any other status
  'default': { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
}

const colors = computed(() => {
  const status = props.status
  return statusColorMap[status] || statusColorMap['default']
})

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
})
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-full font-medium whitespace-nowrap border', sizeClasses]"
    :style="{
      backgroundColor: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    }"
  >
    {{ status }}
  </span>
</template>
