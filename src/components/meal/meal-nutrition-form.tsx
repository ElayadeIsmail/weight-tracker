import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import * as v from "valibot";

import { FormTextField } from "@/components/auth/form-text-field";
import {
  mealNutritionSchema,
  toMealNutritionSubmitValues,
  type MealNutritionFormValues,
  type MealNutritionSubmitValues,
} from "@/components/meal/schema";
import { Button } from "@/components/ui/button";
import { errorToString } from "@/components/ui/form/error-to-string";
import { fieldErrorsFromIssues } from "@/components/ui/form/field-errors";
import { FormMessage } from "@/components/ui/form/form-message";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";

type MealNutritionFormProps = Readonly<{
  defaultValues: MealNutritionFormValues;
  title?: string;
  submitLabel: string;
  loading?: boolean;
  disabled?: boolean;
  footer?: string | null;
  onSubmit: (values: MealNutritionSubmitValues) => Promise<void>;
}>;

export function MealNutritionForm({
  defaultValues,
  title = "Meal details",
  submitLabel,
  loading = false,
  disabled = false,
  footer = null,
  onSubmit,
}: MealNutritionFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        const result = v.safeParse(mealNutritionSchema, value);
        if (result.success) return undefined;
        return { fields: fieldErrorsFromIssues(result.issues) };
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await onSubmit(toMealNutritionSubmitValues(value));
      } catch (err) {
        setError(errorToString(err) ?? "Could not save this meal.");
      }
    },
  });

  return (
    <SurfaceCard style={styles.card}>
      <Text type="label" themeColor="textSecondary">
        {title}
      </Text>

      <FormTextField
        form={form}
        name="dishName"
        label="Dish name"
        placeholder="e.g. Chicken bowl"
        autoCapitalize="sentences"
      />
      <FormTextField
        form={form}
        name="serving"
        label="Serving (optional)"
        placeholder="e.g. 1 bowl"
        autoCapitalize="sentences"
      />
      <FormTextField
        form={form}
        name="items"
        label="Items (optional)"
        placeholder="e.g. rice; chicken; sauce"
        autoCapitalize="sentences"
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <FormTextField
            form={form}
            name="caloriesInput"
            label="Calories"
            placeholder="kcal"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.half}>
          <FormTextField
            form={form}
            name="proteinInput"
            label="Protein (g)"
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <FormTextField
            form={form}
            name="carbohydratesInput"
            label="Carbs (g)"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.half}>
          <FormTextField
            form={form}
            name="fatInput"
            label="Fat (g)"
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <FormTextField
        form={form}
        name="fiberInput"
        label="Fiber (g)"
        keyboardType="decimal-pad"
      />

      {footer ? (
        <Text type="small" themeColor="textSecondary">
          {footer}
        </Text>
      ) : null}
      {error ? <FormMessage>{error}</FormMessage> : null}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => {
          const busy = disabled || loading || isSubmitting;
          return (
            <Button
              label={isSubmitting || loading ? "Saving…" : submitLabel}
              loading={isSubmitting || loading}
              disabled={busy}
              onPress={() => {
                void form.handleSubmit();
              }}
            />
          );
        }}
      </form.Subscribe>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  half: {
    flex: 1,
  },
});
