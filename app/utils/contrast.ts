import Color from 'colorjs.io'
import { type Algorithms } from 'colorjs.io/fn'

/**
 * Optimal black/white contrast
 */
export function optimalGrayscaleContrast(base: Color): Color {
  const baseColor = base.clone()
  const black = new Color('black')
  const white = new Color('white')

  return baseColor.contrast(black, 'APCA') > baseColor.contrast(white, 'APCA') ? black : white
}

/**
 * Finds maximum contrast combination from candidates
 */
export function maximumContrastCombination(base: Color, candidates: Color[]): Color {
  const baseColor = base.clone()
  return candidates.reduce((maxContrastColor, currentColor) => {
    const currentContrast = baseColor.contrast(currentColor, 'APCA')
    const maxContrast = baseColor.contrast(maxContrastColor, 'APCA')
    return currentContrast > maxContrast ? currentColor : maxContrastColor
  }, new Color('black'))
}

export function getContrastColor(color: Color) {
  return optimalGrayscaleContrast(color)
}
