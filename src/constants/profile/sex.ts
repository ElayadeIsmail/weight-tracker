import type { ProfileSex } from "@/types/profile";

export const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const satisfies ReadonlyArray<{ value: ProfileSex; label: string }>;

export const SEX_VALUES = SEX_OPTIONS.map((option) => option.value) as [
  ProfileSex,
  ...ProfileSex[],
];

export const DEFAULT_SEX: ProfileSex = "male";
