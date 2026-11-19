import { StyleSheet, View } from "react-native";

import { MacrosRow } from "@/components/meal/macros-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import type { MealDaySummary } from "@/types/meal";
import { formatDisplayDate, isToday } from "@/utils/date";
import { mealCountLabel } from "@/utils/meal";

type MealDaySummaryCardProps = Readonly<{
  summary: MealDaySummary;
}>;

export function MealDaySummaryCard({ summary }: MealDaySummaryCardProps) {
  const dateLabel = isToday(summary.entryDate)
    ? "Today"
    : formatDisplayDate(summary.entryDate);
  const hasMeals = summary.mealCount > 0;

  return (
    <SurfaceCard muted style={styles.card}>
      <Text type="label" themeColor="textSecondary">
        {dateLabel}
      </Text>
      <Text
        type="number"
        themeColor={hasMeals ? "primary" : "textSecondary"}
      >
        {hasMeals ? Math.round(summary.totalCalories) : 0}
      </Text>
      <Text type="small" themeColor="textSecondary">
        {hasMeals
          ? `kcal · ${mealCountLabel(summary.mealCount)}`
          : "No meals logged yet"}
      </Text>

      {hasMeals ? (
        <View style={styles.macros}>
          <MacrosRow
            proteinG={summary.proteinG}
            carbohydratesG={summary.carbohydratesG}
            fatG={summary.fatG}
            fiberG={summary.fiberG}
            showFiber
          />
        </View>
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    gap: Spacing.half,
  },
  macros: {
    marginTop: Spacing.three,
  },
});
