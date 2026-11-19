import { describe, expect, it } from "@jest/globals";

import { limitChars, normalizeForSearch, requiredLabel } from "./text";

describe("limitChars", () => {
  it("trims the text and cuts it to the limit", () => {
    expect(limitChars("  Remo con banda  ", 40)).toBe("Remo con banda");
    expect(limitChars("Remo con banda", 4)).toBe("Remo");
  });

  it("drops a space left at the end by the cut", () => {
    expect(limitChars("Remo con banda", 5)).toBe("Remo");
  });

  it("counts an emoji as one character, so it is never cut in half", () => {
    expect(limitChars("Remo 💪💪", 6)).toBe("Remo 💪");
  });
});

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
