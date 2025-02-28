<script lang="ts">
import type { ComputedRef, Reactive, Ref } from 'vue'
import { ref } from 'vue'
import Color, { type Coords } from 'colorjs.io'
import type { ColorSpace } from 'colorjs.io/fn'
import { createContext, type PrimitiveProps, useForwardExpose } from 'reka-ui'
import type { SpaceId } from '~/components/color-picker/color-space'
import { useVModel } from '@vueuse/core'
import { useColorSpace } from '~/composables/useColorSpace'
import { useColorGradient } from '~/composables/useColorGradient'
import { useSerializedColor } from '~/composables/useSerializedColor'
import { useColorCoords } from '~/composables/useColorCoords'

export interface SerializeValueOptions {
  precision?: number
  format?: string
  inGamut?: boolean
}

export interface SliderCoordMeta {
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

export interface ColorPickerRootContext {
  modelValue: Ref<Color>
  pickedColor: ComputedRef<Color>
  contrastColor: ComputedRef<Color>
  spaceId: WritableComputedRef<SpaceId>
  space: ComputedRef<ColorSpace>
  coords: ComputedRef<Coords>
  coordsMeta: ComputedRef<SliderCoordMeta[]>
  updateCoord: (index: number, value: number[] | undefined) => void
  gradientStops: ComputedRef<string[]>
  serialized: ComputedRef<string>
  formats: ComputedRef<string[]>
  options: Reactive<SerializeValueOptions>
  alpha: Ref<number>
}

export interface ColorPickerRootEmits {
  'update:modelValue': [payload: Color]
}

export const [injectColorPickerContext, provideColorPickerContext] =
  createContext<ColorPickerRootContext>('ColorPickerRoot')
</script>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import { getContrastColor } from '~/utils/contrast'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  as: 'span'
})

const emit = defineEmits<ColorPickerRootEmits>()

useForwardExpose()

const modelValue = useVModel(props, 'modelValue', emit)

const { space, spaceId } = useColorSpace(modelValue)

const { coords, coordsMeta, updateCoord } = useColorCoords(modelValue, spaceId)

const alpha = ref<number>(modelValue.value.alpha * 100)

const pickedColor = computed(() => new Color(spaceId.value, coords.value, alpha.value / 100))

const gradientStops = useColorGradient(spaceId, coords, alpha, coordsMeta)

const { serialized, formats, options } = useSerializedColor(pickedColor, space)

const contrastColor = computed(() => getContrastColor(pickedColor.value))

provideColorPickerContext({
  modelValue,
  pickedColor,
  contrastColor,
  spaceId,
  space,
  coords,
  coordsMeta,
  updateCoord,
  gradientStops,
  options,
  serialized,
  formats,
  alpha
})
</script>

<template>
  <Primitive :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
