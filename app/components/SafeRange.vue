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
        <CardTitle class="text-lg">Status</CardTitle>
        <Badge
          :variant="comfortLevel === 'impossible' ? 'destructive' : comfortLevel === 'won' ? 'default' : 'secondary'"
          :class="{
            'bg-teal-200/50 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300 border-teal-300/50': comfortLevel === 'comfortable',
            'bg-amber-200/50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-200/50': comfortLevel === 'moderate',
            'bg-rose-200/50 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300 border-rose-200/50': comfortLevel === 'tight',
            'bg-sky-200/50 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300 border-sky-300/50': comfortLevel === 'won',
          }"
        >
          {{ comfortLevel === 'comfortable' ? 'Comfortable' :
             comfortLevel === 'moderate' ? 'Moderate' :
             comfortLevel === 'tight' ? 'Tight' :
             comfortLevel === 'won' ? 'Found!' :
             'Impossible' }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Current Range Info -->
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded-lg bg-muted p-3">
          <p class="text-xs text-muted-foreground">Range</p>
          <p class="text-sm font-mono font-semibold">
            [{{ rangeLow.toLocaleString() }}, {{ rangeHigh.toLocaleString() }}]
          </p>
        </div>
        <div class="rounded-lg bg-muted p-3">
          <p class="text-xs text-muted-foreground">Size</p>
          <p class="text-sm font-mono font-semibold">{{ rangeSize.toLocaleString() }}</p>
        </div>
        <div class="rounded-lg bg-muted p-3">
          <p class="text-xs text-muted-foreground">Guesses Left</p>
          <p class="text-sm font-mono font-semibold">{{ guessesLeft }}</p>
        </div>
      </div>

      <!-- Won State -->
      <div v-if="isWon" class="rounded-lg border border-sky-300/40 bg-sky-100/50 dark:bg-sky-400/10 dark:border-sky-400/30 p-4 text-center">
        <p class="text-lg font-semibold text-sky-700 dark:text-sky-300">
          Number Found!
        </p>
        <p class="text-2xl font-mono font-bold text-sky-800 dark:text-sky-200 mt-1">
          {{ rangeLow.toLocaleString() }}
        </p>
      </div>

      <!-- Impossible State -->
      <Alert v-else-if="!isPossible" variant="destructive">
        <AlertTitle>Impossible</AlertTitle>
        <AlertDescription>
          Cannot guarantee finding the number. Range size ({{ rangeSize.toLocaleString() }}) exceeds
          maximum coverable ({{ maxCoverable.toLocaleString() }}) with {{ guessesLeft }} guess{{ guessesLeft !== 1 ? 'es' : '' }}.
        </AlertDescription>
      </Alert>

      <!-- Safe Range Display -->
      <div v-else-if="safeRange" class="space-y-3">
        <div
          class="rounded-lg border p-4 text-center transition-colors"
          :class="{
            'border-teal-300/40 bg-teal-100/50 dark:bg-teal-400/10 dark:border-teal-400/25': comfortLevel === 'comfortable',
            'border-amber-200/50 bg-amber-100/40 dark:bg-amber-400/10 dark:border-amber-400/25': comfortLevel === 'moderate',
            'border-rose-200/50 bg-rose-100/40 dark:bg-rose-400/10 dark:border-rose-400/25': comfortLevel === 'tight',
          }"
        >
          <p class="text-xs text-muted-foreground mb-1">Safe Range to Guess</p>
          <p
            class="text-2xl font-mono font-bold"
            :class="{
              'text-teal-700 dark:text-teal-300': comfortLevel === 'comfortable',
              'text-amber-700 dark:text-amber-300': comfortLevel === 'moderate',
              'text-rose-700 dark:text-rose-300': comfortLevel === 'tight',
            }"
          >
            [{{ safeRange.low.toLocaleString() }}, {{ safeRange.high.toLocaleString() }}]
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ safeRangeSize.toLocaleString() }} safe number{{ safeRangeSize !== 1 ? 's' : '' }}
            ({{ Math.round((safeRangeSize / rangeSize) * 100) }}% of range)
          </p>
        </div>

        <p class="text-xs text-muted-foreground text-center">
          Pick any number in the safe range. Regardless of the oracle's response,
          you can still find the answer within {{ guessesLeft - 1 }} remaining guess{{ guessesLeft - 1 !== 1 ? 'es' : '' }}.
        </p>
      </div>
    </CardContent>
  </Card>
</template>
