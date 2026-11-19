import type { ProfileActivityLevel } from "@/types/profile";

export const ACTIVITY_LEVEL_OPTIONS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise",
  },
  {
    value: "lightly_active",
    label: "Lightly active",
    description: "Exercise 1–3 days/week",
  },
  {
    value: "moderately_active",
    label: "Moderately active",
    description: "Exercise 3–5 days/week",
  },
  {
    value: "very_active",
    label: "Very active",
    description: "Exercise 6–7 days/week",
  },
  {
    value: "extra_active",
    label: "Extra active",
    description: "Hard exercise or physical job",
  },
] as const satisfies ReadonlyArray<{
  value: ProfileActivityLevel;
  label: string;
  description: string;
}>;

export const ACTIVITY_LEVEL_VALUES = ACTIVITY_LEVEL_OPTIONS.map(
  (option) => option.value,
) as [ProfileActivityLevel, ...ProfileActivityLevel[]];

export const DEFAULT_ACTIVITY_LEVEL: ProfileActivityLevel =
  "moderately_active";

export function activityLevelLabel(value: ProfileActivityLevel): string {
  const option = ACTIVITY_LEVEL_OPTIONS.find((item) => item.value === value);
  return option?.label ?? value;
}
