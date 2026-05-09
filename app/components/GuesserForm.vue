<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  isStarted: boolean
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
}>()

const emit = defineEmits<{
  start: [low: number, high: number, guesses: number]
  submitOracle: [newLow: number, newHigh: number]
  reset: []
}>()

// Setup form
const setupLow = ref(1)
const setupHigh = ref(9999)
const setupGuesses = ref(14)

// Oracle response form
const oracleLow = ref(1)
const oracleHigh = ref(9999)

// Validation
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

function handleStart() {
  if (setupError.value) return
  emit('start', setupLow.value, setupHigh.value, setupGuesses.value)
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

// Watch for range changes to update oracle form defaults
watch(() => [props.rangeLow, props.rangeHigh], ([low, high]) => {
  oracleLow.value = low
  oracleHigh.value = high
})
</script>

<template>
  <!-- Setup Form (before game starts) -->
  <Card v-if="!isStarted">
    <CardHeader>
      <CardTitle class="text-lg">{{ $t('setup.title') }}</CardTitle>
      <CardDescription>{{ $t('setup.description') }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="setup-low">{{ $t('setup.rangeLow') }}</Label>
          <Input
            id="setup-low"
            v-model.number="setupLow"
            type="number"
            placeholder="1"
          />
        </div>
        <div class="space-y-2">
          <Label for="setup-high">{{ $t('setup.rangeHigh') }}</Label>
          <Input
            id="setup-high"
            v-model.number="setupHigh"
            type="number"
            placeholder="9999"
          />
        </div>
      </div>
      <div class="space-y-2">
        <Label for="setup-guesses">{{ $t('setup.totalGuesses') }}</Label>
        <Input
          id="setup-guesses"
          v-model.number="setupGuesses"
          type="number"
          min="1"
          max="50"
          placeholder="14"
        />
        <p class="text-xs text-muted-foreground">
          {{ $t('setup.coverageHint', { guesses: setupGuesses, max: (Math.pow(2, setupGuesses) - 1).toLocaleString() }) }}
        </p>
      </div>
      <p v-if="setupError" class="text-sm text-destructive">
        {{ setupError }}
      </p>
    </CardContent>
    <CardFooter>
      <Button class="w-full" :disabled="!!setupError" @click="handleStart">
        {{ $t('setup.startButton') }}
      </Button>
    </CardFooter>
  </Card>

  <!-- Oracle Response Form (during game) -->
  <Card v-else>
    <CardHeader>
      <CardTitle class="text-lg">{{ $t('oracle.title') }}</CardTitle>
      <CardDescription>
        {{ $t('oracle.description') }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="oracle-low">{{ $t('oracle.newLow') }}</Label>
          <Input
            id="oracle-low"
            v-model.number="oracleLow"
            type="number"
            :min="rangeLow"
            :max="rangeHigh"
          />
        </div>
        <div class="space-y-2">
          <Label for="oracle-high">{{ $t('oracle.newHigh') }}</Label>
          <Input
            id="oracle-high"
            v-model.number="oracleHigh"
            type="number"
            :min="rangeLow"
            :max="rangeHigh"
          />
        </div>
      </div>
      <p v-if="oracleError" class="text-sm text-destructive">
        {{ oracleError }}
      </p>
    </CardContent>
    <CardFooter class="flex gap-2">
      <Button
        class="flex-1"
        :disabled="!!oracleError"
        @click="handleOracleSubmit"
      >
        {{ $t('oracle.submitButton') }}
      </Button>
      <Button variant="outline" @click="handleReset">
        {{ $t('oracle.resetButton') }}
      </Button>
    </CardFooter>
  </Card>
</template>
