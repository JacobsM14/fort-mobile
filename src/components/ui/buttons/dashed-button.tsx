import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

// So a button beside it can match its height.
export const DASHED_BUTTON_HEIGHT = 56;

type DashedButtonProps = {
  label: string;
  onPress: () => void;
  icon?: SymbolViewProps["name"];
  tone?: "primary" | "muted";
  // Shorter, for a secondary action tucked between other content.
  compact?: boolean;
};

export function DashedButton({
  label,
  onPress,
  icon,
  tone = "primary",
  compact = false,
}: DashedButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        {
          borderColor:
            pressed || tone === "primary" ? colors.primary : colors.disabled,
        },
        pressed && styles.buttonPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
    >
      {({ pressed }) => {
        const color =
          pressed || tone === "primary" ? colors.primary : colors.disabled;
        return (
          <>
            {icon !== undefined && (
              <SymbolView name={icon} tintColor={color} size={iconSizes.md} />
            )}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </>
        );
      }}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      width: "100%",
      minHeight: DASHED_BUTTON_HEIGHT,
      borderRadius: radii.xs,
      borderWidth: 1.5,
      borderStyle: "dashed",
    },
    buttonCompact: {
      minHeight: controlHeights.md,
    },
    buttonPressed: {
      backgroundColor: colors.backgroundSecondary,
    },
    label: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.bold,
    },
  }),
);
