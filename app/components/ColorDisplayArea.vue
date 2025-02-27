<script lang="ts" setup>
import {computed, watchPostEffect} from "vue";
import {injectColorPickerRootContext} from "./color-picker/ColorPickerRoot.vue";
import {useMounted} from "@vueuse/core";
import Checkerboard from "~/components/color-picker/Checkerboard.vue";

const context = injectColorPickerRootContext()

if (!context) throw new Error('ColorPickerRoot not found')

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

function getCanvasContext() {
  const context2D = canvas.value?.getContext('2d')
  if (!context2D) throw new Error('Failed to get canvas context')
  return context2D
}

function updateCanvasColor(ctx: CanvasRenderingContext2D) {
  const fillStyle = context.pickedColor.value.display();
  ctx.save();
  ctx.globalCompositeOperation = 'copy';
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

const inGamutSrgbColor = computed(() => context.pickedColor.value.to('srgb').toString({inGamut: true}))

watchPostEffect(() => {
  const colorContext = getCanvasContext()
  updateCanvasColor(colorContext);
})

const isMounted = useMounted()
</script>

<template>
  <div class="relative w-full h-56">
    <div v-if="!isMounted"
         :style="{background: context.pickedColor.value.toString()}"
         class="absolute inset-0 size-full"
         data-class="ssr-placeholder"
    />
    <canvas ref="canvas" class="size-full"/>
    <Checkerboard />
  </div>
</template>

