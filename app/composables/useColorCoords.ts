import Color, {type CoordMeta, type Coords} from "colorjs.io";
import type {SpaceId} from "~/components/color-picker/space";
import type {ColorCoordMeta} from "~/components/color-picker/ColorPickerRoot.vue";

export function createCoordMeta(id: string, meta: CoordMeta): ColorCoordMeta {
    let { name, range } = meta;
    // Default name to id if not provided and append "*" if it's only one character long.
    name = name || id;
    if (name.length === 1) {
        name = name + "*";
    }

    // Use the provided range, fallback to refRange, or default to [0, 100]
    range = range || meta.refRange || [0, 100];
    const [min, max] = range;

    // Calculate step based on the range and cap it at 1
    let step = (max - min) / 100;
    if (step > 1) step = 1;

    // Determine if this coordinate represents a hue (special handling)
    const isHue = id === "h" && meta.type === "angle";

    return { id, name, isHue, min, max, step };
}


export function useColorCoords(spaceId: Ref<SpaceId>, modelValue: Ref<Color>) {
    const coords = computed<Coords>(() => modelValue.value.coords);

    const coordsMeta = computed<ColorCoordMeta[]>(() => {
        const space = Color.Space.get(spaceId.value);
        return Object.entries(space.coords).map(([id, meta]) => createCoordMeta(id, meta));
    });

    function updateCoord(index: number, v: number[] | undefined) {
        if (!v || v.length === 0 || Number.isNaN(v?.[0])) return;
        coords.value[index] = v?.[0] ?? 50;
    }

    return {coords, coordsMeta, updateCoord};
}
