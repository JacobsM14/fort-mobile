import { asc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import { bodyWeights } from "@/db/schema";

import type { ChartPoint } from "@/utils/chart";

import { parseDateKey, toDateKey } from "@/utils/date";

export function bodyWeightsQuery() {
  return db
    .select({
      id: bodyWeights.id,
      measuredOn: bodyWeights.measuredOn,
      weightKg: bodyWeights.weightKg,
    })
    .from(bodyWeights)
    .orderBy(asc(bodyWeights.measuredOn));
}

export type BodyWeightEntry = { id: string; date: Date; weightKg: number };

// Each day key becomes midnight of that day, local time, oldest first.
export function toBodyWeightEntries(
  rows: readonly { id: string; measuredOn: string; weightKg: number }[],
): BodyWeightEntry[] {
  return rows.map((row) => ({
    id: row.id,
    date: parseDateKey(row.measuredOn),
    weightKg: row.weightKg,
  }));
}

// The chart only needs the day and the weight.
export function toBodyWeightPoints(
  entries: readonly BodyWeightEntry[],
): ChartPoint[] {
  return entries.map((entry) => ({ date: entry.date, value: entry.weightKg }));
}

// The weight of each day that has a weigh-in, by day key.
export function toBodyWeightsByDay(
  entries: readonly BodyWeightEntry[],
): Map<string, number> {
  return new Map(
    entries.map((entry) => [toDateKey(entry.date), entry.weightKg] as const),
  );
}

// Where a weight entry starts until there is a weigh-in to start from.
const DEFAULT_WEIGHT_KG = 70;

export function latestBodyWeightKg(entries: readonly BodyWeightEntry[]) {
  return entries.at(-1)?.weightKg ?? DEFAULT_WEIGHT_KG;
}

export type BodyWeightWithChange = BodyWeightEntry & {
  changeKg: number | null;
};

// Each weigh-in with what it changed from the one before it. The first ever
// weigh-in has nothing to compare with. Entries come oldest first.
function withChanges(
  entries: readonly BodyWeightEntry[],
): BodyWeightWithChange[] {
  return entries.map((entry, index) => ({
    ...entry,
    changeKg: index === 0 ? null : entry.weightKg - entries[index - 1].weightKg,
  }));
}

// The weigh-in of one day, or nothing when the user didn't weigh in that day.
export function bodyWeightOnDay(
  entries: readonly BodyWeightEntry[],
  dayKey: string,
): BodyWeightWithChange | undefined {
  return withChanges(entries).find((entry) => toDateKey(entry.date) === dayKey);
}

// The last weigh-ins, the latest first.
export function recentBodyWeights(
  entries: readonly BodyWeightEntry[],
  count: number,
): BodyWeightWithChange[] {
  return withChanges(entries).slice(-count).reverse();
}

// One live query for the chart and the list: both read the same entries.
export function useBodyWeights() {
  const { data, updatedAt } = useLiveQuery(bodyWeightsQuery(), []);

  return {
    entries: toBodyWeightEntries(data),
    loaded: updatedAt !== undefined,
  };
}

// One weigh-in per day: saving again the same day replaces its weight.
export function saveBodyWeight(measuredAt: Date, weightKg: number) {
  db.insert(bodyWeights)
    .values({ id: newId(), measuredOn: toDateKey(measuredAt), weightKg })
    .onConflictDoUpdate({
      target: bodyWeights.measuredOn,
      set: { weightKg, updatedAt: new Date() },
    })
    .run();
}

export function deleteBodyWeight(measuredAt: Date) {
  db.delete(bodyWeights)
    .where(eq(bodyWeights.measuredOn, toDateKey(measuredAt)))
    .run();
}
