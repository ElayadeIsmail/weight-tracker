import * as v from "valibot";

import {
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/constants/picker";
import {
  ACTIVITY_LEVEL_VALUES,
  CALORIE_TARGET_MAX_KCAL,
  CALORIE_TARGET_MIN_KCAL,
  SEX_VALUES,
} from "@/constants/profile";

export const profileUpdateSchema = v.object({
  displayName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Enter a display name."),
    v.maxLength(80, "Name must be 80 characters or fewer."),
  ),
  heightCm: v.pipe(
    v.number("Pick a height."),
    v.minValue(HEIGHT_MIN_CM, `Height must be at least ${HEIGHT_MIN_CM} cm.`),
    v.maxValue(HEIGHT_MAX_CM, `Height must be at most ${HEIGHT_MAX_CM} cm.`),
  ),
  goalWeightKg: v.pipe(
    v.number("Pick a goal weight."),
    v.minValue(WEIGHT_MIN_KG, `Goal must be at least ${WEIGHT_MIN_KG} kg.`),
    v.maxValue(WEIGHT_MAX_KG, `Goal must be at most ${WEIGHT_MAX_KG} kg.`),
  ),
  sex: v.picklist(SEX_VALUES, "Select your sex."),
  birthDate: v.pipe(
    v.string(),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a birth date."),
  ),
  activityLevel: v.picklist(
    ACTIVITY_LEVEL_VALUES,
    "Select your activity level.",
  ),
  calorieTargetInput: v.pipe(
    v.string(),
    v.trim(),
    v.check((value) => {
      if (value === "") return true;
      const calories = Number(value);
      return (
        Number.isFinite(calories) &&
        calories >= CALORIE_TARGET_MIN_KCAL &&
        calories <= CALORIE_TARGET_MAX_KCAL
      );
    }, `Enter a target between ${CALORIE_TARGET_MIN_KCAL} and ${CALORIE_TARGET_MAX_KCAL}, or leave blank.`),
  ),
});

export type ProfileUpdateValues = v.InferOutput<typeof profileUpdateSchema>;
