import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { formatDecimal, parseDecimal } from "@/utils/number";
import { weightFromUnit, weightToUnit } from "@/utils/units";

import {
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const STEP = 0.1;
// Exported so another button can match it.
export const ENTRY_BUTTON_SIZE = 52;
const MIN_INPUT_WIDTH = 60;
const MAX_INPUT_WIDTH = 150;
const CHAR_WIDTH = fontSizes.entry * 0.6;

type BodyWeightEntryProps = {
  initialKg: number;
  // The weight already saved for the day, if any.
  savedKg?: number;
  onSave: (kg: number) => void;
};

// Two layers: the weight with its - and + buttons, and the button that saves it.
// Typed and stepped in the user's unit, saved in kg.
export function BodyWeightEntry({
  initialKg,
  savedKg,
  onSave,
}: BodyWeightEntryProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const units = useUnits();
  const styles = useStyles();

  const [text, setText] = useState(() =>
    formatDecimal(round(weightToUnit(initialKg, units.weight)), language),
  );
  const value = parseDecimal(text);
  // Compared as shown (a tenth), so a saved 72.44 kg isn't "changed" by the
  // 72.4 the input starts with.
  const unchanged =
    savedKg !== undefined &&
    value !== null &&
    round(value) === round(weightToUnit(savedKg, units.weight));

  function step(delta: number) {
    const next = Math.max(0, round((value ?? 0) + delta));
    setText(formatDecimal(next, language));
  }

  function save() {
    if (value !== null && value > 0) {
      onSave(weightFromUnit(value, units.weight));
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.entry}>
        <StepButton
          symbol="-"
          label={t.progress.decreaseWeight}
          onPress={() => step(-STEP)}
        />
        <View style={styles.valueRow}>
          <TextInput
            style={[styles.input, { width: inputWidth(text) }]}
            value={text}
            onChangeText={setText}
            keyboardType="decimal-pad"
            selectTextOnFocus
            selectionColor={colors.primary}
            accessibilityLabel={t.progress.weightInput}
          />
          <Text style={styles.unit}>{units.weight}</Text>
        </View>
        <StepButton
          symbol="+"
          label={t.progress.increaseWeight}
          onPress={() => step(STEP)}
        />
      </View>
      <PrimaryButton
        label={unchanged ? t.progress.weightSaved : t.progress.saveWeight}
        onPress={save}
        disabled={value === null || value <= 0 || unchanged}
        style={styles.save}
      />
    </View>
  );
}

// A TextInput doesn't size itself to its text, so it is worked out from the
// number of characters, within a min and a max.
function inputWidth(text: string) {
  return Math.min(
    MAX_INPUT_WIDTH,
    Math.max(MIN_INPUT_WIDTH, Math.ceil(text.length * CHAR_WIDTH)),
  );
}

// One decimal, which also hides the float noise of repeated steps.
function round(value: number) {
  return Math.round(value * 10) / 10;
}

type StepButtonProps = {
  symbol: string;
  label: string;
  onPress: () => void;
};

function StepButton({ symbol, label, onPress }: StepButtonProps) {
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [styles.step, pressed && styles.stepPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.stepSymbol}>{symbol}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: spacing.md,
    },
    entry: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    valueRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.xs,
    },
    input: {
      padding: 0,
      textAlign: "right",
      fontSize: fontSizes.entry,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    unit: {
      fontSize: fontSizes.detail,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    step: {
      alignItems: "center",
      justifyContent: "center",
      width: ENTRY_BUTTON_SIZE,
      height: ENTRY_BUTTON_SIZE,
      borderWidth: 1,
      borderColor: colors.disabled,
      borderRadius: radii.sm,
    },
    save: {
      minHeight: ENTRY_BUTTON_SIZE,
    },
    stepPressed: {
      opacity: 0.6,
    },
    stepSymbol: {
      fontSize: fontSizes.stepper,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
  }),
);
