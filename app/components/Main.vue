<script lang="ts" setup>
import Color from 'colorjs.io'
import ColorSpacesTable from '~/components/ColorSpacesTable.vue'

const srgbColor = new Color(Color.Space.get('srgb'), [0.8, 0.7, 0.4])
const oklchColor = new Color(Color.Space.get('oklch'), [0.69, 0.176, 146])
const hslColor = new Color(Color.Space.get('hsl'), [300, 80, 60])
const p3Color = new Color(Color.Space.get('p3'), [0.76, 0.3, 0.83])
const p3LinearColor = new Color(Color.Space.get('p3-linear'), [40, 130, 0])
const srgbLinear = new Color(Color.Space.get('srgb-linear'), [0.2, 0.2, 0.85])

const color = ref<Color>(srgbColor)

const baseColor = new Color('rebeccapurple')
const color2 = new Color('blue')
const color3 = new Color('red')
const color4 = new Color('green')
const color5 = new Color('yellow')
</script>

<template>
  <div class="4xl:grid-cols-2 grid items-start p-8">
    <div class="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <ColorMode />
      <CategorizedSpaces />
      <ColorPicker v-model="color" />
    </div>
    <div class="mx-auto w-full max-w-2xl">
      <ColorSpacesTable />
    </div>
  </div>
</template>

<style scoped></style>
