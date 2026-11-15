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
  grow?: number;
  decimal?: boolean;
};

export function ProfileField({
  value,
  onChangeText,
  onEndEditing,
  placeholder,
  maxLength,
  accessibilityLabel,
  grow = 1,
  decimal = false,
}: ProfileFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <TextInput
      style={[styles.input, { flex: grow }]}
      value={value}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      keyboardType={decimal ? "decimal-pad" : "number-pad"}
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
      borderRadius: radii.xs,
      textAlign: "center",
      fontSize: fontSizes.body,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
  }),
);
