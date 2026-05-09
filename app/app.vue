<script setup lang="ts">
const colorMode = useColorMode()

// Apply dark class to html element
useHead({
  htmlAttrs: {
    class: computed(() => colorMode.value === 'dark' ? 'dark' : ''),
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
