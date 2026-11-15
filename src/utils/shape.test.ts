import { describe, expect, it } from "@jest/globals";

import { curvePath } from "./shape";

describe("curvePath", () => {
  it("goes through every point, straight when they are aligned", () => {
    expect(
      curvePath([
        [0, 0],
        [6, 0],
        [12, 0],
      ]),
    ).toBe("M0 0 C1 0 4 0 6 0 C8 0 11 0 12 0");
  });

  it("bends smoothly through a point between two others", () => {
    expect(
      curvePath([
        [0, 0],
        [6, 6],
        [12, 0],
      ]),
    ).toBe("M0 0 C1 1 4 6 6 6 C8 6 11 1 12 0");
  });

  it("leaves a sharp corner at a repeated point", () => {
    expect(
      curvePath([
        [0, 0],
        [6, 6],
        [6, 6],
        [12, 0],
      ]),
    ).toBe("M0 0 C1 1 6 6 6 6 C6 6 11 1 12 0");
  });

  it("loops back to the first point when closed", () => {
    expect(
      curvePath(
        [
          [0, 0],
          [6, 0],
          [6, 6],
        ],
        true,
      ),
    ).toBe("M0 0 C0 -1 5 -1 6 0 C7 1 7 6 6 6 C5 6 0 1 0 0 Z");
  });

  it("is empty with fewer than two points", () => {
    expect(curvePath([[1, 1]])).toBe("");
  });
});
