import Storage from "expo-sqlite/kv-store";

import { ACCENT_COLORS, type AccentColor } from "@/constants/enums";

const KEY = "accent_color";

function isAccentColor(value: string | null): value is AccentColor {
  return ACCENT_COLORS.some((accent) => accent === value);
}

export function loadAccentColor(): AccentColor {
  const stored = Storage.getItemSync(KEY);
  return isAccentColor(stored) ? stored : "orange";
}

export function saveAccentColor(accent: AccentColor) {
  Storage.setItemSync(KEY, accent);
}
