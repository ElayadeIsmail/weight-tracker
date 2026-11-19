import { router, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import {
  CalorieDaySkeleton,
  CaloriesProgress,
  MacrosProgress,
  MealDaySummaryCard,
  MealList,
} from "@/components/meal";
import { IconCircleButton, Screen, ScreenHeader } from "@/components/ui";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useDailyCalorieTarget } from "@/hooks/use-daily-calorie-target";
import { useDeleteMeal, useMealsForDate } from "@/hooks/use-meals";
import { formatLongDate, toDateKey } from "@/utils/date";
import { addMealHref, editMealHref } from "@/utils/meal-routes";

function resolveDateParam(date: string | string[] | undefined): string {
  const value = Array.isArray(date) ? date[0] : date;
  return value || toDateKey();
}

export default function CalorieDayScreen() {
  const { date } = useLocalSearchParams<{ date?: string | string[] }>();
  const entryDate = resolveDateParam(date);
  const { data: summary, isPending } = useMealsForDate(entryDate);
  const { target, macros } = useDailyCalorieTarget();
  const { mutate: deleteMeal } = useDeleteMeal(entryDate);

  const handleDelete = (id: string) => {
    Alert.alert("Delete meal", "Remove this meal from the day?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMeal(id);
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Day"
        title={formatLongDate(entryDate)}
        description="Calories, protein, carbs, and fat for every meal logged this day."
        action={
          <View style={styles.actions}>
            <InlineTextButton
              label="Back"
              tone="primary"
              onPress={() => router.back()}
            />
            <IconCircleButton
              accessibilityLabel="Add meal for this day"
              onPress={() => router.push(addMealHref(entryDate))}
            />
          </View>
        }
      />

      {isPending || !summary ? (
        <CalorieDaySkeleton />
      ) : (
        <>
          <CaloriesProgress
            eatenKcal={summary.totalCalories}
            target={target}
          />
          <MacrosProgress
            eaten={{
              proteinG: summary.proteinG,
              carbohydratesG: summary.carbohydratesG,
              fatG: summary.fatG,
            }}
            targets={macros}
          />
          <MealDaySummaryCard summary={summary} />

          <View style={styles.section}>
            <Text type="subtitle">Meals</Text>
            <MealList
              meals={summary.meals}
              onEdit={(id) => router.push(editMealHref(id))}
              onDelete={handleDelete}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.three,
  },
});
