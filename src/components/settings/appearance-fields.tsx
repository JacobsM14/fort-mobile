import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Chip } from "@/components/ui/inputs/chip";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  ACCENT_COLORS,
  THEME_PREFERENCES,
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

const SWATCH_SIZE = 40;

// Returns two sibling fields so the parent's gap spaces them like the rest
// of its fields.
export function AppearanceFields() {
  const { t } = useTranslation();
  const { globalStyles, scheme, preference, setPreference, accent, setAccent } =
    useTheme();
  const styles = useStyles();

  return (
    <>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.settings.appearance}</Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {THEME_PREFERENCES.map((option) => (
            <Chip
              key={option}
              role="radio"
              label={t.settings.themeOptions[option]}
              icon={THEME_ICONS[option]}
              selected={option === preference}
              onPress={() => setPreference(option)}
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
    </>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    options: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    option: {
      flex: 1,
      alignItems: "center",
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
