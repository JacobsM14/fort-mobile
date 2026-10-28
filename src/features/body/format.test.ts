import { describe, expect, it } from "@jest/globals";

import {
  formatBodyWeight,
  formatBodyWeightValue,
  formatWeightChange,
} from "./format";

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
