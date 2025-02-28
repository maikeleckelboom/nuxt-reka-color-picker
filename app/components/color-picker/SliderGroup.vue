<script lang="ts" setup>
defineSlots<{
  label: []
  field: []
  default: []
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-[1fr,auto] items-center">
      <Label>
        <slot name="label" />
      </Label>
      <slot name="field" />
    </div>
    <slot name="default" />
  </div>
</template>