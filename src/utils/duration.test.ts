import { describe, expect, it } from "@jest/globals";

import {
  cleanDurationDigits,
  digitsFromDuration,
  durationFromDigits,
  elapsedSeconds,
  formatDuration,
  formatDurationDigits,
} from "./duration";

describe("elapsedSeconds", () => {
  const start = new Date(2026, 9, 19, 18, 0, 0);

  it("counts whole seconds and never goes below zero", () => {
    expect(elapsedSeconds(start, start.getTime() + 61_900)).toBe(61);
    expect(elapsedSeconds(start, start.getTime() - 500)).toBe(0);
  });
});

describe("formatDuration", () => {
  it("shows minutes and seconds, and hours only when needed", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(47)).toBe("0:47");
    expect(formatDuration(92)).toBe("1:32");
    expect(formatDuration(3725)).toBe("1:02:05");
  });

  it("drops fractions and negative values", () => {
    expect(formatDuration(59.9)).toBe("0:59");
    expect(formatDuration(-5)).toBe("0:00");
  });
});

describe("typed durations", () => {
  it("fills from the right, like a microwave", () => {
    expect(formatDurationDigits("5")).toBe("0:05");
    expect(formatDurationDigits("130")).toBe("1:30");
    expect(formatDurationDigits("2610")).toBe("26:10");
    expect(formatDurationDigits("10205")).toBe("1:02:05");
  });

  it("keeps the digits as typed until saved", () => {
    expect(formatDurationDigits("90")).toBe("0:90");
    expect(durationFromDigits("90")).toBe(90);
    expect(durationFromDigits("130")).toBe(90);
    expect(durationFromDigits("10205")).toBe(3725);
    expect(durationFromDigits("")).toBeNull();
  });

  it("cleans what the input hands back", () => {
    expect(cleanDurationDigits("0:905")).toBe("905");
    expect(cleanDurationDigits("0:0")).toBe("");
    expect(cleanDurationDigits("1234567")).toBe("123456");
  });

  it("turns a saved duration back into digits", () => {
    expect(digitsFromDuration(90)).toBe("130");
    expect(digitsFromDuration(3725)).toBe("10205");
    expect(digitsFromDuration(5)).toBe("5");
    expect(digitsFromDuration(null)).toBe("");
    expect(digitsFromDuration(0)).toBe("");
  });
});
