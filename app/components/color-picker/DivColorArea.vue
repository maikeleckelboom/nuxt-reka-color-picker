<script lang="ts" setup>
import Color from 'colorjs.io'
import SLGradient from '~/components/color-picker/SLGradient.vue'
import { useEventListener } from '@vueuse/core'

const color = defineModel<Color>('modelValue', {
  type: Object as () => Color,
  default: () => new Color(Color.Space.get('srgb'), [0, 0, 0])
})

const hue = shallowRef<number>(color.value.to('hsl').h)
watch(
  () => color.value.coords,
  (v) => {
    if (v.some(Number.isNaN)) return
    hue.value = color.value.to('hsl').h
  },
  { deep: true }
)

const isLight = computed(() => {
  const l = color.value.to('hsl').l
  return l > 0.5
})
const contrastColor = computed(() => {
  return isLight.value ? '#000000' : '#ffffff'
})

const cursor = useTemplateRef<HTMLDivElement>('cursor')
const container = useTemplateRef<HTMLDivElement>('container')

function getSVFromPosition(clientX: number, clientY: number) {
  const { left, top } = cursor.value?.getBoundingClientRect() ?? { left: 0, top: 0 }
  const x = clientX - left
  const y = clientY - top
  const { width, height } = container.value?.getBoundingClientRect() ?? {
    width: 0,
    height: 0
  }
  const s = (x / width) * 100
  const v = 100 - (y / height) * 100
  return { s, v }
}

useEventListener(container, 'pointerdown', handlePointerdown, { passive: true })

function handlePointerdown(event: PointerEvent) {
  const target = container.value
  if (!target) return

  target.setPointerCapture(event.pointerId)

  const { s, v } = getSVFromPosition(event.clientX, event.clientY)
  color.value = new Color('hsv', [hue.value, s, v]).to(color.value.space.id)

  let rafId: number | null = null
  let lastX = event.clientX
  let lastY = event.clientY

  const handleMove = (event: PointerEvent) => {
    lastX = event.clientX
    lastY = event.clientY

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        const { s, v } = getSVFromPosition(lastX, lastY)
        color.value = new Color('hsv', [hue.value, s, v]).to(color.value.space.id)
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
  const stopCancel = useEventListener(target, 'pointercancel', handleRelease, { once: true })
}
</script>

<template>
  <div ref="container" class="relative size-full overflow-clip">
    <div
      ref="cursor"
      :style="{
        background: contrastColor
      }"
      class="absolute left-0 top-0 size-4 rounded-full bg-blue-400"
    />
    <SLGradient :hue="hue" />
  </div>
</template>

<style lang="postcss" scoped></style>
