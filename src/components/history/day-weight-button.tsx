import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DASHED_BUTTON_HEIGHT } from "@/components/ui/buttons/dashed-button";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import {
  formatBodyWeight,
  formatBodyWeightValue,
  formatWeightChange,
} from "@/features/body/format";

import type { BodyWeightWithChange } from "@/features/body/queries";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type DayWeightButtonProps = {
  // Without one the day has no weigh-in yet and the button invites to log it.
  weight?: BodyWeightWithChange;
  onPress: () => void;
};

export function DayWeightButton({ weight, onPress }: DayWeightButtonProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const units = useUnits();
  const styles = useStyles();
  const press = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        weight === undefined ? styles.emptyButton : styles.loggedButton,
        pressed && styles.pressedButton,
      ]}
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={
        weight === undefined
          ? `${t.history.noWeighIn}, ${t.history.logWeight}`
          : [
              formatBodyWeight(weight.weightKg, units, language),
              weight.changeKg === null
                ? null
                : formatWeightChange(weight.changeKg, units, language),
            ]
              .filter((part) => part !== null)
              .join(", ")
      }
    >
      {({ pressed }) => (
        <>
          <SymbolView
            name={{ ios: "scalemass", android: "weight", web: "weight" }}
            tintColor={colors.text}
            size={iconSizes.md}
          />
          {weight === undefined ? (
            <>
              <Text style={styles.label}>{t.history.noWeighIn}</Text>
              <View style={styles.register}>
                <SymbolView
                  name={{ ios: "plus", android: "add", web: "add" }}
                  tintColor={colors.primary}
                  size={iconSizes.sm}
                />
                <Text style={styles.registerLabel}>{t.history.logWeight}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.values}>
                <Text style={styles.value}>
                  {formatBodyWeightValue(weight.weightKg, units, language)}
                </Text>
                <Text style={styles.unit}>{units.weight}</Text>
              </View>
              {weight.changeKg !== null && (
                <Text style={styles.change}>
                  {formatWeightChange(weight.changeKg, units, language)}
                </Text>
              )}
              <View style={styles.spacer} />
              <SymbolView
                name={{
                  ios: "chevron.right",
                  android: "chevron_right",
                  web: "chevron_right",
                }}
                tintColor={pressed ? colors.primary : colors.disabled}
                size={iconSizes.md}
              />
            </>
          )}
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: DASHED_BUTTON_HEIGHT,
      paddingHorizontal: spacing.md,
      borderWidth: 1.5,
      borderRadius: radii.xs,
    },
    emptyButton: {
      borderStyle: "dashed",
      borderColor: colors.disabled,
    },
    loggedButton: {
      // Always set: the button turns logged after a save, and a dashed border
      // left out of the style isn't reset back to solid.
      borderStyle: "solid",
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },
    pressedButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryTint,
    },
    label: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
    register: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    registerLabel: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.bold,
      color: colors.primary,
    },
    values: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.xs,
    },
    value: {
      fontSize: fontSizes.lead,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    unit: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    change: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    spacer: {
      flex: 1,
    },
  }),
);
