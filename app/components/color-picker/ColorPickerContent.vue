<script lang="ts" setup>
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'
import ChannelSlider from '~/components/color-picker/ChannelSlider.vue'
import HSVColorArea from '~/components/color-picker/preview/HSVColorArea.vue'
import DisplayColorArea from '~/components/color-picker/preview/DisplayColorArea.vue'
import SpaceSelect from '~/components/color-picker/SpaceSelect.vue'
import FormatSelect from '~/components/color-picker/FormatSelect.vue'
import NumericField from '~/components/color-picker/NumericField.vue'
import SliderGroup from '~/components/color-picker/SliderGroup.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const {
  coordsMeta,
  updateCoord,
  gradientStops,
  modelValue,
  space,
  alpha
} = context
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="h-48">
      <HSVColorArea v-if="['hsl','hsv'].includes(space.id)" />
      <DisplayColorArea v-else />
    </div>
    <SliderGroup v-for="(meta, index) in coordsMeta">
      <template #label>
        {{ meta.name }} ({{ meta.min }}-{{ meta.max }})
      </template>
      <template #field>
        <NumericField
          v-model.number="modelValue.coords[index]"
          :max="meta.max"
          :min="meta.min"
          :step="meta.step"
        />
      </template>
      <template #default>
        <ChannelSlider
          :max="meta.max"
          :min="meta.min"
          :model-value="[modelValue.coords[index] || 0]"
          :step="meta.step"
          :stops="gradientStops[index]"
          @update:model-value="(v) => updateCoord(index, v)"
        />
      </template>
    </SliderGroup>
    <SliderGroup>
      <template #label>
        Alpha (0-100)
      </template>
      <template #field>
        <NumericField
          v-model.number="alpha"
          :max="100"
          :min="0"
          :step="1"
        />
      </template>
      <template #default>
        <ChannelSlider
          :checkerboard="true"
          :max="100"
          :min="0"
          :model-value="[alpha]"
          :step="1"
          :stops="gradientStops[3]"
          @update:model-value="(v) => (alpha = v?.[0] ?? 0)"
        />
      </template>
    </SliderGroup>
    <SpaceSelect />
    <FormatSelect />
    <div class="space-y-2">
      <Label for="precision"> Precision </Label>
      <Input
        id="precision"
        v-model="context.options.value.precision"
        :max="18"
        :min="2"
        type="number"
      />
    </div>
    <div class="space-y-2">
      <Label for="color"> Serialized </Label>
      <Input id="color" :model-value="context.serialized.value" readonly />
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
