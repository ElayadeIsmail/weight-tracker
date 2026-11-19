import type { ChartPoint, Weight, WeightStats } from "@/types/weight";
import { formatChartLabel } from "@/utils/date";

export function sortEntriesByDateDesc(entries: Weight[]): Weight[] {
  return [...entries].sort((a, b) => b.entry_date.localeCompare(a.entry_date));
}

export function sortEntriesByDateAsc(entries: Weight[]): Weight[] {
  return [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
}

export function findEntryByDate(
  entries: Weight[],
  date: string,
): Weight | undefined {
  return entries.find((entry) => entry.entry_date === date);
}

export function getWeightStats(entries?: Weight[]): WeightStats {
  const sorted = entries ? sortEntriesByDateDesc(entries) : [];

  if (sorted.length === 0) {
    return {
      latest: null,
      previous: null,
      changeKg: null,
      averageKg: null,
      minKg: null,
      maxKg: null,
      count: 0,
    };
  }

  const weights = sorted.map((entry) => entry.weight_kg);
  const latest = sorted[0];
  const previous = sorted[1] ?? null;
  const total = weights.reduce((sum, value) => sum + value, 0);

  return {
    latest,
    previous,
    changeKg: previous ? latest.weight_kg - previous.weight_kg : null,
    averageKg: total / weights.length,
    minKg: Math.min(...weights),
    maxKg: Math.max(...weights),
    count: sorted.length,
  };
}

export function toChartPoints(entries: Weight[], limit = 14): ChartPoint[] {
  return sortEntriesByDateAsc(entries)
    .slice(-limit)
    .map((entry) => ({
      value: entry.weight_kg,
      label: formatChartLabel(entry.entry_date),
      date: entry.entry_date,
    }));
}

export function formatWeight(kg: number, digits = 1): string {
  return `${kg.toFixed(digits)} kg`;
}

export function formatWeightChange(changeKg: number | null): string {
  if (changeKg == null) return "No previous entry";
  if (changeKg === 0) return "No change";
  const sign = changeKg > 0 ? "+" : "";
  return `${sign}${changeKg.toFixed(1)} kg`;
}
export function parseWeightInput(value: string): number | null {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 500) {
    return null;
  }

  return Math.round(parsed * 10) / 10;
}

export function createEntryId(date: string): string {
  return `weight-${date}`;
}
