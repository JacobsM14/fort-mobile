import { Pressable, StyleSheet, Text } from "react-native";

import { fontsInstrument } from "@/constants/theme";
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

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
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
      height: 64,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    label: {
      fontSize: 17,
      fontFamily: fontsInstrument.bold,
      color: colors.onPrimary,
    },
  }),
);
