// The items grouped by the key each one gives, in their original order.
export function groupBy<T, K>(
  items: readonly T[],
  getKey: (item: T) => K,
): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = getKey(item);
    const group = groups.get(key);
    if (group === undefined) {
      groups.set(key, [item]);
    } else {
      group.push(item);
    }
  }
  return groups;
}

// Adds the item if it's missing and removes it if it's there.
export function toggleItem<T>(items: readonly T[], item: T): T[] {
  return items.includes(item)
    ? items.filter((current) => current !== item)
    : [...items, item];
}
