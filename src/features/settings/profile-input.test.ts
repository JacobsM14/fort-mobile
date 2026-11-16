import { describe, expect, it } from "@jest/globals";

import {
  parseBirthDate,
  parseBodyWeightKg,
  parseHeightCm,
  parseHeightFeetInches,
} from "./profile-input";

describe("parseBodyWeightKg", () => {
  it("takes a weight in kg, with a comma or a point", () => {
    expect(parseBodyWeightKg("72,5", "kg")).toBe(72.5);
    expect(parseBodyWeightKg("80", "kg")).toBe(80);
  });

  it("turns pounds into kg", () => {
    expect(parseBodyWeightKg("220", "lb")).toBeCloseTo(99.79);
  });

  it("rejects what isn't a plausible weight", () => {
    expect(parseBodyWeightKg("", "kg")).toBeNull();
    expect(parseBodyWeightKg("abc", "kg")).toBeNull();
    expect(parseBodyWeightKg("15", "kg")).toBeNull();
    expect(parseBodyWeightKg("500", "kg")).toBeNull();
    expect(parseBodyWeightKg("30", "lb")).toBeNull();
  });
});

describe("parseHeightCm", () => {
  it("takes whole centimeters within a human range", () => {
    expect(parseHeightCm("178")).toBe(178);
    expect(parseHeightCm(" 50 ")).toBe(50);
  });

  it("rejects what isn't a plausible height", () => {
    expect(parseHeightCm("")).toBeNull();
    expect(parseHeightCm("49")).toBeNull();
    expect(parseHeightCm("261")).toBeNull();
    expect(parseHeightCm("17a")).toBeNull();
    expect(parseHeightCm("1.78")).toBeNull();
  });
});

describe("parseHeightFeetInches", () => {
  it("converts to centimeters", () => {
    expect(parseHeightFeetInches("5", "10")).toBe(178);
  });

  it("reads empty inches as zero", () => {
    expect(parseHeightFeetInches("6", "")).toBe(183);
  });

  it("rejects feet or inches out of range", () => {
    expect(parseHeightFeetInches("", "5")).toBeNull();
    expect(parseHeightFeetInches("0", "5")).toBeNull();
    expect(parseHeightFeetInches("9", "0")).toBeNull();
    expect(parseHeightFeetInches("5", "12")).toBeNull();
    expect(parseHeightFeetInches("5", "x")).toBeNull();
  });
});

describe("parseBirthDate", () => {
  const today = new Date(2026, 9, 28);

  it("gives the day as a key", () => {
    expect(parseBirthDate("7", "3", "1994", today)).toBe("1994-03-07");
    expect(parseBirthDate("28", "10", "2026", today)).toBe("2026-10-28");
  });

  it("rejects days that don't exist", () => {
    expect(parseBirthDate("31", "2", "1994", today)).toBeNull();
    expect(parseBirthDate("29", "2", "1995", today)).toBeNull();
    expect(parseBirthDate("29", "2", "1996", today)).toBe("1996-02-29");
    expect(parseBirthDate("0", "3", "1994", today)).toBeNull();
    expect(parseBirthDate("7", "13", "1994", today)).toBeNull();
  });

  it("rejects the future, and years too far back", () => {
    expect(parseBirthDate("29", "10", "2026", today)).toBeNull();
    expect(parseBirthDate("1", "1", "1899", today)).toBeNull();
  });

  it("rejects missing parts", () => {
    expect(parseBirthDate("", "3", "1994", today)).toBeNull();
    expect(parseBirthDate("7", "3", "", today)).toBeNull();
  });
});
