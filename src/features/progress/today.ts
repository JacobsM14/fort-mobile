import { useTranslation } from "@/i18n";

import { getExerciseText, MuscleId } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";

import type { ExerciseSummary } from "@/features/exercises/queries";
import type {
  FinishedWorkoutHistoryItem,
  WorkoutHistoryExercise,
} from "@/features/workouts/queries";

export type TodayEntry = WorkoutHistoryExercise & {
  summary: ExerciseSummary;
  name: string;
};

// Exercises deleted since are archived and missing from the exercise list, so
// they are left out here too.
export function useTodayEntries(
  workout: FinishedWorkoutHistoryItem | undefined,
) {
  const { t } = useTranslation();
  const { exercises: summaries, loaded } = useExerciseList();

  const summariesById = new Map(summaries.map((s) => [s.id, s] as const));
  const entries = (workout?.exercises ?? []).flatMap(
    (exercise): TodayEntry[] => {
      const summary = summariesById.get(exercise.exerciseId);
      return summary === undefined
        ? []
        : [{ ...exercise, summary, name: getExerciseText(summary, t).name }];
    },
  );

  return { entries, loaded };
}

// Every set done counts once, split evenly between its exercise's primary
// muscles; exercises with none are left out so the shares still add up to 1.
export function muscleShares(
  entries: readonly TodayEntry[],
): Partial<Record<MuscleId, number>> {
  const counts = new Map<MuscleId, number>();

  let total = 0;

  for (const entry of entries) {
    const muscles = entry.summary.primaryMuscles;

    if (muscles.length === 0) continue;

    const sets = entry.sets.length;
    total += sets;
    for (const muscle of muscles) {
      counts.set(muscle, (counts.get(muscle) ?? 0) + sets / muscles.length);
    }
  }

  const shares: Partial<Record<MuscleId, number>> = {};

  for (const [muscle, count] of counts.entries()) {
    shares[muscle] = count / total;
  }

  return Object.fromEntries(
    [...counts].map(([muscle, count]) => [muscle, count / total]),
  );
}
