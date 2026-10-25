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
  const previousSets = usePreviousSets(exercise.exerciseId, workoutId);

  return isStopwatchTracking(trackingType) ? (
    <StopwatchTracker
      exercise={exercise}
      trackingType={trackingType}
      previousSets={previousSets}
      onDeleteSet={onDeleteSet}
      onResetTimer={onResetTimer}
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
