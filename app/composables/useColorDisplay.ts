import Color from "colorjs.io";
import type {ColorSpace} from "colorjs.io/fn";
import type {ColorPickerConfig} from "~/composables/useColorPicker";

export function useColorDisplay(
    color: Ref<Color>,
    space: Ref<ColorSpace>,
    config: Ref<ColorPickerConfig>
) {
    const formats = computed<string[]>(() => {
        const formats = space.value.formats
        return Object.keys(formats).filter((format) => format !== 'keyword')
    })

    const serializedColor = computed(() =>
        color.value
            .display({
                precision: config.value.precision,
                format: config.value.format,
                inGamut: config.value.inGamut
            })
    )

    const displayColor = computed(() => {
        return serializedColor.value + ''
    })

    return {formats, serializedColor,displayColor}
}