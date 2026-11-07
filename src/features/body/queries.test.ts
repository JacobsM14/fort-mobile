import { describe, expect, it } from "@jest/globals";

import {
  bodyWeightOnDay,
  bodyWeightsQuery,
  deleteBodyWeight,
  firstBodyWeightDayQuery,
  latestBodyWeightKg,
  recentBodyWeights,
  saveBodyWeight,
  toBodyWeightEntries,
  toBodyWeightPoints,
  toBodyWeightsByDay,
} from "./queries";

// Reads back only the days of the test: the database is shared by the file.
function savedIn(year: number) {
  return bodyWeightsQuery()
    .all()
    .filter((row) => row.measuredOn.startsWith(`${year}-`));
}

describe("firstBodyWeightDayQuery", () => {
  it("reads the day of the earliest weigh-in", () => {
    saveBodyWeight(new Date(1999, 4, 2), 79);
    saveBodyWeight(new Date(1998, 11, 30), 80);

    expect(firstBodyWeightDayQuery().all()).toEqual([
      { measuredOn: "1998-12-30" },
    ]);
  });
});

describe("saveBodyWeight", () => {
  it("saves the weight under its day", () => {
    saveBodyWeight(new Date(2033, 2, 10, 8), 80.5);

    expect(savedIn(2033)).toEqual([
      { id: expect.any(String), measuredOn: "2033-03-10", weightKg: 80.5 },
    ]);
  });

  it("replaces the weight when saved again the same day, at any hour", () => {
    saveBodyWeight(new Date(2034, 5, 1, 10), 81);
    saveBodyWeight(new Date(2034, 5, 1, 19, 30), 80.2);

    const rows = savedIn(2034);

    expect(rows).toHaveLength(1);
    expect(rows[0].weightKg).toBe(80.2);
  });

  it("keeps the same row, and its id, when it replaces a weight", () => {
    saveBodyWeight(new Date(2035, 0, 5, 9), 90);
    const [before] = savedIn(2035);
    saveBodyWeight(new Date(2035, 0, 5, 21), 89);

    expect(savedIn(2035)[0].id).toBe(before.id);
  });

  it("counts the night and the next morning as two days", () => {
    saveBodyWeight(new Date(2036, 6, 9, 23, 30), 70);
    saveBodyWeight(new Date(2036, 6, 10, 0, 10), 71);

    expect(savedIn(2036).map((row) => row.measuredOn)).toEqual([
      "2036-07-09",
      "2036-07-10",
    ]);
  });

  it("is read oldest day first, whatever the order saved", () => {
    saveBodyWeight(new Date(2037, 8, 20), 75);
    saveBodyWeight(new Date(2037, 8, 3), 76);

    expect(savedIn(2037).map((row) => row.measuredOn)).toEqual([
      "2037-09-03",
      "2037-09-20",
    ]);
  });
});

describe("deleteBodyWeight", () => {
  it("removes the weigh-in of that day only, whatever the hour", () => {
    saveBodyWeight(new Date(2038, 3, 4, 8), 70);
    saveBodyWeight(new Date(2038, 3, 5, 8), 71);

    deleteBodyWeight(new Date(2038, 3, 4, 22));

    expect(savedIn(2038).map((row) => row.measuredOn)).toEqual(["2038-04-05"]);
  });

  it("does nothing on a day without weigh-in", () => {
    saveBodyWeight(new Date(2039, 0, 2), 70);

    deleteBodyWeight(new Date(2039, 0, 3));

    expect(savedIn(2039)).toHaveLength(1);
  });
});

describe("toBodyWeightEntries", () => {
  it("turns each day key into midnight of that day, keeping the order", () => {
    const entries = toBodyWeightEntries([
      { id: "a", measuredOn: "2026-10-24", weightKg: 82 },
      { id: "b", measuredOn: "2026-10-26", weightKg: 81.5 },
    ]);

    expect(entries).toEqual([
      { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
      { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
    ]);
  });

  it("is empty without rows", () => {
    expect(toBodyWeightEntries([])).toEqual([]);
  });
});

describe("toBodyWeightPoints", () => {
  it("keeps the day and the weight of each entry", () => {
    const points = toBodyWeightPoints([
      { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
      { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
    ]);

    expect(points).toEqual([
      { date: new Date(2026, 9, 24), value: 82 },
      { date: new Date(2026, 9, 26), value: 81.5 },
    ]);
  });
});

describe("toBodyWeightsByDay", () => {
  it("looks each weigh-in up by its day key", () => {
    const byDay = toBodyWeightsByDay([
      { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
      { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
    ]);

    expect(byDay.get("2026-10-24")).toBe(82);
    expect(byDay.get("2026-10-26")).toBe(81.5);
    expect(byDay.get("2026-10-25")).toBeUndefined();
  });
});

describe("latestBodyWeightKg", () => {
  it("starts from the latest weigh-in", () => {
    expect(
      latestBodyWeightKg([
        { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
        { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
      ]),
    ).toBe(81.5);
  });

  it("starts from a default without weigh-ins", () => {
    expect(latestBodyWeightKg([])).toBe(70);
  });
});

describe("bodyWeightOnDay", () => {
  const entries = [
    { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
    { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
  ];

  it("gives the weight and what it changed from the previous weigh-in", () => {
    expect(bodyWeightOnDay(entries, "2026-10-26")).toMatchObject({
      weightKg: 81.5,
      changeKg: -0.5,
    });
  });

  it("has no change for the first weigh-in", () => {
    expect(bodyWeightOnDay(entries, "2026-10-24")).toMatchObject({
      weightKg: 82,
      changeKg: null,
    });
  });

  it("is empty for a day without weigh-in", () => {
    expect(bodyWeightOnDay(entries, "2026-10-25")).toBeUndefined();
  });
});

describe("recentBodyWeights", () => {
  const entry = (day: number, weightKg: number) => ({
    id: `d${day}`,
    date: new Date(2026, 9, day),
    weightKg,
  });

  it("lists the latest first, each with its change from the day before", () => {
    const result = recentBodyWeights(
      [entry(20, 82), entry(22, 81.5), entry(25, 82.5)],
      5,
    );

    expect(result.map((item) => item.id)).toEqual(["d25", "d22", "d20"]);
    expect(result.map((item) => item.changeKg)).toEqual([1, -0.5, null]);
  });

  it("keeps the last ones, comparing the oldest shown with the one before", () => {
    const result = recentBodyWeights(
      [entry(1, 80), entry(2, 81), entry(3, 79), entry(4, 79)],
      2,
    );

    expect(result.map((item) => item.id)).toEqual(["d4", "d3"]);
    expect(result.map((item) => item.changeKg)).toEqual([0, -2]);
  });

  it("is empty without weigh-ins", () => {
    expect(recentBodyWeights([], 5)).toEqual([]);
  });
});
