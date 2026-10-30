import { describe, expect, it } from "@jest/globals";

import {
  intensityLevel,
  toCalendarLevels,
  toDailySets,
  INTENSITY_THRESHOLDS,
} from "./activity-calendar";

describe("intensityLevel", () => {
  it("is nothing without sets", () => {
    expect(intensityLevel(0)).toBe(0);
  });

  it("reaches each level with the sets of its threshold", () => {
    expect(INTENSITY_THRESHOLDS).toEqual([1, 8, 15, 22]);
    expect(intensityLevel(1)).toBe(1);
    expect(intensityLevel(7)).toBe(1);
    expect(intensityLevel(8)).toBe(2);
    expect(intensityLevel(14)).toBe(2);
    expect(intensityLevel(15)).toBe(3);
    expect(intensityLevel(21)).toBe(3);
    expect(intensityLevel(22)).toBe(4);
  });

  it("stays at the top however many sets there are", () => {
    expect(intensityLevel(100)).toBe(4);
  });
});

describe("toDailySets", () => {
  it("counts the sets of each day", () => {
    const rows = [
      { startedAt: new Date(2026, 9, 20, 18) },
      { startedAt: new Date(2026, 9, 20, 18) },
      { startedAt: new Date(2026, 9, 21, 9) },
    ];

    expect(toDailySets(rows)).toEqual(
      new Map([
        ["2026-10-20", 2],
        ["2026-10-21", 1],
      ]),
    );
  });

  it("adds up the workouts of the same day", () => {
    const rows = [
      { startedAt: new Date(2026, 9, 20, 8) },
      { startedAt: new Date(2026, 9, 20, 19) },
    ];

    expect(toDailySets(rows).get("2026-10-20")).toBe(2);
  });

  // The day is the local one: a workout just after midnight is that day's,
  // not the day before's as its UTC date would say in a timezone east of UTC.
  it("puts a set just after midnight on its own day", () => {
    const rows = [
      { startedAt: new Date(2026, 9, 26, 0, 30) },
      { startedAt: new Date(2026, 9, 25, 23, 30) },
    ];

    const setsByDay = toDailySets(rows);

    expect(setsByDay.get("2026-10-26")).toBe(1);
    expect(setsByDay.get("2026-10-25")).toBe(1);
  });

  it("is empty without sets", () => {
    expect(toDailySets([]).size).toBe(0);
  });
});

describe("toCalendarLevels", () => {
  // Mondays, and a Wednesday evening as today.
  const weekStarts = [new Date(2026, 9, 12), new Date(2026, 9, 19)];
  const today = new Date(2026, 9, 21, 18);

  it("gives a column per week with seven days each", () => {
    const levels = toCalendarLevels(weekStarts, new Map(), today);

    expect(levels).toHaveLength(2);
    expect(levels.every((week) => week.length === 7)).toBe(true);
  });

  it("puts each day's level in its own row, the week's first day on top", () => {
    const setsByDay = new Map([
      ["2026-10-12", 1],
      ["2026-10-13", 8],
      ["2026-10-21", 25],
    ]);

    expect(toCalendarLevels(weekStarts, setsByDay, today)).toEqual([
      [1, 2, 0, 0, 0, 0, 0],
      [0, 0, 4, null, null, null, null],
    ]);
  });

  it("leaves the days still to come without a level, but not today", () => {
    const levels = toCalendarLevels(weekStarts, new Map(), today);

    // Wednesday is today: shown. Thursday on: not yet.
    expect(levels[1][2]).toBe(0);
    expect(levels[1][3]).toBeNull();
  });

  it("shows today even when it has just begun", () => {
    const justAfterMidnight = new Date(2026, 9, 21, 0, 5);

    expect(
      toCalendarLevels(weekStarts, new Map(), justAfterMidnight)[1][2],
    ).toBe(0);
  });

  it("starts each week on the day it is given", () => {
    // A week that starts on a Sunday.
    const sunday = new Date(2026, 9, 18);
    const setsByDay = new Map([["2026-10-18", 3]]);

    expect(toCalendarLevels([sunday], setsByDay, today)).toEqual([
      [1, 0, 0, 0, null, null, null],
    ]);
  });

  it("crosses into the next month in the middle of a week", () => {
    const setsByDay = new Map([
      ["2026-10-31", 9],
      ["2026-11-01", 15],
    ]);

    expect(
      toCalendarLevels(
        [new Date(2026, 9, 26)],
        setsByDay,
        new Date(2026, 10, 3),
      ),
    ).toEqual([[0, 0, 0, 0, 0, 2, 3]]);
  });

  // 25 October 2026 is when the clocks go back in Europe: the week keeps its
  // seven days, none repeated or skipped.
  it("keeps seven different days across a clock change", () => {
    const setsByDay = new Map(
      [19, 20, 21, 22, 23, 24, 25].map((day) => [`2026-10-${day}`, 1]),
    );

    expect(
      toCalendarLevels(
        [new Date(2026, 9, 19)],
        setsByDay,
        new Date(2026, 10, 1),
      ),
    ).toEqual([[1, 1, 1, 1, 1, 1, 1]]);
  });
});
