<script setup lang="ts">
import { computed } from 'vue'

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
  const maxPerSide = Math.pow(2, G - 1) - 1
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
  const rightSize = vizHi.value - vizSafe.value.high
  const safeSize = vizSafe.value.high - vizSafe.value.low + 1

  const safeStart = (leftSize / N) * 100
  const safeEnd = ((leftSize + safeSize) / N) * 100

  return {
    safeStart,
    safeEnd,
    leftWidth: safeStart,
    rightWidth: 100 - safeEnd,
    safeWidth: safeEnd - safeStart,
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" size="icon" aria-label="How it works">
        <svg
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
        <DialogTitle class="text-xl">How the Safe Range Works</DialogTitle>
        <DialogDescription>
          Understanding the algorithm behind the number guesser
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[75vh] px-6 pb-6">
        <div class="space-y-6 pt-4">

          <!-- Section 1: The Problem -->
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              The Problem
            </h3>
            <p class="text-sm leading-relaxed">
              A number is hidden in the range [lo, hi]. Each turn, you pick a number and an oracle
              tells you "higher", "lower", or "correct". You have <strong>G guesses</strong> remaining.
              Which numbers are <em>safe</em> to guess — meaning you can still guarantee finding the
              answer no matter what the oracle responds?
            </p>
          </section>

          <Separator />

          <!-- Section 2: Key Insight -->
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Key Insight
            </h3>
            <p class="text-sm leading-relaxed">
              With G guesses, binary search can handle at most
              <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">2<sup>G</sup> - 1</code>
              numbers in the worst case. When you guess number <em>x</em>, you split the range into:
            </p>
            <ul class="text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Left part</strong>: [lo, x-1] of size <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">(x - lo)</code></li>
              <li><strong>Right part</strong>: [x+1, hi] of size <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">(hi - x)</code></li>
            </ul>
            <p class="text-sm leading-relaxed">
              For your guess to be "safe", <strong>both</strong> parts must be solvable with only
              G-1 guesses remaining — regardless of which side the oracle points to.
            </p>
          </section>

          <Separator />

          <!-- Section 3: The Formula -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              The Formula
            </h3>
            <p class="text-sm leading-relaxed">
              A guess at position <em>x</em> is safe if and only if:
            </p>
            <div class="rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-loose space-y-1">
              <div>Left side:&nbsp; (x - lo) &le; 2<sup>G-1</sup> - 1</div>
              <div>Right side: (hi - x) &le; 2<sup>G-1</sup> - 1</div>
            </div>
            <p class="text-sm leading-relaxed">
              Solving for <em>x</em>, where N = hi - lo + 1:
            </p>
            <div class="rounded-lg border bg-primary/5 p-4 font-mono text-xs leading-loose space-y-1">
              <div><strong>Safe Low</strong>&nbsp; = lo + max(0, N - 2<sup>G-1</sup>)</div>
              <div><strong>Safe High</strong> = hi - max(0, N - 2<sup>G-1</sup>)</div>
            </div>
            <p class="text-sm text-muted-foreground">
              If Safe Low &gt; Safe High, no safe guess exists — it's impossible to guarantee
              finding the number.
            </p>
          </section>

          <Separator />

          <!-- Section 4: Why It Works -->
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Why It Works (Proof Sketch)
            </h3>
            <p class="text-sm leading-relaxed">
              A binary search tree of depth D has at most <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">2<sup>D</sup> - 1</code>
              internal nodes. Each internal node represents one guess, and each leaf represents
              "number found". After guessing <em>x</em>, the worst case is whichever side is larger.
              If both sides have size &le; <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">2<sup>G-1</sup> - 1</code>,
              then G-1 guesses suffice regardless of the oracle's response.
            </p>
            <p class="text-sm leading-relaxed">
              The safe range is exactly the set of positions where this constraint holds for both sides
              simultaneously — giving you freedom to pick <em>any</em> number within it.
            </p>
          </section>

          <Separator />

          <!-- Section 5: Number Line Visualization -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Visualization: Number Line
            </h3>
            <p class="text-xs text-muted-foreground">
              Showing range [{{ vizLo.toLocaleString() }}, {{ vizHi.toLocaleString() }}]
              with {{ vizG }} guesses remaining
            </p>

            <div class="rounded-lg border p-4 bg-muted/30">
              <svg
                viewBox="0 0 400 100"
                class="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Full range bar background -->
                <rect x="20" y="30" width="360" height="24" rx="4" class="fill-muted stroke-border" stroke-width="1" />

                <!-- Unsafe left zone -->
                <rect
                  v-if="lineProps.leftWidth > 0"
                  x="20"
                  y="30"
                  :width="(lineProps.leftWidth / 100) * 360"
                  height="24"
                  rx="4"
                  class="fill-destructive/20"
                />

                <!-- Safe range zone -->
                <rect
                  v-if="vizSafe"
                  :x="20 + (lineProps.safeStart / 100) * 360"
                  y="30"
                  :width="(lineProps.safeWidth / 100) * 360"
                  height="24"
                  class="fill-green-500/30 dark:fill-green-500/20"
                />

                <!-- Unsafe right zone -->
                <rect
                  v-if="lineProps.rightWidth > 0"
                  :x="20 + (lineProps.safeEnd / 100) * 360"
                  y="30"
                  :width="(lineProps.rightWidth / 100) * 360"
                  height="24"
                  rx="4"
                  class="fill-destructive/20"
                />

                <!-- Boundary markers -->
                <line x1="20" y1="26" x2="20" y2="58" class="stroke-foreground" stroke-width="1.5" />
                <line :x1="20 + (lineProps.safeStart / 100) * 360" y1="26" :x2="20 + (lineProps.safeStart / 100) * 360" y2="58" class="stroke-green-600 dark:stroke-green-400" stroke-width="1.5" stroke-dasharray="3,2" />
                <line :x1="20 + (lineProps.safeEnd / 100) * 360" y1="26" :x2="20 + (lineProps.safeEnd / 100) * 360" y2="58" class="stroke-green-600 dark:stroke-green-400" stroke-width="1.5" stroke-dasharray="3,2" />
                <line x1="380" y1="26" x2="380" y2="58" class="stroke-foreground" stroke-width="1.5" />

                <!-- Labels -->
                <text x="20" y="75" class="fill-foreground text-[9px]" text-anchor="start" font-family="monospace">
                  {{ vizLo.toLocaleString() }}
                </text>
                <text
                  v-if="vizSafe"
                  :x="20 + (lineProps.safeStart / 100) * 360"
                  y="75"
                  class="fill-green-700 dark:fill-green-400 text-[9px]"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  {{ vizSafe.low.toLocaleString() }}
                </text>
                <text
                  v-if="vizSafe"
                  :x="20 + (lineProps.safeEnd / 100) * 360"
                  y="75"
                  class="fill-green-700 dark:fill-green-400 text-[9px]"
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
                  unsafe
                </text>
                <text
                  v-if="vizSafe && lineProps.safeWidth > 10"
                  :x="20 + ((lineProps.safeStart + lineProps.safeEnd) / 200) * 360"
                  y="46"
                  class="fill-green-700 dark:fill-green-400 text-[8px] font-semibold"
                  text-anchor="middle"
                  font-family="sans-serif"
                >
                  SAFE RANGE
                </text>
                <text
                  v-if="lineProps.rightWidth > 8"
                  :x="20 + ((lineProps.safeEnd + 100) / 200) * 360"
                  y="46"
                  class="fill-destructive text-[8px]"
                  text-anchor="middle"
                  font-family="sans-serif"
                >
                  unsafe
                </text>

                <!-- Top annotation -->
                <text x="200" y="18" class="fill-muted-foreground text-[8px]" text-anchor="middle" font-family="sans-serif">
                  Range of {{ vizN.toLocaleString() }} numbers
                </text>
              </svg>
            </div>

            <p class="text-xs text-muted-foreground">
              <template v-if="vizSafe">
                The green zone contains <strong>{{ (vizSafe.high - vizSafe.low + 1).toLocaleString() }}</strong>
                safe numbers. Guessing too close to either edge risks creating a subproblem
                too large to solve in the remaining guesses.
              </template>
              <template v-else>
                No safe range exists — the range is too large for the remaining guesses.
              </template>
            </p>
          </section>

          <Separator />

          <!-- Section 6: Binary Tree Visualization -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Visualization: Binary Search Tree
            </h3>
            <p class="text-xs text-muted-foreground">
              Each guess splits the remaining range. A tree of depth G covers 2<sup>G</sup> - 1 numbers.
            </p>

            <div class="rounded-lg border p-4 bg-muted/30">
              <svg
                viewBox="0 0 400 200"
                class="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Level 0: Root -->
                <line x1="200" y1="30" x2="110" y2="75" class="stroke-muted-foreground" stroke-width="1" />
                <line x1="200" y1="30" x2="290" y2="75" class="stroke-muted-foreground" stroke-width="1" />
                <circle cx="200" cy="25" r="16" class="fill-primary/10 stroke-primary" stroke-width="1.5" />
                <text x="200" y="29" class="fill-primary text-[9px] font-semibold" text-anchor="middle" font-family="sans-serif">
                  Guess
                </text>

                <!-- Edge labels level 0 -->
                <text x="145" y="48" class="fill-muted-foreground text-[7px]" text-anchor="middle" font-family="sans-serif" transform="rotate(-20, 145, 48)">
                  lower
                </text>
                <text x="255" y="48" class="fill-muted-foreground text-[7px]" text-anchor="middle" font-family="sans-serif" transform="rotate(20, 255, 48)">
                  higher
                </text>

                <!-- Level 1: Left -->
                <line x1="110" y1="85" x2="65" y2="130" class="stroke-muted-foreground" stroke-width="1" />
                <line x1="110" y1="85" x2="155" y2="130" class="stroke-muted-foreground" stroke-width="1" />
                <circle cx="110" cy="80" r="14" class="fill-secondary stroke-border" stroke-width="1" />
                <text x="110" y="84" class="fill-foreground text-[8px]" text-anchor="middle" font-family="sans-serif">
                  G-1
                </text>

                <!-- Level 1: Right -->
                <line x1="290" y1="85" x2="245" y2="130" class="stroke-muted-foreground" stroke-width="1" />
                <line x1="290" y1="85" x2="335" y2="130" class="stroke-muted-foreground" stroke-width="1" />
                <circle cx="290" cy="80" r="14" class="fill-secondary stroke-border" stroke-width="1" />
                <text x="290" y="84" class="fill-foreground text-[8px]" text-anchor="middle" font-family="sans-serif">
                  G-1
                </text>

                <!-- Level 2: Leaves -->
                <!-- Left-left -->
                <circle cx="65" cy="135" r="12" class="fill-green-500/15 stroke-green-500/50" stroke-width="1" />
                <text x="65" y="139" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <!-- Left-right -->
                <circle cx="155" cy="135" r="12" class="fill-green-500/15 stroke-green-500/50" stroke-width="1" />
                <text x="155" y="139" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <!-- Right-left -->
                <circle cx="245" cy="135" r="12" class="fill-green-500/15 stroke-green-500/50" stroke-width="1" />
                <text x="245" y="139" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <!-- Right-right -->
                <circle cx="335" cy="135" r="12" class="fill-green-500/15 stroke-green-500/50" stroke-width="1" />
                <text x="335" y="139" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">
                  G-2
                </text>

                <!-- Dots indicating continuation -->
                <text x="65" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>
                <text x="155" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>
                <text x="245" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>
                <text x="335" y="162" class="fill-muted-foreground text-[8px]" text-anchor="middle">...</text>

                <!-- Bottom leaf nodes -->
                <rect x="40" y="170" width="50" height="16" rx="3" class="fill-green-500/20 stroke-green-500/40" stroke-width="0.75" />
                <text x="65" y="181" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">Found!</text>

                <rect x="130" y="170" width="50" height="16" rx="3" class="fill-green-500/20 stroke-green-500/40" stroke-width="0.75" />
                <text x="155" y="181" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">Found!</text>

                <rect x="220" y="170" width="50" height="16" rx="3" class="fill-green-500/20 stroke-green-500/40" stroke-width="0.75" />
                <text x="245" y="181" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">Found!</text>

                <rect x="310" y="170" width="50" height="16" rx="3" class="fill-green-500/20 stroke-green-500/40" stroke-width="0.75" />
                <text x="335" y="181" class="fill-green-700 dark:fill-green-400 text-[7px]" text-anchor="middle" font-family="sans-serif">Found!</text>

                <!-- Annotation: depth -->
                <line x1="390" y1="20" x2="390" y2="185" class="stroke-muted-foreground" stroke-width="0.75" stroke-dasharray="2,2" />
                <text x="395" y="25" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">Depth 0</text>
                <text x="395" y="82" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">Depth 1</text>
                <text x="395" y="137" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">Depth 2</text>
                <text x="395" y="181" class="fill-muted-foreground text-[7px]" text-anchor="start" font-family="sans-serif">Depth G</text>
              </svg>
            </div>

            <p class="text-xs text-muted-foreground">
              A tree of depth G has at most <strong>2<sup>G</sup> - 1</strong> internal nodes (guesses)
              and <strong>2<sup>G</sup></strong> leaves (outcomes). Each path from root to leaf represents
              a worst-case sequence of oracle responses. For a guess to be safe, both subtrees
              must fit within the remaining depth.
            </p>
          </section>

          <!-- Example -->
          <Separator />
          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Example
            </h3>
            <div class="rounded-lg border bg-muted/50 p-4 text-xs leading-relaxed space-y-2 font-mono">
              <div>Range: [1, 9999], N = 9999, G = 14</div>
              <div>2<sup>13</sup> = 8192 (max per side with G-1 = 13 guesses)</div>
              <div>Offset = max(0, 9999 - 8192) = 1807</div>
              <div class="pt-1 font-semibold">Safe Low  = 1 + 1807 = <span class="text-green-700 dark:text-green-400">1808</span></div>
              <div class="font-semibold">Safe High = 9999 - 1807 = <span class="text-green-700 dark:text-green-400">8192</span></div>
              <div class="pt-1 text-muted-foreground">Safe range size: 6385 numbers (63.9% of range)</div>
            </div>
          </section>

        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
