import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "@/components/ui/inputs/chip";
import { BackHeader } from "@/components/ui/layout/back-header";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  ACCENT_COLORS,
  LANGUAGE_PREFERENCES,
  THEME_PREFERENCES,
} from "@/constants/enums";
import { accentColors, iconSizes, spacing } from "@/constants/theme";

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
  const styles = useStyles();

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
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>{t.settings.language}</Text>
          <View style={styles.options} accessibilityRole="radiogroup">
            {LANGUAGE_PREFERENCES.map((option) => (
              <Chip
                key={option}
                role="radio"
                label={t.settings.languageOptions[option]}
                selected={option === languagePreference}
                onPress={() => setLanguagePreference(option)}
                style={styles.option}
              />
            ))}
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
                selected={option === themePreference}
                onPress={() => setThemePreference(option)}
                style={styles.option}
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
