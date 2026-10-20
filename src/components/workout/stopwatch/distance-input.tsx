import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { Language } from "@/i18n";

import { formatDecimal, parseDecimal } from "@/utils/number";

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

function toKmText(meters: number | null, language: Language) {
  return meters === null ? "" : formatDecimal(meters / 1000, language);
}

// Typed in km, saved in meters. Empty until typed, since the stopwatch only
// knows the time: it stands out so it isn't forgotten.
export function DistanceInput({
  meters,
  onSave,
  accessibilityLabel,
}: DistanceInputProps) {
  const { language } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const [text, setText] = useState(() => toKmText(meters, language));

  const [shownMeters, setShownMeters] = useState(meters);
  if (meters !== shownMeters) {
    setShownMeters(meters);
    setText(toKmText(meters, language));
  }

  function save() {
    const km = parseDecimal(text);
    const typed = km === null ? null : Math.round(km * 1000);
    if (typed !== null && typed > 0 && typed !== meters) {
      onSave(typed);
    } else {
      setText(toKmText(meters, language));
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
      placeholder="km"
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
