<script lang="ts" setup>
import type { ColorSpaceId } from '~/components/color-picker/color-space'

interface BaseCategoryNode {
  name: string
  icon?: string
}

interface CategoryGroup extends BaseCategoryNode {
  children: CategoryNode[]
  id?: never
}

interface ColorSpaceItem extends BaseCategoryNode {
  id: ColorSpaceId
  children?: never
}

type CategoryNode = CategoryGroup | ColorSpaceItem

const colorSpaceCategories: CategoryNode[] = [
  {
    name: 'RGB Color Models',
    icon: 'mdi:palette',
    children: [
      { name: 'Adobe® 98 RGB', id: 'a98rgb' },
      { name: 'Standard sRGB', id: 'srgb' },
      { name: 'Display P3', id: 'p3' },
      { name: 'ProPhoto RGB', id: 'prophoto' },
      {
        name: 'Linear RGB Variants',
        icon: 'ic:linear-scale',
        children: [
          { name: 'Linear Adobe® 98', id: 'a98rgb-linear' },
          { name: 'Linear sRGB', id: 'srgb-linear' },
          { name: 'Linear P3', id: 'p3-linear' },
          { name: 'Linear ProPhoto', id: 'prophoto-linear' }
        ]
      }
    ]
  },
  {
    name: 'Film & Video Standards',
    icon: 'mdi:filmstrip',
    children: [
      { name: 'ACEScc', id: 'acescc' },
      { name: 'ACEScg', id: 'acescg' },
      { name: 'ICtCp', id: 'ictcp' },
      { name: 'Rec.2020', id: 'rec2020' },
      { name: 'Linear Rec.2020', id: 'rec2020-linear' },
      { name: 'Rec.2100 HLG', id: 'rec2100hlg' },
      { name: 'Rec.2100 PQ', id: 'rec2100pq' }
    ]
  },
  {
    name: 'Cylindrical Color Models',
    icon: 'mdi:rotate-3d',
    children: [
      { name: 'HSL', id: 'hsl' },
      { name: 'HSV', id: 'hsv' },
      { name: 'HWB', id: 'hwb' }
    ]
  },
  {
    name: 'Perceptually Uniform Models',
    icon: 'mdi:eye',

    children: [
      { name: 'Oklab', id: 'oklab' },
      { name: 'Oklch', id: 'oklch' },
      { name: 'CAM16-JMh', id: 'cam16-jmh' },
      { name: 'Google HCT', id: 'hct' }
    ]
  },
  {
    name: 'CIELAB Derivatives',
    icon: 'mdi:flask',

    children: [
      { name: 'CIELAB', id: 'lab' },
      { name: 'CIELAB D65', id: 'lab-d65' },
      { name: 'CIELCH', id: 'lch' },
      { name: 'Jzazbz', id: 'jzazbz' },
      { name: 'JzCzHz', id: 'jzczhz' }
    ]
  },
  {
    name: 'CIELUV Variants',
    icon: 'mdi:palette-swatch',

    children: [
      { name: 'CIELUV', id: 'luv' },
      { name: 'LChuv', id: 'lchuv' },
      { name: 'HPLuv', id: 'hpluv' },
      { name: 'HSLuv', id: 'hsluv' }
    ]
  },
  {
    name: 'XYZ & Absolute',
    icon: 'mdi:axis-arrow',
    children: [
      { name: 'XYZ D50', id: 'xyz-d50' },
      { name: 'XYZ D65', id: 'xyz-d65' },
      { name: 'Absolute XYZ D65', id: 'xyz-abs-d65' }
    ]
  }
] as const
</script>

<template>
  <div class="grid gap-2.5">
    <Label for="color-space"> Color Space </Label>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <slot name="trigger">
          <Button class="w-full justify-start text-left font-normal" variant="outline">
            <slot name="trigger-text">Select a color space</slot>
          </Button>
        </slot>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="w-[var(--reka-dropdown-menu-trigger-width)]"
        :collision-padding="8"
      >
        <DropdownMenuLabel class="sr-only">Color Spaces</DropdownMenuLabel>
        <DropdownMenuGroup v-for="category in colorSpaceCategories" :key="category.id">
          <DropdownMenuSub :key="category.id">
            <DropdownMenuSubTrigger>
              <Icon v-if="category.icon" :name="category.icon" class="mr-2" />
              {{ category.name }}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              :collision-padding="8"
              class="w-[max(calc(var(--reka-dropdown-menu-trigger-width)*0.5),224px)]"
            >
              <DropdownMenuGroup v-for="child in category.children" :key="child.id">
                <DropdownMenuSub v-if="child.children" :key="child.id">
                  <DropdownMenuSubTrigger>
                    <Icon v-if="child.icon" :name="child.icon" class="mr-2" />
                    {{ child.name }}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    :collision-padding="8"
                    class="w-[max(calc(var(--reka-dropdown-menu-trigger-width)*0.5),224px)]"
                  >
                    <DropdownMenuItem v-for="subChild in child.children" :key="subChild.id">
                      {{ subChild.name }}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem v-else>
                  {{ child.name }}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<style lang="postcss" scoped></style>
