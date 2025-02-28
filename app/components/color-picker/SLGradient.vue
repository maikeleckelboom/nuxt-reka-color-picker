<script setup lang="ts">
const { hue } = defineProps<{
  hue: number
}>()
</script>

<template>
  <div
    :style="{ '--hue': hue }"
    class="size-full min-h-24 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0),_rgba(0,0,0,1)),_linear-gradient(to_right,_hsl(var(--hue),0%,100%),_hsl(var(--hue),100%,50%))]"
  />
</template>
