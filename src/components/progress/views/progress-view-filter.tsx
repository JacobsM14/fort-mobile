import { Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { PROGRESS_VIEWS } from "@/features/progress/views";

import type { ProgressView } from "@/features/progress/views";

import {
  controlHeights,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

type ProgressViewFilterProps = {
  value: ProgressView;
  onChange: (view: ProgressView) => void;
};

export function ProgressViewFilter({
  value,
  onChange,
}: ProgressViewFilterProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {PROGRESS_VIEWS.map((view) => {
        const selected = view === value;
        return (
          <Pressable
            key={view}
            style={({ pressed }) => [
              styles.option,
              selected && styles.optionSelected,
              pressed && !selected && styles.optionPressed,
            ]}
            onPress={() => onChange(view)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={t.progress.views[view].label}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {t.progress.views[view].short}
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
