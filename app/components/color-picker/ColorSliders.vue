<script setup lang="ts">
import {injectColorPickerRootContext} from "~/components/color-picker/ColorPickerRoot.vue";

const context = injectColorPickerRootContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}
</script>

<template>
  <div>
<!--    <ColorSlider-->
<!--      v-for="(slider, index) in context.sliders"-->
<!--      :key="index"-->
<!--      :slider="slider"-->
<!--    />-->
  </div>
</template>

<style scoped lang="postcss">

</style>