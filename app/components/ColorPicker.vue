<script lang="ts" setup>
import {useId} from "vue";
import Color from "colorjs.io";
import {useColorCoords} from "~/composables/useColorCoords";
import {useColorDisplay} from "~/composables/useColorDisplay";
import {useColorSpace} from "~/composables/useColorSpace";
import {useColorPicker} from "~/composables/useColorPicker";
import {useColorGradient} from "~/composables/useColorGradient";
import ColorPickerRoot from "~/components/color-picker/ColorPickerRoot.vue";

// Model Value
const modelValue = defineModel<Color>("modelValue", {required: true});

// Color Space
const {spaceId, space} = useColorSpace(modelValue);

// Coords and Meta
const {coords, coordsMeta, updateCoord} = useColorCoords(spaceId, modelValue);

// Alpha Channel
const alpha = ref<number>(100);

// Color
const color = computed(
    () => new Color(spaceId.value, coords.value, alpha.value / 100),
);

// Gradient computation for sliders
const {gradientStops} = useColorGradient(spaceId, coords, alpha, coordsMeta);

// TODO: Move to internal state
// Format and display logic
const id = useId();
const config = useColorPicker(id);

const {serializedColor, formats} = useColorDisplay(color, space, config);
</script>

<template>
  <ColorPickerRoot>
    <div class="mx-auto grid w-full max-w-md gap-6 p-4">
      <div
          :style="{ background: color.display() + '' }"
          class="flex h-16 w-full rounded-md"
      ></div>
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

      <fieldset class="flex flex-col gap-2">
        <div class="space-y-2">
          <Label for="color-space">Space</Label>
          <ColorSpaceSelect id="color-space" v-model="spaceId"/>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-2">
            <Label for="color-format">Format</Label>
            <ColorFormatSelect v-model="config.format" :formats="formats"/>
          </div>
          <div class="space-y-2">
            <Label for="precision-digits">Precision</Label>
            <Input
                id="precision-digits"
                v-model.number="config.precision"
                :max="20"
                :min="2"
                :step="1"
                type="number"
            />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="color-format"> Color </Label>
          <Input id="color-format" :model-value="serializedColor" readonly/>
        </div>
      </fieldset>
    </div>
  </ColorPickerRoot>
</template>

<style lang="postcss">
@property --stops {
  syntax: "<color-stop>";
  inherits: false;
  initial-value: "transparent";
}

[id^="slider-track"] {
  background: linear-gradient(to right, var(--stops));
  @apply border-input border;
}
</style>