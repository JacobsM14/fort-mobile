import { describe, expect, it } from "@jest/globals";

import {
  formatDayHeader,
  getDaysBetween,
  getWeekDays,
  toDateKey,
} from "./date";

// expo-localization numbers weekdays from 1 (Sunday).
const SUNDAY = 1;
const MONDAY = 2;

describe("getWeekDays", () => {
  const thursday = new Date(2026, 9, 15);

  it("starts the week on Monday when the calendar does", () => {
    const days = getWeekDays(thursday, MONDAY);
    expect(days.map((day) => day.getDate())).toEqual([
      12, 13, 14, 15, 16, 17, 18,
    ]);
  });

  it("starts the week on Sunday when the calendar does", () => {
    const days = getWeekDays(thursday, SUNDAY);
    expect(days[0].getDate()).toBe(11);
    expect(days[0].getDay()).toBe(0);
  });

  it("keeps the given day when it's the first of the week", () => {
    const monday = new Date(2026, 9, 12);
    expect(getWeekDays(monday, MONDAY)[0].getDate()).toBe(12);
  });

  it("crosses into the previous month", () => {
    const sunday = new Date(2026, 10, 1);
    const [first] = getWeekDays(sunday, MONDAY);
    expect([first.getMonth(), first.getDate()]).toEqual([9, 26]);
  });
});

describe("formatDayHeader", () => {
  it("shows weekday, day and month in capitals, without the month's dot", () => {
    const monday = new Date(2026, 9, 19);
    expect(formatDayHeader(monday, "es")).toBe("LUNES 19 OCT");
    expect(formatDayHeader(monday, "en")).toBe("MONDAY 19 OCT");
  });
});

describe("getDaysBetween", () => {
  it("lists the days from the newest to the oldest, leaving out the end", () => {
    const days = getDaysBetween(new Date(2026, 9, 29), new Date(2026, 10, 2));
    expect(days.map((day) => [day.getMonth(), day.getDate()])).toEqual([
      [10, 1],
      [9, 31],
      [9, 30],
      [9, 29],
    ]);
  });
});

describe("toDateKey", () => {
  it("pads month and day, using the local date", () => {
    expect(toDateKey(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});
