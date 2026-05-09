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
            'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30': comfortLevel === 'comfortable',
            'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30': comfortLevel === 'moderate',
            'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30': comfortLevel === 'tight',
            'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30': comfortLevel === 'won',
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
      <div v-if="isWon" class="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
        <p class="text-lg font-semibold text-green-700 dark:text-green-400">
          Number Found!
        </p>
        <p class="text-2xl font-mono font-bold text-green-800 dark:text-green-300 mt-1">
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
            'border-green-500/30 bg-green-500/10': comfortLevel === 'comfortable',
            'border-amber-500/30 bg-amber-500/10': comfortLevel === 'moderate',
            'border-orange-500/30 bg-orange-500/10': comfortLevel === 'tight',
          }"
        >
          <p class="text-xs text-muted-foreground mb-1">Safe Range to Guess</p>
          <p
            class="text-2xl font-mono font-bold"
            :class="{
              'text-green-700 dark:text-green-400': comfortLevel === 'comfortable',
              'text-amber-700 dark:text-amber-400': comfortLevel === 'moderate',
              'text-orange-700 dark:text-orange-400': comfortLevel === 'tight',
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
