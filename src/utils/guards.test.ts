import { describe, expect, it } from "@jest/globals";

import {
  isArrayOf,
  isFiniteNumber,
  isInteger,
  isOneOf,
  isRecord,
  isString,
  orNull,
} from "./guards";

describe("isRecord", () => {
  it("accepts a plain object, even an empty one", () => {
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord({})).toBe(true);
  });

  it("rejects null and lists, which typeof also calls objects", () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
  });

  it("rejects values that aren't objects", () => {
    expect(isRecord("a")).toBe(false);
    expect(isRecord(1)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });
});

describe("isString", () => {
  it("accepts text, even empty", () => {
    expect(isString("a")).toBe(true);
    expect(isString("")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isString(1)).toBe(false);
    expect(isString(null)).toBe(false);
  });
});

describe("isFiniteNumber", () => {
  it("accepts whole and decimal numbers, negative too", () => {
    expect(isFiniteNumber(80.5)).toBe(true);
    expect(isFiniteNumber(-3)).toBe(true);
    expect(isFiniteNumber(0)).toBe(true);
  });

  it("rejects NaN and Infinity", () => {
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it("rejects a number written as text", () => {
    expect(isFiniteNumber("80")).toBe(false);
  });
});

describe("isInteger", () => {
  it("accepts whole numbers", () => {
    expect(isInteger(10)).toBe(true);
    expect(isInteger(0)).toBe(true);
  });

  it("rejects decimals and text", () => {
    expect(isInteger(1.5)).toBe(false);
    expect(isInteger("10")).toBe(false);
  });
});

describe("isOneOf", () => {
  const sizes = ["small", "large"] as const;

  it("accepts a value of the list", () => {
    expect(isOneOf(sizes, "large")).toBe(true);
  });

  it("rejects a value outside the list, and one with another case", () => {
    expect(isOneOf(sizes, "medium")).toBe(false);
    expect(isOneOf(sizes, "Large")).toBe(false);
  });
});

describe("orNull", () => {
  const isNullableString = orNull(isString);

  it("accepts null and what the check accepts", () => {
    expect(isNullableString(null)).toBe(true);
    expect(isNullableString("a")).toBe(true);
  });

  it("rejects undefined: a missing field is not a null one", () => {
    expect(isNullableString(undefined)).toBe(false);
  });

  it("rejects what the check rejects", () => {
    expect(isNullableString(1)).toBe(false);
  });
});

describe("isArrayOf", () => {
  it("accepts a list where every item passes, and an empty one", () => {
    expect(isArrayOf(["a", "b"], isString)).toBe(true);
    expect(isArrayOf([], isString)).toBe(true);
  });

  it("rejects a list with one item that doesn't pass", () => {
    expect(isArrayOf(["a", 1], isString)).toBe(false);
  });

  it("rejects something that isn't a list", () => {
    expect(isArrayOf({ 0: "a" }, isString)).toBe(false);
    expect(isArrayOf("ab", isString)).toBe(false);
  });
});
