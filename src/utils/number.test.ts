import { describe, expect, it } from "@jest/globals";

import {
  formatDecimal,
  parseDecimal,
  parseInteger,
  roundToTenth,
  withSign,
} from "./number";

describe("parseDecimal", () => {
  it("accepts a comma or a point as the decimal separator", () => {
    expect(parseDecimal("62,5")).toBe(62.5);
    expect(parseDecimal("62.5")).toBe(62.5);
    expect(parseDecimal(" 100 ")).toBe(100);
    expect(parseDecimal("62,")).toBe(62);
    expect(parseDecimal(",5")).toBe(0.5);
  });

  it("rejects anything that isn't a positive number", () => {
    expect(parseDecimal("")).toBeNull();
    expect(parseDecimal("-5")).toBeNull();
    expect(parseDecimal("1.2.3")).toBeNull();
    expect(parseDecimal("abc")).toBeNull();
  });
});

describe("parseInteger", () => {
  it("accepts whole numbers only", () => {
    expect(parseInteger("12")).toBe(12);
    expect(parseInteger("12,5")).toBeNull();
    expect(parseInteger("")).toBeNull();
  });
});

describe("formatDecimal", () => {
  it("uses the language's separator and at most two decimals", () => {
    expect(formatDecimal(62.5, "es")).toBe("62,5");
    expect(formatDecimal(62.5, "en")).toBe("62.5");
    expect(formatDecimal(1250, "es")).toBe("1250");
    expect(formatDecimal(2.125, "en")).toBe("2.13");
  });
});

describe("roundToTenth", () => {
  it("keeps one decimal and drops the float noise", () => {
    expect(roundToTenth(72.44)).toBe(72.4);
    expect(roundToTenth(72.45)).toBe(72.5);
    expect(roundToTenth(0.1 + 0.2)).toBe(0.3);
  });
});

describe("withSign", () => {
  it("puts a plus before a gain and a minus before a loss", () => {
    expect(withSign(1.5, "1,5")).toBe("+1,5");
    expect(withSign(-1.5, "1,5")).toBe("-1,5");
  });

  it("carries no sign for nothing", () => {
    expect(withSign(0, "0")).toBe("0");
  });
});
