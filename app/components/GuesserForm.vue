<script setup lang="ts">
import { ArrowDown, ArrowRight, ArrowUp, Play, RotateCcw, Sparkles, Undo2 } from 'lucide-vue-next'
import type { GameMode } from '~/composables/useGuesser'

const { t } = useI18n()

const props = defineProps<{
  isStarted: boolean
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
  mode: GameMode
  suggestedGuess: number
  canUndo: boolean
}>()

const emit = defineEmits<{
  start: [low: number, high: number, guesses: number, mode: GameMode]
  submitOracle: [newLow: number, newHigh: number]
  submitAutoFeedback: [direction: 'lower' | 'higher']
  undo: []
  reset: []
}>()

const setupLow = ref<number>(1)
const setupHigh = ref<number>(9999)
const setupGuesses = ref<number>(14)

const oracleLow = ref<number>(1)
const oracleHigh = ref<number>(9999)

const setupError = computed(() => {
  if (setupLow.value >= setupHigh.value) return t('setup.errors.lowGeHigh')
  if (setupGuesses.value < 1) return t('setup.errors.minGuess')
  if (setupGuesses.value > 50) return t('setup.errors.maxGuess')
  return null
})

const oracleError = computed(() => {
  if (oracleLow.value > oracleHigh.value) return t('setup.errors.lowGtHigh')
  if (oracleLow.value < props.rangeLow || oracleHigh.value > props.rangeHigh) {
    return t('setup.errors.outOfRange', { low: props.rangeLow, high: props.rangeHigh })
  }
  if (oracleLow.value === props.rangeLow && oracleHigh.value === props.rangeHigh) {
    return t('setup.errors.notNarrower')
  }
  return null
})

const canGoLower = computed(() => props.guessesLeft > 0 && props.suggestedGuess > props.rangeLow)
const canGoHigher = computed(() => props.guessesLeft > 0 && props.suggestedGuess < props.rangeHigh)

function handleStart(mode: GameMode) {
  if (setupError.value) return
  emit('start', setupLow.value, setupHigh.value, setupGuesses.value, mode)
  oracleLow.value = setupLow.value
  oracleHigh.value = setupHigh.value
}

function handleOracleSubmit() {
  if (oracleError.value) return
  emit('submitOracle', oracleLow.value, oracleHigh.value)
}

function handleReset() {
  setupLow.value = 1
  setupHigh.value = 9999
  setupGuesses.value = 14
  emit('reset')
}

watch(
  [() => props.rangeLow, () => props.rangeHigh],
  ([low, high]) => {
    oracleLow.value = low
    oracleHigh.value = high
  }
)
</script>

<template>
  <Card v-if="!isStarted">
    <CardHeader>
      <CardTitle class="text-lg">{{ $t('setup.title') }}</CardTitle>
      <CardDescription>{{ $t('setup.description') }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="setup-low">{{ $t('setup.rangeLow') }}</Label>
          <Input id="setup-low" v-model.number="setupLow" type="number" placeholder="1" @keyup.enter="handleStart('manual')" />
        </div>
        <div class="space-y-2">
          <Label for="setup-high">{{ $t('setup.rangeHigh') }}</Label>
          <Input id="setup-high" v-model.number="setupHigh" type="number" placeholder="9999" @keyup.enter="handleStart('manual')" />
        </div>
      </div>
      <div class="space-y-2">
        <Label for="setup-guesses">{{ $t('setup.totalGuesses') }}</Label>
        <Input id="setup-guesses" v-model.number="setupGuesses" type="number" min="1" max="50" placeholder="14" @keyup.enter="handleStart('manual')" />
        <p class="text-xs text-muted-foreground">
          {{ $t('setup.coverageHint', { guesses: setupGuesses, max: (2 ** setupGuesses - 1).toLocaleString() }) }}
        </p>
      </div>
      <p v-if="setupError" class="text-sm text-destructive">{{ setupError }}</p>
    </CardContent>
    <CardFooter class="grid grid-cols-2 gap-2">
      <Button class="w-full" :disabled="!!setupError" @click="handleStart('manual')">
        <Play class="mr-2 h-4 w-4" />
        {{ $t('setup.manualButton') }}
      </Button>
      <Button
        class="w-full bg-secondary text-secondary-foreground"
        :disabled="!!setupError"
        @click="handleStart('auto_pick')"
      >
        <Sparkles class="mr-2 h-4 w-4" />
        {{ $t('setup.autoPickButton') }}
      </Button>
    </CardFooter>
  </Card>

  <Card v-else>
    <CardHeader v-if="mode === 'manual'">
      <CardTitle class="text-lg">{{ $t('oracle.title') }}</CardTitle>
      <CardDescription>{{ $t('oracle.manualDescription') }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="mode === 'manual'" class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="oracle-low">{{ $t('oracle.newLow') }}</Label>
          <Input id="oracle-low" v-model.number="oracleLow" type="number" :min="rangeLow" :max="rangeHigh" @keyup.enter="handleOracleSubmit" />
        </div>
        <div class="space-y-2">
          <Label for="oracle-high">{{ $t('oracle.newHigh') }}</Label>
          <Input id="oracle-high" v-model.number="oracleHigh" type="number" :min="rangeLow" :max="rangeHigh" @keyup.enter="handleOracleSubmit" />
        </div>
      </div>

      <p v-if="mode === 'manual' && oracleError" class="text-sm text-destructive">{{ oracleError }}</p>
    </CardContent>
    <CardFooter class="flex flex-col gap-2">
      <Button v-if="mode === 'manual'" class="w-full" :disabled="!!oracleError" @click="handleOracleSubmit">
        <ArrowRight class="mr-2 h-4 w-4" />
        {{ $t('oracle.submitButton') }}
      </Button>

      <div v-else class="flex gap-2 w-full">
        <Button class="flex-1 h-[70px] bg-destructive text-destructive-foreground" :disabled="!canGoLower" @click="emit('submitAutoFeedback', 'lower')">
          <ArrowDown class="mr-2 h-5 w-5" />
          {{ $t('oracle.lowerButton') }}
        </Button>
        <Button class="flex-1 h-[70px] bg-accent text-accent-foreground" :disabled="!canGoHigher" @click="emit('submitAutoFeedback', 'higher')">
          <ArrowUp class="mr-2 h-5 w-5" />
          {{ $t('oracle.higherButton') }}
        </Button>
      </div>

      <div class="flex gap-2 w-full">
        <Button class="flex-1" variant="outline" :disabled="!canUndo" @click="emit('undo')">
          <Undo2 class="mr-2 h-4 w-4" />
          {{ $t('oracle.undoButton') }}
        </Button>
        <Button class="flex-1" variant="outline" @click="handleReset">
          <RotateCcw class="mr-2 h-4 w-4" />
          {{ $t('oracle.resetButton') }}
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
