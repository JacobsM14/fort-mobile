import Storage from "expo-sqlite/kv-store";

import {
  LANGUAGE_PREFERENCES,
  type LanguagePreference,
} from "@/constants/enums";

const KEY = "language_preference";

function isLanguagePreference(
  value: string | null,
): value is LanguagePreference {
  return LANGUAGE_PREFERENCES.some((preference) => preference === value);
}

export function loadLanguagePreference(): LanguagePreference {
  const stored = Storage.getItemSync(KEY);
  return isLanguagePreference(stored) ? stored : "system";
}

export function saveLanguagePreference(preference: LanguagePreference) {
  Storage.setItemSync(KEY, preference);
}
