import { useId } from "vue";

export interface ColorPickerConfig {
  layout: "standard" | "compact";
  precision: number;
  inGamut: boolean;
  format: string | undefined;
}

export const useColorPicker = (id?: string) => {
  if (!id) id = useId();
  const state = useState<ColorPickerConfig>(id);

  state.value ??= {
    layout: "standard",
    precision: 5,
    format: undefined,
    inGamut: false
  };

  return state;
};
