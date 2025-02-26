<script lang="ts" setup>
import {computed, watchPostEffect} from "vue";
import {injectColorPickerRootContext} from "./color-picker/ColorPickerRoot.vue";

const context = injectColorPickerRootContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const {modelValue} = context

const bgCanvas = useTemplateRef<HTMLCanvasElement>('bgCanvas')
const srgbCanvas = useTemplateRef<HTMLCanvasElement>('srgbCanvas')

function getSrgbBoundingBoxContext() {
  const ctx = srgbCanvas.value?.getContext('2d')!
  if (!ctx) throw new Error('Failed to get canvas context')
  return ctx
}

function getCanvasContext() {
  const ctx = bgCanvas.value?.getContext('2d')!
  if (!ctx) throw new Error('Failed to get canvas context')
  return ctx
}

function updateCanvasColor(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = modelValue.value.display()
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

const inGamutSrgbColor = computed(() => modelValue.value.to('srgb').toString({inGamut: true}))

watchPostEffect(() => {
  const ctx = getCanvasContext()
  updateCanvasColor(ctx);
})


</script>

<template>
  <div class="relative w-full h-56">
    <canvas ref="srgbCanvas" class="absolute inset-0 pointer-events-none"/>
    <canvas ref="bgCanvas" class="size-full"/>
  </div>
</template>

