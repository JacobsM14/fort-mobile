import { describe, expect, it } from "@jest/globals";

import { es } from "@/i18n/es";

import {
  dailyMetric,
  estimatedOneRepMax,
  formatBodyWeight,
  formatBodyWeightValue,
  formatChange,
  formatMetric,
  formatWeightChange,
  progressChange,
} from "./metrics";

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

describe("progressChange", () => {
  it("is the last day minus the first", () => {
    expect(progressChange([{ value: 80 }, { value: 70 }, { value: 100 }])).toBe(
      20,
    );
    expect(progressChange([{ value: 100 }, { value: 90 }])).toBe(-10);
  });

  it("is null without two days to compare", () => {
    expect(progressChange([])).toBeNull();
    expect(progressChange([{ value: 50 }])).toBeNull();
  });
});

describe("formatChange", () => {
  const metric = { weight: "kg", distance: "km" } as const;

  it("reads each type in its own unit", () => {
    expect(formatChange("weight_reps", 16, metric, es, "es")).toBe(
      "+16 kg · 1RM est.",
    );
    expect(formatChange("bodyweight_reps", 3, metric, es, "es")).toBe(
      "+3 reps",
    );
    expect(formatChange("duration", 15, metric, es, "es")).toBe("+0:15");
    expect(formatChange("distance_duration", 0.3, metric, es, "es")).toBe(
      "+1,1 km/h",
    );
  });

  it("shows a drop with a minus and a tie with no sign", () => {
    expect(formatChange("weight_reps", -2.5, metric, es, "es")).toBe(
      "-2,5 kg · 1RM est.",
    );
    expect(formatChange("bodyweight_reps", 0, metric, es, "es")).toBe("0 reps");
  });

  it("converts to the user's units", () => {
    const imperial = { weight: "lb", distance: "mi" } as const;
    expect(formatChange("weight_reps", 10, imperial, es, "en")).toBe(
      "+22 lb · 1RM est.",
    );
  });
});

describe("formatBodyWeight", () => {
  it("rounds to a tenth in the user's unit", () => {
    expect(
      formatBodyWeight(72.44, { weight: "kg", distance: "km" }, "es"),
    ).toBe("72,4kg");
    expect(formatBodyWeight(80, { weight: "lb", distance: "mi" }, "en")).toBe(
      "176.4lb",
    );
  });
});

describe("formatBodyWeightValue", () => {
  it("leaves the unit out", () => {
    expect(
      formatBodyWeightValue(72.44, { weight: "kg", distance: "km" }, "es"),
    ).toBe("72,4");
  });
});

describe("formatWeightChange", () => {
  const metric = { weight: "kg", distance: "km" } as const;

  it("shows a gain with a plus and a loss with a minus", () => {
    expect(formatWeightChange(0.4, metric, "es")).toBe("+0,4");
    expect(formatWeightChange(-1.3, metric, "es")).toBe("-1,3");
  });

  it("carries no sign when it rounds to nothing", () => {
    expect(formatWeightChange(0.01, metric, "es")).toBe("0");
    expect(formatWeightChange(0, metric, "es")).toBe("0");
  });

  it("converts to the user's units", () => {
    const imperial = { weight: "lb", distance: "mi" } as const;
    expect(formatWeightChange(1, imperial, "en")).toBe("+2.2");
  });
});
