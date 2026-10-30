import { Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { PROGRESS_RANGES } from "@/features/progress/ranges";

import type { ProgressRange } from "@/features/progress/ranges";

import {
  controlHeights,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

type RangeFilterProps = {
  value: ProgressRange;
  onChange: (range: ProgressRange) => void;
};

// How far back the statistics look.
export function RangeFilter({ value, onChange }: RangeFilterProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {PROGRESS_RANGES.map((range) => {
        const selected = range === value;
        return (
          <Pressable
            key={range}
            style={({ pressed }) => [
              styles.option,
              selected && styles.optionSelected,
              pressed && !selected && styles.optionPressed,
            ]}
            onPress={() => onChange(range)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={t.progress.ranges[range].label}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {t.progress.ranges[range].short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: spacing.sm,
    },
    option: {
      flex: 1,
      height: controlHeights.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.disabled,
      borderRadius: radii.xs,
    },
    optionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    optionPressed: {
      borderColor: colors.primary,
    },
    text: {
      fontSize: fontSizes.footnote,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.disabled,
    },
    textSelected: {
      color: colors.background,
    },
  }),
);
