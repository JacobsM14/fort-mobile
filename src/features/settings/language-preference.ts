import { LANGUAGE_PREFERENCES } from "@/constants/enums";

import { storedChoice } from "./stored-choice";

const languagePreference = storedChoice(
  "language_preference",
  LANGUAGE_PREFERENCES,
  "system",
);

export const loadLanguagePreference = languagePreference.load;
export const saveLanguagePreference = languagePreference.save;
