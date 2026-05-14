<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

// Example values for visualization when game hasn't started
const props = defineProps<{
  rangeLow?: number
  rangeHigh?: number
  guessesLeft?: number
  safeRange?: { low: number; high: number } | null
}>()

// Use provided values or defaults for visualization
const vizLo = computed(() => props.rangeLow ?? 1)
const vizHi = computed(() => props.rangeHigh ?? 9999)
const vizG = computed(() => props.guessesLeft ?? 14)
const vizN = computed(() => vizHi.value - vizLo.value + 1)

const vizSafe = computed(() => {
  if (props.safeRange) return props.safeRange
  // Calculate default example
  const N = vizN.value
  const G = vizG.value
  const maxPerSide = 2 ** (G - 1) - 1
  const offset = Math.max(0, N - 1 - maxPerSide)
  const safeLow = vizLo.value + offset
  const safeHigh = vizHi.value - offset
  if (safeLow > safeHigh) return null
  return { low: safeLow, high: safeHigh }
})

// Number line proportions (0-100 scale for SVG)
const lineProps = computed(() => {
  const N = vizN.value
  if (!vizSafe.value || N <= 0) {
    return { safeStart: 0, safeEnd: 100, leftWidth: 0, rightWidth: 0, safeWidth: 100 }
  }
  const leftSize = vizSafe.value.low - vizLo.value
  const safeSize = vizSafe.value.high - vizSafe.value.low + 1

  const safeStart = (leftSize / N) * 100
  const safeEnd = ((leftSize + safeSize) / N) * 100

  return {
    safeStart,
    safeEnd,
    leftWidth: safeStart,
    rightWidth: 100 - safeEnd,
    safeWidth: safeEnd - safeStart
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" size="icon" :aria-label="$t('algorithm.triggerLabel')">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </Button>
    </DialogTrigger>

    <DialogContent class="max-w-2xl max-h-[90vh] p-0">
      <DialogHeader class="px-6 pt-6 pb-0">
        <DialogTitle class="text-xl">{{ $t('algorithm.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('algorithm.description') }}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[75vh] px-6 pb-6">
        <div class="space-y-6 pt-4">

          <!-- Section 1: The Problem -->
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.problem.title') }}
            </h3>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.problem.text') }}
            </p>
          </section>

          <Separator />

          <!-- Section 2: Key Insight -->
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.insight.title') }}
            </h3>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.insight.text', { formula: '2^G - 1' }) }}
            </p>
            <ul class="text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>{{ $t('algorithm.insight.leftPart') }}</strong></li>
              <li><strong>{{ $t('algorithm.insight.rightPart') }}</strong></li>
            </ul>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.insight.conclusion') }}
            </p>
          </section>

          <Separator />

          <!-- Section 3: The Formula -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.formula.title') }}
            </h3>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.formula.intro') }}
            </p>
            <div class="rounded-md border-2 border-border bg-muted p-4 font-mono text-xs leading-loose space-y-1 shadow-[var(--shadow-brutal-sm)]">
              <div>{{ $t('algorithm.formula.leftSide') }}</div>
              <div>{{ $t('algorithm.formula.rightSide') }}</div>
            </div>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.formula.solving') }}
            </p>
            <div class="rounded-md border-2 border-border bg-primary/10 p-4 font-mono text-xs leading-loose space-y-1 shadow-[var(--shadow-brutal-sm)]">
              <div><strong>{{ $t('algorithm.formula.safeLow') }}</strong></div>
              <div><strong>{{ $t('algorithm.formula.safeHigh') }}</strong></div>
            </div>
            <p class="text-sm text-muted-foreground">
              {{ $t('algorithm.formula.impossibleNote') }}
            </p>
          </section>

          <Separator />

          <!-- Section 4: Why It Works -->
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.proof.title') }}
            </h3>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.proof.text1', { formula: '2^D - 1', constraint: '2^(G-1) - 1' }) }}
            </p>
            <p class="text-sm leading-relaxed">
              {{ $t('algorithm.proof.text2') }}
            </p>
          </section>

          <Separator />

          <!-- Section 5: Number Line Visualization -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.vizNumberLine.title') }}
            </h3>
            <p class="text-xs text-muted-foreground">
              {{ $t('algorithm.vizNumberLine.subtitle', { lo: vizLo.toLocaleString(), hi: vizHi.toLocaleString(), guesses: vizG }) }}
            </p>

            <div class="rounded-md border-2 border-border p-4 bg-muted shadow-[var(--shadow-brutal-sm)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 400 100"
                class="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Full range bar background -->
                <rect x="20" y="30" width="360" height="24" rx="4" class="fill-muted stroke-border" stroke-width="2" />

                <!-- Unsafe left zone -->
                <rect
                  v-if="lineProps.leftWidth > 0"
                  x="20"
                  y="30"
                  :width="(lineProps.leftWidth / 100) * 360"
                  height="24"
                  rx="4"
                  class="fill-destructive/30"
                />

                <!-- Safe range zone -->
                <rect
                  v-if="vizSafe"
                  :x="20 + (lineProps.safeStart / 100) * 360"
                  y="30"
                  :width="(lineProps.safeWidth / 100) * 360"
                  height="24"
                  class="fill-primary/30"
                />

                <!-- Unsafe right zone -->
                <rect
                  v-if="lineProps.rightWidth > 0"
                  :x="20 + (lineProps.safeEnd / 100) * 360"
                  y="30"
                  :width="(lineProps.rightWidth / 100) * 360"
                  height="24"
                  rx="4"
                  class="fill-destructive/30"
                />

                <!-- Boundary markers -->
                <line x1="20" y1="26" x2="20" y2="58" class="stroke-foreground" stroke-width="2" />
                <line :x1="20 + (lineProps.safeStart / 100) * 360" y1="26" :x2="20 + (lineProps.safeStart / 100) * 360" y2="58" class="stroke-primary" stroke-width="2" stroke-dasharray="3,2" />
                <line :x1="20 + (lineProps.safeEnd / 100) * 360" y1="26" :x2="20 + (lineProps.safeEnd / 100) * 360" y2="58" class="stroke-primary" stroke-width="2" stroke-dasharray="3,2" />
                <line x1="380" y1="26" x2="380" y2="58" class="stroke-foreground" stroke-width="2" />

                <!-- Labels -->
                <text x="20" y="75" class="fill-foreground text-[9px]" text-anchor="start" font-family="monospace">
                  {{ vizLo.toLocaleString() }}
                </text>
                <text
                  v-if="vizSafe"
                  :x="20 + (lineProps.safeStart / 100) * 360"
                  y="75"
                  class="fill-primary text-[9px]"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  {{ vizSafe.low.toLocaleString() }}
                </text>
                <text
                  v-if="vizSafe"
                  :x="20 + (lineProps.safeEnd / 100) * 360"
                  y="75"
                  class="fill-primary text-[9px]"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  {{ vizSafe.high.toLocaleString() }}
                </text>
                <text x="380" y="75" class="fill-foreground text-[9px]" text-anchor="end" font-family="monospace">
                  {{ vizHi.toLocaleString() }}
                </text>

                <!-- Zone labels on the bar -->
                <text
                  v-if="lineProps.leftWidth > 8"
                  :x="20 + (lineProps.leftWidth / 200) * 360"
                  y="46"
                  class="fill-destructive text-[8px]"
                  text-anchor="middle"
                  font-family="sans-serif"
                >
                  {{ $t('algorithm.vizNumberLine.unsafe') }}
                </text>
                <text
                  v-if="vizSafe && lineProps.safeWidth > 10"
                  :x="20 + ((lineProps.safeStart + lineProps.safeEnd) / 200) * 360"
                  y="46"
                  class="fill-primary text-[8px] font-semibold"
                  text-anchor="middle"
                  font-family="sans-serif"
                >
                  {{ $t('algorithm.vizNumberLine.safeRange') }}
                </text>
                <text
                  v-if="lineProps.rightWidth > 8"
                  :x="20 + ((lineProps.safeEnd + 100) / 200) * 360"
                  y="46"
                  class="fill-destructive text-[8px]"
                  text-anchor="middle"
                  font-family="sans-serif"
                >
                  {{ $t('algorithm.vizNumberLine.unsafe') }}
                </text>

                <!-- Top annotation -->
                <text x="200" y="18" class="fill-muted-foreground text-[8px]" text-anchor="middle" font-family="sans-serif">
                  {{ $t('algorithm.vizNumberLine.rangeOf', { n: vizN.toLocaleString() }) }}
                </text>
              </svg>
            </div>

            <p class="text-xs text-muted-foreground">
              <template v-if="vizSafe">
                {{ $t('algorithm.vizNumberLine.explanation', { count: (vizSafe.high - vizSafe.low + 1).toLocaleString() }) }}
              </template>
              <template v-else>
                {{ $t('algorithm.vizNumberLine.noSafe') }}
              </template>
            </p>
          </section>

          <Separator />

          <!-- Section 6: Binary Tree Visualization -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.vizTree.title') }}
            </h3>
            <p class="text-xs text-muted-foreground">
              {{ $t('algorithm.vizTree.subtitle') }}
            </p>

            <div class="rounded-md border-2 border-border p-4 bg-muted shadow-[var(--shadow-brutal-sm)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 400 200"
                class="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Level 0: Root -->
                <line x1="200" y1="30" x2="110" y2="75" class="stroke-muted-foreground" stroke-width="2" />
                <line x1="200" y1="30" x2="290" y2="75" class="stroke-muted-foreground" stroke-width="2" />
                <circle cx="200" cy="25" r="16" class="fill-primary/20 stroke-primary" stroke-width="2" />
                <text x="200" y="29" class="fill-primary text-[9px] font-semibold" text-anchor="middle" font-family="sans-serif">
                  {{ $t('algorithm.vizTree.guess') }}
                </text>

                <!-- Edge labels level 0 -->
                <text x="145" y="48" class="fill-muted-foreground text-[7px]" text-anchor="middle" font-family="sans-serif" transform="rotate(-20, 145, 48)">
                  {{ $t('algorithm.vizTree.lower') }}
                </text>
                <text x="255" y="48" class="fill-muted-foreground text-[7px]" text-anchor="middle" font-family="sans-serif" transform="rotate(20, 255, 48)">
                  {{ $t('algorithm.vizTree.higher') }}
                </text>

                <!-- Level 1: Left -->
                <line x1="110" y1="85" x2="65" y2="130" class="stroke-muted-foreground" stroke-width="2" />
                <line x1="110" y1="85" x2="155" y2="130" class="stroke-muted-foreground" stroke-width="2" />
                <circle cx="110" cy="80" r="14" class="fill-secondary stroke-border" stroke-width="2" />
                <text x="110" y="84" class="fill-foreground text-[8px]" text-anchor="middle" font-family="sans-serif">
                  G-1
                </text>

                <!-- Level 1: Right -->
                <line x1="290" y1="85" x2="245" y2="130" class="stroke-muted-foreground" stroke-width="2" />
                <line x1="290" y1="85" x2="335" y2="130" class="stroke-muted-foreground" stroke-width="2" />
                <circle cx="290" cy="80" r="14" class="fill-secondary stroke-border" stroke-width="2" />
                <text x="290" y="84" class="fill-foreground text-[8px]" text-anchor="middle" font-family="sans-serif">
                  G-1
                </text>

                <!-- Level 2: Leaves -->
                <circle cx="65" cy="135" r="12" class="fill-info/30 stroke-info" stroke-width="2" />
                <text x="65" y="139" class="fill-info text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <circle cx="155" cy="135" r="12" class="fill-info/30 stroke-info" stroke-width="2" />
                <text x="155" y="139" class="fill-info text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <circle cx="245" cy="135" r="12" class="fill-info/30 stroke-info" stroke-width="2" />
                <text x="245" y="139" class="fill-info text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <circle cx="335" cy="135" r="12" class="fill-info/30 stroke-info" stroke-width="2" />
                <text x="335" y="139" class="fill-info text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <!-- Dots indicating continuation -->
                <text x="65" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>
                <text x="155" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>
                <text x="245" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>
                <text x="335" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>

                <!-- Bottom leaf nodes -->
                <rect x="40" y="170" width="50" height="16" rx="3" class="fill-primary/30 stroke-primary" stroke-width="2" />
                <text x="65" y="181" class="fill-primary text-[7px]" text-anchor="middle" font-family="sans-serif">{{ $t('algorithm.vizTree.found') }}</text>

                <rect x="130" y="170" width="50" height="16" rx="3" class="fill-primary/30 stroke-primary" stroke-width="2" />
                <text x="155" y="181" class="fill-primary text-[7px]" text-anchor="middle" font-family="sans-serif">{{ $t('algorithm.vizTree.found') }}</text>

                <rect x="220" y="170" width="50" height="16" rx="3" class="fill-primary/30 stroke-primary" stroke-width="2" />
                <text x="245" y="181" class="fill-primary text-[7px]" text-anchor="middle" font-family="sans-serif">{{ $t('algorithm.vizTree.found') }}</text>

                <rect x="310" y="170" width="50" height="16" rx="3" class="fill-primary/30 stroke-primary" stroke-width="2" />
                <text x="335" y="181" class="fill-primary text-[7px]" text-anchor="middle" font-family="sans-serif">{{ $t('algorithm.vizTree.found') }}</text>

                <!-- Annotation: depth -->
                <line x1="390" y1="20" x2="390" y2="185" class="stroke-muted-foreground" stroke-width="2" stroke-dasharray="2,2" />
                <text x="395" y="25" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">{{ $t('algorithm.vizTree.depth') }} 0</text>
                <text x="395" y="82" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">{{ $t('algorithm.vizTree.depth') }} 1</text>
                <text x="395" y="137" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">{{ $t('algorithm.vizTree.depth') }} 2</text>
                <text x="395" y="181" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">{{ $t('algorithm.vizTree.depth') }} G</text>
              </svg>
            </div>

            <p class="text-xs text-muted-foreground">
              {{ $t('algorithm.vizTree.explanation') }}
            </p>
          </section>

          <!-- Example -->
          <Separator />
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {{ $t('algorithm.example.title') }}
            </h3>
            <div class="rounded-md border-2 border-border bg-muted p-4 text-xs leading-relaxed space-y-2 font-mono shadow-[var(--shadow-brutal-sm)]">
              <div>{{ $t('algorithm.example.range') }}</div>
              <div>{{ $t('algorithm.example.maxPerSide') }}</div>
              <div>{{ $t('algorithm.example.offset') }}</div>
              <div class="pt-1 font-semibold">{{ $t('algorithm.example.safeLow', { value: '1808' }) }}</div>
              <div class="font-semibold">{{ $t('algorithm.example.safeHigh', { value: '8192' }) }}</div>
              <div class="pt-1 text-muted-foreground">{{ $t('algorithm.example.safeSize') }}</div>
            </div>
          </section>

        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
