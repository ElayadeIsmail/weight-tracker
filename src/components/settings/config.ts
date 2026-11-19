import {
  DEFAULT_ACTIVITY_LEVEL,
  DEFAULT_SEX,
} from "@/constants/profile";
import type { Profile } from "@/types/profile";
import { resolveInitialBirthDate } from "@/utils/birth-date";
import { resolveInitialHeight, resolveInitialWeight } from "@/utils/picker";

export const PROFILE_FORM_COPY = {
  sectionTitle: "Your profile",
  sectionDescription:
    "Update your details so we can estimate your daily calorie needs.",
  calorieTargetLabel: "Daily calorie target (optional)",
  calorieTargetPlaceholder:
    "Leave blank to estimate from stats + weight goal",
  saveError: "Could not update your profile.",
} as const;

export function getProfileFormDefaults(profile: Profile) {
  return {
    displayName: profile.display_name?.trim() ?? "",
    heightCm: resolveInitialHeight(profile.height_cm),
    goalWeightKg: resolveInitialWeight(profile.goal_weight_kg),
    sex: profile.sex ?? DEFAULT_SEX,
    birthDate: resolveInitialBirthDate(profile.birth_date),
    activityLevel: profile.activity_level ?? DEFAULT_ACTIVITY_LEVEL,
    calorieTargetInput:
      profile.calorie_target_kcal != null
        ? String(Math.round(profile.calorie_target_kcal))
        : "",
  };
}
