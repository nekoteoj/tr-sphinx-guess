<script setup lang="ts">
const colorMode = useColorMode()
const { locale } = useI18n()

// Apply dark class and lang attribute to html element
useHead({
  htmlAttrs: {
    class: computed(() => (colorMode.value === 'dark' ? 'dark' : '')),
    lang: computed(() => locale.value)
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
