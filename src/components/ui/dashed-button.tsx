import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import { fontsInstrument, spacing } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type DashedButtonProps = {
  label: string;
  onPress: () => void;
  icon?: SymbolViewProps["name"];
  tone?: "primary" | "muted";
};

export function DashedButton({
  label,
  onPress,
  icon,
  tone = "primary",
}: DashedButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          borderColor:
            pressed || tone === "primary" ? colors.primary : colors.disabled,
        },
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      {({ pressed }) => {
        const color =
          pressed || tone === "primary" ? colors.primary : colors.disabled;
        return (
          <>
            {icon !== undefined && (
              <SymbolView name={icon} tintColor={color} size={20} />
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
      height: 56,
      borderRadius: 2,
      borderWidth: 1.5,
      borderStyle: "dashed",
    },
    buttonPressed: {
      backgroundColor: colors.backgroundSecondary,
    },
    label: {
      fontSize: 16,
      fontFamily: fontsInstrument.bold,
    },
  }),
);
