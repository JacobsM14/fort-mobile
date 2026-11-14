import { Pressable, StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { FinishedWorkoutHistoryItem } from "@/features/workouts/queries";
import type { Translations } from "@/i18n/es";

import { formatTime } from "@/utils/date";
import { elapsedSeconds } from "@/utils/duration";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const WORKOUT_BUTTON_MIN_WIDTH = 140;

type WorkoutPickerProps = {
  workouts: readonly FinishedWorkoutHistoryItem[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
};

function durationLabel(
  workout: FinishedWorkoutHistoryItem,
  t: Translations,
): string {
  const seconds = elapsedSeconds(workout.startedAt, workout.endedAt.getTime());
  return t.progress.minutes(Math.floor(seconds / 60));
}

export function WorkoutPicker({
  workouts,
  selectedId,
  onSelect,
}: WorkoutPickerProps) {
  const { t, language } = useTranslation();
  const styles = useStyles();

  return (
    <ScrollView
      horizontal
      style={styles.scroll}
      contentContainerStyle={styles.row}
      showsHorizontalScrollIndicator={false}
      accessibilityRole="radiogroup"
    >
      {workouts.map((workout) => {
        const selected = workout.id === selectedId;
        return (
          <Pressable
            key={workout.id}
            style={[
              styles.button,
              selected ? styles.buttonSelected : styles.buttonNotSelected,
            ]}
            onPress={() => onSelect(workout.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
          >
            <Text
              style={[
                styles.time,
                selected ? styles.timeSelected : styles.timeNotSelected,
              ]}
            >
              {formatTime(workout.startedAt, language)} ·{" "}
              {durationLabel(workout, t)}
            </Text>
            <Text style={styles.name}>{workout.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 0,
    },
    row: {
      flexGrow: 1,
      gap: spacing.xs,
    },
    button: {
      flexDirection: "column",
      borderWidth: 1,
      flexGrow: 1,
      minWidth: WORKOUT_BUTTON_MIN_WIDTH,
      height: controlHeights.xl,
      justifyContent: "center",
      padding: spacing.sm,
      borderRadius: radii.xs,
    },
    buttonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryTint,
    },
    buttonNotSelected: {
      borderColor: colors.disabled,
    },
    time: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.bold,
    },
    timeSelected: {
      color: colors.primary,
    },
    timeNotSelected: {
      color: colors.disabled,
    },
    name: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
  }),
);
