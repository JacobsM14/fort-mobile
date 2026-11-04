import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "@/components/ui/inputs/chip";
import { SelectField } from "@/components/ui/inputs/select-field";
import { BackHeader } from "@/components/ui/layout/back-header";
import { OptionsSheet } from "@/components/ui/overlays/options-sheet";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import {
  ACCENT_COLORS,
  DISTANCE_UNIT_PREFERENCES,
  LANGUAGE_PREFERENCES,
  THEME_PREFERENCES,
  WEIGHT_UNIT_PREFERENCES,
  type ThemePreference,
} from "@/constants/enums";

import { accentColors, iconSizes, spacing } from "@/constants/theme";

const THEME_ICONS: Record<ThemePreference, SymbolViewProps["name"]> = {
  system: {
    ios: "circle.lefthalf.filled",
    android: "contrast",
    web: "contrast",
  },
  light: { ios: "sun.max", android: "light_mode", web: "light_mode" },
  dark: { ios: "moon", android: "dark_mode", web: "dark_mode" },
};

export default function PreferencesScreen() {
  const {
    t,
    preference: languagePreference,
    setPreference: setLanguagePreference,
  } = useTranslation();
  const {
    globalStyles,
    scheme,
    preference: themePreference,
    setPreference: setThemePreference,
    accent,
    setAccent,
  } = useTheme();
  const {
    weightPreference,
    distancePreference,
    setWeightPreference,
    setDistancePreference,
  } = useUnits();
  const styles = useStyles();
  // The list is drawn here, outside the ScrollView, so it covers the screen.
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageOptions = LANGUAGE_PREFERENCES.map((option) => ({
    value: option,
    label: t.settings.languageOptions[option],
  }));

  // Unit symbols read the same in every language; only "system" is
  // translated.
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
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>{t.settings.appearance}</Text>
          <View style={styles.options} accessibilityRole="radiogroup">
            {THEME_PREFERENCES.map((option) => (
              <Chip
                key={option}
                role="radio"
                label={t.settings.themeOptions[option]}
                icon={THEME_ICONS[option]}
                selected={option === themePreference}
                onPress={() => setThemePreference(option)}
                style={[styles.option, styles.compactOption]}
              />
            ))}
          </View>
        </View>
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>{t.settings.accent.label}</Text>
          <View style={styles.swatches} accessibilityRole="radiogroup">
            {ACCENT_COLORS.map((option) => {
              const selected = option === accent;
              const shades = accentColors[option][scheme];
              return (
                <Pressable
                  key={option}
                  style={[
                    styles.swatchRing,
                    selected && styles.swatchRingSelected,
                  ]}
                  onPress={() => setAccent(option)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={t.settings.accent.names[option]}
                >
                  <View
                    style={[styles.swatch, { backgroundColor: shades.primary }]}
                  >
                    {selected && (
                      <SymbolView
                        name={{
                          ios: "checkmark",
                          android: "check",
                          web: "check",
                        }}
                        tintColor={shades.onPrimary}
                        size={iconSizes.sm}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
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

const SWATCH_SIZE = 40;

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
    },
    options: {
      flexDirection: "row",
      gap: spacing.sm,
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
    // For chips short on room: in half the width, or with an icon.
    compactOption: {
      paddingHorizontal: spacing.xs,
    },
    swatches: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    swatchRing: {
      padding: spacing.xs,
      borderWidth: 2,
      borderColor: "transparent",
      borderRadius: SWATCH_SIZE,
    },
    swatchRingSelected: {
      borderColor: colors.text,
    },
    swatch: {
      width: SWATCH_SIZE,
      height: SWATCH_SIZE,
      borderRadius: SWATCH_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);
