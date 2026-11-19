export const WEIGHT_MIN_KG = 30;
export const WEIGHT_MAX_KG = 250;
export const HEIGHT_MIN_CM = 120;
export const HEIGHT_MAX_CM = 230;
export const DEFAULT_WEIGHT_KG = 70;
export const DEFAULT_HEIGHT_CM = 170;

export const FEELING_OPTIONS = [
  "Great",
  "Good",
  "Okay",
  "Tired",
  "Bloated",
  "Sore",
] as const;

export type FeelingOption = (typeof FEELING_OPTIONS)[number];

export function isFeelingOption(value?: string): value is FeelingOption {
  return (FEELING_OPTIONS as readonly string[]).includes(value ?? "");
}

export const CHART_RANGES = [
  { days: 7, label: "7D" },
  { days: 14, label: "14D" },
  { days: 30, label: "30D" },
] as const;
