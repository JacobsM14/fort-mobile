import Constants from "expo-constants";
import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TutorialDialog } from "@/components/onboarding/tutorial-dialog";
import { SettingsRow } from "@/components/settings/settings-row";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useOpenUrl } from "@/hooks/use-open-url";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { APP_NAME, CONTACT_EMAIL, STORE_URLS } from "@/constants/app-info";

import { spacing } from "@/constants/theme";

const storeUrl =
  Platform.OS === "ios" || Platform.OS === "android"
    ? STORE_URLS[Platform.OS]
    : undefined;

export default function AboutScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const openUrl = useOpenUrl();
  const version = Constants.expoConfig?.version ?? "-";
  const [tutorialVisible, setTutorialVisible] = useState(false);

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.about}
      />
      <View style={styles.list}>
        <SettingsRow
          icon={{ ios: "info.circle", android: "info", web: "info" }}
          label={t.about.version}
          value={version}
        />
        <SettingsRow
          icon={{ ios: "envelope", android: "mail", web: "mail" }}
          label={t.about.contact}
          onPress={() => openUrl(`mailto:${CONTACT_EMAIL}`)}
        />
        {storeUrl !== undefined && (
          <SettingsRow
            icon={{ ios: "star", android: "star", web: "star" }}
            label={t.about.rate}
            onPress={() => openUrl(storeUrl)}
          />
        )}
        <SettingsRow
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          label={t.about.tutorial}
          onPress={() => setTutorialVisible(true)}
        />
      </View>
      <Text style={globalStyles.subtitle}>{t.about.disclaimer(APP_NAME)}</Text>
      <TutorialDialog
        visible={tutorialVisible}
        onClose={() => setTutorialVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xs,
  },
});
