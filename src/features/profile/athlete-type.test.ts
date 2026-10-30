import { describe, expect, it } from "@jest/globals";

import {
  averageSessions,
  consistencyLevel,
  consistencyWeeks,
  nextConsistencyLevel,
  toFrequentExercises,
  toWeeklySessions,
  trainingStyle,
  type AthleteTypeRow,
} from "./athlete-type";

// One row is one set done.
function setRow(overrides: Partial<AthleteTypeRow> = {}): AthleteTypeRow {
  return {
    workoutId: "w1",
    startedAt: new Date(2026, 9, 20, 18),
    exerciseId: "bench",
    key: "bench_press",
    name: null,
    description: null,
    trackingType: "weight_reps",
    ...overrides,
  };
}

describe("averageSessions", () => {
  it("averages the sessions over every week, empty ones included", () => {
    expect(averageSessions([3, 0, 4, 1])).toBe(2);
  });

  it("is zero without weeks", () => {
    expect(averageSessions([])).toBe(0);
  });
});

describe("consistencyLevel", () => {
  it("goes up with the average sessions a week", () => {
    expect(consistencyLevel([1, 0, 2, 1])).toBe("sporadic");
    expect(consistencyLevel([2, 1, 3, 2])).toBe("regular");
    expect(consistencyLevel([3, 2, 4, 3])).toBe("steady");
  });

  it("is unstoppable with 4 sessions in each of the last two weeks", () => {
    expect(consistencyLevel([0, 0, 4, 5])).toBe("unstoppable");
  });

  it("needs both of the last two weeks for unstoppable", () => {
    expect(consistencyLevel([3, 3, 5, 3])).toBe("steady");
    expect(consistencyLevel([4])).toBe("steady");
  });

  it("is sporadic without weeks", () => {
    expect(consistencyLevel([])).toBe("sporadic");
  });
});

describe("nextConsistencyLevel", () => {
  it("is the level above, and none at the top", () => {
    expect(nextConsistencyLevel("sporadic")).toBe("regular");
    expect(nextConsistencyLevel("steady")).toBe("unstoppable");
    expect(nextConsistencyLevel("unstoppable")).toBeNull();
  });
});

describe("toWeeklySessions", () => {
  const weekStarts = [new Date(2026, 9, 12), new Date(2026, 9, 19)];

  it("counts a workout once, however many sets it has", () => {
    const rows = [
      setRow({ workoutId: "w1" }),
      setRow({ workoutId: "w1" }),
      setRow({ workoutId: "w1" }),
    ];

    expect(toWeeklySessions(rows, weekStarts)).toEqual([0, 1]);
  });

  it("counts two workouts of the same day as two sessions", () => {
    const rows = [
      setRow({ workoutId: "w1", startedAt: new Date(2026, 9, 13, 8) }),
      setRow({ workoutId: "w2", startedAt: new Date(2026, 9, 13, 19) }),
    ];

    expect(toWeeklySessions(rows, weekStarts)).toEqual([2, 0]);
  });

  it("starts each week at its first instant and ends it before the next", () => {
    const rows = [
      setRow({ workoutId: "w1", startedAt: new Date(2026, 9, 12) }),
      setRow({ workoutId: "w2", startedAt: new Date(2026, 9, 18, 23, 59) }),
      setRow({ workoutId: "w3", startedAt: new Date(2026, 9, 19) }),
    ];

    expect(toWeeklySessions(rows, weekStarts)).toEqual([2, 1]);
  });

  it("leaves out what is before the first week", () => {
    const rows = [setRow({ startedAt: new Date(2026, 9, 11, 23, 59) })];

    expect(toWeeklySessions(rows, weekStarts)).toEqual([0, 0]);
  });
});

describe("toFrequentExercises", () => {
  it("counts the workouts of each exercise, not its sets", () => {
    const rows = [
      setRow({ exerciseId: "bench", workoutId: "w1" }),
      setRow({ exerciseId: "bench", workoutId: "w1" }),
      setRow({ exerciseId: "bench", workoutId: "w1" }),
      setRow({ exerciseId: "squat", workoutId: "w1" }),
      setRow({ exerciseId: "squat", workoutId: "w2" }),
    ];

    expect(
      toFrequentExercises(rows, 3).map((e) => [e.id, e.workoutCount]),
    ).toEqual([
      ["squat", 2],
      ["bench", 1],
    ]);
  });

  it("keeps the most done and no more than the limit", () => {
    const rows = [
      setRow({ exerciseId: "a", workoutId: "w1" }),
      setRow({ exerciseId: "b", workoutId: "w1" }),
      setRow({ exerciseId: "b", workoutId: "w2" }),
      setRow({ exerciseId: "c", workoutId: "w1" }),
      setRow({ exerciseId: "c", workoutId: "w2" }),
      setRow({ exerciseId: "c", workoutId: "w3" }),
    ];

    expect(toFrequentExercises(rows, 2).map((e) => e.id)).toEqual(["c", "b"]);
  });

  it("orders a tie by id, whatever the order of the rows", () => {
    const rows = [
      setRow({ exerciseId: "b", workoutId: "w1" }),
      setRow({ exerciseId: "a", workoutId: "w1" }),
    ];

    expect(toFrequentExercises(rows, 2).map((e) => e.id)).toEqual(["a", "b"]);
    expect(
      toFrequentExercises([...rows].reverse(), 2).map((e) => e.id),
    ).toEqual(["a", "b"]);
  });

  it("keeps what is needed to name the exercise", () => {
    const rows = [
      setRow({
        exerciseId: "mine",
        key: null,
        name: "Remo sentado",
        description: "Con agarre neutro",
        trackingType: "bodyweight_reps",
      }),
    ];

    expect(toFrequentExercises(rows, 3)).toEqual([
      {
        id: "mine",
        key: null,
        name: "Remo sentado",
        description: "Con agarre neutro",
        trackingType: "bodyweight_reps",
        workoutCount: 1,
      },
    ]);
  });

  it("is empty without rows", () => {
    expect(toFrequentExercises([], 3)).toEqual([]);
  });
});

describe("trainingStyle", () => {
  function sets(
    trackingType: AthleteTypeRow["trackingType"],
    count: number,
  ): AthleteTypeRow[] {
    return Array.from({ length: count }, () => setRow({ trackingType }));
  }

  it("is all-round without sets", () => {
    expect(trainingStyle([])).toBe("allRound");
  });

  it("is the style with at least 60 % of the sets", () => {
    expect(
      trainingStyle([...sets("weight_reps", 3), ...sets("duration", 2)]),
    ).toBe("strength");
    expect(
      trainingStyle([...sets("bodyweight_reps", 6), ...sets("duration", 4)]),
    ).toBe("calisthenics");
  });

  it("adds time and distance together for endurance", () => {
    expect(
      trainingStyle([
        ...sets("duration", 2),
        ...sets("distance_duration", 2),
        ...sets("weight_reps", 1),
      ]),
    ).toBe("endurance");
  });

  it("is all-round when none reaches 60 %", () => {
    expect(
      trainingStyle([...sets("weight_reps", 5), ...sets("bodyweight_reps", 5)]),
    ).toBe("allRound");
    expect(
      trainingStyle([...sets("weight_reps", 59), ...sets("duration", 41)]),
    ).toBe("allRound");
  });
});

describe("consistencyWeeks", () => {
  // Mondays; the last is the week in progress.
  const weekStarts = [
    new Date(2026, 9, 5),
    new Date(2026, 9, 12),
    new Date(2026, 9, 19),
    new Date(2026, 9, 26),
  ];

  it("leaves out the week in progress", () => {
    expect(consistencyWeeks(weekStarts, undefined)).toEqual([
      new Date(2026, 9, 5),
      new Date(2026, 9, 12),
      new Date(2026, 9, 19),
    ]);
  });

  it("starts at the week of the first workout", () => {
    expect(consistencyWeeks(weekStarts, new Date(2026, 9, 14, 18))).toEqual([
      new Date(2026, 9, 12),
      new Date(2026, 9, 19),
    ]);
    // On the very first instant of a week, the one before is left out.
    expect(consistencyWeeks(weekStarts, new Date(2026, 9, 12))).toEqual([
      new Date(2026, 9, 12),
      new Date(2026, 9, 19),
    ]);
  });

  it("keeps every complete week when the first workout is older", () => {
    expect(consistencyWeeks(weekStarts, new Date(2026, 0, 10))).toHaveLength(3);
  });

  it("is empty while the first workout is in the week in progress", () => {
    expect(consistencyWeeks(weekStarts, new Date(2026, 9, 27, 9))).toEqual([]);
  });
});
