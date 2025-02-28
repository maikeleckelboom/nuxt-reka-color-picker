<script lang="ts" setup>
import Color from 'colorjs.io'

const srgbColor = new Color(Color.Space.get('srgb'), [0.2, 0.2, 0.85])
const oklchColor = new Color(Color.Space.get('oklch'), [0.69, 0.176, 146])
const labColor = new Color(Color.Space.get('lab'), [0.69, 0.176, 146])

const color = ref<Color>(oklchColor)
</script>

<template>
  <div class="mx-auto flex w-full max-w-md flex-col gap-8 p-4">
    <ColorMode />
    <ColorPicker v-model="color">
      <ColorPickerContent />
    </ColorPicker>
  </div>
</template>

<style scoped></style>
