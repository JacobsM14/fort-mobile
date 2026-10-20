import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "@/components/ui/inputs/chip";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { LANGUAGE_PREFERENCES } from "@/constants/enums";
import { spacing } from "@/constants/theme";

export default function PreferencesScreen() {
  const { t, preference, setPreference } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.preferences}
      />
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.settings.language}</Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {LANGUAGE_PREFERENCES.map((option) => (
            <Chip
              key={option}
              role="radio"
              label={t.settings.languageOptions[option]}
              selected={option === preference}
              onPress={() => setPreference(option)}
              style={styles.option}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    alignItems: "center",
  },
});
