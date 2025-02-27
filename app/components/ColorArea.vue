<script lang="ts" setup>
import {type ShallowRef, useTemplateRef, watchPostEffect} from "vue";
import {injectColorPickerRootContext} from "./color-picker/ColorPickerRoot.vue";
import {useEventListener, useWindowSize} from "@vueuse/core";
import Color, {type Coords} from "colorjs.io";

const context = injectColorPickerRootContext()

if (!context) throw new Error('ColorPickerRoot not found')

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const boundaryCanvas = useTemplateRef<HTMLCanvasElement>('boundaryCanvas')
const canvasContainer = useTemplateRef<HTMLDivElement>('canvasContainer')
const contrastCanvas = useTemplateRef<HTMLCanvasElement>('contrastCanvas')

function getCanvasContext(canvasElementRef: ShallowRef<HTMLCanvasElement | null>) {
  const context2D = canvasElementRef.value?.getContext('2d', {willReadFrequently: true})
  if (!context2D) throw new Error('Failed to get canvas context')
  return context2D
}

const {space, pickedColor, modelValue} = context

const currentColorBounds = computed(() => {
  const coords = Object.values(space.value.coords)
  const min = coords.map(c => c.refRange?.[0] ?? c.range?.[0])
  const max = coords.map(c => c.refRange?.[1] ?? c.range?.[1])
  return {min, max}
})

function updateCanvasColor(ctx: CanvasRenderingContext2D) {
  const canvasEl = ctx.canvas;
  if (!canvasEl) return;

  const {width, height} = resizeCanvas(canvasEl, ctx);

  let [hue, sValue, vValue] = modelValue.value.to('hsv').coords;


  if (Number.isNaN(hue) || Number.isNaN(sValue) || Number.isNaN(vValue)) {
    return;
  }

  applySaturationGradient(ctx, width, height, hue);

  applyValueGradient(ctx, width, height);

  drawMarker(ctx, width, height, sValue, vValue);
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

function applySaturationGradient(ctx: CanvasRenderingContext2D, width: number, height: number, hue: number) {
  const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
  const hueColor = new Color('hsv', [hue, 100, 100]).display();
  saturationGradient.addColorStop(0, 'hsl(0, 0%, 100%)');
  saturationGradient.addColorStop(1, hueColor.toString());
  ctx.fillStyle = saturationGradient;
  ctx.fillRect(0, 0, width, height);
}

function applyValueGradient(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
  valueGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  valueGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
  ctx.fillStyle = valueGradient;
  ctx.fillRect(0, 0, width, height);
}

function normalizeRange(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function drawMarker(ctx: CanvasRenderingContext2D, width: number, height: number, sValue: number, vValue: number) {
  const normalizedS = normalizeRange(sValue, 0, 100);
  const normalizedV = normalizeRange(vValue, 0, 100);

  const markerX = normalizedS * width;
  const markerY = height - (normalizedV * height);

  ctx.beginPath();
  ctx.arc(markerX, markerY, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.fill();
}



const hue = computed(() => context.modelValue.value.to('hsv').coords[0])

watchPostEffect(() => {
  const colorContext = getCanvasContext(canvas)
  updateCanvasColor(colorContext);
})

const {width} = useWindowSize()

watch(width, () => {
  const colorContext = getCanvasContext(canvas)
  updateCanvasColor(colorContext);
}, {flush: 'post'})

function updateColorFromPosition(clientX: number, clientY: number) {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  const rect = canvasEl.getBoundingClientRect();
  const {xRatio, yRatio} = calculateRatios(clientX, clientY, rect);
  const {saturation, value} = convertRatiosToSV(xRatio, yRatio);
  const hsvColor = createHSVColor(hue.value, saturation, value);
  context.modelValue.value = hsvColor.to(space.value.id, { inGamut: false });
}

function calculateRatios(clientX: number, clientY: number, rect: DOMRect) {
  const xRatio = (clientX - rect.left) / rect.width;
  const yRatio = (clientY - rect.top) / rect.height;
  return {xRatio, yRatio};
}

function convertRatiosToSV(xRatio: number, yRatio: number) {
  const saturation = clamp(xRatio, 0, 1) * 100;
  const value = 100 - clamp(yRatio, 0, 1) * 100;
  return {saturation, value};
}

function createHSVColor(hue: number, saturation: number, value: number) {
  return new Color('hsv', [hue, saturation, value]);
}




function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

useEventListener(canvasContainer, 'pointerdown', onPressed, {passive: true})

function onPressed(event: PointerEvent) {
  const container = canvasContainer.value;
  if (!container) return;

  container.setPointerCapture(event.pointerId);
  updateColorFromPosition(event.clientX, event.clientY);

  let rafId: number | null = null;
  let lastX = event.clientX;
  let lastY = event.clientY;

  const handleMove = (event: PointerEvent) => {
    lastX = event.clientX;
    lastY = event.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        updateColorFromPosition(lastX, lastY);
        rafId = null;
      });
    }
  };

  const handleRelease = () => {
    cleanup();
    container.releasePointerCapture(event.pointerId);
  };

  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    stopMove();
    stopUp();
    stopCancel();
  };

  // Register event listeners
  const stopMove = useEventListener(container, 'pointermove', handleMove, {passive: true});
  const stopUp = useEventListener(container, 'pointerup', handleRelease, {once: true});
  const stopCancel = useEventListener(container, 'pointercancel', handleRelease, {once: true});
}

function chromaticAdaptiveBounds(value: number, min: number, max: number, factor = 0.1) {
  const range = max - min;
  const delta = range * factor;
  return [Math.max(min, value - delta), Math.min(max, value + delta)];
}

const currentColorBoundsWithChromaticAdaptation = computed(() => {
  const { min, max } = currentColorBounds.value;
  const hsvCoords = modelValue.value.to('hsv').coords;
  const [hue, saturation, value] = hsvCoords;

  return {
    min: [
      chromaticAdaptiveBounds(hue, min[0]!, max[0]!)[0],
      chromaticAdaptiveBounds(saturation, min[1]!, max[1]!)[0],
      chromaticAdaptiveBounds(value, min[2]!, max[2]!)[0],
    ],
    max: [
      chromaticAdaptiveBounds(hue, min[0]!, max[0]!)[1],
      chromaticAdaptiveBounds(saturation, min[1]!, max[1]!)[1],
      chromaticAdaptiveBounds(value, min[2]!, max[2]!)[1],
    ],
  };
});

</script>

<template>
  <div class="rounded-md relative overflow-clip border-2 border-current/60">
    <canvas ref="boundaryCanvas" class="absolute inset-0"/>
    <canvas ref="contrastCanvas" class="absolute inset-0"/>
    <div ref="canvasContainer"
         class="relative w-full h-56 overflow-clip touch-none">
      <canvas ref="canvas" class="size-full"/>
    </div>
  </div>
</template>