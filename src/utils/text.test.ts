import { describe, expect, it } from "@jest/globals";

import { normalizeForSearch, requiredLabel } from "./text";

describe("requiredLabel", () => {
  it("marks a required field with an asterisk", () => {
    expect(requiredLabel("Altura", true)).toBe("Altura *");
    expect(requiredLabel("Altura", false)).toBe("Altura");
  });
});

describe("normalizeForSearch", () => {
  it("strips accents, case and surrounding spaces", () => {
    expect(normalizeForSearch("  Bíceps Curl ")).toBe("biceps curl");
  });

  it("turns ñ into n like any other accented letter", () => {
    expect(normalizeForSearch("Muñeca")).toBe("muneca");
  });
});
