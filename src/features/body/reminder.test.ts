import { describe, expect, it } from "@jest/globals";

import { nextWeightReminder } from "./reminder";

const SUNDAY = 0;
const MONDAY = 1;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

// Wednesday, 28 October 2026.
const wednesday = (hour: number, minute = 0) =>
  new Date(2026, 9, 28, hour, minute);

describe("nextWeightReminder", () => {
  it("is nothing when the reminder is off", () => {
    expect(nextWeightReminder(null, wednesday(8), false)).toBeNull();
  });

  it("falls on a later day of this week", () => {
    expect(nextWeightReminder(FRIDAY, wednesday(8), false)).toEqual(
      new Date(2026, 9, 30, 9),
    );
  });

  it("falls on the next week when the day has gone by", () => {
    expect(nextWeightReminder(MONDAY, wednesday(8), false)).toEqual(
      new Date(2026, 10, 2, 9),
    );
  });

  it("reaches both ends of the week", () => {
    expect(nextWeightReminder(SUNDAY, wednesday(8), false)).toEqual(
      new Date(2026, 10, 1, 9),
    );
    expect(nextWeightReminder(SATURDAY, wednesday(8), false)).toEqual(
      new Date(2026, 9, 31, 9),
    );
  });

  describe("on the chosen day itself", () => {
    const WEDNESDAY = 3;

    it("is today while its hour hasn't come", () => {
      expect(nextWeightReminder(WEDNESDAY, wednesday(8), false)).toEqual(
        new Date(2026, 9, 28, 9),
      );
    });

    it("is next week once its hour has passed", () => {
      expect(nextWeightReminder(WEDNESDAY, wednesday(10), false)).toEqual(
        new Date(2026, 10, 4, 9),
      );
    });

    it("is next week at the very hour, which is no longer ahead", () => {
      expect(nextWeightReminder(WEDNESDAY, wednesday(9), false)).toEqual(
        new Date(2026, 10, 4, 9),
      );
    });

    it("is next week when the user already weighed in today", () => {
      expect(nextWeightReminder(WEDNESDAY, wednesday(8), true)).toEqual(
        new Date(2026, 10, 4, 9),
      );
    });
  });

  it("ignores a weigh-in today when the chosen day is another", () => {
    expect(nextWeightReminder(FRIDAY, wednesday(8), true)).toEqual(
      new Date(2026, 9, 30, 9),
    );
  });

  it("crosses the end of the month and of the year", () => {
    const newYearsEve = new Date(2026, 11, 31, 10);
    expect(nextWeightReminder(THURSDAY, newYearsEve, false)).toEqual(
      new Date(2027, 0, 7, 9),
    );
    expect(nextWeightReminder(FRIDAY, newYearsEve, false)).toEqual(
      new Date(2027, 0, 1, 9),
    );
  });

  // In a time zone that changes its clock that weekend (Europe, for one) a
  // week is 25 hours long here; elsewhere this still has to hold.
  it("stays at the same local hour across a clock change", () => {
    const friday = new Date(2026, 9, 23, 10);
    const next = nextWeightReminder(MONDAY, friday, false);
    expect(next?.getDate()).toBe(26);
    expect(next?.getHours()).toBe(9);
    expect(next?.getMinutes()).toBe(0);
  });

  it("leaves the date it is given as it was", () => {
    const now = wednesday(8);
    nextWeightReminder(FRIDAY, now, false);
    expect(now).toEqual(wednesday(8));
  });
});
