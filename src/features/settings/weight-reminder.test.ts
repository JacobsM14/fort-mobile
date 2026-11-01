import { describe, expect, it } from "@jest/globals";

import { parseWeightReminder } from "./weight-reminder";

const MONDAY_AT_NINE = { weekday: 1, hour: 9, minute: 0 };

describe("parseWeightReminder", () => {
  it("reads the day, hour and minute it was saved with", () => {
    expect(parseWeightReminder("3,7,30")).toEqual({
      weekday: 3,
      hour: 7,
      minute: 30,
    });
  });

  it("reaches both ends of the week and of the day", () => {
    expect(parseWeightReminder("0,0,0")).toEqual({
      weekday: 0,
      hour: 0,
      minute: 0,
    });
    expect(parseWeightReminder("6,23,59")).toEqual({
      weekday: 6,
      hour: 23,
      minute: 59,
    });
  });

  it("is Monday at nine when nothing was saved", () => {
    expect(parseWeightReminder(null)).toEqual(MONDAY_AT_NINE);
  });

  it("is the default for a value out of range", () => {
    expect(parseWeightReminder("7,9,0")).toEqual(MONDAY_AT_NINE);
    expect(parseWeightReminder("3,24,0")).toEqual(MONDAY_AT_NINE);
    expect(parseWeightReminder("3,9,60")).toEqual(MONDAY_AT_NINE);
    expect(parseWeightReminder("-1,9,0")).toEqual(MONDAY_AT_NINE);
  });

  it("is the default for what isn't a whole number", () => {
    expect(parseWeightReminder("3,9.5,0")).toEqual(MONDAY_AT_NINE);
    expect(parseWeightReminder("3,nine,0")).toEqual(MONDAY_AT_NINE);
    expect(parseWeightReminder("")).toEqual(MONDAY_AT_NINE);
  });

  // The first version saved only the weekday, under another key; a value like
  // that has no time to go with it.
  it("is the default for a weekday without its time", () => {
    expect(parseWeightReminder("3")).toEqual(MONDAY_AT_NINE);
  });
});
