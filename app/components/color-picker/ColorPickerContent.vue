<script setup lang="ts">
import {injectColorPickerRootContext} from "~/components/color-picker/ColorPickerRoot.vue";
import ColorSlider from "~/components/color-picker/ColorSlider.vue";

const context = injectColorPickerRootContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const {
  coords,
  coordsMeta,
  updateCoord,
  gradientStops,
  alpha,
} = context
</script>

<template>
  <div>
    <ColorArea/>

    <ColorSpaceSelect/>
    <ColorFormatSelect/>
    <div v-for="(meta, index) in coordsMeta" class="space-y-2">
      <div class="grid grid-cols-[1fr,auto]">
        <label
            :for="`slider-channel-${index}`"
            class="text-sm font-semibold tracking-tight"
        >
          {{ meta.name }} ({{ meta.min }}-{{ meta.max }})
        </label>
        <Input
            :id="`slider-channel-${index}`"
            v-model.number="coords[index]"
            :max="meta.max"
            :min="meta.min"
            :step="meta.step"
            class="py-1 pr-2 pl-2 font-mono"
            type="number"
        />
      </div>
      <ColorSlider
          :max="meta.max"
          :min="meta.min"
          :model-value="[coords[index] || 0]"
          :step="meta.step"
          :stops="gradientStops[index]"
          :style="`--stops: ${gradientStops[index]}`"
          @update:model-value="(v) => updateCoord(index, v)"
      />
    </div>
    <div class="space-y-2">
      <div class="grid grid-cols-[1fr,auto]">
        <label class="text-sm font-semibold tracking-tight" for="alpha-slider">
          Alpha (0-100)
        </label>
        <Input
            id="alpha-slider"
            v-model.number="alpha"
            :max="100"
            :min="0"
            :step="1"
            type="number"
        />
      </div>
      <ColorSlider
          id="alpha-slider"
          :checkerboard="true"
          :max="100"
          :min="0"
          :model-value="[alpha]"
          :style="`--stops: ${gradientStops[coordsMeta.length]}`"
          @update:model-value="(v) => (alpha = v ? v[0]! : 100)"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>