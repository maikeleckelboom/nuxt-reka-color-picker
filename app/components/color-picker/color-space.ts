import type { ColorSpace } from 'colorjs.io/fn'
import Color from 'colorjs.io'

// Explicitly define all color spaces by id and name
export const COLOR_SPACES = {
  a98rgb: 'Adobe® 98 RGB compatible',
  'a98rgb-linear': 'Linear Adobe® 98 RGB compatible',
  acescc: 'ACEScc',
  acescg: 'ACEScg',
  'cam16-jmh': 'CAM16-JMh',
  hct: 'HCT',
  hpluv: 'HPLuv',
  hsl: 'HSL',
  hsluv: 'HSLuv',
  hsv: 'HSV',
  hwb: 'HWB',
  ictcp: 'ICTCP',
  jzczhz: 'JzCzHz',
  jzazbz: 'Jzazbz',
  lch: 'LCH',
  lchuv: 'LChuv',
  lab: 'Lab',
  'lab-d65': 'Lab D65',
  luv: 'Luv',
  oklch: 'Oklch',
  oklab: 'Oklab',
  p3: 'P3',
  'p3-linear': 'Linear P3',
  prophoto: 'ProPhoto',
  'prophoto-linear': 'Linear ProPhoto',
  rec2020: 'REC.2020',
  'rec2020-linear': 'Linear REC.2020',
  rec2100hlg: 'REC.2100-HLG',
  rec2100pq: 'REC.2100-PQ',
  'xyz-abs-d65': 'Absolute XYZ D65',
  'xyz-d50': 'XYZ D50',
  'xyz-d65': 'XYZ D65',
  srgb: 'sRGB',
  'srgb-linear': 'Linear sRGB'
} as const

export type ColorSpaceId = keyof typeof COLOR_SPACES
export type ColorSpaceName = (typeof COLOR_SPACES)[ColorSpaceId]

// Type for the cache to ensure type safety
type ColorSpaceCache = Map<ColorSpaceId, ColorSpace>

// Singleton cache instance
let colorSpaceCache: ColorSpaceCache | null = null

// Type derived directly from the ColorSpace
export type SpaceId = ColorSpace['id']

// Type for the list of color spaces
export interface ColorSpaceItem {
  id: SpaceId
  name: string
}

function initializeCache(): ColorSpaceCache {
  const cache = new Map<ColorSpaceId, ColorSpace>()

  try {
    // Type assertion for internal API access
    const spaces = (Color.Space as unknown as { all: ColorSpace[] }).all

    for (const space of spaces) {
      if (COLOR_SPACES.hasOwnProperty(space.id)) {
        cache.set(<ColorSpaceId>space.id, space)
      }
    }
  } catch (error) {
    console.error('Failed to initialize color space cache:', error)
  }

  return cache
}

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
