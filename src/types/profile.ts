import type { Database } from "./database";

export type ThemePreference = "light" | "dark" | "system";

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export type BmiResult = {
  value: number;
  category: BmiCategory;
  label: string;
  description: string;
};

export type ProfileSex = "male" | "female";

export type ProfileActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
