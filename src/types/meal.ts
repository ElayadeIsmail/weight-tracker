import { Database } from "./database";

export type Meal = Database["public"]["Tables"]["meal_entries"]["Row"];

export type MealInsert =
  Database["public"]["Tables"]["meal_entries"]["Insert"];

export type NutritionEstimate = {
  is_food: boolean;
  dish_name: string;
  serving: string;
  items: string;
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
  confidence: number;
};

export type MealDaySummary = {
  entryDate: string;
  totalCalories: number;
  mealCount: number;
  proteinG: number;
  carbohydratesG: number;
  fatG: number;
  fiberG: number;
  meals: Meal[];
};

export type PickedMealImage = {
  uri: string;
  mimeType: string;
  fileName?: string;
  /** Raw base64 from the picker — preferred for Android uploads. */
  base64?: string;
};
