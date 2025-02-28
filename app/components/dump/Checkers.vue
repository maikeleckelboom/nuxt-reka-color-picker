<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface CheckerBoardProps {
  rows?: number
  cols?: number
  color1?: string
  color2?: string
}

const props = withDefaults(defineProps<CheckerBoardProps>(), {
  rows: 8,
  cols: 8,
  color1: 'rgba(255,255,255,0.21)',
  color2: '#000000'
})

const container = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const drawCheckerboard = () => {
  if (!container.value || !canvas.value) return

  const dpr = window.devicePixelRatio || 1
  const rect = container.value.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  // Set canvas dimensions
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = `${width}px`
  canvas.value.style.height = `${height}px`

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // Scale context for high DPI displays
  ctx.scale(dpr, dpr)

  // Calculate square dimensions
  const squareWidth = width / props.cols
  const squareHeight = height / props.rows

  // Draw pattern
  for (let row = 0; row < props.rows; row++) {
    for (let col = 0; col < props.cols; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? props.color1 : props.color2
      ctx.fillRect(col * squareWidth, row * squareHeight, squareWidth, squareHeight)
    }
  }
}

onMounted(() => {
  // Use resize observer to handle container resizing
  resizeObserver = new ResizeObserver(() => {
    drawCheckerboard()
  })

  if (container.value) {
    resizeObserver.observe(container.value)
  }

  // Initial draw
  drawCheckerboard()
})

onBeforeUnmount(() => {
  if (resizeObserver && container.value) {
    resizeObserver.unobserve(container.value)
  }
})
</script>

<template>
  <div ref="container" class="size-full">
    <canvas ref="canvas" class="size-full"></canvas>
  </div>
</template>
