import { supabase } from "@/lib/supabase";
import { deleteMealPhoto } from "@/services/meal-photo.service";
import type { Meal, MealDaySummary, MealInsert } from "@/types/meal";
import { groupMealsByDate, toDaySummary } from "@/utils/meal";

export type MealUpdateInput = Partial<
  Omit<MealInsert, "id" | "user_id" | "created_at" | "updated_at">
>;

export type MealHistoryPage = {
  days: MealDaySummary[];
  nextCursor: string | null;
};

/** Days per history page — covers the longest chart range (30D). */
const HISTORY_PAGE_DAYS = 30;
/** Meal rows fetched per page attempt (multiple meals share a day). */
const HISTORY_MEAL_BATCH = 200;

export const mealRepository = {
  async getHistoryPage(options?: {
    beforeDate?: string;
    limitDays?: number;
  }): Promise<MealHistoryPage> {
    const limitDays = options?.limitDays ?? HISTORY_PAGE_DAYS;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    let query = supabase
      .from("meal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(HISTORY_MEAL_BATCH);

    if (options?.beforeDate) {
      query = query.lt("entry_date", options.beforeDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    const meals = data ?? [];
    if (meals.length === 0) {
      return { days: [], nextCursor: null };
    }

    let days = groupMealsByDate(meals);
    const hitMealLimit = meals.length >= HISTORY_MEAL_BATCH;

    // Truncated batches can cut mid-day — refill the oldest day fully.
    if (hitMealLimit && days.length > 0) {
      const oldestDate = days[days.length - 1]!.entryDate;
      const fullDayMeals = await mealRepository.getByDate(oldestDate);
      days = [...days.slice(0, -1), toDaySummary(oldestDate, fullDayMeals)];
    }

    const hasMoreDays = days.length > limitDays;
    if (hasMoreDays) {
      days = days.slice(0, limitDays);
    }

    const nextCursor =
      (hitMealLimit || hasMoreDays) && days.length > 0
        ? days[days.length - 1]!.entryDate
        : null;

    return { days, nextCursor };
  },

  async getByDate(entryDate: string): Promise<Meal[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", entryDate)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  },

  async getById(id: string): Promise<Meal> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async save(
    input: Omit<MealInsert, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Meal> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
      .from("meal_entries")
      .insert({
        ...input,
        user_id: user.id,
      })
      .select("*")
      .single();

    if (error) throw error;

    return data;
  },

  async update(id: string, input: MealUpdateInput): Promise<Meal> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
      .from("meal_entries")
      .update(input)
      .eq("user_id", user.id)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { data: meal, error: fetchError } = await supabase
      .from("meal_entries")
      .select("image_url")
      .eq("user_id", user.id)
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from("meal_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("id", id);

    if (error) throw error;

    await deleteMealPhoto(meal?.image_url);
  },
};
