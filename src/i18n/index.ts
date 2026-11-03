import { useLocales } from "expo-localization";

import { useLanguagePreference } from "@/hooks/use-language";

import { ca } from "./ca";
import { en } from "./en";
import { es, type Translations } from "./es";
import { eu } from "./eu";
import { fr } from "./fr";
import { pt } from "./pt";

const translations = { es, en, fr, ca, eu, pt } satisfies Record<
  string,
  Translations
>;

export type Language = keyof typeof translations;

const fallbackLanguage: Language = "en";

function isSupported(code: string | null): code is Language {
  return code !== null && code in translations;
}

export function useTranslation() {
  const { preference, setPreference } = useLanguagePreference();
  const [locale] = useLocales();
  const language: Language =
    preference !== "system"
      ? preference
      : isSupported(locale.languageCode)
        ? locale.languageCode
        : fallbackLanguage;

  return { t: translations[language], language, preference, setPreference };
}
