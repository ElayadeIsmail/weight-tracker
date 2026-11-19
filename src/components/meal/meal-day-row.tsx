import { Pressable, StyleSheet, View } from "react-native";

import { MacrosRow } from "@/components/meal/macros-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import type { MealDaySummary } from "@/types/meal";
import { formatDisplayDate, isToday } from "@/utils/date";
import { formatKcal, mealCountLabel } from "@/utils/meal";

type MealDayRowProps = Readonly<{
  summary: MealDaySummary;
  onPress: (entryDate: string) => void;
}>;

export function MealDayRow({ summary, onPress }: MealDayRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(summary.entryDate)}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <SurfaceCard radius="md" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.copy}>
            <Text type="smallBold">
              {formatDisplayDate(summary.entryDate)}
              {isToday(summary.entryDate) ? " · Today" : ""}
            </Text>
            <Text type="small" themeColor="textSecondary">
              {mealCountLabel(summary.mealCount)}
            </Text>
          </View>
          <Text type="smallBold" themeColor="primary">
            {formatKcal(summary.totalCalories)}
          </Text>
        </View>
        <MacrosRow
          proteinG={summary.proteinG}
          carbohydratesG={summary.carbohydratesG}
          fatG={summary.fatG}
        />
      </SurfaceCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
