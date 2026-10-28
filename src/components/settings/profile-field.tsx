import { StyleSheet } from "react-native";
// See SetRow: lets a drag that starts here scroll the list.
import { TextInput } from "react-native-gesture-handler";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  controlHeights,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

type ProfileFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  onEndEditing?: () => void;
  placeholder: string;
  maxLength: number;
  accessibilityLabel: string;
  // Wider for the year than for the day.
  grow?: number;
};

// A short number box of the user settings: the height, or a part of the date.
export function ProfileField({
  value,
  onChangeText,
  onEndEditing,
  placeholder,
  maxLength,
  accessibilityLabel,
  grow = 1,
}: ProfileFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <TextInput
      style={[styles.input, { flex: grow }]}
      value={value}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      keyboardType="number-pad"
      maxLength={maxLength}
      selectTextOnFocus
      placeholder={placeholder}
      placeholderTextColor={colors.disabled}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    input: {
      height: controlHeights.md,
      paddingHorizontal: spacing.xs,
      paddingVertical: 0,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
      textAlign: "center",
      fontSize: fontSizes.body,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
  }),
);
