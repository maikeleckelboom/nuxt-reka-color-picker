<script lang="ts" setup>
type CategoryNode =
  | {
      name: string
      children: readonly CategoryNode[]
    }
  | {
      name: string
      id: string
    }

const categories: CategoryNode[] = [
  {
    name: 'RGB Color Models',
    children: [
      { name: 'Adobe RGB (1998)', id: 'a98rgb' },
      { name: 'sRGB (Standard RGB)', id: 'srgb' },
      { name: 'Display P3', id: 'p3' },
      { name: 'ProPhoto RGB', id: 'prophoto' },
      {
        name: 'Linear RGB Formats',
        children: [
          { name: 'Linear Adobe RGB', id: 'a98rgb-linear' },
          { name: 'Linear sRGB', id: 'srgb-linear' },
          { name: 'Linear Display P3', id: 'p3-linear' },
          { name: 'Linear ProPhoto RGB', id: 'prophoto-linear' }
        ]
      }
    ]
  },
  {
    name: 'Cinematic & Broadcast Standards',
    children: [
      { name: 'ACES CC (Color Correction)', id: 'acescc' },
      { name: 'ACES CG (Computer Graphics)', id: 'acescg' },
      { name: 'ICtCp (Intensity Chroma)', id: 'ictcp' },
      { name: 'Rec.2020', id: 'rec2020' },
      { name: 'Linear Rec.2020', id: 'rec2020-linear' },
      { name: 'Rec.2100 HLG (Hybrid Log-Gamma)', id: 'rec2100hlg' },
      { name: 'Rec.2100 PQ (Perceptual Quantizer)', id: 'rec2100pq' }
    ]
  },
  {
    name: 'Hue-Based Models',
    children: [
      { name: 'HSL (Hue, Saturation, Lightness)', id: 'hsl' },
      { name: 'HSV (Hue, Saturation, Value)', id: 'hsv' },
      { name: 'HWB (Hue, Whiteness, Blackness)', id: 'hwb' }
    ]
  },
  {
    name: 'Modern Perceptual Models',
    children: [
      { name: 'Oklab (Perceptually Uniform)', id: 'oklab' },
      { name: 'Oklch (Perceptual Polar Coordinates)', id: 'oklch' },
      { name: 'CAM16-JMh (Color Appearance)', id: 'cam16-jmh' },
      { name: 'HCT (Hue, Chroma, Tone)', id: 'hct' }
    ]
  },
  {
    name: 'CIE Lab-Based Models',
    children: [
      { name: 'Lab (L*a*b*)', id: 'lab' },
      { name: 'Lab D65 (D65 Illuminant)', id: 'lab-d65' },
      { name: 'LCh (L*C*h°)', id: 'lch' },
      { name: 'Jzazbz (High Dynamic Range)', id: 'jzazbz' },
      { name: 'JzCzHz (Polar Jzazbz)', id: 'jzczhz' }
    ]
  },
  {
    name: 'CIE Luv-Based Models',
    children: [
      { name: 'Luv (L*u*v*)', id: 'luv' },
      { name: 'LChuv (L*C*h° Luv)', id: 'lchuv' },
      { name: 'HPLuv (Human-Perceptible)', id: 'hpluv' },
      { name: 'HSLuv (Hue-Saturation-Lightness Luv)', id: 'hsluv' }
    ]
  },
  {
    name: 'CIE XYZ Reference',
    children: [
      { name: 'XYZ D50 (5000K Reference)', id: 'xyz-d50' },
      { name: 'XYZ D65 (6500K Reference)', id: 'xyz-d65' },
      { name: 'Absolute XYZ D65', id: 'xyz-abs-d65' }
    ]
  }
]

interface FlattenedEntry {
  path: string[]
  name: string
  id: string
}

const flattenedData = computed<FlattenedEntry[]>(() => {
  const flatten = (nodes: readonly CategoryNode[], path: string[]): FlattenedEntry[] => {
    return nodes.flatMap((node) => {
      if ('children' in node) {
        return flatten(node.children, [...path, node.name])
      }
      return [
        {
          path: [...path],
          name: node.name,
          id: node.id
        }
      ]
    })
  }
  return flatten(categories, [])
})
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[40%]">Category Hierarchy</TableHead>
          <TableHead class="w-[35%]">Color Space</TableHead>
          <TableHead class="w-[25%]">Identifier</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="entry in flattenedData" :key="entry.id">
          <TableCell class="font-medium">
            {{ entry.path.join(' › ') }}
          </TableCell>
          <TableCell>{{ entry.name }}</TableCell>
          <TableCell>
            <code class="bg-muted rounded px-2 py-1 text-sm">
              {{ entry.id }}
            </code>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
