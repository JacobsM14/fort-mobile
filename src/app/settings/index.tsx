import { router, type Href } from "expo-router";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsRow } from "@/components/settings/settings-row";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { Translations } from "@/i18n/es";
import type { SymbolViewProps } from "expo-symbols";

import { spacing } from "@/constants/theme";

type Section = {
  key: keyof Translations["settings"]["sections"];
  href: Href;
  icon: SymbolViewProps["name"];
};

const SECTIONS: Section[] = [
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
    key: "notifications",
    href: "/settings/notifications",
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

// The notifications come from native modules that only exist on Android.
const VISIBLE_SECTIONS = SECTIONS.filter(
  (section) => section.key !== "notifications" || Platform.OS === "android",
);

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
        {VISIBLE_SECTIONS.map((section) => (
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
