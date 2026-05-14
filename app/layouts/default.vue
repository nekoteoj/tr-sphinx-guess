<script setup lang="ts">
const { reset } = useGuesser()
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto flex h-14 items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity" @click="reset">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-primary"
          >
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
          </svg>
          <h1 class="text-lg font-semibold">{{ $t('layout.title') }}</h1>
        </NuxtLink>
        <div class="flex items-center gap-1">
          <GithubButton />
          <AlgorithmDialog />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 max-w-2xl">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-xs text-muted-foreground">
      <div class="container mx-auto px-4">
        {{ $t('layout.footer') }} · {{ $t('layout.credit') }}
        <a href="https://github.com/nekoteoj" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-foreground transition-colors">
          <GithubIcon class="h-3 w-3" />
          nekoteoj
        </a>
      </div>
    </footer>
  </div>
</template>
