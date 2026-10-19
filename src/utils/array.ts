// Adds the item if it's missing and removes it if it's there.
export function toggleItem<T>(items: readonly T[], item: T): T[] {
  return items.includes(item)
    ? items.filter((current) => current !== item)
    : [...items, item];
}
