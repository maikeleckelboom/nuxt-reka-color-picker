<script lang="ts" setup>
import { useId, computed, type HTMLAttributes } from 'vue'
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits
} from 'reka-ui'
import { cn } from '~~/layers/ui/lib/utils'
import Checkerboard from './Checkerboard.vue'

export interface ColorSliderProps extends SliderRootProps {
  checkerboard?: boolean
  stops?: string | string[]
}

const props = defineProps<ColorSliderProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const uuid = useId()
</script>

<template>
  <SliderRoot
    :class="cn('relative flex w-full touch-none select-none items-center', props.class)"
    v-bind="forwarded"
  >
    <SliderTrack
      :id="`slider-track-${uuid}`"
      :style="{ '--stops': Array.isArray(props.stops) ? props.stops.join(', ') : props.stops }"
      class="relative h-5 w-full grow overflow-hidden rounded-full"
    >
      <Checkerboard v-if="checkerboard" />
      <SliderRange class="sr-only" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      :class="
        cn(
          'block h-5 w-5 rounded-full border-2 border-accent-foreground ring-offset-background transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50'
        )
      "
    />
  </SliderRoot>
</template>

<style lang="postcss" scoped>
@property --stops {
  syntax: '<color-stop>';
  inherits: false;
  initial-value: 'transparent';
}

[id^='slider-track-'] {
  background: linear-gradient(to right, var(--stops));
  @apply border border-input;
}
</style>
