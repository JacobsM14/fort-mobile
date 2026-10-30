import { describe, expect, it } from "@jest/globals";

import {
  formatDayHeader,
  formatShortDay,
  getDaysBetween,
  getWeekDays,
  isDateKey,
  isIsoDate,
  lastWeekStarts,
  parseDateKey,
  toDateKey,
  toIso,
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

describe("lastWeekStarts", () => {
  // A Sunday.
  const today = new Date(2026, 9, 25, 18, 30);

  it("ends with the week of today, the oldest week first", () => {
    expect(lastWeekStarts(today, MONDAY, 3)).toEqual([
      new Date(2026, 9, 5),
      new Date(2026, 9, 12),
      new Date(2026, 9, 19),
    ]);
  });

  it("starts the weeks on the first weekday of the calendar", () => {
    expect(lastWeekStarts(today, SUNDAY, 3)).toEqual([
      new Date(2026, 9, 11),
      new Date(2026, 9, 18),
      new Date(2026, 9, 25),
    ]);
  });

  it("crosses into the previous year", () => {
    expect(lastWeekStarts(new Date(2027, 0, 6), MONDAY, 3)).toEqual([
      new Date(2026, 11, 21),
      new Date(2026, 11, 28),
      new Date(2027, 0, 4),
    ]);
  });

  it("gives as many weeks as asked", () => {
    expect(lastWeekStarts(today, MONDAY, 12)).toHaveLength(12);
    expect(lastWeekStarts(today, MONDAY, 1)).toEqual([new Date(2026, 9, 19)]);
  });
});

describe("formatDayHeader", () => {
  it("shows weekday, day and month in capitals, without the month's dot", () => {
    const monday = new Date(2026, 9, 19);
    expect(formatDayHeader(monday, "es")).toBe("LUNES 19 OCT");
    expect(formatDayHeader(monday, "en")).toBe("MONDAY 19 OCT");
  });
});

describe("formatShortDay", () => {
  it("shows the day and the short month in the language's order", () => {
    const monday = new Date(2026, 9, 19);
    expect(formatShortDay(monday, "es")).toBe("19 oct");
    expect(formatShortDay(monday, "en")).toBe("Oct 19");
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

describe("parseDateKey", () => {
  it("reads back the local day written by toDateKey", () => {
    const day = new Date(2026, 0, 5);
    expect(parseDateKey(toDateKey(day))).toEqual(day);
  });
});

describe("isDateKey", () => {
  it("accepts what toDateKey writes", () => {
    expect(isDateKey(toDateKey(new Date(2026, 9, 24)))).toBe(true);
  });

  it("accepts February 29th only in a leap year", () => {
    expect(isDateKey("2028-02-29")).toBe(true);
    expect(isDateKey("2026-02-29")).toBe(false);
  });

  it("rejects days and months that don't exist", () => {
    expect(isDateKey("2026-02-30")).toBe(false);
    expect(isDateKey("2026-13-01")).toBe(false);
    expect(isDateKey("2026-00-10")).toBe(false);
  });

  it("rejects other formats and values that aren't text", () => {
    expect(isDateKey("2026-1-5")).toBe(false);
    expect(isDateKey("24/10/2026")).toBe(false);
    expect(isDateKey("2026-10-24T10:00:00.000Z")).toBe(false);
    expect(isDateKey(20261024)).toBe(false);
  });
});

describe("isIsoDate", () => {
  it("accepts what toIso writes", () => {
    expect(isIsoDate(toIso(new Date(2026, 9, 30, 18, 5)))).toBe(true);
  });

  it("rejects dates written any other way, even valid ones", () => {
    expect(isIsoDate("2026-10-30")).toBe(false);
    expect(isIsoDate("2026-10-30T18:05:00Z")).toBe(false);
    expect(isIsoDate("2026-10-30T18:05:00.000+02:00")).toBe(false);
    expect(isIsoDate("Fri Oct 30 2026")).toBe(false);
  });

  it("rejects values that aren't text", () => {
    expect(isIsoDate(Date.now())).toBe(false);
    expect(isIsoDate(null)).toBe(false);
  });
});
