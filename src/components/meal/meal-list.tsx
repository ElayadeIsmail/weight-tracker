import { StyleSheet, View } from "react-native";

import { MealRow } from "@/components/meal/meal-row";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import type { Meal } from "@/types/meal";

type MealListProps = Readonly<{
  meals: Meal[];
  emptyMessage?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}>;

export function MealList({
  meals,
  emptyMessage = "No meals logged for this day.",
  onEdit,
  onDelete,
}: MealListProps) {
  if (meals.length === 0) {
    return (
      <Text type="small" themeColor="textSecondary">
        {emptyMessage}
      </Text>
    );
  }

  return (
    <View style={styles.list}>
      {meals.map((meal) => (
        <MealRow
          key={meal.id}
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
});
