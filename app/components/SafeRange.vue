<script setup lang="ts">
import { Dices } from "lucide-vue-next"
import type { Distribution, GameMode } from "~/composables/useGuesser"

const props = defineProps<{
  rangeLow: number
  rangeHigh: number
  guessesLeft: number
  rangeSize: number
  isPossible: boolean
  isWon: boolean
  isGameOver: boolean
  mode: GameMode
  distribution: Distribution
  suggestedGuess: number
  safeRange: { low: number; high: number } | null
  safeRangeSize: number
  comfortLevel: string
  maxCoverable: number
}>()

const emit = defineEmits<{
  setMode: [mode: GameMode]
  setDistribution: [distribution: Distribution]
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
            'bg-accent text-accent-foreground': comfortLevel === 'comfortable',
            'bg-info text-info-foreground': comfortLevel === 'moderate',
            'bg-secondary text-secondary-foreground': comfortLevel === 'tight',
            'bg-primary text-primary-foreground': comfortLevel === 'won',
            'bg-warning text-warning-foreground': comfortLevel === 'impossible',
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
        <div class="rounded-md border-2 border-border bg-muted shadow-[var(--shadow-brutal-sm)] p-3">
          <p class="text-xs text-muted-foreground">{{ $t('status.range') }}</p>
          <p class="text-sm font-mono font-semibold">
            {{ $t('common.rangeFormat', { low: rangeLow.toLocaleString(), high: rangeHigh.toLocaleString() }) }}
          </p>
        </div>
        <div class="rounded-md border-2 border-border bg-muted shadow-[var(--shadow-brutal-sm)] p-3">
          <p class="text-xs text-muted-foreground">{{ $t('status.size') }}</p>
          <p class="text-sm font-mono font-semibold">{{ rangeSize.toLocaleString() }}</p>
        </div>
        <div class="rounded-md border-2 border-border bg-muted shadow-[var(--shadow-brutal-sm)] p-3">
          <p class="text-xs text-muted-foreground">{{ $t('status.guessesLeft') }}</p>
          <p class="text-sm font-mono font-semibold">{{ guessesLeft }}</p>
        </div>
      </div>

      <!-- Won State -->
      <div v-if="isWon" class="rounded-md border-2 border-border bg-primary p-4 text-center shadow-[var(--shadow-brutal)]">
        <p class="text-lg font-semibold text-primary-foreground">
          {{ $t('status.numberFound') }}
        </p>
        <p class="text-2xl font-mono font-bold text-primary-foreground mt-1">
          {{ rangeLow.toLocaleString() }}
        </p>
      </div>

      <!-- Game Over State (out of guesses, didn't find it) -->
      <div v-else-if="isGameOver" class="rounded-md border-2 border-border bg-destructive p-4 text-center shadow-[var(--shadow-brutal)]">
        <p class="text-lg font-semibold text-destructive-foreground">
          {{ $t('status.gameoverTitle') }}
        </p>
        <p class="text-sm text-destructive-foreground mt-1">
          {{ $t('status.gameoverDesc', { low: rangeLow.toLocaleString(), high: rangeHigh.toLocaleString() }) }}
        </p>
      </div>

      <div v-else-if="mode === 'auto_pick'" class="space-y-3">
        <div class="rainbow-wrapper rounded-md shadow-[var(--shadow-brutal)]">
          <div class="inner-card rounded-sm bg-card p-4 text-center">
            <p class="text-xs text-muted-foreground mb-2">{{ $t('status.suggestedGuessAuto') }}</p>
            <div class="mx-auto w-fit px-1 py-1">
              <p class="text-3xl font-mono font-bold text-foreground">
                {{ suggestedGuess.toLocaleString() }}
              </p>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
              {{ $t('status.suggestedGuessAutoHint') }}
            </p>
          </div>
        </div>

        <div v-if="!isPossible" class="rounded-md border-2 border-border bg-warning p-4 text-center shadow-[var(--shadow-brutal-sm)]">
          <p class="text-sm font-semibold text-warning-foreground">
            {{ $t('status.notGuaranteed') }}
          </p>
          <p class="text-xs text-warning-foreground mt-1">
            {{ $t('status.impossibleDesc', { rangeSize: rangeSize.toLocaleString(), maxCoverable: maxCoverable.toLocaleString(), guessesLeft }) }}
          </p>
        </div>
      </div>

      <!-- Not Guaranteed State (impossible but can still try) -->
      <div v-else-if="!isPossible" class="space-y-3">
        <div class="rounded-md border-2 border-border bg-warning p-4 text-center shadow-[var(--shadow-brutal-sm)]">
          <p class="text-sm font-semibold text-warning-foreground">
            {{ $t('status.notGuaranteed') }}
          </p>
          <p class="text-xs text-warning-foreground mt-1">
            {{ $t('status.impossibleDesc', { rangeSize: rangeSize.toLocaleString(), maxCoverable: maxCoverable.toLocaleString(), guessesLeft }) }}
          </p>
          <p class="text-xs text-warning-foreground mt-2 font-medium">
            {{ $t('status.canStillTry') }}
          </p>
        </div>

        <!-- Suggested midpoint guess -->
        <div class="rounded-md border-2 border-border bg-card p-4 text-center shadow-[var(--shadow-brutal-sm)]">
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
          class="rounded-md border-2 border-border p-4 text-center transition-colors shadow-[var(--shadow-brutal-sm)]"
          :class="{
            'bg-accent text-accent-foreground': comfortLevel === 'comfortable',
            'bg-info text-info-foreground': comfortLevel === 'moderate',
            'bg-secondary text-secondary-foreground': comfortLevel === 'tight',
          }"
        >
          <p class="text-xs mb-1 opacity-80">{{ $t('status.safeRangeLabel') }}</p>
          <p class="text-2xl font-mono font-bold">
            {{ $t('common.rangeFormat', { low: safeRange.low.toLocaleString(), high: safeRange.high.toLocaleString() }) }}
          </p>
          <p class="text-xs mt-1 opacity-80">
            {{ $t('status.safeNumbers', { count: safeRangeSize.toLocaleString(), percent: Math.round((safeRangeSize / rangeSize) * 100) }) }}
          </p>
        </div>

        <p class="text-xs text-muted-foreground text-center">
          {{ $t('status.helpText', { remaining: guessesLeft - 1 }) }}
        </p>
      </div>

      <div class="flex items-center justify-between gap-2 pt-1">
        <div v-if="mode === 'auto_pick'" class="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            class="gap-2"
            :aria-label="$t('mode.reroll')"
            :title="$t('mode.reroll')"
            @click="emit('reroll')"
          >
            <Dices class="h-4 w-4" />
            <span class="hidden md:inline">{{ $t('mode.reroll') }}</span>
          </Button>
          <DistributionDialog
            :distribution="distribution"
            @select-distribution="emit('setDistribution', $event)"
          />
        </div>
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
            class="relative inline-flex h-7 w-12 items-center rounded-md border-2 border-border shadow-[var(--shadow-brutal-sm)] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[var(--shadow-brutal)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :class="isAutoPick ? 'bg-primary' : 'bg-muted'"
            @click="toggleMode"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-md border-2 border-border bg-card transition-transform"
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

<style scoped>
.rainbow-wrapper {
  padding: 3px;
  background: repeating-linear-gradient(
    135deg,
    #a7d8f0 0px,
    #a7d8f0 3px,
    #f8c8dc 3px,
    #f8c8dc 6px,
    #c5e99e 6px,
    #c5e99e 9px,
    #d4bbff 9px,
    #d4bbff 12px,
    #ffe082 12px,
    #ffe082 15px,
    #a7d8f0 15px,
    #a7d8f0 18px
  );
  background-size: 18px 18px;
  animation: stripe-march 1s linear infinite;
}

.inner-card {
  background: var(--card);
}

@keyframes stripe-march {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 18px 18px;
  }
}

:global(.dark) .rainbow-wrapper {
  background: repeating-linear-gradient(
    135deg,
    #7ecbf0 0px,
    #7ecbf0 3px,
    #ff9ebe 3px,
    #ff9ebe 6px,
    #b8e986 6px,
    #b8e986 9px,
    #bb86fc 9px,
    #bb86fc 12px,
    #ffd54f 12px,
    #ffd54f 15px,
    #7ecbf0 15px,
    #7ecbf0 18px
  );
  box-shadow: 0 0 12px rgba(126, 203, 240, 0.5), var(--shadow-brutal);
}

@media (prefers-reduced-motion: reduce) {
  .rainbow-wrapper {
    animation: none;
    background-position: 0 0;
  }
  :global(.dark) .rainbow-wrapper {
    animation: none;
    background-position: 0 0;
    box-shadow: 0 0 12px rgba(126, 203, 240, 0.5), var(--shadow-brutal);
  }
}
</style>
