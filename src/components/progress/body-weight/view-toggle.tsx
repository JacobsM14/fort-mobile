import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  controlHeights,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

export type WeightView = "chart" | "list";

const VIEWS: readonly WeightView[] = ["chart", "list"];

const ICONS: Record<WeightView, SymbolViewProps["name"]> = {
  chart: {
    ios: "chart.xyaxis.line",
    android: "trending_down",
    web: "show_chart",
  },
  list: {
    ios: "list.bullet",
    android: "format_list_bulleted",
    web: "format_list_bulleted",
  },
};

type ViewToggleProps = {
  value: WeightView;
  onChange: (view: WeightView) => void;
};

// Whether the weights are read as a chart or as a list.
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {VIEWS.map((view) => {
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
          >
            {({ pressed }) => (
              <>
                <SymbolView
                  name={ICONS[view]}
                  tintColor={
                    selected
                      ? colors.background
                      : pressed
                        ? colors.primary
                        : colors.disabled
                  }
                  size={iconSizes.sm}
                />
                <Text style={[styles.text, selected && styles.textSelected]}>
                  {t.progress.weightViews[view]}
                </Text>
              </>
            )}
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
    },
    option: {
      flex: 1,
      height: controlHeights.sm,
      flexDirection: "row",
      gap: spacing.sm,
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
