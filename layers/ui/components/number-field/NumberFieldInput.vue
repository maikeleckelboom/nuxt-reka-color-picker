<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~~/layers/ui/lib/utils'
import { NumberFieldInput } from 'reka-ui'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

function onWheel(event: WheelEvent) {
  event.preventDefault()
}
</script>

<template>
  <NumberFieldInput
    data-slot="input"
    :class="
      cn(
        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border py-2 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  />
</template>
