import { describe, expect, it } from "@jest/globals";

import { muscleShares, type TodayEntry } from "./today";

import type { MuscleId } from "@/features/exercises/catalog";
import type { SetValues } from "@/features/workouts/queries";

const SET: SetValues = {
  weightKg: 60,
  reps: 10,
  durationS: null,
  distanceM: null,
};

let nextId = 0;

// An exercise of the workout with that many sets done.
function entry(
  sets: number,
  primaryMuscles: MuscleId[],
  secondaryMuscles: MuscleId[] = [],
): TodayEntry {
  nextId += 1;
  return {
    id: `workout-exercise-${nextId}`,
    exerciseId: `exercise-${nextId}`,
    sets: Array.from({ length: sets }, () => SET),
    name: `Exercise ${nextId}`,
    summary: {
      id: `exercise-${nextId}`,
      key: null,
      name: `Exercise ${nextId}`,
      description: null,
      equipment: null,
      trackingType: "weight_reps",
      primaryMuscles,
      secondaryMuscles,
    },
  };
}

describe("muscleShares", () => {
  it("gives each muscle its part of the sets done", () => {
    expect(muscleShares([entry(3, ["chest"]), entry(1, ["biceps"])])).toEqual({
      chest: 0.75,
      biceps: 0.25,
    });
  });

  it("adds up a muscle worked in several exercises", () => {
    expect(
      muscleShares([
        entry(2, ["chest"]),
        entry(2, ["chest"]),
        entry(4, ["triceps"]),
      ]),
    ).toEqual({ chest: 0.5, triceps: 0.5 });
  });

  it("splits an exercise's sets evenly between its primary muscles", () => {
    expect(
      muscleShares([entry(2, ["quads", "hamstrings"]), entry(2, ["chest"])]),
    ).toEqual({ quads: 0.25, hamstrings: 0.25, chest: 0.5 });
  });

  it("leaves the secondary muscles out", () => {
    expect(muscleShares([entry(3, ["chest"], ["triceps"])])).toEqual({
      chest: 1,
    });
  });

  it("leaves out exercises without muscles, so the rest still add up to 1", () => {
    expect(muscleShares([entry(3, []), entry(1, ["abs"])])).toEqual({
      abs: 1,
    });
  });

  it("always adds up to 1", () => {
    const shares = muscleShares([
      entry(4, ["chest"]),
      entry(3, ["quads", "glutes", "hamstrings"]),
      entry(2, ["lats"], ["biceps"]),
    ]);
    const total = Object.values(shares).reduce((sum, share) => sum + share, 0);
    expect(total).toBeCloseTo(1);
  });

  it("is empty without exercises", () => {
    expect(muscleShares([])).toEqual({});
  });
});
