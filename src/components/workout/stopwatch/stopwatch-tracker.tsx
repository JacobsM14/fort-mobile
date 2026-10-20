import { Alert, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { CornerFrame } from "@/components/ui/layout/corner-frame";
import { DistanceInput } from "@/components/workout/stopwatch/distance-input";
import { DurationInput } from "@/components/workout/stopwatch/duration-input";
import { StopwatchControls } from "@/components/workout/stopwatch/stopwatch-controls";
import {
  DELETE_SET_WIDTH,
  DeleteSetButton,
} from "@/components/workout/shared/delete-set-button";
import { ElapsedTime } from "@/components/workout/shared/elapsed-time";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import {
  completeSet,
  pauseSetTimer,
  resetSetTimer,
  startNextSetTimer,
  updateSetValues,
} from "@/features/workouts/queries";
import {
  elapsedSeconds,
  formatPreviousSet,
  getStopwatchState,
  isSetDone,
} from "@/features/workouts/sets";

import type { SetValues, WorkoutExercise } from "@/features/workouts/queries";
import type {
  StopwatchState,
  StopwatchTrackingType,
} from "@/features/workouts/sets";

import { formatDuration } from "@/utils/duration";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

const NUMBER_WIDTH = 44;
// Less than this is a slip, not a set: stopping drops it instead of saving.
const MIN_SET_SECONDS = 1;

type StopwatchTrackerProps = {
  exercise: WorkoutExercise;
  trackingType: StopwatchTrackingType;
  previousSets: readonly SetValues[];
  onDeleteSet: (setId: string, number: number) => void;
  // The screen asks first; the time run so far would be lost.
  onResetTimer: (setId: string, seconds: number) => void;
};

function secondsSoFar(state: StopwatchState) {
  switch (state.status) {
    case "idle":
      return 0;
    case "running":
      return state.offsetS + elapsedSeconds(state.since, Date.now());
    case "paused":
      return state.seconds;
  }
}

// Each stop of the stopwatch saves a set; a distance set gets its km typed in
// its row afterwards.
export function StopwatchTracker({
  exercise,
  trackingType,
  previousSets,
  onDeleteSet,
  onResetTimer,
}: StopwatchTrackerProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const units = useUnits();
  const styles = useStyles();
  const state = getStopwatchState(exercise.sets);
  const doneSets = exercise.sets.filter(isSetDone);
  const withDistance = trackingType === "distance_duration";

  function run(action: () => void) {
    try {
      action();
    } catch {
      Alert.alert(t.workout.saveError);
    }
  }

  function stop() {
    if (state.status === "idle") {
      return;
    }
    const { set } = state;
    if (secondsSoFar(state) < MIN_SET_SECONDS) {
      run(() => resetSetTimer(set.id));
    } else {
      run(() => completeSet(set.id, set));
    }
  }

  function reset() {
    if (state.status !== "idle") {
      onResetTimer(state.set.id, secondsSoFar(state));
    }
  }

  function renderTime() {
    switch (state.status) {
      case "idle":
        return (
          <Text style={[styles.time, styles.timeIdle]} numberOfLines={1}>
            {formatDuration(0)}
          </Text>
        );
      case "running":
        return (
          <ElapsedTime
            since={state.since}
            offsetSeconds={state.offsetS}
            style={[styles.time, styles.timeRunning]}
            numberOfLines={1}
            adjustsFontSizeToFit
          />
        );
      case "paused":
        return (
          <Text style={styles.time} numberOfLines={1} adjustsFontSizeToFit>
            {formatDuration(state.seconds)}
          </Text>
        );
    }
  }

  return (
    <Animated.View style={styles.container} layout={LinearTransition}>
      <View style={styles.stopwatch}>
        <CornerFrame style={styles.frame}>
          <View style={styles.display}>
            {renderTime()}
            {state.status === "paused" && (
              <Text style={[globalStyles.inputLabel, styles.pausedLabel]}>
                {t.workout.paused}
              </Text>
            )}
          </View>
        </CornerFrame>
        <StopwatchControls
          status={state.status}
          onStart={() => run(() => startNextSetTimer(exercise.id))}
          onPause={() =>
            state.status === "running" && run(() => pauseSetTimer(state.set.id))
          }
          onStop={stop}
          onReset={reset}
        />
        {previousSets.length > 0 && (
          <Text style={styles.previous}>
            {[
              t.workout.previous,
              ...previousSets.map((set) =>
                formatPreviousSet(trackingType, set, units, language),
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
          {withDistance && (
            <View style={styles.row}>
              <View style={styles.numberSpace} />
              <Text style={[globalStyles.inputLabel, styles.columnLabel]}>
                {units.distance}
              </Text>
              <Text style={[globalStyles.inputLabel, styles.columnLabel]}>
                {t.workout.time}
              </Text>
              <View style={styles.deleteSpace} />
            </View>
          )}
          {doneSets.map((set, index) => (
            <Animated.View
              key={set.id}
              style={styles.row}
              entering={FadeIn}
              layout={LinearTransition}
            >
              <Text style={styles.number}>{index + 1}</Text>
              {withDistance && (
                <DistanceInput
                  meters={set.distanceM}
                  onSave={(distanceM) =>
                    run(() => updateSetValues(set.id, { ...set, distanceM }))
                  }
                  accessibilityLabel={`${t.workout.set} ${index + 1}, ${units.distance}`}
                />
              )}
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
      gap: spacing.lg,
      paddingTop: spacing.md,
    },
    // The margin keeps the floating corners inside the screen's padding.
    frame: {
      marginHorizontal: spacing.sm,
    },
    display: {
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
    },
    time: {
      fontSize: fontSizes.timer,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
    timeIdle: {
      color: colors.disabled,
    },
    timeRunning: {
      color: colors.primary,
    },
    pausedLabel: {
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
      width: NUMBER_WIDTH,
      textAlign: "center",
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
    numberSpace: {
      width: NUMBER_WIDTH,
    },
    columnLabel: {
      flex: 1,
      textAlign: "center",
    },
    deleteSpace: {
      width: DELETE_SET_WIDTH,
    },
  }),
);
