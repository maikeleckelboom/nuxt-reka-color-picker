<script lang="ts" setup></script>

<template>
  <div class="checkerboard absolute inset-0 size-full overflow-clip" />
</template>

<style scoped>
.checkerboard {
  --foreground-color: hsl(var(--muted-foreground) / 0.5);
  --background-color: hsl(var(--muted) / 0.5);
  --checker-size: 12px;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    background-position: 0 0,
    calc(var(--checker-size) / 2) calc(var(--checker-size) / 2);
    background-size: var(--checker-size) var(--checker-size);
    background-image: linear-gradient(
      45deg,
      var(--foreground-color) 25%,
      transparent 25%,
      transparent 75%,
      var(--foreground-color) 75%,
      var(--foreground-color) 100%
    ),
    linear-gradient(
      45deg,
      var(--foreground-color) 25%,
      var(--background-color) 25%,
      var(--background-color) 75%,
      var(--foreground-color) 75%,
      var(--foreground-color) 100%
    );
  }
}
</style>
