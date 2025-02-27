<script setup lang="ts">
import {injectColorPickerRootContext} from "~/components/color-picker/ColorPickerRoot.vue";
import Color from "colorjs.io";

const context = injectColorPickerRootContext()

const {space,pickedColor} = context

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const boundaryCanvas = useTemplateRef<HTMLCanvasElement>('boundaryCanvas')

const srgbSpace = Color.Space.get('srgb')

const currentColorBounds = computed(() => {
  const coords = Object.values(space.value.coords)
  const min = coords.map(c => c.refRange?.[0] ?? c.range?.[0])
  const max = coords.map(c => c.refRange?.[1] ?? c.range?.[1])
  return {min, max}
})

const srgbColorBounds = computed(() => {
  const coords = Object.values(srgbSpace.coords)
  const min = coords.map(c => c.refRange?.[0] ?? c.range?.[0])
  const max = coords.map(c => c.refRange?.[1] ?? c.range?.[1])
  return {min, max}
})




function updateCanvasColor(ctx: CanvasRenderingContext2D) {
  const canvasEl = ctx.canvas;
  if (!canvasEl) return;

  const hsvColor = context.pickedColor.value.to('hsv');
  const [hue, sValue, vValue] = hsvColor.coords;
  const {width, height} = resizeCanvas(canvasEl, ctx);


}

function drawMarker(ctx: CanvasRenderingContext2D, width: number, height: number, x: number, y: number) {
  ctx.fillStyle = 'orange'
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fill();
}

function resizeCanvas(canvasEl: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const {width, height} = canvasEl.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvasEl.width = width * dpr;
  canvasEl.height = height * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return {width, height, dpr};
}

watch(pickedColor, (value) => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return;
  updateCanvasColor(ctx)
}, {immediate: true})
</script>

<template>
  <div class="flex gap-4">
    <canvas ref="canvas" class="w-64 h-64 border border-gray-300"></canvas>
    <canvas ref="boundaryCanvas" class="w-64 h-64 border border-gray-300"></canvas>
  </div>
</template>
