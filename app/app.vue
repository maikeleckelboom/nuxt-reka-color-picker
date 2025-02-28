<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div>
    <div
      class="pointer-events-none absolute inset-0 left-0 top-0 -z-10 flex h-max w-full justify-center overflow-hidden"
    >
      <div class="flex w-[108rem] flex-none justify-end">
        <img
          alt="backdrop"
          class="w-[90rem] max-w-none flex-none"
          decoding="async"
          src="/reku-bg.png"
        />
      </div>
    </div>
    <Main />
    <Toaster />
  </div>
</template>
