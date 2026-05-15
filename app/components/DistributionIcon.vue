<script setup lang="ts">
defineProps<{
  type: 'standard' | 'risky_edge'
  size?: number
}>()
</script>

<template>
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? 16"
    :height="size ?? 16"
    viewBox="0 0 24 24"
    fill="none"
    :class="{ 'text-current': size === 40 }"
  >
    <template v-if="type === 'standard'">
      <rect x="2" y="14" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="6.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="11" y="6" width="3" height="14" rx="1" fill="currentColor" />
      <rect x="15.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="20" y="14" width="3" height="6" rx="1" fill="currentColor" />
    </template>
    <template v-else>
      <rect x="2" y="6" width="3" height="14" rx="1" fill="currentColor" />
      <rect x="6.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="11" y="14" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="15.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="20" y="6" width="3" height="14" rx="1" fill="currentColor" />
    </template>
  </svg>
</template>
