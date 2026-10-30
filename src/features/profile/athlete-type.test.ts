import { describe, expect, it } from "@jest/globals";

import {
  averageSessions,
  consistencyLevel,
  nextConsistencyLevel,
} from "./athlete-type";

describe("averageSessions", () => {
  it("averages the sessions over every week, empty ones included", () => {
    expect(averageSessions([3, 0, 4, 1])).toBe(2);
  });

  it("is zero without weeks", () => {
    expect(averageSessions([])).toBe(0);
  });
});

describe("consistencyLevel", () => {
  it("goes up with the average sessions a week", () => {
    expect(consistencyLevel([1, 0, 2, 1])).toBe("sporadic");
    expect(consistencyLevel([2, 1, 3, 2])).toBe("regular");
    expect(consistencyLevel([3, 2, 4, 3])).toBe("steady");
  });

  it("is unstoppable with 4 sessions in each of the last two weeks", () => {
    expect(consistencyLevel([0, 0, 4, 5])).toBe("unstoppable");
  });

  it("needs both of the last two weeks for unstoppable", () => {
    expect(consistencyLevel([3, 3, 5, 3])).toBe("steady");
    expect(consistencyLevel([4])).toBe("steady");
  });

  it("is sporadic without weeks", () => {
    expect(consistencyLevel([])).toBe("sporadic");
  });
});

describe("nextConsistencyLevel", () => {
  it("is the level above, and none at the top", () => {
    expect(nextConsistencyLevel("sporadic")).toBe("regular");
    expect(nextConsistencyLevel("steady")).toBe("unstoppable");
    expect(nextConsistencyLevel("unstoppable")).toBeNull();
  });
});
