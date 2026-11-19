export const CALORIE_TARGET_MIN_KCAL = 800;
export const CALORIE_TARGET_MAX_KCAL = 10000;

export function parseCalorieTargetInput(value: string): number | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}
