<script lang="ts" setup>
import {watchPostEffect} from "vue";
import {injectColorPickerRootContext} from "./color-picker/ColorPickerRoot.vue";
import {useEventListener, useMounted} from "@vueuse/core";
import Color from "colorjs.io";

const context = injectColorPickerRootContext()

if (!context) throw new Error('ColorPickerRoot not found')

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

function getCanvasContext() {
  const context2D = canvas.value?.getContext('2d')
  if (!context2D) throw new Error('Failed to get canvas context')
  return context2D
}

function updateCanvasColor(ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Get current hue from HSV color
  const hsvColor = context.color.value.to('hsv');
  const [hue] = hsvColor.coords;

  // Create horizontal gradient for saturation
  const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
  const hueColor = new Color('hsv', [hue, 100, 100]).display();
  saturationGradient.addColorStop(0, 'hsl(0, 0%, 100%)');
  saturationGradient.addColorStop(1, hueColor.toString());

  // Fill canvas with saturation gradient
  ctx.fillStyle = saturationGradient;
  ctx.fillRect(0, 0, width, height);

  // Create vertical gradient for value (black overlay)
  const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
  valueGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  valueGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

  // Apply value gradient overlay
  ctx.fillStyle = valueGradient;
  ctx.fillRect(0, 0, width, height);

  // Draw current position marker
  const [_, currentS, currentV] = context.color.value.to('hsv').coords;
  const markerX = (currentS / 100) * width;
  const markerY = (1 - currentV / 100) * height;

  ctx.beginPath();
  ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

watchPostEffect(() => {
  const colorContext = getCanvasContext()
  updateCanvasColor(colorContext);
})

const isMounted = useMounted()
const container = useTemplateRef<HTMLDivElement>('container')

const hue = computed(() => context.color.value.to('hsv').coords[0])

function updateColorFromPosition(x: number, y: number) {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  const rect = canvasEl.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const saturation = clamp((x - rect.left) / width, 0, 1) * 100;
  const value = 100 - clamp((y - rect.top) / height, 0, 1) * 100;

  context.modelValue.value = new Color('hsv', [hue.value, saturation, value]);
}

const isDragging = shallowRef<boolean>(false)


function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

const stop = useEventListener(
    container,
    'pointerdown',
    onPressed,
    {capture: true}
)

function onPressed(event: PointerEvent) {
  isDragging.value = true
  const parent = container.value as HTMLElement
  parent.setPointerCapture(event.pointerId)

  updateColorFromPosition(event.clientX, event.clientY)

  const cleanupMv = useEventListener('pointermove', (event) => {
    updateColorFromPosition(event.clientX, event.clientY)

    const cleanupPu = useEventListener('pointerup', () => {
      isDragging.value = false
      parent.releasePointerCapture(event.pointerId)
      cleanupMv()
    }, {once: true})

  }, {passive: true})
}
</script>

<template>
  <div ref="container" class="relative  w-fit h-56 ">
    <!--    <div v-if="!isMounted"-->
    <!--         :style="{ background: context.color.value.toString() }"-->
    <!--         class="absolute inset-0 size-full"-->
    <!--    />-->
    <canvas
        ref="canvas"
        class="size-full"
    />
  </div>
</template>