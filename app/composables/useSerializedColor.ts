import type Color from 'colorjs.io'
import type { ColorSpace } from 'colorjs.io/fn'
import type { SerializeValueOptions } from '~/components/color-picker/ColorPickerRoot.vue'

export function useSerializedColor(color: Ref<Color>, space: Ref<ColorSpace>) {
  const formats = computed<string[]>(() => {
    const formats = space.value.formats
    return Object.keys(formats).filter((format) => format !== 'keyword')
  })

  const options = reactive<SerializeValueOptions>({
    format: undefined,
    inGamut: false,
    precision: 5
  })

  const serialized = computed(() => color.value.toString(options))

  watch(
    formats,
    (v) => {
      if (!v?.length) return
      const [first] = v as [string, ...string[]]
      options.format = first
    },
    { immediate: true }
  )

  return { serialized, formats, options }
}
