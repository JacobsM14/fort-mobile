import { DurationTracker } from "@/components/workout/duration/duration-tracker";
import { SetList } from "@/components/workout/sets/set-list";

import { usePreviousSets } from "@/features/workouts/queries";

import type { TrackingType } from "@/constants/enums";
import type { WorkoutExercise } from "@/features/workouts/queries";

type ExerciseTrackerProps = {
  workoutId: string;
  exercise: WorkoutExercise;
  trackingType: TrackingType;
  onDeleteSet: (setId: string, number: number) => void;
};

// Timed exercises run from one big stopwatch; the others log sets in rows.
export function ExerciseTracker({
  workoutId,
  exercise,
  trackingType,
  onDeleteSet,
}: ExerciseTrackerProps) {
  const previousSets = usePreviousSets(exercise.exerciseId, workoutId);

  return trackingType === "duration" ? (
    <DurationTracker
      exercise={exercise}
      previousSets={previousSets}
      onDeleteSet={onDeleteSet}
    />
  ) : (
    <SetList
      exercise={exercise}
      trackingType={trackingType}
      previousSets={previousSets}
      onDeleteSet={onDeleteSet}
    />
  );
}
