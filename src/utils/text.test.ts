import { describe, expect, it } from "@jest/globals";

import { normalizeForSearch } from "./text";

describe("normalizeForSearch", () => {
  it("strips accents, case and surrounding spaces", () => {
    expect(normalizeForSearch("  Bíceps Curl ")).toBe("biceps curl");
  });

  it("turns ñ into n like any other accented letter", () => {
    expect(normalizeForSearch("Muñeca")).toBe("muneca");
  });
});
