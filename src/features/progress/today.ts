import { useTranslation } from "@/i18n";

import { getExerciseText } from "@/features/exercises/catalog";
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
