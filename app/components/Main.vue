<script lang="ts" setup>
import Color from 'colorjs.io'

const srgbColor = new Color(Color.Space.get('srgb'), [0.2, 0.2, 0.85])
const oklchColor = new Color(Color.Space.get('oklch'), [0.69, 0.176, 146])

const color = ref(oklchColor)
</script>

<template>
  <div class="max-w-md p-4 gap-8 mx-auto w-full flex flex-col">
    <ColorMode/>
    <ColorPicker v-model="color">
      <ColorPickerContent/>
    </ColorPicker>
  </div>
</template>

<style scoped>

</style>