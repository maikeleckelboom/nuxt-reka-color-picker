<script lang="ts" setup>
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'
import ColorChannelSlider from '~/components/color-picker/ColorPickerSlider.vue'
import ColorPickerSlider from '~/components/color-picker/ColorPickerSlider.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerContext not found')
}

const { coordsMeta, updateCoord, gradientStops, modelValue, space, alpha } = context

const isSVMappable = computed(() =>
  ['srgb', 'srgb-linear', 'hwb', 'hsv', 'hsl', 'hsluv', 'hpluv'].includes(space.value.id)
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div :class="isSVMappable ? 'grid h-48 grid-cols-[0.35fr_1fr] grid-rows-2' : 'h-24'">
      <ColorPickerPreview />
      <ColorPickerSVArea v-if="isSVMappable" />
    </div>
    <div class="grid grid-cols-[1fr_0.3fr] items-center gap-3">
      <ColorPickerFormatSelect />
      <ColorPickerPrecisionField />
    </div>
    <ColorPickerSerializedField />
  </div>
</template>

<style lang="postcss" scoped></style>
