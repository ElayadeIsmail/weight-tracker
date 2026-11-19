import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { MealNutritionForm } from "@/components/meal/meal-nutrition-form";
import {
  mealToNutritionFormValues,
  type MealNutritionSubmitValues,
} from "@/components/meal/schema";
import { DateField } from "@/components/ui/date-field";
import { Spacing } from "@/constants/theme";
import { useUpdateMeal } from "@/hooks/use-meals";
import type { Meal } from "@/types/meal";

type EditMealFormProps = Readonly<{
  meal: Meal;
  onSaved?: () => void;
}>;

export function EditMealForm({ meal, onSaved }: EditMealFormProps) {
  const [entryDate, setEntryDate] = useState(meal.entry_date);
  const { mutateAsync: updateMeal, isPending } = useUpdateMeal();

  const handleSave = async (values: MealNutritionSubmitValues) => {
    await updateMeal({
      id: meal.id,
      input: {
        entry_date: entryDate,
        dish_name: values.dish_name,
        serving: values.serving,
        items: values.items,
        calories_kcal: values.calories_kcal,
        protein_g: values.protein_g,
        carbohydrates_g: values.carbohydrates_g,
        fat_g: values.fat_g,
        fiber_g: values.fiber_g,
      },
    });
    onSaved?.();
  };

  return (
    <View style={styles.form}>
      <DateField value={entryDate} onChange={setEntryDate} />
      <MealNutritionForm
        defaultValues={mealToNutritionFormValues({
          dish_name: meal.dish_name,
          serving: meal.serving,
          items: meal.items,
          calories_kcal: Number(meal.calories_kcal),
          protein_g: Number(meal.protein_g),
          carbohydrates_g: Number(meal.carbohydrates_g),
          fat_g: Number(meal.fat_g),
          fiber_g: Number(meal.fiber_g),
        })}
        title="Edit meal"
        submitLabel="Save changes"
        loading={isPending}
        footer="Adjust the estimate or your manual entry anytime."
        onSubmit={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.five,
  },
});
