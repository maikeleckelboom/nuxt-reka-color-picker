<script lang="ts" setup>
import {Toaster} from "vue-sonner";
</script>

<template>
  <div>
    <div class="z-0 w-full h-max absolute top-0 left-0 inset-0 pointer-events-none flex justify-center overflow-hidden">
      <div class="w-[108rem] flex-none flex justify-end">
        <img alt="backdrop" class="w-[90rem] flex-none max-w-none" decoding="async" src="/reku-bg.png">
      </div>
    </div>
    <Main/>
    <Toaster/>
  </div>
</template>
