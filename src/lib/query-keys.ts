export const queryKeys = {
  profile: ["profile"] as const,
  weightEntries: ["weight_entries"] as const,
  weightHistory: ["weight_entries", "history"] as const,
  mealHistory: ["meal_entries", "history"] as const,
  mealsByDate: (entryDate: string) =>
    ["meal_entries", "by_date", entryDate] as const,
  mealById: (id: string) => ["meal_entries", "by_id", id] as const,
};
