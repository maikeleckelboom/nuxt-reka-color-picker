import type { CoordMeta, Coords } from 'colorjs.io'
import Color from 'colorjs.io'
import type { SpaceId } from '~/components/color-picker/color-space'
import type { CoordMeta } from '~/components/color-picker/ColorPickerRoot.vue'

export function useColorGradient(
  spaceId: Ref<SpaceId>,
  coords: Ref<Coords>,
  alpha: Ref<number>,
  coordsMeta: Ref<CoordMeta[]>
) {
  const gradientStops = computed<string[]>(() => {
    const results = []
    for (let i = 0; i < coordsMeta.value.length; i++) {
      results.push(generateCoordGradient(i, coordsMeta.value[i] as CoordMeta))
    }
    results.push(generateAlphaGradient())
    return results
  })

  const generateCoordGradient = (index: number, meta: CoordMeta) => {
    const { isHue, min, max } = meta
    const start = coords.value.slice() as Coords
    start[index] = min
    const color1 = new Color(spaceId.value, start, alpha.value / 100)
    const end = coords.value.slice() as Coords
    end[index] = max
    const color2 = new Color(spaceId.value, end, alpha.value / 100)

    return Color.steps(color1, color2, {
      space: spaceId.value,
      steps: 10,
      ...(isHue && { hue: 'raw' })
    })
      .map((c) => c.display())
      .join(', ')
  }

  const generateAlphaGradient = () => {
    const color1 = new Color(spaceId.value, coords.value, 0)
    const color2 = new Color(spaceId.value, coords.value, 1)
    return Color.steps(color1, color2, { steps: 10 })
      .map((c) => c.display())
      .join(', ')
  }

  return gradientStops
}
