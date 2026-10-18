import { Alert, Linking } from "react-native";

import { useTranslation } from "@/i18n";

// openURL rejects when no app can handle the link (e.g. no email app), so the
// user gets a message instead of nothing happening.
export function useOpenUrl(): (url: string) => void {
  const { t } = useTranslation();

  return function openUrl(url: string) {
    Linking.openURL(url).catch(() => Alert.alert(t.errors.openUrl));
  };
}
