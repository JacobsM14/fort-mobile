import { THEME_PREFERENCES } from "@/constants/enums";

import { storedChoice } from "./stored-choice";

const themePreference = storedChoice(
  "theme_preference",
  THEME_PREFERENCES,
  "system",
);

export const loadThemePreference = themePreference.load;
export const saveThemePreference = themePreference.save;
