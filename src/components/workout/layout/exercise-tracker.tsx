import { SetList } from "@/components/workout/sets/set-list";
import { StopwatchTracker } from "@/components/workout/stopwatch/stopwatch-tracker";

import { usePreviousSets } from "@/features/workouts/queries";
import { isStopwatchTracking } from "@/features/workouts/sets";

import type { TrackingType } from "@/constants/enums";
import type { WorkoutExercise } from "@/features/workouts/queries";

type ExerciseTrackerProps = {
  workoutId: string;
  exercise: WorkoutExercise;
  trackingType: TrackingType;
  onDeleteSet: (setId: string, number: number) => void;
  onResetTimer: (setId: string, seconds: number) => void;
  mode?: "live" | "edit";
};

// Timed and distance exercises run from one big stopwatch; the others log
// sets in rows.
export function ExerciseTracker({
  workoutId,
  exercise,
  trackingType,
  onDeleteSet,
  onResetTimer,
  mode = "live",
}: ExerciseTrackerProps) {
  // "Previous" is the last other workout, which for a past one being edited
  // may well have come after it, so it is left out there.
  const lastTimeSets = usePreviousSets(exercise.exerciseId, workoutId);
  const previousSets = mode === "edit" ? [] : lastTimeSets;

  return isStopwatchTracking(trackingType) ? (
    <StopwatchTracker
      exercise={exercise}
      trackingType={trackingType}
      previousSets={previousSets}
      onDeleteSet={onDeleteSet}
      onResetTimer={onResetTimer}
      mode={mode}
    />
  ) : (
    <SetList
      exercise={exercise}
      trackingType={trackingType}
      previousSets={previousSets}
      onDeleteSet={onDeleteSet}
      mode={mode}
    />
  );
}
