import * as v from "valibot";

import { WEIGHT_MAX_KG, WEIGHT_MIN_KG } from "@/constants/picker";

export const weightEntrySchema = v.object({
  date: v.pipe(
    v.string(),
    v.nonEmpty("Pick a date."),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date."),
  ),
  weightKg: v.pipe(
    v.number("Pick a weight."),
    v.minValue(WEIGHT_MIN_KG, `Weight must be at least ${WEIGHT_MIN_KG} kg.`),
    v.maxValue(WEIGHT_MAX_KG, `Weight must be at most ${WEIGHT_MAX_KG} kg.`),
  ),
  note: v.optional(v.nullable(v.string())),
});

export type WeightEntryValues = v.InferOutput<typeof weightEntrySchema>;
