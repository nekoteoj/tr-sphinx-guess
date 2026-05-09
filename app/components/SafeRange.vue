<script setup lang="ts">
defineProps<{
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
  rangeSize: number
  isPossible: boolean
  isWon: boolean
  safeRange: { low: number; high: number } | null
  safeRangeSize: number
  comfortLevel: string
  maxCoverable: number
}>()
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg">{{ $t('status.title') }}</CardTitle>
        <Badge
          :variant="comfortLevel === 'impossible' ? 'destructive' : comfortLevel === 'won' ? 'default' : 'secondary'"
          :class="{
            'bg-emerald-200/50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border-emerald-300/50': comfortLevel === 'comfortable',
            'bg-violet-200/50 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 border-violet-300/50': comfortLevel === 'moderate',
            'bg-pink-200/50 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300 border-pink-300/50': comfortLevel === 'tight',
            'bg-blue-200/50 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 border-blue-300/50': comfortLevel === 'won',
          }"
        >
          {{ comfortLevel === 'comfortable' ? $t('status.comfortable') :
             comfortLevel === 'moderate' ? $t('status.moderate') :
             comfortLevel === 'tight' ? $t('status.tight') :
             comfortLevel === 'won' ? $t('status.found') :
             $t('status.impossible') }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Current Range Info -->
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded-lg bg-muted p-3">
          <p class="text-xs text-muted-foreground">{{ $t('status.range') }}</p>
          <p class="text-sm font-mono font-semibold">
            [{{ rangeLow.toLocaleString() }}, {{ rangeHigh.toLocaleString() }}]
          </p>
        </div>
        <div class="rounded-lg bg-muted p-3">
          <p class="text-xs text-muted-foreground">{{ $t('status.size') }}</p>
          <p class="text-sm font-mono font-semibold">{{ rangeSize.toLocaleString() }}</p>
        </div>
        <div class="rounded-lg bg-muted p-3">
          <p class="text-xs text-muted-foreground">{{ $t('status.guessesLeft') }}</p>
          <p class="text-sm font-mono font-semibold">{{ guessesLeft }}</p>
        </div>
      </div>

      <!-- Won State -->
      <div v-if="isWon" class="rounded-lg border border-blue-300/40 bg-blue-100/50 dark:bg-blue-400/10 dark:border-blue-400/30 p-4 text-center">
        <p class="text-lg font-semibold text-blue-700 dark:text-blue-300">
          {{ $t('status.numberFound') }}
        </p>
        <p class="text-2xl font-mono font-bold text-blue-800 dark:text-blue-200 mt-1">
          {{ rangeLow.toLocaleString() }}
        </p>
      </div>

      <!-- Impossible State -->
      <Alert v-else-if="!isPossible" variant="destructive">
        <AlertTitle>{{ $t('status.impossible') }}</AlertTitle>
        <AlertDescription>
          {{ $t('status.impossibleDesc', { rangeSize: rangeSize.toLocaleString(), maxCoverable: maxCoverable.toLocaleString(), guessesLeft }) }}
        </AlertDescription>
      </Alert>

      <!-- Safe Range Display -->
      <div v-else-if="safeRange" class="space-y-3">
        <div
          class="rounded-lg border p-4 text-center transition-colors"
          :class="{
            'border-emerald-300/40 bg-emerald-100/50 dark:bg-emerald-400/10 dark:border-emerald-400/25': comfortLevel === 'comfortable',
            'border-violet-300/40 bg-violet-100/50 dark:bg-violet-400/10 dark:border-violet-400/25': comfortLevel === 'moderate',
            'border-pink-300/40 bg-pink-100/50 dark:bg-pink-400/10 dark:border-pink-400/25': comfortLevel === 'tight',
          }"
        >
          <p class="text-xs text-muted-foreground mb-1">{{ $t('status.safeRangeLabel') }}</p>
          <p
            class="text-2xl font-mono font-bold"
            :class="{
              'text-emerald-700 dark:text-emerald-300': comfortLevel === 'comfortable',
              'text-violet-700 dark:text-violet-300': comfortLevel === 'moderate',
              'text-pink-700 dark:text-pink-300': comfortLevel === 'tight',
            }"
          >
            [{{ safeRange.low.toLocaleString() }}, {{ safeRange.high.toLocaleString() }}]
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ $t('status.safeNumbers', { count: safeRangeSize.toLocaleString(), percent: Math.round((safeRangeSize / rangeSize) * 100) }) }}
          </p>
        </div>

        <p class="text-xs text-muted-foreground text-center">
          {{ $t('status.helpText', { remaining: guessesLeft - 1 }) }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
