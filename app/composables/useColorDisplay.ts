import Color from "colorjs.io";
import type {ColorSpace} from "colorjs.io/fn";
import type {ColorPickerOptions} from "~/components/color-picker/ColorPickerRoot.vue";

export function useColorDisplay(
    color: Ref<Color>,
    space: Ref<ColorSpace>,
    options: Ref<ColorPickerOptions>
) {
    const formats = computed<string[]>(() => {
        const formats = space.value.formats
        return Object.keys(formats).filter((format) => format !== 'keyword')
    })

    const serializedColor = computed(() =>
        color.value.display({
                precision: options.value.precision,
                format: options.value.format,
                inGamut: options.value.inGamut
        }).toString()
    )

    watch(formats, (v) => {
        const [first] = v as [string, ...string[]]
        options.value.format = first
    }, {immediate: true})


    return {formats, serializedColor}
}