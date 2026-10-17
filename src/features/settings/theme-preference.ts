import Storage from "expo-sqlite/kv-store";

import { THEME_PREFERENCES, type ThemePreference } from "@/constants/enums";

const KEY = "theme_preference";

function isThemePreference(value: string | null): value is ThemePreference {
  return THEME_PREFERENCES.some((preference) => preference === value);
}

export function loadThemePreference(): ThemePreference {
  const stored = Storage.getItemSync(KEY);
  return isThemePreference(stored) ? stored : "system";
}

export function saveThemePreference(preference: ThemePreference) {
  Storage.setItemSync(KEY, preference);
}
