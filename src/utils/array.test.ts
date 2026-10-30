import { describe, expect, it } from "@jest/globals";

import { groupBy, toggleItem } from "./array";

describe("groupBy", () => {
  it("groups the items by key, keeping their order", () => {
    const groups = groupBy(["apple", "avocado", "banana", "apricot"], (item) =>
      item[0],
    );

    expect(groups.get("a")).toEqual(["apple", "avocado", "apricot"]);
    expect(groups.get("b")).toEqual(["banana"]);
  });

  it("has no group for a key nobody gave", () => {
    expect(groupBy(["a"], (item) => item).get("z")).toBeUndefined();
  });
});

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
