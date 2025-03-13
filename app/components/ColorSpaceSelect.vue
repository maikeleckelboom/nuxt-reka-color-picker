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

const spaces = listColorSpaces()

function currentColorInGamut(spaceId: string) {
  return context.modelValue.value.inGamut(spaceId)
}
</script>

<template>
  <Select v-model="model">
    <SelectTrigger>
      <SelectValue placeholder="Select a color space"/>
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in spaces" :key="item.id" :value="item.id">
        {{ item.name }}
        <div v-if="!currentColorInGamut(item.id)" class="relative top-0.5 left-2 inline-flex">
          <Icon name="hugeicons:alert-01" class="size-4 text-orange-400"/>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
