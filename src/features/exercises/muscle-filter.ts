import { MUSCLE_GROUPS, type MuscleGroup } from "@/constants/enums";
import { MUSCLES, type MuscleId } from "@/features/exercises/catalog";

import { toggleItem } from "@/utils/array";

// The groups picked and the muscles picked, which may refine those groups or
// stand on their own.
export type MuscleFilter = {
  groups: readonly MuscleGroup[];
  muscles: readonly MuscleId[];
};

export const EMPTY_MUSCLE_FILTER: MuscleFilter = { groups: [], muscles: [] };

const GROUP_BY_MUSCLE = Object.fromEntries(
  MUSCLES.map((muscle) => [muscle.id, muscle.groupKey]),
) as Record<MuscleId, MuscleGroup>;

export function muscleGroupOf(id: MuscleId): MuscleGroup {
  return GROUP_BY_MUSCLE[id];
}

export function availableMuscleGroups(
  available: readonly MuscleId[],
): MuscleGroup[] {
  return MUSCLE_GROUPS.filter((group) =>
    available.some((muscle) => muscleGroupOf(muscle) === group),
  );
}

function looseMuscles(filter: MuscleFilter): MuscleId[] {
  return filter.muscles.filter(
    (muscle) => !filter.groups.includes(muscleGroupOf(muscle)),
  );
}

// Turning a group on selects its muscles, so they can be dropped one by one;
// turning it off drops them all.
export function toggleMuscleGroup(
  filter: MuscleFilter,
  group: MuscleGroup,
  available: readonly MuscleId[],
): MuscleFilter {
  if (filter.groups.includes(group)) {
    return {
      groups: filter.groups.filter((current) => current !== group),
      muscles: filter.muscles.filter(
        (muscle) => muscleGroupOf(muscle) !== group,
      ),
    };
  }
  const added = available.filter(
    (muscle) =>
      muscleGroupOf(muscle) === group && !filter.muscles.includes(muscle),
  );
  return {
    groups: [...filter.groups, group],
    muscles: [...filter.muscles, ...added],
  };
}

export function toggleFilterMuscle(
  filter: MuscleFilter,
  muscle: MuscleId,
): MuscleFilter {
  return { ...filter, muscles: toggleItem(filter.muscles, muscle) };
}

// The muscles an exercise has to work to pass. A group with none of its
// muscles left still counts as the whole group, so dropping them never loses
// the group. Empty means no muscle filter.
export function filterMuscleIds(filter: MuscleFilter): MuscleId[] {
  const fromGroups = filter.groups.flatMap((group) => {
    const picked = filter.muscles.filter(
      (muscle) => muscleGroupOf(muscle) === group,
    );
    return picked.length > 0
      ? picked
      : MUSCLES.filter((muscle) => muscle.groupKey === group).map(
          (muscle) => muscle.id,
        );
  });
  return [...fromGroups, ...looseMuscles(filter)];
}

// With groups picked, only their muscles are offered, plus any muscle picked
// before so an active filter is never hidden.
export function visibleFilterMuscles(
  filter: MuscleFilter,
  available: readonly MuscleId[],
): readonly MuscleId[] {
  if (filter.groups.length === 0) {
    return available;
  }
  return available.filter(
    (muscle) =>
      filter.groups.includes(muscleGroupOf(muscle)) ||
      filter.muscles.includes(muscle),
  );
}

// A refined group still counts as one filter.
export function activeFilterCount(filter: MuscleFilter): number {
  return filter.groups.length + looseMuscles(filter).length;
}
