<script lang="ts" setup>
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerContext not found')
}
</script>

<template>
  <NumberField v-model="context.options.precision" :max="18" :min="2" :step="1">
    <Label> Precision </Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>

<style lang="postcss" scoped></style>
