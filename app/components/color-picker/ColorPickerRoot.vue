<script lang="ts">
import { createContext, type PrimitiveProps } from 'reka-ui'
import type { ComputedRef, Ref } from 'vue'
import Color, { type Coords } from 'colorjs.io'
import type { SpaceId } from '~/components/color-picker/space'
import type { ColorSpace } from 'colorjs.io/fn'

export interface ColorPickerOptions {
  precision?: number
  format?: string
  inGamut?: boolean
}

export interface ColorCoordMeta {
  id: string
  name: string
  isHue: boolean
  min: number
  max: number
  step: number
}

export interface ColorPickerRootProps extends PrimitiveProps {
  modelValue: Color
}

export type ColorPickerRootContext = {
  modelValue: Ref<Color>
  pickedColor: ComputedRef<Color>
  spaceId: WritableComputedRef<SpaceId>
  space: ComputedRef<ColorSpace>
  coords: ComputedRef<Coords>
  coordsMeta: ComputedRef<ColorCoordMeta[]>
  updateCoord: (index: number, v: number[] | undefined) => void
  gradientStops: ComputedRef<string[]>
  serialized: ComputedRef<string>
  formats: ComputedRef<string[]>
  options: Ref<ColorPickerOptions>
  alpha: Ref<number>
}

export type ColorPickerRootEmits = {
  'update:modelValue': [payload: Color]
}

export const [injectColorPickerContext, provideColorPickerContext] =
  createContext<ColorPickerRootContext>('ColorPickerRoot')
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { Primitive, useForwardExpose } from 'reka-ui'
import { useColorSpace } from '~/composables/useColorSpace'
import { useColorGradient } from '~/composables/useColorGradient'
import { useColorDisplay } from '~/composables/useColorDisplay'
import { useColorCoords } from '~/composables/useColorCoords'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  as: 'span'
})

const emit = defineEmits<ColorPickerRootEmits>()

useForwardExpose()

const modelValue = useVModel(props, 'modelValue', emit)

const { space, spaceId } = useColorSpace(modelValue)

const { coords, coordsMeta, updateCoord } = useColorCoords(modelValue, spaceId)

const alpha = ref<number>(modelValue.value.alpha * 100)

const pickedColor = computed(
  () => new Color(spaceId.value, coords.value, alpha.value / 100)
)

const gradientStops = useColorGradient(spaceId, coords, alpha, coordsMeta)

const options = ref<ColorPickerOptions>({
  format: undefined,
  inGamut: false,
  precision: 5
})

const { serialized, formats } = useColorDisplay(pickedColor, space, options)

provideColorPickerContext({
  modelValue,
  pickedColor,
  spaceId,
  space,
  coords,
  coordsMeta,
  updateCoord,
  gradientStops,
  serialized,
  formats,
  options,
  alpha
})
</script>

<template>
  <Primitive :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
