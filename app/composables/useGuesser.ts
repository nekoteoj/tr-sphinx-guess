import { computed, ref } from "vue"

export type GameMode = "manual" | "auto_pick"

export interface HistoryEntry {
  step: number
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
  mode: GameMode
  suggestedGuess: number
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
const mode = ref<GameMode>("manual")
const currentSuggestedGuess = ref(DEFAULT_RANGE_LOW)

function clamp(value: number, low: number, high: number) {
  return Math.min(high, Math.max(low, value))
}

function erf(x: number) {
  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * absX)
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-absX * absX)
  return sign * y
}

function normalCdf(x: number) {
  return 0.5 * (1 + erf(x / Math.SQRT2))
}

function inverseNormalCdf(p: number) {
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1,
    2.506628277459239,
  ]
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968,
    2.938163982698783,
  ]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]

  const pLow = 0.02425
  const pHigh = 1 - pLow

  if (p <= 0) return Number.NEGATIVE_INFINITY
  if (p >= 1) return Number.POSITIVE_INFINITY

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p))
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    )
  }

  if (p <= pHigh) {
    const q = p - 0.5
    const r = q * q
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    )
  }

  const q = Math.sqrt(-2 * Math.log(1 - p))
  return (
    -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  )
}

function sampleTruncatedNormalInt(low: number, high: number) {
  if (low >= high) return low

  const mu = (low + high) / 2
  const sigma = mu - low

  if (!Number.isFinite(sigma) || sigma <= 0) {
    return clamp(Math.round(mu), low, high)
  }

  const a = (low - mu) / sigma
  const b = (high - mu) / sigma
  const cdfA = normalCdf(a)
  const cdfB = normalCdf(b)

  if (!Number.isFinite(cdfA) || !Number.isFinite(cdfB) || cdfA >= cdfB) {
    return clamp(Math.round(mu), low, high)
  }

  const u = cdfA + Math.random() * (cdfB - cdfA)
  const z = inverseNormalCdf(u)
  const sample = mu + sigma * z

  return clamp(Math.round(sample), low, high)
}

export function useGuesser() {
  // Computed values
  const rangeSize = computed(() => rangeHigh.value - rangeLow.value + 1)

  const maxCoverable = computed(() => {
    if (guessesLeft.value <= 0) return 0
    return 2 ** guessesLeft.value - 1
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
    const maxPerSide = 2 ** (G - 1) - 1

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

  const canUndo = computed(() => history.value.length > 1)

  const isGameOver = computed(() => {
    return guessesLeft.value <= 0 && rangeSize.value > 1
  })

  const midpointGuess = computed(() => {
    return Math.floor((rangeLow.value + rangeHigh.value) / 2)
  })

  const suggestedGuess = computed(() => {
    if (mode.value === "auto_pick") return currentSuggestedGuess.value
    return midpointGuess.value
  })

  const comfortLevel = computed(() => {
    if (isGameOver.value) return "gameover"
    if (isWon.value) return "won"
    if (!isPossible.value) return "impossible"
    const ratio = safeRangeSize.value / rangeSize.value
    if (ratio >= 0.5) return "comfortable"
    if (ratio >= 0.2) return "moderate"
    return "tight"
  })

  function refreshSuggestedGuess() {
    if (rangeLow.value >= rangeHigh.value) {
      currentSuggestedGuess.value = rangeLow.value
      return
    }

    if (mode.value === "auto_pick") {
      const sourceLow = safeRange.value ? safeRange.value.low : rangeLow.value
      const sourceHigh = safeRange.value ? safeRange.value.high : rangeHigh.value
      currentSuggestedGuess.value = sampleTruncatedNormalInt(sourceLow, sourceHigh)
      return
    }

    currentSuggestedGuess.value = midpointGuess.value
  }

  // Actions
  function startGame(low: number, high: number, guesses: number, gameMode: GameMode) {
    rangeLow.value = low
    rangeHigh.value = high
    guessesLeft.value = guesses
    initialGuesses.value = guesses
    mode.value = gameMode
    isStarted.value = true
    history.value = []

    refreshSuggestedGuess()

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

    refreshSuggestedGuess()
    addHistoryEntry()
  }

  function submitAutoFeedback(direction: "lower" | "higher") {
    if (guessesLeft.value <= 0) return

    const guess = currentSuggestedGuess.value

    if (direction === "lower") {
      const newHigh = guess - 1
      if (newHigh < rangeLow.value) return
      rangeHigh.value = newHigh
    } else {
      const newLow = guess + 1
      if (newLow > rangeHigh.value) return
      rangeLow.value = newLow
    }

    guessesLeft.value--

    refreshSuggestedGuess()
    addHistoryEntry()
  }

  function setMode(nextMode: GameMode) {
    if (mode.value === nextMode) return
    mode.value = nextMode
    refreshSuggestedGuess()
  }

  function rerollSuggestedGuess() {
    if (!isStarted.value) return
    if (mode.value !== "auto_pick") return
    if (isWon.value || isGameOver.value) return
    refreshSuggestedGuess()
  }

  function addHistoryEntry() {
    const sr = safeRange.value
    history.value.push({
      step: history.value.length,
      rangeLow: rangeLow.value,
      rangeHigh: rangeHigh.value,
      guessesLeft: guessesLeft.value,
      mode: mode.value,
      suggestedGuess: currentSuggestedGuess.value,
      safeLow: sr ? sr.low : null,
      safeHigh: sr ? sr.high : null,
      isPossible: isPossible.value,
    })
  }

  function undo() {
    if (history.value.length <= 1) return

    history.value.pop()
    const prev = history.value[history.value.length - 1]
    rangeLow.value = prev.rangeLow
    rangeHigh.value = prev.rangeHigh
    guessesLeft.value = prev.guessesLeft
    mode.value = prev.mode
    currentSuggestedGuess.value = prev.suggestedGuess
  }

  function reset() {
    rangeLow.value = DEFAULT_RANGE_LOW
    rangeHigh.value = DEFAULT_RANGE_HIGH
    guessesLeft.value = DEFAULT_GUESSES
    initialGuesses.value = DEFAULT_GUESSES
    isStarted.value = false
    mode.value = "manual"
    currentSuggestedGuess.value = DEFAULT_RANGE_LOW
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
    mode,

    // Computed
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

    // Actions
    startGame,
    setMode,
    rerollSuggestedGuess,
    submitOracleResponse,
    submitAutoFeedback,
    undo,
    reset,
  }
}
