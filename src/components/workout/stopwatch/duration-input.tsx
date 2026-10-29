import { useState } from "react";
import { StyleSheet } from "react-native";
// See SetRow: lets a drag that starts here scroll the list.
import { TextInput } from "react-native-gesture-handler";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  cleanDurationDigits,
  digitsFromDuration,
  durationFromDigits,
  formatDurationDigits,
} from "@/utils/duration";

import {
  controlHeights,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

type DurationInputProps = {
  seconds: number | null;
  // Called when the field is left with a new valid time; an empty or zero
  // time goes back to the saved one.
  onSave: (seconds: number) => void;
  accessibilityLabel: string;
};

// A time typed like on a microwave (see utils/duration).
export function DurationInput({
  seconds,
  onSave,
  accessibilityLabel,
}: DurationInputProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [digits, setDigits] = useState(() => digitsFromDuration(seconds));

  // When the saved time changes, the input shows it as saved: "0:90" becomes
  // "1:30".
  const [shownSeconds, setShownSeconds] = useState(seconds);
  if (seconds !== shownSeconds) {
    setShownSeconds(seconds);
    setDigits(digitsFromDuration(seconds));
  }

  function save() {
    const typed = durationFromDigits(digits);
    if (typed !== null && typed > 0 && typed !== seconds) {
      onSave(typed);
    } else {
      setDigits(digitsFromDuration(seconds));
    }
  }

  return (
    <TextInput
      style={styles.input}
      value={digits === "" ? "" : formatDurationDigits(digits)}
      onChangeText={(text) => setDigits(cleanDurationDigits(text))}
      onEndEditing={save}
      keyboardType="number-pad"
      selectTextOnFocus
      placeholder="0:00"
      placeholderTextColor={colors.disabled}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    input: {
      flex: 1,
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
