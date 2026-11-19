import { supabase } from "@/lib/supabase";
import { Profile, ProfileUpdate } from "@/types/profile";

export const profileRepository = {
  async get(): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .single();

    if (error) throw error;

    return data;
  },

  async update(input: ProfileUpdate): Promise<Profile> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
