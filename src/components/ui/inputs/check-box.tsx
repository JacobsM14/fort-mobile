import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { controlHeights, iconSizes, radii } from "@/constants/theme";

const CHECKMARK: SymbolViewProps["name"] = {
  ios: "checkmark",
  android: "check",
  web: "check",
};

type CheckBoxProps = {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  // What tapping does while unchecked, such as a plus to add; the checkmark
  // in the accent by default.
  uncheckedIcon?: SymbolViewProps["name"];
  disabled?: boolean;
};

export function CheckBox({
  checked,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  uncheckedIcon = CHECKMARK,
  disabled = false,
}: CheckBoxProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.box,
        checked && styles.boxChecked,
        // A checked box that can't be unchecked keeps its full color.
        disabled && !checked && styles.boxDisabled,
        pressed && styles.boxPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <SymbolView
        name={checked ? CHECKMARK : uncheckedIcon}
        tintColor={checked ? colors.onPrimary : colors.primary}
        size={iconSizes.md}
      />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      width: controlHeights.md,
      height: controlHeights.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
    },
    boxChecked: {
      backgroundColor: colors.primary,
    },
    boxDisabled: {
      opacity: 0.4,
    },
    boxPressed: {
      opacity: 0.7,
    },
  }),
);
