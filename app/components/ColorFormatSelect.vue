<script lang="ts" setup>
import {cn} from "~~/layers/ui/lib/utils";

const {formats} = defineProps<{ formats: string[] }>()

const format = defineModel<string>('modelValue', {
  required: false
})

watch(
    () => formats,
    (updatedFormats) => {
      if (import.meta.server) return
      const [firstFormat] = updatedFormats
      if (!firstFormat) return
      format.value = firstFormat
    },
    {immediate: true}
)
</script>

<template>
  <Select :model-value="format" @update:model-value="format = $event">
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
        <SelectItem v-for="format in formats" :key="format" :value="format">
          {{ format }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
