<script lang="ts" setup>
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import Checkerboard from '~/components/color-picker/Checkerboard.vue'

const context = injectColorPickerContext()

if (!context) throw new Error('ColorPickerRoot not found')
</script>

<template>
  <div class="relative row-span-full grid size-full grid-rows-2">
    <div
      :style="{ background: context.pickedColor.value.toString() }"
      class="relative col-start-1 row-start-1 size-full overflow-clip"
    >
      <Checkerboard class="col-start-1 row-start-1" />
    </div>
    <div :style="{ background: context.contrastColor.value.toString() }"></div>
  </div>
</template>
