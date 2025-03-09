// coords, spaceId, gamutHint);
import type {Coords} from "colorjs.io";
import type {SpaceId} from "~/components/color-picker/space";
import type {ColorCoordMeta} from "~/components/color-picker/ColorPickerRoot.vue";

export function useGamutPaths(
    coords: Ref<Coords>,
    spaceId: Ref<SpaceId>,
    gamutHint: Ref<'srgb'>
) {

}