<script lang="ts" setup>
import {listColorSpaces} from "./color-picker/space";
import {injectColorPickerRootContext} from "~/components/color-picker/ColorPickerRoot.vue";

const context = injectColorPickerRootContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const model = computed({
  get: () => context.spaceId.value,
  set: (value) => context.spaceId.value = value
})
</script>

<template>
  <Select v-model="model">
    <SelectTrigger>
      <SelectValue placeholder="Select a color space"/>
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in listColorSpaces()" :key="item.id" :value="item.id">
        {{ item.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>