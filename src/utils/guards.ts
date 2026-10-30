// Checks for values whose type isn't known yet, like the result of JSON.parse.
// Each one narrows the value, so after it TypeScript knows what it is.

// A plain object: not null and not a list, which typeof also calls "object".
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

// NaN and Infinity are numbers too, but never a valid amount.
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

// One of the values of an enum list, like SET_TYPES.
export function isOneOf<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return values.some((item) => item === value);
}

// The same check, also accepting null.
export function orNull<T>(check: (value: unknown) => value is T) {
  return (value: unknown): value is T | null => value === null || check(value);
}

export function isArrayOf<T>(
  value: unknown,
  check: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.every(check);
}
