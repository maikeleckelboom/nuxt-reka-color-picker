<script lang="ts" setup>
import {listColorSpaces} from "./utils";

const modelValue = defineModel<string>('modelValue', {
  required: true
})
</script>

<template>
  <Select v-model="modelValue">
    <SelectTrigger>
      <SelectValue placeholder="Select a color space" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in listColorSpaces()" :key="item.id" :value="item.id">
        {{ item.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<style lang="postcss" scoped></style>