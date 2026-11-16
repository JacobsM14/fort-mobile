import { muscleGroupOf } from "@/features/exercises/muscle-filter";

import type { MuscleId } from "@/features/exercises/catalog";
import type { Translations } from "@/i18n/es";

function getRoutineMuscles(
  routine: { muscles: readonly MuscleId[] },
  t: Translations,
) {
  return routine.muscles.map((muscle) => t.muscles[muscle]).join(", ");
}

// Basic groups (chest, legs...) in the order the routine first works them.
export function getRoutineMuscleGroups(
  routine: { muscles: readonly MuscleId[] },
  t: Translations,
) {
  const groups = new Set(routine.muscles.map(muscleGroupOf));
  return [...groups].map((group) => t.muscleGroups[group]).join(", ");
}

export function getRoutineDetail(
  routine: { exerciseCount: number; muscles: readonly MuscleId[] },
  t: Translations,
) {
  return [
    t.routines.exerciseCount(routine.exerciseCount),
    getRoutineMuscles(routine, t),
  ]
    .filter((part) => part !== "")
    .join(" · ");
}
