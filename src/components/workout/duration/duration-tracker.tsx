import { SymbolView } from "expo-symbols";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { CornerFrame } from "@/components/ui/layout/corner-frame";
import { DurationInput } from "@/components/workout/duration/duration-input";
import { DeleteSetButton } from "@/components/workout/shared/delete-set-button";
import { ElapsedTime } from "@/components/workout/shared/elapsed-time";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  completeSet,
  startNextSetTimer,
  updateSetValues,
} from "@/features/workouts/queries";
import { formatPreviousSet, isSetDone } from "@/features/workouts/sets";

import type { SetValues, WorkoutExercise } from "@/features/workouts/queries";

import { formatDuration } from "@/utils/duration";

import {
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

const BUTTON_SIZE = 176;
const MIN_SET_MS = 1000;

type DurationTrackerProps = {
  exercise: WorkoutExercise;
  previousSets: readonly SetValues[];
  onDeleteSet: (setId: string, number: number) => void;
};

export function DurationTracker({
  exercise,
  previousSets,
  onDeleteSet,
}: DurationTrackerProps) {
  const { t, language } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const running = exercise.sets.find(
    (set) => set.startedAt !== null && !isSetDone(set),
  );
  const runningSince = running?.startedAt ?? null;
  const doneSets = exercise.sets.filter(isSetDone);

  function run(action: () => void) {
    try {
      action();
    } catch {
      Alert.alert(t.workout.saveError);
    }
  }

  function toggle() {
    if (running === undefined) {
      run(() => startNextSetTimer(exercise.id));
    } else if (
      runningSince !== null &&
      Date.now() - runningSince.getTime() >= MIN_SET_MS
    ) {
      run(() => completeSet(running.id, running));
    }
  }

  return (
    <Animated.View style={styles.container} layout={LinearTransition}>
      <View style={styles.stopwatch}>
        <CornerFrame>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              (pressed || runningSince !== null) && styles.buttonActive,
            ]}
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={
              runningSince === null ? t.workout.startTimer : t.workout.stopTimer
            }
          >
            {({ pressed }) => (
              <SymbolView
                name={
                  runningSince === null
                    ? { ios: "timer", android: "timer", web: "timer" }
                    : { ios: "stop.fill", android: "stop", web: "stop" }
                }
                tintColor={
                  pressed || runningSince !== null
                    ? colors.onPrimary
                    : colors.primary
                }
                size={iconSizes.hero}
              />
            )}
          </Pressable>
        </CornerFrame>
        {runningSince === null ? (
          <Text style={styles.time}>{formatDuration(0)}</Text>
        ) : (
          <ElapsedTime
            since={runningSince}
            style={[styles.time, styles.timeRunning]}
          />
        )}
        {previousSets.length > 0 && (
          <Text style={styles.previous}>
            {[
              t.workout.previous,
              ...previousSets.map((set) =>
                formatPreviousSet("duration", set, language),
              ),
            ].join(" · ")}
          </Text>
        )}
      </View>
      {doneSets.length > 0 && (
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>
            {t.workout.sets} · {doneSets.length}
          </Text>
          {doneSets.map((set, index) => (
            <Animated.View
              key={set.id}
              style={styles.row}
              entering={FadeIn}
              layout={LinearTransition}
            >
              <Text style={styles.number}>{index + 1}</Text>
              <DurationInput
                seconds={set.durationS}
                onSave={(durationS) =>
                  run(() => updateSetValues(set.id, { ...set, durationS }))
                }
                accessibilityLabel={`${t.workout.set} ${index + 1}, ${t.workout.time}`}
              />
              <DeleteSetButton
                number={index + 1}
                onPress={() => onDeleteSet(set.id, index + 1)}
              />
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      gap: spacing.lg,
    },
    stopwatch: {
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    button: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    buttonActive: {
      backgroundColor: colors.primary,
    },
    time: {
      fontSize: fontSizes.display,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    timeRunning: {
      color: colors.primary,
    },
    previous: {
      textAlign: "center",
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    // Same column as the set numbers in the rows of other exercises.
    number: {
      width: 44,
      textAlign: "center",
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
  }),
);
