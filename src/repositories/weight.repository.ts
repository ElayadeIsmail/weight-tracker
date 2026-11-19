import { supabase } from "@/lib/supabase";
import { Weight, WeightInsert } from "@/types/weight";

export type WeightHistoryPage = {
  entries: Weight[];
  nextCursor: string | null;
};

const HISTORY_PAGE_SIZE = 30;

export const weightRepository = {
  async getAll(): Promise<Weight[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
      .from("weight_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: true });

    if (error) throw error;

    return data;
  },

  async getHistoryPage(options?: {
    beforeDate?: string;
    limit?: number;
  }): Promise<WeightHistoryPage> {
    const limit = options?.limit ?? HISTORY_PAGE_SIZE;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    let query = supabase
      .from("weight_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .limit(limit + 1);

    if (options?.beforeDate) {
      query = query.lt("entry_date", options.beforeDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = data ?? [];
    const hasMore = rows.length > limit;
    const entries = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && entries.length > 0
        ? entries[entries.length - 1]!.entry_date
        : null;

    return { entries, nextCursor };
  },

  async save(input: Omit<WeightInsert, "id" | "user_id">): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    // One entry per day: insert when new, update when (user_id, entry_date) exists.
    const { error } = await supabase.from("weight_entries").upsert(
      {
        ...input,
        user_id: user.id,
      },
      { onConflict: "user_id,entry_date" },
    );

    if (error) throw error;
  },

  async remove(date: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated.");

    const { error } = await supabase
      .from("weight_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("entry_date", date);

    if (error) throw error;
  },
};
