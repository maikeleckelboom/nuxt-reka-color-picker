<script setup lang="ts">
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'

const context = injectColorPickerContext()

if (!context) throw new Error('ColorPickerContext not found')

const { modelValue } = context

/**
 * todo: add palette with squares from left-right, top-bottom;
 */
</script>

<template>
  <div></div>
</template>

<style scoped lang="postcss"></style>
