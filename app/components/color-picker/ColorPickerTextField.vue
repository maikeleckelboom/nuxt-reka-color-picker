<script lang="ts" setup>
import { vClampRange } from '~/utils/vClampRange'

const {
  max = 100,
  min = 0,
  step = 1
} = defineProps<{
  max: number
  min: number
  step: number
}>()

const modelValue = defineModel<number | undefined>('modelValue', {
  type: Number
})

defineSlots<{
  label: []
}>()
</script>

<template>
  <Input
    v-clamp-range
    v-model.number="modelValue"
    :max="max"
    :min="min"
    :step="step"
    class="-nums w-full min-w-48"
    type="text"
  />
</template>
