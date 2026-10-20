import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  DELETE_SET_WIDTH,
  DeleteSetButton,
} from "@/components/workout/shared/delete-set-button";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { canCompleteSet, formatPreviousSet } from "@/features/workouts/sets";

import type { SetValues, WorkoutSet } from "@/features/workouts/queries";
import type { RepsTrackingType } from "@/features/workouts/sets";
import type { Language } from "@/i18n";
import type { Translations } from "@/i18n/es";

import { formatDecimal, parseDecimal, parseInteger } from "@/utils/number";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type Field = "weight" | "reps";

const FIELDS: Record<RepsTrackingType, readonly Field[]> = {
  weight_reps: ["weight", "reps"],
  bodyweight_reps: ["reps"],
};

// What the inputs hold while typing.
type Texts = Record<Field, string>;

function toTexts(values: SetValues, language: Language): Texts {
  return {
    weight:
      values.weightKg === null ? "" : formatDecimal(values.weightKg, language),
    reps: values.reps === null ? "" : String(values.reps),
  };
}

function toValues(texts: Texts): SetValues {
  return {
    weightKg: parseDecimal(texts.weight),
    reps: parseInteger(texts.reps),
    durationS: null,
    distanceM: null,
  };
}

function getFieldLabels(t: Translations): Record<Field, string> {
  return {
    weight: t.workout.weight,
    reps: t.workout.reps,
  };
}

function valuesKey(values: SetValues) {
  return [values.weightKg, values.reps, values.durationS, values.distanceM]
    .map(String)
    .join("|");
}

type SetHeaderProps = {
  trackingType: RepsTrackingType;
  // Whether the exercise was done before, so there is a last time to show.
  showPrevious: boolean;
};

// Column labels, laid out like the rows below them.
export function SetHeader({ trackingType, showPrevious }: SetHeaderProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const labels = getFieldLabels(t);

  return (
    <View style={styles.row}>
      <Text style={[globalStyles.inputLabel, styles.number]}>
        {t.workout.set}
      </Text>
      {showPrevious && (
        <Text style={[globalStyles.inputLabel, styles.column, styles.label]}>
          {t.workout.previous}
        </Text>
      )}
      {FIELDS[trackingType].map((field) => (
        <Text
          key={field}
          style={[globalStyles.inputLabel, styles.column, styles.label]}
        >
          {labels[field]}
        </Text>
      ))}
      <View style={styles.boxSpace} />
      <View style={styles.deleteSpace} />
    </View>
  );
}

type SetRowProps = {
  number: number;
  set: WorkoutSet;
  trackingType: RepsTrackingType;
  // The set with the same number last time; undefined when it had fewer.
  previous: SetValues | undefined;
  showPrevious: boolean;
  // The set before it isn't done yet, so this one can't be started or done.
  locked: boolean;
  onSave: (values: SetValues) => void;
  onComplete: (values: SetValues) => void;
  onDelete: () => void;
};

export function SetRow({
  number,
  set,
  trackingType,
  previous,
  showPrevious,
  locked,
  onSave,
  onComplete,
  onDelete,
}: SetRowProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const [texts, setTexts] = useState(() => toTexts(set, language));

  // When the saved values change (a field is saved, a set is added), the
  // inputs show them as saved: "62.50" becomes "62,5".
  const savedKey = valuesKey(set);
  const [shownKey, setShownKey] = useState(savedKey);
  if (savedKey !== shownKey) {
    setShownKey(savedKey);
    setTexts(toTexts(set, language));
  }

  const labels = getFieldLabels(t);
  const values = toValues(texts);
  const done = set.completedAt !== null;
  const ready = canCompleteSet(trackingType, values);
  const checkDisabled = done || locked || !ready;
  const previousText =
    previous === undefined
      ? undefined
      : formatPreviousSet(trackingType, previous, language);

  function change(field: Field, text: string) {
    setTexts((current) => ({ ...current, [field]: text }));
  }

  function save() {
    if (done && !ready) {
      setTexts(toTexts(set, language));
    } else if (valuesKey(values) !== savedKey) {
      onSave(values);
    }
  }

  function renderField(field: Field) {
    return (
      <TextInput
        key={field}
        style={[styles.input, styles.column]}
        value={texts[field]}
        onChangeText={(text) => change(field, text)}
        onEndEditing={save}
        keyboardType={field === "reps" ? "number-pad" : "decimal-pad"}
        selectTextOnFocus
        placeholder="0"
        placeholderTextColor={colors.disabled}
        accessibilityLabel={`${t.workout.set} ${number}, ${labels[field]}`}
      />
    );
  }

  const previousLabel = `${t.workout.previous}: ${previousText ?? "-"}`;
  return (
    <View style={styles.row}>
      <Text style={styles.number}>{number}</Text>
      {showPrevious && (
        <Text
          style={[styles.column, styles.previous]}
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityLabel={previousLabel}
        >
          {previousText ?? "-"}
        </Text>
      )}
      {FIELDS[trackingType].map(renderField)}
      <Pressable
        style={({ pressed }) => [
          styles.box,
          styles.checkBox,
          done && styles.boxFilled,
          !done && checkDisabled && styles.boxDisabled,
          pressed && styles.checkPressed,
        ]}
        onPress={() => onComplete(values)}
        disabled={checkDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done, disabled: checkDisabled }}
        accessibilityLabel={t.workout.completeSet(number)}
        accessibilityHint={
          locked && !done ? t.workout.previousSetFirst : undefined
        }
      >
        <SymbolView
          name={{ ios: "checkmark", android: "check", web: "check" }}
          tintColor={done ? colors.onPrimary : colors.primary}
          size={iconSizes.md}
        />
      </Pressable>
      <DeleteSetButton number={number} onPress={onDelete} />
    </View>
  );
}

const BOX_SIZE = 44;

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    // Fits the "SERIE" label above the set numbers.
    number: {
      width: BOX_SIZE,
      textAlign: "center",
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
    column: {
      flex: 1,
    },
    label: {
      textAlign: "center",
    },
    input: {
      height: BOX_SIZE,
      paddingHorizontal: spacing.xs,
      paddingVertical: 0,
      borderRadius: radii.sm,
      textAlign: "center",
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
      // backgroundColor: colors.backgroundSecondary,
      // borderWidth: 1,
      // borderColor: colors.border,
    },
    boxSpace: {
      width: BOX_SIZE,
    },
    deleteSpace: {
      width: DELETE_SET_WIDTH,
    },
    previous: {
      textAlign: "center",
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    box: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radii.sm,
    },
    checkBox: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    boxFilled: {
      backgroundColor: colors.primary,
    },
    boxDisabled: {
      opacity: 0.4,
    },
    checkPressed: {
      opacity: 0.7,
    },
  }),
);
