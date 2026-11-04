import { describe, expect, it } from "@jest/globals";

import { nextWeightReminder } from "./next-weight-reminder";

import type { WeightReminder } from "./weight-reminder";

const SUNDAY = 0;
const MONDAY = 1;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

const reminder = (weekday: number, hour = 9, minute = 0): WeightReminder => ({
  weekday,
  hour,
  minute,
});

// Wednesday, 28 October 2026.
const wednesday = (hour: number, minute = 0) =>
  new Date(2026, 9, 28, hour, minute);

describe("nextWeightReminder", () => {
  it("is nothing when the reminder is off", () => {
    expect(nextWeightReminder(null, wednesday(8), false)).toBeNull();
  });

  it("falls on a later day of this week", () => {
    expect(nextWeightReminder(reminder(FRIDAY), wednesday(8), false)).toEqual(
      new Date(2026, 9, 30, 9),
    );
  });

  it("falls on the next week when the day has gone by", () => {
    expect(nextWeightReminder(reminder(MONDAY), wednesday(8), false)).toEqual(
      new Date(2026, 10, 2, 9),
    );
  });

  it("reaches both ends of the week", () => {
    expect(nextWeightReminder(reminder(SUNDAY), wednesday(8), false)).toEqual(
      new Date(2026, 10, 1, 9),
    );
    expect(nextWeightReminder(reminder(SATURDAY), wednesday(8), false)).toEqual(
      new Date(2026, 9, 31, 9),
    );
  });

  it("goes off at the chosen hour and minute", () => {
    expect(
      nextWeightReminder(reminder(FRIDAY, 18, 45), wednesday(8), false),
    ).toEqual(new Date(2026, 9, 30, 18, 45));
  });

  describe("on the chosen day itself", () => {
    it("is today while its time hasn't come", () => {
      expect(
        nextWeightReminder(reminder(WEDNESDAY), wednesday(8), false),
      ).toEqual(new Date(2026, 9, 28, 9));
    });

    it("is next week once its time has passed", () => {
      expect(
        nextWeightReminder(reminder(WEDNESDAY), wednesday(10), false),
      ).toEqual(new Date(2026, 10, 4, 9));
    });

    it("is next week at the very time, which is no longer ahead", () => {
      expect(
        nextWeightReminder(reminder(WEDNESDAY), wednesday(9), false),
      ).toEqual(new Date(2026, 10, 4, 9));
    });

    it("is next week when the user already weighed in today", () => {
      expect(
        nextWeightReminder(reminder(WEDNESDAY), wednesday(8), true),
      ).toEqual(new Date(2026, 10, 4, 9));
    });

    it("tells the time apart by the minute", () => {
      const halfPastSeven = reminder(WEDNESDAY, 7, 30);
      expect(
        nextWeightReminder(halfPastSeven, wednesday(7, 29), false),
      ).toEqual(new Date(2026, 9, 28, 7, 30));
      expect(
        nextWeightReminder(halfPastSeven, wednesday(7, 31), false),
      ).toEqual(new Date(2026, 10, 4, 7, 30));
    });

    it("is still today for a time late in the day", () => {
      expect(
        nextWeightReminder(reminder(WEDNESDAY, 22), wednesday(21), false),
      ).toEqual(new Date(2026, 9, 28, 22));
    });
  });

  it("ignores a weigh-in today when the chosen day is another", () => {
    expect(nextWeightReminder(reminder(FRIDAY), wednesday(8), true)).toEqual(
      new Date(2026, 9, 30, 9),
    );
  });

  it("crosses the end of the month and of the year", () => {
    const newYearsEve = new Date(2026, 11, 31, 10);
    expect(nextWeightReminder(reminder(THURSDAY), newYearsEve, false)).toEqual(
      new Date(2027, 0, 7, 9),
    );
    expect(nextWeightReminder(reminder(FRIDAY), newYearsEve, false)).toEqual(
      new Date(2027, 0, 1, 9),
    );
  });

  // In a time zone that changes its clock that weekend (Europe, for one) a
  // week is 25 hours long here; elsewhere this still has to hold.
  it("stays at the same local time across a clock change", () => {
    const friday = new Date(2026, 9, 23, 10);
    const next = nextWeightReminder(reminder(MONDAY, 7, 30), friday, false);
    expect(next?.getDate()).toBe(26);
    expect(next?.getHours()).toBe(7);
    expect(next?.getMinutes()).toBe(30);
  });

  it("leaves the date it is given as it was", () => {
    const now = wednesday(8);
    nextWeightReminder(reminder(FRIDAY), now, false);
    expect(now).toEqual(wednesday(8));
  });
});
