<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import type {
  ColorPickerRootEmits,
  ColorPickerRootProps
} from '~/components/color-picker/ColorPickerRoot.vue'

const props = defineProps<ColorPickerRootProps>()
const emits = defineEmits<ColorPickerRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ColorPickerRoot v-bind="forwarded">
    <slot />
  </ColorPickerRoot>
</template>
