<script lang="ts" setup>
import {injectColorPickerRootContext} from "~/components/color-picker/ColorPickerRoot.vue";
import ColorSlider from "~/components/color-picker/ColorSlider.vue";
import TestPicker from "~/components/TestPicker.vue";

const context = injectColorPickerRootContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const {
  coords,
  coordsMeta,
  updateCoord,
  gradientStops,
  spaceId,
  modelValue,
  pickedColor,
  space,
  alpha,
} = context

const coordMeta = computed(() => Object.values(space.value.coords))

const staticHue = shallowRef<number>(0)

watch(modelValue, (value) => {
  if (!value?.coords?.[0] || Number.isNaN(value.coords[0])) return;
  staticHue.value = value.to('hsv').coords[0]
}, {immediate: true})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="text-4xl">
    </div>

    <ColorArea/>

    <div v-for="(meta, index) in coordsMeta" class="space-y-2">
      <div class="grid grid-cols-[1fr,auto] items-center">
        <Label :for="`slider-channel-${index}`">
          {{ meta.name }} ({{ meta.min }}-{{ meta.max }})
        </Label>
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
          @update:model-value="(v) => updateCoord(index, v)"
      />
    </div>
    <div class="space-y-2">
      <div class="grid grid-cols-[1fr,auto] items-center">
        <Label for="slider-alpha-channel">
          Alpha (0-100)
        </Label>
        <Input
            id="slider-alpha-channel"
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
          @update:model-value="(v) => (alpha = v ? v[0]! : 100)"
      />
    </div>
    <ColorSpaceSelect/>
    <ColorFormatSelect/>
    <div class="space-y-2">
      <Label for="precision">
        Precision
      </Label>
      <Input id="precision" v-model="context.options.value.precision" :max="18" :min="2" type="number"/>
    </div>
    <div class="space-y-2">
      <Label for="color">
        Serialized
      </Label>
      <Input id="color" :model-value="context.serializedColor.value" readonly/>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>