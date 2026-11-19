import { useTranslation } from "@/i18n";

import { getExerciseText } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import { useWorkout } from "@/features/workouts/queries";
import { isExerciseDone } from "@/features/workouts/sets";

import type { ExerciseSummary } from "@/features/exercises/queries";
import type { WorkoutExercise } from "@/features/workouts/queries";

export type WorkoutEntry = WorkoutExercise & {
  summary: ExerciseSummary;
  name: string;
};

// The workout's exercises with what the screen shows of each. Exercises
// deleted since are archived, and still shown: what was logged stays.
export function useWorkoutEntries(workoutId: string) {
  const { t } = useTranslation();
  const { workout, exercises, loaded } = useWorkout(workoutId);
  const { exercises: summaries, loaded: summariesLoaded } = useExerciseList({
    includeArchived: true,
  });

  const summariesById = new Map(
    summaries.map((summary) => [summary.id, summary] as const),
  );
  const entries = exercises.flatMap((exercise): WorkoutEntry[] => {
    const summary = summariesById.get(exercise.exerciseId);
    return summary === undefined
      ? []
      : [{ ...exercise, summary, name: getExerciseText(summary, t).name }];
  });

  return {
    title: workout?.name ?? t.workout.title,
    found: workout !== undefined,
    startedAt: workout?.startedAt,
    endedAt: workout?.endedAt ?? undefined,
    entries,
    anyDone: exercises.some(isExerciseDone),
    loaded: loaded && summariesLoaded,
  };
}
