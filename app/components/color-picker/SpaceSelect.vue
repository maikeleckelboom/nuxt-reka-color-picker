<script lang="ts" setup>
import { listColorSpaces } from './space'
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const model = computed({
  get: () => context.spaceId.value,
  set: (value) => (context.spaceId.value = value)
})
</script>

<template>
  <Label for="color-space"> Space </Label>
  <Select id="color-space" v-model="model">
    <SelectTrigger>
      <SelectValue placeholder="Select a pickedColor space" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="item in listColorSpaces()"
        :key="item.id"
        :value="item.id"
      >
        {{ item.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
