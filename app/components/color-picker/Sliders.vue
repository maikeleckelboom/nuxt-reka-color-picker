<script setup lang="ts">
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'

const context = injectColorPickerContext()

if (!context) throw new Error('ColorPickerRoot not found')

</script>

<template>
  <div>

  </div>
</template>

<style scoped lang="postcss"></style>
