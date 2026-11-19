import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ui/date-field";
import { FeelingChips } from "@/components/ui/feeling-chips";
import { fieldErrorsFromIssues } from "@/components/ui/form/field-errors";
import { FormMessage } from "@/components/ui/form/form-message";
import { SectionHeader } from "@/components/ui/section-header";
import { WeightPicker } from "@/components/ui/weight-picker";
import { weightEntrySchema } from "@/components/weight/schema";
import { isFeelingOption, type FeelingOption } from "@/constants/picker";
import { Spacing } from "@/constants/theme";
import type { Weight } from "@/types/weight";
import { shiftDateKey, toDateKey } from "@/utils/date";
import { resolveInitialWeight } from "@/utils/picker";

type WeightFormProps = Readonly<{
  selectedDate: string;
  onDateChange: (date: string) => void;
  existingEntry: Weight | null;
  fallbackWeightKg?: number | null;
  onSave: (input: {
    date: string;
    weightKg: number;
    note?: string | null;
  }) => Promise<void>;
}>;

function resolveNote(entry: Weight | null): FeelingOption | undefined {
  const note = entry?.note ?? undefined;
  return isFeelingOption(note) ? note : undefined;
}

export function WeightForm({
  selectedDate,
  onDateChange,
  existingEntry,
  fallbackWeightKg,
  onSave,
}: WeightFormProps) {
  const [error, setError] = useState<string | null>(null);

  const minimumDate = useMemo(() => {
    const key = shiftDateKey(toDateKey(), -365);
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, []);

  const form = useForm({
    defaultValues: {
      date: selectedDate,
      weightKg: resolveInitialWeight(
        existingEntry?.weight_kg ?? fallbackWeightKg,
      ),
      note: resolveNote(existingEntry) as string | null | undefined,
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = v.safeParse(weightEntrySchema, value);
        if (result.success) return undefined;
        return { fields: fieldErrorsFromIssues(result.issues) };
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await onSave({
          date: value.date,
          weightKg: value.weightKg,
          note: value.note ?? null,
        });
      } catch {
        setError("Could not save this entry.");
      }
    },
  });

  useEffect(() => {
    form.setFieldValue("date", selectedDate);
    form.setFieldValue(
      "weightKg",
      resolveInitialWeight(existingEntry?.weight_kg ?? fallbackWeightKg),
    );
    form.setFieldValue("note", resolveNote(existingEntry));
    setError(null);
  }, [existingEntry, fallbackWeightKg, form, selectedDate]);

  const isToday = selectedDate === toDateKey();

  return (
    <View style={styles.form}>
      <SectionHeader
        title="Log weight"
        description="Scroll to pick your weight, or nudge by 0.1 kg."
      />

      <form.Field name="date">
        {(field) => (
          <DateField
            value={field.state.value}
            onChange={(date) => {
              field.handleChange(date);
              onDateChange(date);
            }}
            minimumDate={minimumDate}
          />
        )}
      </form.Field>

      <form.Field name="weightKg">
        {(field) => (
          <WeightPicker
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </form.Field>

      <form.Field name="note">
        {(field) => (
          <FeelingChips
            value={field.state.value ?? undefined}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </form.Field>

      {error ? <FormMessage>{error}</FormMessage> : null}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            label={
              isSubmitting
                ? "Saving…"
                : existingEntry
                  ? isToday
                    ? "Update today"
                    : "Update entry"
                  : isToday
                    ? "Save today"
                    : "Save entry"
            }
            disabled={isSubmitting}
            onPress={() => {
              void form.handleSubmit();
            }}
          />
        )}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
