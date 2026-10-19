import { describe, expect, it } from "@jest/globals";

import { es } from "@/i18n/es";

import type { SetValues, WorkoutExercise, WorkoutSet } from "./queries";
import {
  canCompleteSet,
  elapsedSeconds,
  formatPreviousSet,
  formatSet,
  getDefaultExerciseId,
  isSetUnlocked,
  needsRestChoice,
} from "./sets";

const EMPTY: SetValues = {
  weightKg: null,
  reps: null,
  durationS: null,
  distanceM: null,
};

const DONE_AT = new Date(2026, 9, 19, 18, 0, 0);

function set(overrides: Partial<WorkoutSet> = {}): WorkoutSet {
  return {
    ...EMPTY,
    id: "set",
    startedAt: null,
    completedAt: null,
    restStartedAt: null,
    restS: null,
    ...overrides,
  };
}

function exercise(id: string, sets: WorkoutSet[]): WorkoutExercise {
  return { id, exerciseId: id, sets };
}

describe("canCompleteSet", () => {
  it("needs weight and reps for weighted sets", () => {
    expect(canCompleteSet("weight_reps", { ...EMPTY, reps: 10 })).toBe(false);
    expect(canCompleteSet("weight_reps", { ...EMPTY, weightKg: 60 })).toBe(
      false,
    );
    expect(
      canCompleteSet("weight_reps", { ...EMPTY, weightKg: 0, reps: 10 }),
    ).toBe(true);
  });

  it("needs only reps for bodyweight sets", () => {
    expect(canCompleteSet("bodyweight_reps", { ...EMPTY, reps: 0 })).toBe(
      false,
    );
    expect(canCompleteSet("bodyweight_reps", { ...EMPTY, reps: 12 })).toBe(
      true,
    );
  });

  it("needs a time for timed sets and a distance for distance sets", () => {
    expect(canCompleteSet("duration", { ...EMPTY, durationS: 45 })).toBe(true);
    expect(canCompleteSet("duration", EMPTY)).toBe(false);
    expect(
      canCompleteSet("distance_duration", { ...EMPTY, durationS: 600 }),
    ).toBe(false);
    expect(
      canCompleteSet("distance_duration", { ...EMPTY, distanceM: 2000 }),
    ).toBe(true);
  });
});

describe("isSetUnlocked", () => {
  it("unlocks the first set and those right after a done one", () => {
    const sets = [set({ completedAt: DONE_AT }), set(), set()];
    expect(isSetUnlocked(sets, 0)).toBe(true);
    expect(isSetUnlocked(sets, 1)).toBe(true);
    expect(isSetUnlocked(sets, 2)).toBe(false);
  });
});

describe("needsRestChoice", () => {
  it("is offered after the last set once it's done", () => {
    const sets = [
      set({ completedAt: DONE_AT, restS: 0 }),
      set({ completedAt: DONE_AT }),
    ];
    expect(needsRestChoice(sets, 1)).toBe(true);
    expect(needsRestChoice(sets, 0)).toBe(false);
  });

  it("is offered after the last set done when more were added after it", () => {
    const sets = [set({ completedAt: DONE_AT }), set(), set()];
    expect(needsRestChoice(sets, 0)).toBe(true);
  });

  it("isn't offered once the next set is done", () => {
    const sets = [set({ completedAt: DONE_AT }), set({ completedAt: DONE_AT })];
    expect(needsRestChoice(sets, 0)).toBe(false);
  });

  it("isn't offered for a pending set or once a rest is picked", () => {
    expect(needsRestChoice([set()], 0)).toBe(false);
    expect(
      needsRestChoice(
        [set({ completedAt: DONE_AT, restStartedAt: DONE_AT })],
        0,
      ),
    ).toBe(false);
    expect(needsRestChoice([set({ completedAt: DONE_AT, restS: 0 })], 0)).toBe(
      false,
    );
  });
});

describe("getDefaultExerciseId", () => {
  it("picks the first exercise with nothing done", () => {
    const exercises = [
      exercise("a", [set({ completedAt: DONE_AT })]),
      exercise("b", [set()]),
      exercise("c", [set()]),
    ];
    expect(getDefaultExerciseId(exercises)).toBe("b");
  });

  it("picks the last one when all are done, and none when empty", () => {
    const exercises = [
      exercise("a", [set({ completedAt: DONE_AT })]),
      exercise("b", [set({ completedAt: DONE_AT })]),
    ];
    expect(getDefaultExerciseId(exercises)).toBe("b");
    expect(getDefaultExerciseId([])).toBeUndefined();
  });
});

describe("elapsedSeconds", () => {
  it("counts whole seconds and never goes below zero", () => {
    expect(elapsedSeconds(DONE_AT, DONE_AT.getTime() + 61_900)).toBe(61);
    expect(elapsedSeconds(DONE_AT, DONE_AT.getTime() - 500)).toBe(0);
  });
});

describe("formatSet", () => {
  it("shows each tracking type's values", () => {
    expect(
      formatSet("weight_reps", { ...EMPTY, weightKg: 62.5, reps: 8 }, es, "es"),
    ).toBe("62,5 kg × 8");
    expect(formatSet("bodyweight_reps", { ...EMPTY, reps: 12 }, es, "es")).toBe(
      "12 reps",
    );
    expect(formatSet("duration", { ...EMPTY, durationS: 45 }, es, "es")).toBe(
      "0:45",
    );
    expect(
      formatSet(
        "distance_duration",
        { ...EMPTY, distanceM: 5200, durationS: 1570 },
        es,
        "es",
      ),
    ).toBe("5,2 km / 26:10");
  });
});

describe("formatPreviousSet", () => {
  it("keeps each tracking type's values short", () => {
    expect(
      formatPreviousSet(
        "weight_reps",
        { ...EMPTY, weightKg: 77.5, reps: 5 },
        "es",
      ),
    ).toBe("77,5×5");
    expect(
      formatPreviousSet("bodyweight_reps", { ...EMPTY, reps: 12 }, "es"),
    ).toBe("12");
    expect(
      formatPreviousSet(
        "distance_duration",
        { ...EMPTY, distanceM: 5200, durationS: 1570 },
        "es",
      ),
    ).toBe("5,2 km · 26:10");
  });
});
