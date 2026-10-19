import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  DELETE_SET_WIDTH,
  DeleteSetButton,
} from "@/components/workout/shared/delete-set-button";
import { ElapsedTime } from "@/components/workout/shared/elapsed-time";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { canCompleteSet, formatPreviousSet } from "@/features/workouts/sets";

import type { TrackingType } from "@/constants/enums";
import type { SetValues, WorkoutSet } from "@/features/workouts/queries";
import type { Language } from "@/i18n";
import type { Translations } from "@/i18n/es";

import {
  cleanDurationDigits,
  digitsFromDuration,
  durationFromDigits,
  formatDurationDigits,
} from "@/utils/duration";
import { formatDecimal, parseDecimal, parseInteger } from "@/utils/number";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type Field = "weight" | "reps" | "distance" | "time";

const FIELDS: Record<TrackingType, readonly Field[]> = {
  weight_reps: ["weight", "reps"],
  bodyweight_reps: ["reps"],
  duration: ["time"],
  distance_duration: ["distance", "time"],
};

// What the inputs hold while typing; time holds the digits typed.
type Texts = Record<Field, string>;

function toTexts(values: SetValues, language: Language): Texts {
  return {
    weight:
      values.weightKg === null ? "" : formatDecimal(values.weightKg, language),
    reps: values.reps === null ? "" : String(values.reps),
    distance:
      values.distanceM === null
        ? ""
        : formatDecimal(values.distanceM / 1000, language),
    time: digitsFromDuration(values.durationS),
  };
}

function toValues(texts: Texts): SetValues {
  const km = parseDecimal(texts.distance);
  return {
    weightKg: parseDecimal(texts.weight),
    reps: parseInteger(texts.reps),
    durationS: durationFromDigits(texts.time),
    distanceM: km === null ? null : Math.round(km * 1000),
  };
}

function getFieldLabels(t: Translations): Record<Field, string> {
  return {
    weight: t.workout.weight,
    reps: t.workout.reps,
    distance: t.workout.distance,
    time: t.workout.time,
  };
}

function valuesKey(values: SetValues) {
  return [values.weightKg, values.reps, values.durationS, values.distanceM]
    .map(String)
    .join("|");
}

// Last time's set goes in its own column when it's short ("77,5×5"); a
// distance and time don't fit next to two inputs, so they go below the row.
function hasPreviousColumn(trackingType: TrackingType) {
  return FIELDS[trackingType].includes("reps");
}

type SetHeaderProps = {
  trackingType: TrackingType;
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
      {showPrevious && hasPreviousColumn(trackingType) && (
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
  trackingType: TrackingType;
  // The set with the same number last time; undefined when it had fewer.
  previous: SetValues | undefined;
  showPrevious: boolean;
  // The set before it isn't done yet, so this one can't be started or done.
  locked: boolean;
  onSave: (values: SetValues) => void;
  onComplete: (values: SetValues) => void;
  onDelete: () => void;
  onStartTimer: (values: SetValues) => void;
  onStopTimer: (values: SetValues) => void;
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
  onStartTimer,
  onStopTimer,
}: SetRowProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const [texts, setTexts] = useState(() => toTexts(set, language));

  // When the saved values change (a stopwatch stops, a field is saved), the
  // inputs show them as saved: "0:90" becomes "1:30".
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
  const timerStartedAt = done ? null : set.startedAt;
  const timerDisabled = done || (locked && timerStartedAt === null);

  function change(field: Field, text: string) {
    setTexts((current) => ({
      ...current,
      [field]: field === "time" ? cleanDurationDigits(text) : text,
    }));
  }

  function save() {
    if (done && !ready) {
      setTexts(toTexts(set, language));
    } else if (valuesKey(values) !== savedKey) {
      onSave(values);
    }
  }

  function toggleTimer() {
    if (timerStartedAt === null) {
      onStartTimer(values);
    } else if (trackingType === "duration" || ready) {
      onComplete(values);
    } else {
      onStopTimer(values);
    }
  }

  function renderField(field: Field) {
    const label = `${t.workout.set} ${number}, ${labels[field]}`;

    if (field !== "time") {
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
          accessibilityLabel={label}
        />
      );
    }

    return (
      <View key={field} style={[styles.column, styles.timeGroup]}>
        {timerStartedAt === null ? (
          <TextInput
            style={[styles.input, styles.timeInput]}
            value={texts.time === "" ? "" : formatDurationDigits(texts.time)}
            onChangeText={(text) => change("time", text)}
            onEndEditing={save}
            keyboardType="number-pad"
            selectTextOnFocus
            placeholder="0:00"
            placeholderTextColor={colors.disabled}
            accessibilityLabel={label}
          />
        ) : (
          <View style={[styles.input, styles.timeInput, styles.timeRunning]}>
            <ElapsedTime
              since={timerStartedAt}
              style={[styles.timeText, styles.timeTextRunning]}
            />
          </View>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.box,
            styles.timerButton,
            (pressed || timerStartedAt !== null) && styles.boxFilled,
            timerDisabled && styles.boxDisabled,
          ]}
          onPress={toggleTimer}
          disabled={timerDisabled}
          accessibilityRole="button"
          accessibilityLabel={
            timerStartedAt === null ? t.workout.startTimer : t.workout.stopTimer
          }
          accessibilityHint={
            locked && !done ? t.workout.previousSetFirst : undefined
          }
          accessibilityState={{ disabled: timerDisabled }}
        >
          {({ pressed }) => (
            <SymbolView
              name={
                timerStartedAt === null
                  ? {
                      ios: "play.fill",
                      android: "play_arrow",
                      web: "play_arrow",
                    }
                  : { ios: "stop.fill", android: "stop", web: "stop" }
              }
              tintColor={
                pressed || timerStartedAt !== null
                  ? colors.onPrimary
                  : colors.primary
              }
              size={iconSizes.sm}
            />
          )}
        </Pressable>
      </View>
    );
  }

  const previousLabel = `${t.workout.previous}: ${previousText ?? "-"}`;
  const row = (
    <View style={styles.row}>
      <Text style={styles.number}>{number}</Text>
      {showPrevious && hasPreviousColumn(trackingType) && (
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

  if (hasPreviousColumn(trackingType) || previousText === undefined) {
    return row;
  }
  return (
    <View style={styles.withCaption}>
      {row}
      <Text style={styles.caption} accessibilityLabel={previousLabel}>
        {t.workout.previous} · {previousText}
      </Text>
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
    timeGroup: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    timeInput: {
      flex: 1,
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
    },
    timeRunning: {
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.primary,
    },
    timeText: {
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
    timeTextRunning: {
      color: colors.primary,
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
    withCaption: {
      gap: spacing.xs,
    },
    // Starts under the first input, past the set number.
    caption: {
      marginLeft: BOX_SIZE + spacing.sm,
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
    timerButton: {
      borderWidth: 1,
      borderColor: colors.primary,
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
