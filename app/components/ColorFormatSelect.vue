<script lang="ts" setup>
import {cn} from "~~/layers/ui/lib/utils";
import {injectColorPickerRootContext} from "~/components/color-picker/ColorPickerRoot.vue";

const context = injectColorPickerRootContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const {options} = context
</script>

<template>
  <Label for="color-format">
    Format
  </Label>
  <Select
      id="color-format"
      :model-value="options.format"
      class="w-full"
      @update:model-value="options.format = $event as string "
  >
    <SelectTrigger
        :class="
        cn(
          'h-fit border px-3 py-2.5 text-start font-semibold transition-colors hover:bg-accent [&_svg]:opacity-100'
        )
      "
    >
      <SelectValue placeholder="Select a format"/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="format in context.formats.value" :key="format" :value="format">
          {{ format }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
