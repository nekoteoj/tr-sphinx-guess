<script setup lang="ts">
const { locale, setLocale } = useI18n()

function toggleLocale() {
  const newLocale = locale.value === 'th' ? 'en' : 'th'
  setLocale(newLocale)
}

const currentFlag = computed(() => (locale.value === 'th' ? '🇹🇭' : '🇬🇧'))
const currentCode = computed(() => (locale.value === 'th' ? 'TH' : 'EN'))
</script>

<template>
  <Button
    variant="outline"
    class="gap-1.5 px-2.5 text-xs font-medium h-10"
    @click="toggleLocale"
    aria-label="Switch language"
  >
    <span class="text-base leading-none">{{ currentFlag }}</span>
    <span>{{ currentCode }}</span>
  </Button>
</template>
