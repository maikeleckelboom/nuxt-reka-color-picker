import Color, { type Coords } from "colorjs.io";
import type { ColorCoordMeta } from "~/composables/useColorGradient";
import type {SpaceId} from "~/components/utils";

export function useColorCoords(spaceId: Ref<SpaceId>, modelValue: Ref<Color>) {
  const coords = computed<Coords>(() => modelValue.value.coords);

  const coordsMeta = computed<ColorCoordMeta[]>(() => {
    const space = Color.Space.get(spaceId.value);
    return Object.entries(space.coords).map(([id, meta]) => {
      let { name, range } = meta;
      name = name || id;
      name.length === 1 && (name = name + "*");
      range = range || meta.refRange || [0, 100];
      const [min, max] = range;
      let step = (max - min) / 100;
      if (step > 1) step = 1;
      const isHue = id === "h" && meta.type === "angle";
      return { id, name, isHue, min, max, step };
    });
  });

  function updateCoord(index: number, v: number[] | undefined) {
    coords.value[index] = v?.[0] ?? 50;
  }

  return { coords, coordsMeta, updateCoord };
}
