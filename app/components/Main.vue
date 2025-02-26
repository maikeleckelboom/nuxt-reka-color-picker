<script lang="ts" setup>
import Color from 'colorjs.io'
import ColorPicker from "~/components/ColorPicker.vue";

const srgbColor = new Color(Color.Space.get('srgb'), [0.5, 0.5, 0.5])

const colorE = ref(srgbColor)
</script>

<template>
  <div class="grid place-items-center w-full">
   <div class="w-full">
     <div class="max-w-md py-4 mx-auto w-full">
       <ColorMode />
     </div>
     <ColorPicker v-model="colorE"/>
   </div>
  </div>
</template>

<style scoped>

</style>