<script setup lang="ts">
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}
</script>

<template>
  <div class="space-y-2">
    <Label for="color"> Serialized </Label>
    <Input id="color" :model-value="context.serialized.value" readonly />
  </div>
</template>

<style scoped lang="postcss"></style>
