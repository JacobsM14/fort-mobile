import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIconFields } from "@/components/settings/app-icon-fields";
import { AppearanceFields } from "@/components/settings/appearance-fields";
import { Chip } from "@/components/ui/inputs/chip";
import { SelectField } from "@/components/ui/inputs/select-field";
import { BackHeader } from "@/components/ui/layout/back-header";
import { OptionsSheet } from "@/components/ui/overlays/options-sheet";

import { useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import {
  DISTANCE_UNIT_PREFERENCES,
  LANGUAGE_PREFERENCES,
  WEIGHT_UNIT_PREFERENCES,
} from "@/constants/enums";

import { spacing } from "@/constants/theme";

export default function PreferencesScreen() {
  const {
    t,
    preference: languagePreference,
    setPreference: setLanguagePreference,
  } = useTranslation();
  const { globalStyles } = useTheme();
  const {
    weightPreference,
    distancePreference,
    setWeightPreference,
    setDistancePreference,
  } = useUnits();

  const [languageOpen, setLanguageOpen] = useState(false);
  const languageOptions = LANGUAGE_PREFERENCES.map((option) => ({
    value: option,
    label: t.settings.languageOptions[option],
  }));

  function unitLabel(option: string) {
    return option === "system" ? t.settings.units.system : option;
  }

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.preferences}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SelectField
          label={t.settings.language}
          valueLabel={t.settings.languageOptions[languagePreference]}
          open={languageOpen}
          onPress={() => setLanguageOpen(true)}
        />
        <View style={styles.units}>
          <View style={[globalStyles.formCage, styles.unitGroup]}>
            <Text style={globalStyles.inputLabel}>
              {t.settings.units.weight}
            </Text>
            <View style={styles.unitOptions} accessibilityRole="radiogroup">
              {WEIGHT_UNIT_PREFERENCES.map((option) => (
                <Chip
                  key={option}
                  role="radio"
                  label={unitLabel(option)}
                  selected={option === weightPreference}
                  onPress={() => setWeightPreference(option)}
                  style={[styles.option, styles.compactOption]}
                />
              ))}
            </View>
          </View>
          <View style={[globalStyles.formCage, styles.unitGroup]}>
            <Text style={globalStyles.inputLabel}>
              {t.settings.units.distance}
            </Text>
            <View style={styles.unitOptions} accessibilityRole="radiogroup">
              {DISTANCE_UNIT_PREFERENCES.map((option) => (
                <Chip
                  key={option}
                  role="radio"
                  label={unitLabel(option)}
                  selected={option === distancePreference}
                  onPress={() => setDistancePreference(option)}
                  style={[styles.option, styles.compactOption]}
                />
              ))}
            </View>
          </View>
        </View>
        <AppearanceFields />
        {Platform.OS === "android" && <AppIconFields />}
      </ScrollView>
      <OptionsSheet
        visible={languageOpen}
        title={t.settings.language}
        closeLabel={t.settings.closeLanguage}
        options={languageOptions}
        value={languagePreference}
        onSelect={setLanguagePreference}
        onClose={() => setLanguageOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  option: {
    flex: 1,
    alignItems: "center",
  },
  units: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  unitGroup: {
    flex: 1,
  },
  // Three chips fit in half the width only with a tighter gap and padding.
  unitOptions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  // For chips short on room, in half the width.
  compactOption: {
    paddingHorizontal: spacing.xs,
  },
});
