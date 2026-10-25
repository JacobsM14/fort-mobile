import { describe, expect, it } from "@jest/globals";

import { es } from "@/i18n/es";

import { dailyMetric, estimatedOneRepMax, formatMetric } from "./metrics";

import type { SetValues } from "@/features/workouts/queries";

const EMPTY: SetValues = {
  weightKg: null,
  reps: null,
  durationS: null,
  distanceM: null,
};

describe("estimatedOneRepMax", () => {
  it("adds a thirtieth of the weight per rep", () => {
    expect(estimatedOneRepMax(100, 10)).toBeCloseTo(133.33);
    expect(estimatedOneRepMax(60, 5)).toBe(70);
  });

  it("leaves a single rep as it is", () => {
    expect(estimatedOneRepMax(120, 1)).toBe(120);
  });

  it("counts long sets as 15 reps, so they don't read as a false max", () => {
    expect(estimatedOneRepMax(60, 30)).toBe(estimatedOneRepMax(60, 15));
    expect(estimatedOneRepMax(60, 30)).toBe(90);
    expect(estimatedOneRepMax(60, 12)).toBeCloseTo(84);
  });
});

describe("dailyMetric", () => {
  it("takes the best set, however many were done", () => {
    const sets: SetValues[] = [
      { ...EMPTY, weightKg: 80, reps: 5 },
      { ...EMPTY, weightKg: 70, reps: 12 },
      { ...EMPTY, weightKg: 60, reps: 8 },
    ];
    expect(dailyMetric("weight_reps", sets)).toBeCloseTo(98);
  });

  it("doesn't let a light, long set beat a heavy one", () => {
    const sets: SetValues[] = [
      { ...EMPTY, weightKg: 80, reps: 8 },
      { ...EMPTY, weightKg: 60, reps: 30 },
    ];
    expect(dailyMetric("weight_reps", sets)).toBeCloseTo(101.33);
  });

  it("ignores sets missing a value", () => {
    const sets: SetValues[] = [
      { ...EMPTY, weightKg: 80, reps: null },
      { ...EMPTY, weightKg: null, reps: 10 },
      { ...EMPTY, weightKg: 50, reps: 3 },
    ];
    expect(dailyMetric("weight_reps", sets)).toBeCloseTo(55);
  });

  it("uses the best reps, time and speed for the other types", () => {
    expect(
      dailyMetric("bodyweight_reps", [
        { ...EMPTY, reps: 8 },
        { ...EMPTY, reps: 11 },
      ]),
    ).toBe(11);
    expect(
      dailyMetric("duration", [
        { ...EMPTY, durationS: 60 },
        { ...EMPTY, durationS: 95 },
      ]),
    ).toBe(95);
    expect(
      dailyMetric("distance_duration", [
        { ...EMPTY, distanceM: 5000, durationS: 1500 },
        { ...EMPTY, distanceM: 1000, durationS: 250 },
        { ...EMPTY, distanceM: 2000, durationS: null },
      ]),
    ).toBe(4);
  });

  it("is null on a day with nothing to measure", () => {
    expect(dailyMetric("duration", [])).toBeNull();
    expect(dailyMetric("weight_reps", [EMPTY])).toBeNull();
  });
});

describe("formatMetric", () => {
  it("shows the value in the user's units", () => {
    const metric = { weight: "kg", distance: "km" } as const;
    expect(formatMetric("weight_reps", 92.333, metric, es, "es")).toBe(
      "92,3 kg",
    );
    expect(formatMetric("distance_duration", 4, metric, es, "es")).toBe(
      "14,4 km/h",
    );
    expect(formatMetric("duration", 95, metric, es, "es")).toBe("1:35");
  });

  it("converts to pounds and miles", () => {
    const imperial = { weight: "lb", distance: "mi" } as const;
    expect(formatMetric("weight_reps", 100, imperial, es, "en")).toBe(
      "220.5 lb",
    );
    expect(formatMetric("distance_duration", 4, imperial, es, "en")).toBe(
      "8.9 mph",
    );
  });
});
