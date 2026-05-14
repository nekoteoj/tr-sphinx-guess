<script setup lang="ts">
import { ref } from "vue"
import type { Distribution } from "~/composables/useGuesser"

const props = defineProps<{
  distribution: Distribution
}>()

const emit = defineEmits<{
  "select-distribution": [distribution: Distribution]
}>()

const dialogOpen = ref(false)

function select(dist: Distribution) {
  emit("select-distribution", dist)
  dialogOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="gap-2"
        :aria-label="$t('distribution.buttonLabel')"
        :title="$t('distribution.buttonLabel')"
      >
        <svg
          v-if="distribution === 'standard'"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect x="2" y="14" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="6.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="11" y="6" width="3" height="14" rx="1" fill="currentColor" />
          <rect x="15.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="20" y="14" width="3" height="6" rx="1" fill="currentColor" />
        </svg>
        <svg
          v-else
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect x="2" y="6" width="3" height="14" rx="1" fill="currentColor" />
          <rect x="6.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="11" y="14" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="15.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="20" y="6" width="3" height="14" rx="1" fill="currentColor" />
        </svg>
        <span class="hidden md:inline">{{ distribution === 'standard' ? $t('distribution.standard') : $t('distribution.riskyEdge') }}</span>
      </Button>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ $t("distribution.dialogTitle") }}</DialogTitle>
        <DialogDescription>{{ $t("distribution.dialogDescription") }}</DialogDescription>
      </DialogHeader>

      <div class="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          class="relative flex flex-col items-center gap-2 rounded-md border-2 p-4 text-center shadow-[var(--shadow-brutal-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          :class="{
            'border-primary bg-primary text-primary-foreground': distribution === 'standard',
            'border-border bg-card hover:bg-muted': distribution !== 'standard',
          }"
          @click="select('standard')"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            class="text-current"
          >
            <rect x="2" y="14" width="3" height="6" rx="1" fill="currentColor" />
            <rect x="6.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="11" y="6" width="3" height="14" rx="1" fill="currentColor" />
            <rect x="15.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="20" y="14" width="3" height="6" rx="1" fill="currentColor" />
          </svg>
          <div class="space-y-0.5">
            <p class="text-sm font-semibold">{{ $t("distribution.standard") }}</p>
            <p class="text-xs opacity-80">{{ $t("distribution.standardDesc") }}</p>
          </div>
        </button>

        <button
          type="button"
          class="relative flex flex-col items-center gap-2 rounded-md border-2 p-4 text-center shadow-[var(--shadow-brutal-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          :class="{
            'border-primary bg-primary text-primary-foreground': distribution === 'risky_edge',
            'border-border bg-card hover:bg-muted': distribution !== 'risky_edge',
          }"
          @click="select('risky_edge')"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            class="text-current"
          >
            <rect x="2" y="6" width="3" height="14" rx="1" fill="currentColor" />
            <rect x="6.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="11" y="14" width="3" height="6" rx="1" fill="currentColor" />
            <rect x="15.5" y="10" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="20" y="6" width="3" height="14" rx="1" fill="currentColor" />
          </svg>
          <div class="space-y-0.5">
            <p class="text-sm font-semibold">{{ $t("distribution.riskyEdge") }}</p>
            <p class="text-xs opacity-80">{{ $t("distribution.riskyEdgeDesc") }}</p>
          </div>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
