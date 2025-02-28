<script lang="ts" setup>
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'
import ColorPickerSlider from '~/components/color-picker/ColorPickerSlider.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const { modelValue, coordsMeta, updateCoord, gradientStops, alpha } = context

const sliders = coordsMeta.value.map((meta, i) => ({
  ...meta,
  onUpdate: (v: number | number[] | undefined) => {
    if (v !== undefined) {
      updateCoord(i, Array.isArray(v) ? v : [v])
    }
  }
}))

function updateAlpha(v: number | number[] | undefined) {
  if (v !== undefined) {
    alpha.value = Array.isArray(v) ? v[0]! : v
  }
}
</script>

<template>
  <div>
    <ColorPickerSliderGroup v-for="(slider, i) in sliders">
      <template #label> {{ slider.name }}</template>
      <template #field>
        <ColorPickerNumberField
          :max="slider.max"
          :min="slider.min"
          :model-value="modelValue.coords[i]"
          :step="slider.step"
          @update:model-value="slider.onUpdate"
        />
      </template>
      <template #default>
        <ColorPickerSlider
          :max="slider.max"
          :min="slider.min"
          :model-value="[modelValue.coords[i] || 0]"
          :step="slider.step"
          :stops="gradientStops[i]"
          @update:model-value="slider.onUpdate"
        />
      </template>
    </ColorPickerSliderGroup>
    <ColorPickerSliderGroup>
      <template #label> Alpha (0-100)</template>
      <template #field>
        <ColorPickerNumberField
          :max="100"
          :min="0"
          :model-value="alpha"
          :step="1"
          @update:model-value="updateAlpha"
        />
      </template>
      <template #default>
        <ColorPickerSlider
          checkerboard="true"
          :max="100"
          :min="0"
          :model-value="[alpha]"
          :step="1"
          :stops="gradientStops[3]"
          @update:model-value="updateAlpha"
        />
      </template>
    </ColorPickerSliderGroup>
  </div>
</template>
