<script setup lang="ts">
import type { HistoryEntry } from '~/composables/useGuesser'

defineProps<{
  history: HistoryEntry[]
}>()
</script>

<template>
  <Card v-if="history.length > 0">
    <CardHeader class="pb-3">
      <CardTitle class="text-lg">History</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="entry in [...history].reverse()"
          :key="entry.step"
          class="flex items-center gap-3 rounded-lg border p-3 text-sm"
          :class="{
            'border-teal-300/30 bg-teal-50/50 dark:bg-teal-400/5 dark:border-teal-400/20': entry.isPossible && entry.safeLow !== null,
            'border-rose-200/40 bg-rose-50/50 dark:bg-rose-400/5 dark:border-rose-400/20': !entry.isPossible,
          }"
        >
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {{ entry.step }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-xs">
                [{{ entry.rangeLow.toLocaleString() }}, {{ entry.rangeHigh.toLocaleString() }}]
              </span>
              <span v-if="entry.safeLow !== null && entry.safeHigh !== null" class="text-xs text-muted-foreground">
                Safe: [{{ entry.safeLow.toLocaleString() }}, {{ entry.safeHigh.toLocaleString() }}]
              </span>
              <span v-else class="text-xs text-destructive">
                Impossible
              </span>
            </div>
          </div>
          <Badge variant="outline" class="shrink-0 text-xs">
            {{ entry.guessesLeft }} left
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
