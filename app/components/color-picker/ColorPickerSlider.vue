<script lang="ts" setup>
import { computed, type HTMLAttributes, useId } from 'vue'
import {
  SliderRange,
  SliderRoot,
  type SliderRootEmits,
  type SliderRootProps,
  SliderThumb,
  SliderTrack,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  useForwardPropsEmits
} from 'reka-ui'
import { cn } from '~~/layers/ui/lib/utils'
import Checkerboard from './Checkerboard.vue'
import { isDefined } from '@vueuse/shared'

export interface ColorSliderProps extends SliderRootProps {
  checkerboard?: boolean | 'true' | 'false'
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

const isTrue = (value: unknown) => value === true || value === 'true'
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <SliderRoot
      :class="cn('relative flex w-full touch-none select-none items-center', props.class)"
      v-bind="forwarded"
    >
      <SliderTrack
        :id="`slider-track-${uuid}`"
        :style="{
          '--stops': Array.isArray(props.stops) ? props.stops.join(', ') : props.stops
        }"
        class="relative h-5 w-full grow overflow-hidden rounded-full"
      >
        <Checkerboard v-if="isTrue(checkerboard)" />
        <SliderRange class="sr-only" />
      </SliderTrack>
      <TooltipRoot disable-closing-trigger>
        <TooltipTrigger as-child>
          <SliderThumb
            v-for="(value, key) in modelValue"
            :key="key"
            :class="
              cn(
                'border-accent-foreground ring-offset-background block h-5 w-5 rounded-full border-2 transition-colors',
                'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50'
              )
            "
          />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            :side-offset="12"
            class="bg-card text-foreground border-muted rounded-sm border px-2 py-1 text-sm font-semibold"
          >
            {{ isDefined(modelValue) ? modelValue.join(', ') : '❔' }}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </SliderRoot>
  </TooltipProvider>
</template>

<style lang="postcss" scoped>
@property --stops {
  syntax: '<color-stop>';
  inherits: false;
  initial-value: 'transparent';
}

[id^='slider-track-'] {
  background: linear-gradient(to right, var(--stops));
  @apply border-input border;
}
</style>
