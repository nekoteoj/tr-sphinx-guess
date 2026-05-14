<script setup lang="ts">
import type { HistoryEntry } from '~/composables/useGuesser'

defineProps<{
  history: HistoryEntry[]
}>()
</script>

<template>
  <Card v-if="history.length > 0">
    <CardHeader class="pb-3">
      <CardTitle class="text-lg">{{ $t('history.title') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="entry in [...history].reverse()"
          :key="entry.step"
          class="flex items-center gap-3 rounded-md border-2 border-border bg-card p-3 text-sm shadow-[var(--shadow-brutal-sm)]"
          :class="{
            'border-l-4 border-l-primary': entry.isPossible && entry.safeLow !== null,
            'border-l-4 border-l-destructive': !entry.isPossible,
          }"
        >
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium border border-border">
            {{ entry.step }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-xs">
                {{ $t('common.rangeFormat', { low: entry.rangeLow.toLocaleString(), high: entry.rangeHigh.toLocaleString() }) }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ $t('history.modeLabel') }} {{ entry.mode === 'auto_pick' ? $t('history.modeAutoPick') : $t('history.modeManual') }}
              </span>
              <span v-if="entry.safeLow !== null && entry.safeHigh !== null" class="text-xs text-muted-foreground">
                {{ $t('history.safe') }} {{ $t('common.rangeFormat', { low: entry.safeLow.toLocaleString(), high: entry.safeHigh.toLocaleString() }) }}
              </span>
              <span v-else class="text-xs text-destructive">
                {{ $t('history.impossible') }}
              </span>
            </div>
          </div>
          <Badge variant="outline" class="shrink-0 text-xs bg-card">
            {{ $t('history.left', { count: entry.guessesLeft }) }}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
