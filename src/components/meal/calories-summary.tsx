import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { MacrosRow } from "@/components/meal/macros-row";
import { IconCircleButton } from "@/components/ui/icon-circle-button";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import type { MealDaySummary } from "@/types/meal";
import { toDateKey } from "@/utils/date";
import { mealCountLabel } from "@/utils/meal";
import { addMealHref, caloriesTabHref } from "@/utils/meal-routes";

type CaloriesSummaryProps = Readonly<{
  summary?: MealDaySummary;
}>;

export function CaloriesSummary({ summary }: CaloriesSummaryProps) {
  const today = toDateKey();
  const hasMeals = summary != null && summary.mealCount > 0;
  const mealLabel =
    summary != null && hasMeals
      ? mealCountLabel(summary.mealCount)
      : "Log a meal photo to start";

  return (
    <SurfaceCard muted style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text type="label" themeColor="textSecondary">
            Today's calories
          </Text>
          <Text
            type="number"
            themeColor={hasMeals ? "primary" : "textSecondary"}
          >
            {hasMeals && summary ? Math.round(summary.totalCalories) : 0}
          </Text>
          <Text type="small" themeColor="textSecondary">
            {mealLabel}
          </Text>
        </View>
        <IconCircleButton
          accessibilityLabel="Add meal"
          onPress={() => router.push(addMealHref(today))}
        />
      </View>

      {hasMeals && summary ? (
        <MacrosRow
          proteinG={summary.proteinG}
          carbohydratesG={summary.carbohydratesG}
          fatG={summary.fatG}
        />
      ) : null}

      <InlineTextButton
        label="View calorie history"
        tone="primary"
        onPress={() => router.push(caloriesTabHref)}
      />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
});
