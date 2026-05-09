import { ref, computed } from 'vue'

export interface HistoryEntry {
  step: number
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
  safeLow: number | null
  safeHigh: number | null
  isPossible: boolean
}

const DEFAULT_RANGE_LOW = 1
const DEFAULT_RANGE_HIGH = 9999
const DEFAULT_GUESSES = 14

// Module-level state (singleton) — shared across all components
const rangeLow = ref(DEFAULT_RANGE_LOW)
const rangeHigh = ref(DEFAULT_RANGE_HIGH)
const guessesLeft = ref(DEFAULT_GUESSES)
const initialGuesses = ref(DEFAULT_GUESSES)
const history = ref<HistoryEntry[]>([])
const isStarted = ref(false)

export function useGuesser() {

  // Computed values
  const rangeSize = computed(() => rangeHigh.value - rangeLow.value + 1)

  const maxCoverable = computed(() => {
    if (guessesLeft.value <= 0) return 0
    return Math.pow(2, guessesLeft.value) - 1
  })

  const isPossible = computed(() => {
    if (rangeSize.value <= 1) return true
    return rangeSize.value <= maxCoverable.value
  })

  const isWon = computed(() => rangeSize.value <= 1)

  const safeRange = computed(() => {
    if (isWon.value) {
      return { low: rangeLow.value, high: rangeLow.value }
    }

    if (!isPossible.value) {
      return null
    }

    const G = guessesLeft.value
    if (G <= 0) return null

    const N = rangeSize.value
    const maxPerSide = Math.pow(2, G - 1) - 1

    // Safe range: positions where both sides are solvable in G-1 guesses
    // x is safe if (x - lo) <= maxPerSide AND (hi - x) <= maxPerSide
    // x >= lo + (N - 1 - maxPerSide) = lo + max(0, N - 1 - maxPerSide)
    // x <= hi - (N - 1 - maxPerSide) = hi - max(0, N - 1 - maxPerSide)
    const offset = Math.max(0, N - 1 - maxPerSide)
    const safeLow = rangeLow.value + offset
    const safeHigh = rangeHigh.value - offset

    if (safeLow > safeHigh) return null

    return { low: safeLow, high: safeHigh }
  })

  const safeRangeSize = computed(() => {
    if (!safeRange.value) return 0
    return safeRange.value.high - safeRange.value.low + 1
  })

  const isGameOver = computed(() => {
    return guessesLeft.value <= 0 && rangeSize.value > 1
  })

  const suggestedGuess = computed(() => {
    return Math.floor((rangeLow.value + rangeHigh.value) / 2)
  })

  const comfortLevel = computed(() => {
    if (isGameOver.value) return 'gameover'
    if (isWon.value) return 'won'
    if (!isPossible.value) return 'impossible'
    const ratio = safeRangeSize.value / rangeSize.value
    if (ratio >= 0.5) return 'comfortable'
    if (ratio >= 0.2) return 'moderate'
    return 'tight'
  })

  // Actions
  function startGame(low: number, high: number, guesses: number) {
    rangeLow.value = low
    rangeHigh.value = high
    guessesLeft.value = guesses
    initialGuesses.value = guesses
    isStarted.value = true
    history.value = []

    // Record initial state
    addHistoryEntry()
  }

  function submitOracleResponse(newLow: number, newHigh: number) {
    if (guessesLeft.value <= 0) return
    if (newLow > newHigh) return
    if (newLow < rangeLow.value || newHigh > rangeHigh.value) return

    rangeLow.value = newLow
    rangeHigh.value = newHigh
    guessesLeft.value--

    addHistoryEntry()
  }

  function addHistoryEntry() {
    const sr = safeRange.value
    history.value.push({
      step: history.value.length,
      rangeLow: rangeLow.value,
      rangeHigh: rangeHigh.value,
      guessesLeft: guessesLeft.value,
      safeLow: sr ? sr.low : null,
      safeHigh: sr ? sr.high : null,
      isPossible: isPossible.value,
    })
  }

  function reset() {
    rangeLow.value = DEFAULT_RANGE_LOW
    rangeHigh.value = DEFAULT_RANGE_HIGH
    guessesLeft.value = DEFAULT_GUESSES
    initialGuesses.value = DEFAULT_GUESSES
    isStarted.value = false
    history.value = []
  }

  return {
    // State
    rangeLow,
    rangeHigh,
    guessesLeft,
    initialGuesses,
    history,
    isStarted,

    // Computed
    rangeSize,
    maxCoverable,
    isPossible,
    isWon,
    isGameOver,
    suggestedGuess,
    safeRange,
    safeRangeSize,
    comfortLevel,

    // Actions
    startGame,
    submitOracleResponse,
    reset,
  }
}
