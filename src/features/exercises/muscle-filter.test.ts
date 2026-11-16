import { describe, expect, it } from "@jest/globals";

import {
  activeFilterCount,
  availableMuscleGroups,
  EMPTY_MUSCLE_FILTER,
  filterMuscleIds,
  muscleGroupOf,
  toggleFilterMuscle,
  toggleMuscleGroup,
  visibleFilterMuscles,
} from "./muscle-filter";

import type { MuscleId } from "./catalog";

const AVAILABLE: MuscleId[] = [
  "chest",
  "biceps",
  "triceps",
  "forearms",
  "quads",
];

describe("muscleGroupOf", () => {
  it("gives each muscle its group", () => {
    expect(muscleGroupOf("biceps")).toBe("arms");
    expect(muscleGroupOf("quads")).toBe("legs");
  });
});

describe("availableMuscleGroups", () => {
  it("keeps the groups with a muscle on offer, in their order", () => {
    expect(availableMuscleGroups(AVAILABLE)).toEqual(["chest", "arms", "legs"]);
  });
});

describe("toggleMuscleGroup", () => {
  it("turns a group on with its muscles on offer", () => {
    expect(toggleMuscleGroup(EMPTY_MUSCLE_FILTER, "arms", AVAILABLE)).toEqual({
      groups: ["arms"],
      muscles: ["biceps", "triceps", "forearms"],
    });
  });

  it("doesn't repeat a muscle that was already picked", () => {
    const filter = { groups: [], muscles: ["biceps"] as MuscleId[] };
    expect(toggleMuscleGroup(filter, "arms", AVAILABLE).muscles).toEqual([
      "biceps",
      "triceps",
      "forearms",
    ]);
  });

  it("turns a group off with all its muscles", () => {
    const filter = {
      groups: ["arms" as const],
      muscles: ["chest", "biceps"] as MuscleId[],
    };
    expect(toggleMuscleGroup(filter, "arms", AVAILABLE)).toEqual({
      groups: [],
      muscles: ["chest"],
    });
  });
});

describe("filterMuscleIds", () => {
  const arms = toggleMuscleGroup(EMPTY_MUSCLE_FILTER, "arms", AVAILABLE);

  it("is empty without a filter", () => {
    expect(filterMuscleIds(EMPTY_MUSCLE_FILTER)).toEqual([]);
  });

  it("keeps the group when one of its muscles is dropped", () => {
    const filter = toggleFilterMuscle(arms, "forearms");
    expect(filter.groups).toEqual(["arms"]);
    expect(filterMuscleIds(filter)).toEqual(["biceps", "triceps"]);
  });

  it("counts a group with no muscle left as the whole group", () => {
    let filter = arms;
    for (const muscle of ["biceps", "triceps", "forearms"] as const) {
      filter = toggleFilterMuscle(filter, muscle);
    }
    expect(filterMuscleIds(filter)).toEqual(["biceps", "triceps", "forearms"]);
  });

  it("adds the muscles picked outside the groups", () => {
    const filter = {
      groups: ["arms" as const],
      muscles: ["chest"] as MuscleId[],
    };
    expect(filterMuscleIds(filter)).toEqual([
      "biceps",
      "triceps",
      "forearms",
      "chest",
    ]);
  });
});

describe("visibleFilterMuscles", () => {
  it("offers every muscle without a group", () => {
    expect(visibleFilterMuscles(EMPTY_MUSCLE_FILTER, AVAILABLE)).toEqual(
      AVAILABLE,
    );
  });

  it("offers the groups' muscles and the ones already picked", () => {
    const filter = {
      groups: ["arms" as const],
      muscles: ["chest"] as MuscleId[],
    };
    expect(visibleFilterMuscles(filter, AVAILABLE)).toEqual([
      "chest",
      "biceps",
      "triceps",
      "forearms",
    ]);
  });
});

describe("activeFilterCount", () => {
  it("counts a refined group once and each loose muscle", () => {
    const filter = toggleFilterMuscle(
      toggleMuscleGroup(EMPTY_MUSCLE_FILTER, "arms", AVAILABLE),
      "forearms",
    );
    expect(activeFilterCount(filter)).toBe(1);
    expect(activeFilterCount(toggleFilterMuscle(filter, "quads"))).toBe(2);
  });
});
