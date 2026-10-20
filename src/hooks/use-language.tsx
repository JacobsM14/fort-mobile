import { createContext, use, useState, type ReactNode } from "react";

import {
  loadLanguagePreference,
  saveLanguagePreference,
} from "@/features/settings/language-preference";

import type { LanguagePreference } from "@/constants/enums";

type LanguageContextValue = {
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// The language picked in the settings. "system" follows the device; the
// language actually shown is resolved in useTranslation (src/i18n).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(loadLanguagePreference);

  function setPreference(next: LanguagePreference) {
    saveLanguagePreference(next);
    setPreferenceState(next);
  }

  return (
    <LanguageContext value={{ preference, setPreference }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguagePreference(): LanguageContextValue {
  const context = use(LanguageContext);
  if (context === null) {
    throw new Error(
      "useLanguagePreference must be used inside LanguageProvider",
    );
  }
  return context;
}
