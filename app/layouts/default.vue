<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto flex h-14 items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <svg
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
            <path d="m21 21-6.05-6.05M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
            <path d="M10 7v6" />
            <path d="M7 10h6" />
          </svg>
          <h1 class="text-lg font-semibold">Number Guesser</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 max-w-2xl">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t py-4 text-center text-xs text-muted-foreground">
      <div class="container mx-auto px-4">
        Binary search helper — pick any number in the safe range
      </div>
    </footer>
  </div>
</template>
