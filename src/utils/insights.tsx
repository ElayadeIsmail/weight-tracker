import type { Weight } from "@/types/weight";
import { shiftDateKey } from "@/utils/date";
import { sortEntriesByDateAsc } from "@/utils/weight";

const round1 = (value: number): number => Math.round(value * 10) / 10;

export function getLoggingStreak(entries: Weight[], todayKey: string): number {
  const dates = new Set(entries.map((entry) => entry.entry_date));

  let cursor = dates.has(todayKey) ? todayKey : shiftDateKey(todayKey, -1);
  let streak = 0;

  while (dates.has(cursor)) {
    streak++;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

export function getWeeklyAverageKg(
  entries: Weight[],
  todayKey: string,
): number | null {
  const start = shiftDateKey(todayKey, -6);

  let total = 0;
  let count = 0;

  for (const entry of entries) {
    if (entry.entry_date >= start && entry.entry_date <= todayKey) {
      total += entry.weight_kg;
      count++;
    }
  }

  return count > 0 ? round1(total / count) : null;
}

export function getWeeklyChangeKg(
  entries: Weight[],
  todayKey: string,
): number | null {
  const sorted = sortEntriesByDateAsc(entries);

  if (sorted.length < 2) {
    return null;
  }

  const weekAgo = shiftDateKey(todayKey, -7);

  let latest: Weight | undefined;
  let older: Weight | undefined;

  for (let i = sorted.length - 1; i >= 0; i--) {
    const entry = sorted[i];

    if (!latest && entry.entry_date <= todayKey) {
      latest = entry;
    }

    if (!older && entry.entry_date <= weekAgo) {
      older = entry;
    }

    if (latest && older) {
      break;
    }
  }

  older ??= sorted[0];

  if (!latest || latest.id === older.id) {
    return null;
  }

  return round1(latest.weight_kg - older.weight_kg);
}
