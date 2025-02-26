<script lang="ts" setup>
import {type ShallowRef, useTemplateRef, watchPostEffect} from "vue";
import {injectColorPickerRootContext} from "./color-picker/ColorPickerRoot.vue";
import {useEventListener, useMounted, useWindowSize} from "@vueuse/core";
import Color from "colorjs.io";

const context = injectColorPickerRootContext()

if (!context) throw new Error('ColorPickerRoot not found')

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

function getCanvasContext(canvasElementRef:ShallowRef<HTMLCanvasElement | null>) {
  const context2D = canvasElementRef.value?.getContext('2d')
  if (!context2D) throw new Error('Failed to get canvas context')
  return context2D
}

const boundaryCanvas = useTemplateRef<HTMLCanvasElement>('boundaryCanvas')

function computeSRGBBoundary(hue: number): Array<{ s: number; v: number }> {
  const points: { s: number; v: number }[] = [];
  for (let s = 0; s <= 100; s++) {
    let low = 0;
    let high = 100;
    let bestV = 100;
    const colorAtMax = new Color('hsv', [hue, s, 100]);
    try {
      if (colorAtMax.to('srgb').inGamut()) {
        points.push({ s, v: 100 });
        continue;
      }
    } catch {
      points.push({ s, v: 100 });
      continue;
    }

    // Binary search to find the highest v in gamut
    const epsilon = 0.5;
    while (high - low > epsilon) {
      const mid = (low + high) / 2;
      const color = new Color('hsv', [hue, s, mid]);
      try {
        const inGamut = color.to('srgb').inGamut();
        if (inGamut) {
          low = mid;
          bestV = mid;
        } else {
          high = mid;
        }
      } catch {
        high = mid;
      }
    }
    points.push({ s, v: bestV });
  }
  return points;
}

function updateCanvasColor(ctx: CanvasRenderingContext2D) {

  // Get current hue from HSV color
  const hsvColor = context.color.value.to('hsv');
  const [hue] = hsvColor.coords;

  const pixelRatio = window.devicePixelRatio || 1;

  const width = ctx.canvas.width = canvas.value?.clientWidth! * pixelRatio;
  const height = ctx.canvas.height = canvas.value?.clientHeight! * pixelRatio;

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
  const markerX = (currentS / 100) * width
  const markerY = (1 - currentV / 100) * height;

  ctx.beginPath();
  ctx.arc(markerX, markerY, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fill();
}

const canvasContainer = useTemplateRef<HTMLDivElement>('canvasContainer')

const hue = computed(() => context.color.value.to('hsv').coords[0])

watchPostEffect(() => {
  const colorContext = getCanvasContext(canvas)
  updateCanvasColor(colorContext);
})

const {width} = useWindowSize()

watch(width, () => {
  const colorContext = getCanvasContext(canvas)
  updateCanvasColor(colorContext);
}, {flush: 'post'})

function updateColorFromPosition(x: number, y: number) {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  const rect = canvasEl.getBoundingClientRect();

  const width = rect.width;
  const height = rect.height;

  const saturation = clamp((x - rect.left) / width, 0, 1) * 100;
  const value = 100 - clamp((y - rect.top) / height, 0, 1) * 100;

  const hsvColor = new Color('hsv', [hue.value, saturation, value])
  const updatedColor = hsvColor.to(context.spaceId.value)

  if(!updatedColor.coords.some(Number.isNaN)) {
    context.modelValue.value = updatedColor
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

useEventListener(canvasContainer, 'pointerdown', onPressed, {passive: true})

function onPressed(event: PointerEvent) {
  const container = canvasContainer.value
  if (!container) return

  container.setPointerCapture(event.pointerId)

  updateColorFromPosition(event.clientX, event.clientY)

  const stopPointermove = useEventListener('pointermove', (event) => {

    updateColorFromPosition(event.clientX, event.clientY)

    const stopPointerup = useEventListener('pointerup', () => {
      container.releasePointerCapture(event.pointerId)
      stopPointermove()
    }, {once: true})

    useEventListener('pointercancel', () => {
      container.releasePointerCapture(event.pointerId)
      stopPointermove()
      stopPointerup()
    }, {once: true})

  }, {passive: true})
}

const isMounted = useMounted()

// todo: draw boundary points
</script>

<template>
  <div ref="canvasContainer"
       class="relative w-full h-56 overflow-clip touch-none border">
    <canvas ref="boundaryCanvas" class="absolute size-full inset-0"/>
    <template v-if="!isMounted">
      <div
          class="size-full bg-[linear-gradient(to_bottom,_rgba(0,0,0,0),_rgba(0,0,0,1)),_linear-gradient(to_right,_hsl(var(--hue),0%,100%),_hsl(var(--hue),100%,50%))]"/>
    </template>
    <canvas ref="canvas" class="size-full"/>
  </div>
</template>