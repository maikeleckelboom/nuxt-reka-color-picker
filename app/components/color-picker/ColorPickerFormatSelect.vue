<script lang="ts" setup>
import { cn } from '~~/layers/ui/lib/utils'
import { injectColorPickerContext } from '~/components/color-picker/ColorPickerRoot.vue'

const context = injectColorPickerContext()

if (!context) {
  throw new Error('ColorPickerRoot not found')
}

const { options } = context
</script>

<template>
  <div class="grid gap-2.5">
    <Label for="color-format"> Format </Label>
    <Select
      id="color-format"
      :model-value="options.format"
      class="w-full"
      @update:model-value="options.format = $event as string"
    >
      <SelectTrigger
        :class="
          cn(
            'hover:bg-accent border px-3 py-2 text-start font-semibold transition-colors [&_svg]:opacity-100'
          )
        "
      >
        <SelectValue placeholder="Select a format" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="format in context.formats.value" :key="format" :value="format">
            {{ format }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
