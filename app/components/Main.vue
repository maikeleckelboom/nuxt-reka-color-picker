<script lang="ts" setup>
import Color from 'colorjs.io'

const srgbColor = new Color(Color.Space.get('srgb'), [0.2, 0.5, 0.85])

const color = ref(srgbColor)
</script>

<template>
  <div class="max-w-md py-4 mx-auto w-full flex flex-col">
    <ColorMode/>
    <ColorPicker v-model="color">
      <ColorPickerContent/>
    </ColorPicker>
  </div>
</template>

<style scoped>

</style>