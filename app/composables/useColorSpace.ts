import Color from 'colorjs.io'
import type { Ref } from 'vue'
import type { ColorSpace } from 'colorjs.io/fn'
import type { SpaceId } from '~/components/color-picker/color-space'

export function useColorSpace(modelValue: Ref<Color>) {
  const spaceId = computed<SpaceId>({
    get: () => modelValue.value.spaceId || modelValue.value.space.id,
    set: (id) => {
      if (id === spaceId.value) return
      modelValue.value = modelValue.value.to(id)
    }
  })

  const space = computed<ColorSpace>(() => Color.Space.get(spaceId.value))

  return { spaceId, space }
}
