import { CALORIE_TARGET_MIN_KCAL } from "@/constants/profile";
import type { Profile, ProfileActivityLevel, ProfileSex } from "@/types/profile";
import { parseDateKey } from "@/utils/date";

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
} as const satisfies Record<ProfileActivityLevel, number>;

/** Daily deficit applied when current weight is above goal. */
export const WEIGHT_LOSS_DEFICIT_KCAL = 500;
/** Daily surplus applied when current weight is below goal. */
export const WEIGHT_GAIN_SURPLUS_KCAL = 300;
/** Treat goal as maintain when within this many kg. */
export const GOAL_WEIGHT_TOLERANCE_KG = 0.5;

export type GoalDirection = "lose" | "gain" | "maintain";

export type DailyCalorieTarget = {
  targetKcal: number;
  /** Maintenance TDEE before goal adjustment (when estimated). */
  maintenanceKcal: number | null;
  source: "custom" | "estimated";
  goalDirection: GoalDirection | null;
};

export type CalorieProgressResult = {
  /** 0–1 fill for the progress bar (capped at 100%). */
  progress: number;
  /** Eaten as a percent of target (can exceed 100). */
  percent: number;
  remainingKcal: number;
  over: boolean;
};

export function ageFromBirthDate(
  birthDate: string,
  onDate: Date = new Date(),
): number {
  const birth = parseDateKey(birthDate);
  let age = onDate.getFullYear() - birth.getFullYear();
  const hadBirthday =
    onDate.getMonth() > birth.getMonth() ||
    (onDate.getMonth() === birth.getMonth() &&
      onDate.getDate() >= birth.getDate());

  if (!hadBirthday) age -= 1;
  return Math.max(age, 0);
}

/** Mifflin–St Jeor resting energy expenditure. */
export function estimateBmrKcal(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: ProfileSex,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return sex === "male" ? base + 5 : base - 161;
}

export function estimateTdeeKcal(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: ProfileSex,
  activityLevel: ProfileActivityLevel,
): number {
  const bmr = estimateBmrKcal(weightKg, heightCm, ageYears, sex);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function goalDirectionFromWeights(
  currentKg: number,
  goalKg: number,
): GoalDirection {
  const delta = currentKg - goalKg;
  if (Math.abs(delta) <= GOAL_WEIGHT_TOLERANCE_KG) return "maintain";
  return delta > 0 ? "lose" : "gain";
}

export function applyGoalAdjustment(
  maintenanceKcal: number,
  direction: GoalDirection,
): number {
  let target = maintenanceKcal;
  if (direction === "lose") {
    target = maintenanceKcal - WEIGHT_LOSS_DEFICIT_KCAL;
  } else if (direction === "gain") {
    target = maintenanceKcal + WEIGHT_GAIN_SURPLUS_KCAL;
  }
  return Math.max(CALORIE_TARGET_MIN_KCAL, Math.round(target));
}

type ResolveDailyCalorieTargetInput = Readonly<{
  profile: Pick<
    Profile,
    | "calorie_target_kcal"
    | "sex"
    | "birth_date"
    | "activity_level"
    | "height_cm"
    | "goal_weight_kg"
  > | null | undefined;
  weightKg: number | null | undefined;
}>;

/**
 * Prefer an explicit profile target. Otherwise estimate TDEE and adjust for
 * lose/gain based on current weight vs goal weight.
 */
export function resolveDailyCalorieTarget({
  profile,
  weightKg,
}: ResolveDailyCalorieTargetInput): DailyCalorieTarget | null {
  if (!profile) return null;

  if (
    profile.calorie_target_kcal != null &&
    Number.isFinite(profile.calorie_target_kcal)
  ) {
    return {
      targetKcal: Math.round(profile.calorie_target_kcal),
      maintenanceKcal: null,
      source: "custom",
      goalDirection: null,
    };
  }

  if (
    weightKg == null ||
    !Number.isFinite(weightKg) ||
    profile.sex == null ||
    profile.birth_date == null ||
    profile.activity_level == null ||
    profile.height_cm == null
  ) {
    return null;
  }

  const ageYears = ageFromBirthDate(profile.birth_date);
  if (ageYears < 15) return null;

  const maintenanceKcal = estimateTdeeKcal(
    weightKg,
    profile.height_cm,
    ageYears,
    profile.sex,
    profile.activity_level,
  );

  const goalDirection =
    profile.goal_weight_kg != null && Number.isFinite(profile.goal_weight_kg)
      ? goalDirectionFromWeights(weightKg, profile.goal_weight_kg)
      : "maintain";

  return {
    targetKcal: applyGoalAdjustment(maintenanceKcal, goalDirection),
    maintenanceKcal,
    source: "estimated",
    goalDirection,
  };
}

export function getCalorieProgress(
  eatenKcal: number,
  targetKcal: number,
): CalorieProgressResult {
  if (targetKcal <= 0) {
    return {
      progress: 0,
      percent: 0,
      remainingKcal: 0,
      over: false,
    };
  }

  const ratio = eatenKcal / targetKcal;
  const remainingKcal = Math.round(targetKcal - eatenKcal);

  return {
    progress: Math.min(Math.max(ratio, 0), 1),
    percent: Math.round(ratio * 100),
    remainingKcal,
    over: eatenKcal > targetKcal,
  };
}

export function calorieTargetSourceLabel(target: DailyCalorieTarget): string {
  if (target.source === "custom") return "Your target";
  if (target.goalDirection === "lose") return "Goal: fat loss";
  if (target.goalDirection === "gain") return "Goal: weight gain";
  return "Estimated need";
}
