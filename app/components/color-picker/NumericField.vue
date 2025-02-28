<script lang="ts" setup>
import type { Directive } from 'vue'

const vClampRange: Directive<HTMLInputElement> = {
  mounted(el) {
    const clampValue = () => {
      const value = parseFloat(el.value)
      const minVal = parseFloat(el.min)
      const maxVal = parseFloat(el.max)

      let clamped = value
      if (!isNaN(minVal)) clamped = Math.max(clamped, minVal)
      if (!isNaN(maxVal)) clamped = Math.min(clamped, maxVal)

      if (clamped !== value) {
        el.value = clamped.toString()
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    const handler = () => clampValue()

    el.addEventListener('input', handler)
    clampValue() // Initial clamp

    // Store handler for cleanup
    ;(el as any)._clampHandler = handler
  },
  updated(el) {
    // Re-clamp when attributes change
    const value = parseFloat(el.value)
    const minVal = parseFloat(el.min)
    const maxVal = parseFloat(el.max)

    let clamped = value
    if (!isNaN(minVal)) clamped = Math.max(clamped, minVal)
    if (!isNaN(maxVal)) clamped = Math.min(clamped, maxVal)

    if (clamped !== value) {
      el.value = clamped.toString()
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  },
  beforeUnmount(el) {
    if ((el as any)._clampHandler) {
      el.removeEventListener('input', (el as any)._clampHandler)
    }
  }
}

const { max, min, step, ...restProps } = defineProps<{
  max: number
  min: number
  step: number
}>()

const modelValue = defineModel<number | undefined>({ required: true })
</script>

<template>
  <Input
    v-clamp-range
    v-model.number="modelValue"
    :max="max"
    :min="min"
    :step="step"
    class="font-mono tabular-nums max-w-24"
    type="number"
  />
</template>