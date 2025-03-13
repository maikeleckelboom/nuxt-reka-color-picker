import { ColorSpace } from 'colorjs.io/fn'
import Color from 'colorjs.io'

export interface ColorSpaceItem {
  name: string
  id: string
  space: ColorSpace
}

let colorSpaceCache = new Map<string, ColorSpace>()

export function listColorSpaces(): ColorSpaceItem[] {
  if (colorSpaceCache.size === 0) {
    // @ts-expect-error internal API
    Color.Space.all.forEach((space: ColorSpace) => {
      colorSpaceCache.set(space.id, space)
    })
  }

  return Array.from(colorSpaceCache.values()).map((space) => ({
    name: space.name,
    id: space.id,
    space: space,
  }))
}

export type SpaceId = ColorSpace['id']
