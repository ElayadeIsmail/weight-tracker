import {
  DEFAULT_HEIGHT_CM,
  DEFAULT_WEIGHT_KG,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/constants/picker";

export function clampWeightKg(value: number): number {
  const rounded = Math.round(value * 10) / 10;
  return Math.min(Math.max(rounded, WEIGHT_MIN_KG), WEIGHT_MAX_KG);
}

export function clampHeightCm(value: number): number {
  return Math.min(Math.max(Math.round(value), HEIGHT_MIN_CM), HEIGHT_MAX_CM);
}

export function splitWeight(value: number): { whole: number; decimal: number } {
  const clamped = clampWeightKg(value);
  const whole = Math.floor(clamped);
  const decimal = Math.round((clamped - whole) * 10);
  return { whole, decimal };
}

export function joinWeight(whole: number, decimal: number): number {
  return clampWeightKg(whole + decimal / 10);
}

export function createWholeWeightOptions(): number[] {
  return Array.from(
    { length: WEIGHT_MAX_KG - WEIGHT_MIN_KG + 1 },
    (_, index) => WEIGHT_MIN_KG + index,
  );
}

export function createDecimalOptions(): number[] {
  return Array.from({ length: 10 }, (_, index) => index);
}

export function createHeightOptions(): number[] {
  return Array.from(
    { length: HEIGHT_MAX_CM - HEIGHT_MIN_CM + 1 },
    (_, index) => HEIGHT_MIN_CM + index,
  );
}

export function resolveInitialWeight(value?: number | null): number {
  return value == null ? DEFAULT_WEIGHT_KG : clampWeightKg(value);
}
export function resolveInitialHeight(value?: number | null): number {
  return value == null ? DEFAULT_HEIGHT_CM : clampHeightCm(value);
}
