<script setup lang="ts">
import { Dices } from 'lucide-vue-next'
import type { GameMode } from '~/composables/useGuesser'

const props = defineProps<{
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
  rangeSize: number
  isPossible: boolean
  isWon: boolean
  isGameOver: boolean
  mode: GameMode
  suggestedGuess: number
  safeRange: { low: number; high: number } | null
  safeRangeSize: number
  comfortLevel: string
  maxCoverable: number
}>()

const emit = defineEmits<{
  setMode: [mode: GameMode]
  reroll: []
}>()

const isAutoPick = computed(() => props.mode === 'auto_pick')

function toggleMode() {
  emit('setMode', isAutoPick.value ? 'manual' : 'auto_pick')
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg">{{ $t('status.title') }}</CardTitle>
        <Badge
          :variant="comfortLevel === 'gameover' ? 'destructive' : 'secondary'"
          :class="{
            'bg-emerald-200/50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border-emerald-300/50': comfortLevel === 'comfortable',
            'bg-violet-200/50 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 border-violet-300/50': comfortLevel === 'moderate',
            'bg-pink-200/50 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300 border-pink-300/50': comfortLevel === 'tight',
            'bg-blue-200/50 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 border-blue-300/50': comfortLevel === 'won',
            'bg-amber-200/50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-300/50': comfortLevel === 'impossible',
          }"
        >
          {{ comfortLevel === 'comfortable' ? $t('status.comfortable') :
             comfortLevel === 'moderate' ? $t('status.moderate') :
             comfortLevel === 'tight' ? $t('status.tight') :
             comfortLevel === 'won' ? $t('status.found') :
             comfortLevel === 'gameover' ? $t('status.gameover') :
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
            {{ $t('common.rangeFormat', { low: rangeLow.toLocaleString(), high: rangeHigh.toLocaleString() }) }}
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

      <!-- Game Over State (out of guesses, didn't find it) -->
      <div v-else-if="isGameOver" class="rounded-lg border border-pink-300/40 bg-pink-100/50 dark:bg-pink-400/10 dark:border-pink-400/30 p-4 text-center">
        <p class="text-lg font-semibold text-pink-700 dark:text-pink-300">
          {{ $t('status.gameoverTitle') }}
        </p>
        <p class="text-sm text-muted-foreground mt-1">
          {{ $t('status.gameoverDesc', { low: rangeLow.toLocaleString(), high: rangeHigh.toLocaleString() }) }}
        </p>
      </div>

      <div v-else-if="mode === 'auto_pick'" class="space-y-3">
        <div class="rounded-lg border border-muted p-4 text-center">
          <p class="text-xs text-muted-foreground mb-1">{{ $t('status.suggestedGuessAuto') }}</p>
          <p class="text-2xl font-mono font-bold text-foreground">
            {{ suggestedGuess.toLocaleString() }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ $t('status.suggestedGuessAutoHint') }}
          </p>
        </div>

        <div v-if="!isPossible" class="rounded-lg border border-amber-300/40 bg-amber-100/50 dark:bg-amber-400/10 dark:border-amber-400/30 p-4 text-center">
          <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">
            {{ $t('status.notGuaranteed') }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ $t('status.impossibleDesc', { rangeSize: rangeSize.toLocaleString(), maxCoverable: maxCoverable.toLocaleString(), guessesLeft }) }}
          </p>
        </div>
      </div>

      <!-- Not Guaranteed State (impossible but can still try) -->
      <div v-else-if="!isPossible" class="space-y-3">
        <div class="rounded-lg border border-amber-300/40 bg-amber-100/50 dark:bg-amber-400/10 dark:border-amber-400/30 p-4 text-center">
          <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">
            {{ $t('status.notGuaranteed') }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ $t('status.impossibleDesc', { rangeSize: rangeSize.toLocaleString(), maxCoverable: maxCoverable.toLocaleString(), guessesLeft }) }}
          </p>
          <p class="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
            {{ $t('status.canStillTry') }}
          </p>
        </div>

        <!-- Suggested midpoint guess -->
        <div class="rounded-lg border border-muted p-4 text-center">
          <p class="text-xs text-muted-foreground mb-1">{{ $t('status.suggestedGuess') }}</p>
          <p class="text-2xl font-mono font-bold text-foreground">
            {{ suggestedGuess.toLocaleString() }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ $t('status.suggestedGuessHint') }}
          </p>
        </div>
      </div>

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
            {{ $t('common.rangeFormat', { low: safeRange.low.toLocaleString(), high: safeRange.high.toLocaleString() }) }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            {{ $t('status.safeNumbers', { count: safeRangeSize.toLocaleString(), percent: Math.round((safeRangeSize / rangeSize) * 100) }) }}
          </p>
        </div>

        <p class="text-xs text-muted-foreground text-center">
          {{ $t('status.helpText', { remaining: guessesLeft - 1 }) }}
        </p>
      </div>

      <div class="flex items-center justify-between gap-2 pt-1">
        <Button
          v-if="mode === 'auto_pick'"
          variant="default"
          size="sm"
          class="gap-2 border-teal-300/60 bg-teal-500 text-white hover:bg-teal-600 dark:border-teal-500/50 dark:bg-teal-600 dark:hover:bg-teal-500"
          :aria-label="$t('mode.reroll')"
          :title="$t('mode.reroll')"
          @click="emit('reroll')"
        >
          <Dices class="h-4 w-4" />
          <span class="hidden md:inline">{{ $t('mode.reroll') }}</span>
        </Button>
        <div v-else />

        <div class="flex items-center gap-2">
          <span class="text-xs" :class="mode === 'manual' ? 'font-medium text-foreground' : 'text-muted-foreground'">
            {{ $t('mode.manual') }}
          </span>
          <button
            type="button"
            role="switch"
            :aria-checked="isAutoPick"
            :aria-label="$t('mode.label')"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :class="isAutoPick ? 'bg-primary' : 'bg-border'"
            @click="toggleMode"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform"
              :class="isAutoPick ? 'translate-x-5' : 'translate-x-0.5'"
            />
          </button>
          <span class="text-xs" :class="mode === 'auto_pick' ? 'font-medium text-foreground' : 'text-muted-foreground'">
            {{ $t('mode.autoPick') }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
