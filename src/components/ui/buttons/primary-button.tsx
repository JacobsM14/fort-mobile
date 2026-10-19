import { Pressable, StyleSheet, Text } from "react-native";

import { fontsInstrument, fontSizes, radii } from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles } from "@/hooks/use-theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: 64,
      borderRadius: radii.sm,
      backgroundColor: colors.primary,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    label: {
      fontSize: fontSizes.button,
      fontFamily: fontsInstrument.bold,
      color: colors.onPrimary,
    },
  }),
);
