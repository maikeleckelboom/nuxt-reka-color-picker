<script lang="ts" setup>
import { type ShallowRef, useTemplateRef, watchPostEffect } from 'vue'
import { injectColorPickerContext } from '../ColorPickerRoot.vue'
import { useEventListener, useWindowSize } from '@vueuse/core'
import Color from 'colorjs.io'

const context = injectColorPickerContext()

if (!context) throw new Error('ColorPickerRoot not found')

const container = useTemplateRef<HTMLDivElement>('container')

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

function getCanvasContext(
  canvasElementRef: ShallowRef<HTMLCanvasElement | null>
) {
  const context2D = canvasElementRef.value?.getContext('2d', {
    willReadFrequently: true
  })
  if (!context2D) throw new Error('Failed to get canvas context')
  return context2D
}

const { space, modelValue } = context

function updateCanvasColor(ctx: CanvasRenderingContext2D) {
  const canvasEl = ctx.canvas
  if (!canvasEl) return

  const { width, height } = resizeCanvas(canvasEl, ctx)

  const [hue, sValue, vValue] = modelValue.value.to('hsv').coords

  if (Number.isNaN(hue) || Number.isNaN(sValue) || Number.isNaN(vValue)) {
    return
  }

  applySaturationGradient(ctx, width, height, hue)

  applyValueGradient(ctx, width, height)

  drawMarker(ctx, width, height, sValue, vValue)
}

function resizeCanvas(
  canvasEl: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  const { width, height } = canvasEl.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  canvasEl.width = width * dpr
  canvasEl.height = height * dpr

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.scale(dpr, dpr)

  return { width, height, dpr }
}

function applySaturationGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue: number
) {
  const saturationGradient = ctx.createLinearGradient(0, 0, width, 0)
  const hueColor = new Color('hsv', [hue, 100, 100]).display()
  saturationGradient.addColorStop(0, 'hsl(0, 0%, 100%)')
  saturationGradient.addColorStop(1, hueColor.toString())
  ctx.fillStyle = saturationGradient
  ctx.fillRect(0, 0, width, height)
}

function applyValueGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const valueGradient = ctx.createLinearGradient(0, 0, 0, height)
  valueGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  valueGradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ctx.fillStyle = valueGradient
  ctx.fillRect(0, 0, width, height)
}

function normalizeRange(value: number, min: number, max: number) {
  return (value - min) / (max - min)
}

function drawMarker(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sValue: number,
  vValue: number
) {
  const normalizedS = normalizeRange(sValue, 0, 100)
  const normalizedV = normalizeRange(vValue, 0, 100)

  const markerX = normalizedS * width
  const markerY = height - normalizedV * height

  ctx.beginPath()
  ctx.arc(markerX, markerY, 8, 0, 2 * Math.PI)
  ctx.strokeStyle = '#2a2d2f'
  ctx.lineWidth = 2
  ctx.stroke()
}

const hue = computed(() => context.modelValue.value.to('hsv').coords[0])

watchPostEffect(() => {
  const colorContext = getCanvasContext(canvas)
  updateCanvasColor(colorContext)
})

const { width } = useWindowSize()

watch(width, () => {
  const colorContext = getCanvasContext(canvas)
  updateCanvasColor(colorContext)
}, { flush: 'post' })

function updateColorFromPosition(clientX: number, clientY: number) {
  const canvasEl = canvas.value
  if (!canvasEl) return

  const rect = canvasEl.getBoundingClientRect()
  const { xRatio, yRatio } = calculateRatios(clientX, clientY, rect)
  const { saturation, value } = convertRatiosToSV(xRatio, yRatio)
  const hsvColor = createHSVColor(hue.value, saturation, value)
  context.modelValue.value = hsvColor.to(space.value.id, { inGamut: false })
}

function calculateRatios(clientX: number, clientY: number, rect: DOMRect) {
  const xRatio = (clientX - rect.left) / rect.width
  const yRatio = (clientY - rect.top) / rect.height
  return { xRatio, yRatio }
}

function convertRatiosToSV(xRatio: number, yRatio: number) {
  const saturation = clamp(xRatio, 0, 1) * 100
  const value = 100 - clamp(yRatio, 0, 1) * 100
  return { saturation, value }
}

function createHSVColor(hue: number, saturation: number, value: number) {
  return new Color('hsv', [hue, saturation, value])
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

useEventListener(container, 'pointerdown', handlePointerdown, { passive: true })

function handlePointerdown(event: PointerEvent) {
  const target = container.value
  if (!target) return

  target.setPointerCapture(event.pointerId)
  updateColorFromPosition(event.clientX, event.clientY)

  let rafId: number | null = null
  let lastX = event.clientX
  let lastY = event.clientY

  const handleMove = (event: PointerEvent) => {
    lastX = event.clientX
    lastY = event.clientY

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        updateColorFromPosition(lastX, lastY)
        rafId = null
      })
    }
  }

  const handleRelease = () => {
    cleanup()
    target.releasePointerCapture(event.pointerId)
  }

  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    stopMove()
    stopUp()
    stopCancel()
  }

  const stopMove = useEventListener(target, 'pointermove', handleMove, {
    passive: true
  })
  const stopUp = useEventListener(target, 'pointerup', handleRelease, {
    once: true
  })
  const stopCancel = useEventListener(
    target,
    'pointercancel',
    handleRelease,
    { once: true }
  )
}
</script>

<template>
  <div
    ref="container"
    class="relative h-full min-h-24 w-full touch-none overflow-clip"
  >
    <canvas ref="canvas" class="size-full" />
  </div>
</template>
