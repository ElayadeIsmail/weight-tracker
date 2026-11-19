import { Image, StyleSheet, View } from "react-native";

import { InlineTextButton } from "@/components/ui/inline-text-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Meal } from "@/types/meal";
import { formatKcal } from "@/utils/meal";

type MealRowProps = Readonly<{
  meal: Meal;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}>;

export function MealRow({ meal, onEdit, onDelete }: MealRowProps) {
  const theme = useTheme();

  return (
    <SurfaceCard radius="md" style={styles.row}>
      {meal.image_url ? (
        <Image source={{ uri: meal.image_url }} style={styles.thumb} />
      ) : (
        <View
          style={[
            styles.thumb,
            styles.thumbPlaceholder,
            { backgroundColor: theme.backgroundSelected },
          ]}
        />
      )}

      <View style={styles.copy}>
        <Text type="smallBold" numberOfLines={1}>
          {meal.dish_name}
        </Text>
        {meal.items ? (
          <Text type="small" themeColor="textSecondary" numberOfLines={2}>
            {meal.items}
          </Text>
        ) : null}
        <Text type="small" themeColor="textSecondary">
          P {Math.round(Number(meal.protein_g))}g · C{" "}
          {Math.round(Number(meal.carbohydrates_g))}g · F{" "}
          {Math.round(Number(meal.fat_g))}g
        </Text>
      </View>

      <View style={styles.actions}>
        <Text type="smallBold" themeColor="primary">
          {formatKcal(Number(meal.calories_kcal))}
        </Text>
        {onEdit ? (
          <InlineTextButton
            label="Edit"
            tone="primary"
            onPress={() => onEdit(meal.id)}
          />
        ) : null}
        {onDelete ? (
          <InlineTextButton
            label="Delete"
            tone="accent"
            onPress={() => onDelete(meal.id)}
          />
        ) : null}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
  },
  thumbPlaceholder: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  actions: {
    alignItems: "flex-end",
    gap: Spacing.one,
  },
});
