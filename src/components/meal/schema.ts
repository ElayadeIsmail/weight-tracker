import * as v from "valibot";

const optionalText = (maxLength: number) =>
  v.pipe(v.string(), v.trim(), v.maxLength(maxLength, `Must be ${maxLength} characters or fewer.`));

function nonNegativeGramsInput(label: string) {
  return v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(`Enter ${label.toLowerCase()}.`),
    v.check((value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0 && parsed <= 2000;
    }, `${label} must be between 0 and 2000.`),
  );
}

export const mealNutritionSchema = v.object({
  dishName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Enter a dish name."),
    v.maxLength(120, "Dish name must be 120 characters or fewer."),
  ),
  serving: optionalText(120),
  items: optionalText(500),
  caloriesInput: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Enter calories."),
    v.check((value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 && parsed <= 10000;
    }, "Enter calories between 1 and 10000."),
  ),
  proteinInput: nonNegativeGramsInput("Protein"),
  carbohydratesInput: nonNegativeGramsInput("Carbs"),
  fatInput: nonNegativeGramsInput("Fat"),
  fiberInput: nonNegativeGramsInput("Fiber"),
});

export type MealNutritionFormValues = v.InferOutput<typeof mealNutritionSchema>;

export type MealNutritionSubmitValues = {
  dish_name: string;
  serving: string | null;
  items: string | null;
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
};

function roundNutrition(value: number) {
  return Math.round(value * 10) / 10;
}

export function toMealNutritionSubmitValues(
  value: MealNutritionFormValues,
): MealNutritionSubmitValues {
  return {
    dish_name: value.dishName.trim(),
    serving: value.serving.trim() || null,
    items: value.items.trim() || null,
    calories_kcal: roundNutrition(Number(value.caloriesInput)),
    protein_g: roundNutrition(Number(value.proteinInput)),
    carbohydrates_g: roundNutrition(Number(value.carbohydratesInput)),
    fat_g: roundNutrition(Number(value.fatInput)),
    fiber_g: roundNutrition(Number(value.fiberInput)),
  };
}

function formatNutritionNumber(value: number) {
  if (!Number.isFinite(value)) return "";
  return String(roundNutrition(value));
}

export function emptyMealNutritionFormValues(): MealNutritionFormValues {
  return {
    dishName: "",
    serving: "",
    items: "",
    caloriesInput: "",
    proteinInput: "0",
    carbohydratesInput: "0",
    fatInput: "0",
    fiberInput: "0",
  };
}

function clipText(value: string | null | undefined, maxLength: number) {
  if (!value) return "";
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : trimmed.slice(0, maxLength);
}

export function mealToNutritionFormValues(values: {
  dish_name: string;
  serving?: string | null;
  items?: string | null;
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
}): MealNutritionFormValues {
  return {
    dishName: clipText(values.dish_name, 120),
    serving: clipText(values.serving, 120),
    items: clipText(values.items, 500),
    caloriesInput: formatNutritionNumber(values.calories_kcal),
    proteinInput: formatNutritionNumber(values.protein_g),
    carbohydratesInput: formatNutritionNumber(values.carbohydrates_g),
    fatInput: formatNutritionNumber(values.fat_g),
    fiberInput: formatNutritionNumber(values.fiber_g),
  };
}
