import { ColorSpace } from 'colorjs.io/fn'
import Color from 'colorjs.io'

export interface ColorSpaceItem {
  name: string
  id: string
}

let colorSpaceCache = new Map<string, ColorSpace>()

export function listColorSpaces(): ColorSpaceItem[] {
  if (colorSpaceCache.size === 0) {
    // @ts-ignore
    Color.Space.all.forEach((space: ColorSpace) => {
      colorSpaceCache.set(space.id, space)
    })
  }

  return Array.from(colorSpaceCache.values()).map((space) => ({
    name: space.name,
    id: space.id
  }))
}

export type SpaceId = ColorSpace['id']