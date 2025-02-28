import type { ColorSpace } from 'colorjs.io/fn'
import Color from 'colorjs.io'

// Type for the cache to ensure type safety
type ColorSpaceCache = Map<ColorSpace['id'], ColorSpace>

// Singleton cache instance
let colorSpaceCache: ColorSpaceCache | null = null

// Type derived directly from the ColorSpace
export type ColorSpaceItem = Pick<ColorSpace, 'name' | 'id'>
export type SpaceId = ColorSpace['id']

// Initialize cache once
function initializeCache(): ColorSpaceCache {
  const cache = new Map<ColorSpace['id'], ColorSpace>()

  try {
    // Type assertion for internal API access
    const spaces = (Color.Space as unknown as { all: ColorSpace[] }).all

    for (const space of spaces) {
      if (space.id && space.name) {
        cache.set(space.id, space)
      }
    }
  } catch (error) {
    console.error('Failed to initialize color space cache:', error)
  }

  return cache
}

// Memoized getter for cache instance
function getColorSpaceCache(): ColorSpaceCache {
  if (!colorSpaceCache) {
    colorSpaceCache = initializeCache()
  }
  return colorSpaceCache
}

export function listColorSpaces(): ColorSpaceItem[] {
  const cache = getColorSpaceCache()
  return Array.from(cache.values()).map(({ name, id }) => ({ name, id }))
}
