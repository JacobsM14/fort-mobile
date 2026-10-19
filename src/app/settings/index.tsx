import { router, type Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsRow } from "@/components/settings/settings-row";
import { BackHeader } from "@/components/ui/layout/back-header";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import type { Translations } from "@/i18n/es";

type Section = {
  key: keyof Translations["settings"]["sections"];
  href: Href;
  icon: SymbolViewProps["name"];
};

const SECTIONS: Section[] = [
  {
    key: "themes",
    href: "/settings/themes",
    icon: { ios: "paintpalette", android: "palette", web: "palette" },
  },
  {
    key: "user",
    href: "/settings/user",
    icon: { ios: "person", android: "person", web: "person" },
  },
  {
    key: "preferences",
    href: "/settings/preferences",
    icon: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
  },
  {
    key: "exercises",
    href: "/settings/exercises",
    icon: {
      ios: "dumbbell",
      android: "fitness_center",
      web: "fitness_center",
    },
  },
  {
    key: "permissions",
    href: "/settings/permissions",
    icon: {
      ios: "bell.badge",
      android: "notifications",
      web: "notifications",
    },
  },
  {
    key: "data",
    href: "/settings/data",
    icon: {
      ios: "arrow.up.arrow.down",
      android: "swap_vert",
      web: "swap_vert",
    },
  },
  {
    key: "privacy",
    href: "/settings/privacy",
    icon: { ios: "lock.shield", android: "shield", web: "shield" },
  },
  {
    key: "about",
    href: "/settings/about",
    icon: { ios: "info.circle", android: "info", web: "info" },
  },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader backLabel={t.settings.breadCrumb} title={t.settings.title} />
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <SettingsRow
            key={section.key}
            icon={section.icon}
            label={t.settings.sections[section.key]}
            onPress={() => router.push(section.href)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xs,
  },
});
