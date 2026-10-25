import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import type { DistanceUnit } from "@/constants/enums";
import type { Language } from "@/i18n";

import { formatDecimal, parseDecimal } from "@/utils/number";
import { distanceFromUnit, distanceToUnit } from "@/utils/units";

import {
  fontsJetBrainsMono,
  fontSizes,
  radii,
  spacing,
} from "@/constants/theme";

type DistanceInputProps = {
  meters: number | null;
  // Called when the field is left with a new valid distance; an empty or zero
  // distance goes back to the saved one.
  onSave: (meters: number) => void;
  accessibilityLabel: string;
};

function toText(meters: number | null, unit: DistanceUnit, language: Language) {
  return meters === null
    ? ""
    : formatDecimal(distanceToUnit(meters, unit), language);
}

// Typed in km or miles, saved in meters. Empty until typed, since the
// stopwatch only knows the time: it stands out so it isn't forgotten.
export function DistanceInput({
  meters,
  onSave,
  accessibilityLabel,
}: DistanceInputProps) {
  const { language } = useTranslation();
  const { colors } = useTheme();
  const { distance: unit } = useUnits();
  const styles = useStyles();
  const savedText = toText(meters, unit, language);
  const [text, setText] = useState(savedText);

  const [shownKey, setShownKey] = useState(`${unit}|${meters}`);
  if (`${unit}|${meters}` !== shownKey) {
    setShownKey(`${unit}|${meters}`);
    setText(savedText);
  }

  // Left as shown, it keeps the saved meters instead of the rounded miles
  // converted back.
  function save() {
    const value = parseDecimal(text);
    const typed = value === null ? null : distanceFromUnit(value, unit);
    if (text !== savedText && typed !== null && typed > 0) {
      onSave(typed);
    } else {
      setText(savedText);
    }
  }

  return (
    <TextInput
      style={[styles.input, meters === null && styles.missing]}
      value={text}
      onChangeText={setText}
      onEndEditing={save}
      keyboardType="decimal-pad"
      selectTextOnFocus
      // Lets a drag that starts here scroll the list (see SetRow).
      scrollEnabled={false}
      placeholder={unit}
      placeholderTextColor={colors.disabled}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    input: {
      flex: 1,
      height: 44,
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
    missing: {
      borderColor: colors.primary,
    },
  }),
);
