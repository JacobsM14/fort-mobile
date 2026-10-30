import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { controlHeights, iconSizes, radii, spacing } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type FilterButtonProps = {
  label: string;
  activeCount: number;
  onPress: () => void;
};

export function FilterButton({
  label,
  activeCount,
  onPress,
}: FilterButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const active = activeCount > 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        active && styles.buttonActive,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={active ? `${label} · ${activeCount}` : label}
    >
      <SymbolView
        name={{
          ios: "line.3.horizontal.decrease",
          android: "filter_list",
          web: "filter_list",
        }}
        tintColor={active ? colors.onPrimary : colors.text}
        size={iconSizes.sm}
      />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    // Same height and box as SearchInput, which it sits next to.
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      height: controlHeights.lg,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.xs,
    },
    buttonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    buttonPressed: {
      opacity: 0.85,
    },
  }),
);
