import { describe, expect, it } from "@jest/globals";

import { toggleItem } from "./array";

describe("toggleItem", () => {
  it("adds a missing item at the end", () => {
    expect(toggleItem(["a", "b"], "c")).toEqual(["a", "b", "c"]);
  });

  it("removes an item that is there", () => {
    expect(toggleItem(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("returns a new array and leaves the original alone", () => {
    const items = ["a"];
    const result = toggleItem(items, "b");
    expect(result).not.toBe(items);
    expect(items).toEqual(["a"]);
  });
});
