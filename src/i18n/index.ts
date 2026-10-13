import { useLocales } from "expo-localization";

import { en } from "./en";
import { es, type Translations } from "./es";

const translations = { es, en } satisfies Record<string, Translations>;

export type Language = keyof typeof translations;

const fallbackLanguage: Language = "en";

function isSupported(code: string | null): code is Language {
  return code !== null && code in translations;
}

export function useTranslation() {
  const [locale] = useLocales();
  const language = isSupported(locale.languageCode)
    ? locale.languageCode
    : fallbackLanguage;

  return { t: translations[language], language };
}
