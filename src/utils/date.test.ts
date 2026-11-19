import { describe, expect, it } from "@jest/globals";

import {
  earliestDate,
  formatDayHeader,
  formatShortDay,
  fromIso,
  fromIsoOrNull,
  getDaysBetween,
  getWeekDays,
  isDateKey,
  isIsoDate,
  isMissedDay,
  lastWeekStarts,
  msUntilNextDay,
  parseDateKey,
  startOfDay,
  toDateKey,
  toIso,
  weekEnd,
  weekStartsSince,
} from "./date";

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

describe("weekStartsSince", () => {
  // A Sunday.
  const today = new Date(2026, 9, 25, 18, 30);

  it("goes back to the week of the given day, the newest week first", () => {
    expect(weekStartsSince(today, MONDAY, new Date(2026, 9, 7, 9))).toEqual([
      new Date(2026, 9, 19),
      new Date(2026, 9, 12),
      new Date(2026, 9, 5),
    ]);
  });

  it("starts the weeks on the first weekday of the calendar", () => {
    expect(weekStartsSince(today, SUNDAY, new Date(2026, 9, 17))).toEqual([
      new Date(2026, 9, 25),
      new Date(2026, 9, 18),
      new Date(2026, 9, 11),
    ]);
  });

  it("counts whole weeks across a daylight saving change", () => {
    const weeks = weekStartsSince(today, MONDAY, new Date(2026, 2, 2));
    expect(weeks).toHaveLength(34);
    expect(weeks.at(-1)).toEqual(new Date(2026, 2, 2));
  });

  it("gives only this week without a day, or with one in this week", () => {
    const thisWeek = [new Date(2026, 9, 19)];
    expect(weekStartsSince(today, MONDAY, undefined)).toEqual(thisWeek);
    expect(weekStartsSince(today, MONDAY, new Date(2026, 9, 20))).toEqual(
      thisWeek,
    );
  });

  it("gives only this week for a day still to come", () => {
    expect(weekStartsSince(today, MONDAY, new Date(2026, 11, 1))).toEqual([
      new Date(2026, 9, 19),
    ]);
  });
});

describe("weekEnd", () => {
  it("is midnight of the first day of the next week", () => {
    expect(weekEnd(new Date(2026, 9, 26))).toEqual(new Date(2026, 10, 2));
  });

  it("crosses into the next year", () => {
    expect(weekEnd(new Date(2026, 11, 28))).toEqual(new Date(2027, 0, 4));
  });
});

describe("earliestDate", () => {
  it("gives the earliest date, leaving out the missing ones", () => {
    const earliest = new Date(2026, 0, 5);
    expect(earliestDate([new Date(2026, 3, 1), undefined, earliest])).toBe(
      earliest,
    );
  });

  it("is undefined when every date is missing", () => {
    expect(earliestDate([undefined, undefined])).toBeUndefined();
    expect(earliestDate([])).toBeUndefined();
  });
});

describe("isMissedDay", () => {
  const today = new Date(2026, 9, 28, 18, 30);

  it("is a day already gone without a workout", () => {
    expect(isMissedDay(new Date(2026, 9, 27), false, today)).toBe(true);
  });

  it("isn't a day that was trained", () => {
    expect(isMissedDay(new Date(2026, 9, 27), true, today)).toBe(false);
  });

  it("isn't today, at any hour, nor a day still to come", () => {
    expect(isMissedDay(new Date(2026, 9, 28), false, today)).toBe(false);
    expect(isMissedDay(new Date(2026, 9, 29), false, today)).toBe(false);
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

describe("startOfDay", () => {
  it("keeps the local day and drops the time", () => {
    expect(startOfDay(new Date(2026, 10, 19, 23, 59, 30))).toEqual(
      new Date(2026, 10, 19),
    );
  });
});

describe("msUntilNextDay", () => {
  it("counts up to the next local midnight", () => {
    expect(msUntilNextDay(new Date(2026, 10, 19, 23, 59, 30))).toBe(30_000);
  });

  it("is a whole day at midnight itself", () => {
    const midnight = new Date(2026, 10, 19);
    expect(midnight.getTime() + msUntilNextDay(midnight)).toBe(
      new Date(2026, 10, 20).getTime(),
    );
  });

  it("rolls over the end of the month and the year", () => {
    const now = new Date(2026, 11, 31, 12, 0, 0);
    expect(new Date(now.getTime() + msUntilNextDay(now))).toEqual(
      new Date(2027, 0, 1),
    );
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

describe("fromIso and fromIsoOrNull", () => {
  it("read back the instant toIso wrote", () => {
    const moment = new Date(2026, 9, 30, 18, 5, 7, 123);

    expect(fromIso(toIso(moment))).toEqual(moment);
    expect(fromIsoOrNull(toIso(moment))).toEqual(moment);
  });

  it("keep a missing date missing", () => {
    expect(fromIsoOrNull(null)).toBeNull();
  });
});
