<script setup lang="ts">
const {
  rangeLow,
  rangeHigh,
  guessesLeft,
  history,
  isStarted,
  rangeSize,
  maxCoverable,
  isPossible,
  isWon,
  isGameOver,
  canUndo,
  suggestedGuess,
  safeRange,
  safeRangeSize,
  comfortLevel,
  startGame,
  submitOracleResponse,
  undo,
  reset,
} = useGuesser()

function handleStart(low: number, high: number, guesses: number) {
  startGame(low, high, guesses)
}

function handleOracleSubmit(newLow: number, newHigh: number) {
  submitOracleResponse(newLow, newHigh)
}

function handleReset() {
  reset()
}

function handleUndo() {
  undo()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Intro text (when not started) -->
    <div v-if="!isStarted" class="text-center space-y-2 py-4">
      <h2 class="text-2xl font-bold tracking-tight">{{ $t('index.heading') }}</h2>
      <p class="text-muted-foreground text-sm max-w-md mx-auto">
        {{ $t('index.description') }}
      </p>
    </div>

    <!-- Safe Range Display (when game is active) -->
    <SafeRange
      v-if="isStarted"
      :range-low="rangeLow"
      :range-high="rangeHigh"
      :guesses-left="guessesLeft"
      :range-size="rangeSize"
      :is-possible="isPossible"
      :is-won="isWon"
      :is-game-over="isGameOver"
      :suggested-guess="suggestedGuess"
      :safe-range="safeRange"
      :safe-range-size="safeRangeSize"
      :comfort-level="comfortLevel"
      :max-coverable="maxCoverable"
    />

    <!-- Form -->
    <GuesserForm
      :is-started="isStarted"
      :range-low="rangeLow"
      :range-high="rangeHigh"
      :guesses-left="guessesLeft"
      :can-undo="canUndo"
      @start="handleStart"
      @submit-oracle="handleOracleSubmit"
      @undo="handleUndo"
      @reset="handleReset"
    />

    <!-- History -->
    <GuessHistory :history="history" />
  </div>
</template>
