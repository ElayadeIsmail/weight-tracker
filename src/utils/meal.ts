import type { Meal, MealDaySummary } from "@/types/meal";
import type { ChartPoint } from "@/types/weight";
import { formatChartLabel } from "@/utils/date";

export function formatKcal(value: number) {
  return `${Math.round(value)} kcal`;
}

export function toCaloriesChartPoints(days: MealDaySummary[]): ChartPoint[] {
  return [...days]
    .sort((a, b) => a.entryDate.localeCompare(b.entryDate))
    .map((day) => ({
      value: Math.round(day.totalCalories),
      label: formatChartLabel(day.entryDate),
      date: day.entryDate,
    }));
}

export function formatGrams(value: number) {
  return `${Math.round(value)}g`;
}

export function toDaySummary(entryDate: string, meals: Meal[]): MealDaySummary {
  return {
    entryDate,
    meals,
    mealCount: meals.length,
    totalCalories: meals.reduce(
      (sum, meal) => sum + Number(meal.calories_kcal),
      0,
    ),
    proteinG: meals.reduce((sum, meal) => sum + Number(meal.protein_g), 0),
    carbohydratesG: meals.reduce(
      (sum, meal) => sum + Number(meal.carbohydrates_g),
      0,
    ),
    fatG: meals.reduce((sum, meal) => sum + Number(meal.fat_g), 0),
    fiberG: meals.reduce((sum, meal) => sum + Number(meal.fiber_g), 0),
  };
}

export function groupMealsByDate(meals: Meal[]): MealDaySummary[] {
  const byDate = new Map<string, Meal[]>();

  for (const meal of meals) {
    const existing = byDate.get(meal.entry_date);
    if (existing) {
      existing.push(meal);
    } else {
      byDate.set(meal.entry_date, [meal]);
    }
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([entryDate, dayMeals]) => toDaySummary(entryDate, dayMeals));
}

export function mealCountLabel(count: number) {
  return `${count} ${count === 1 ? "meal" : "meals"}`;
}
