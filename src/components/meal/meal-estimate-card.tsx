import { StyleSheet, View } from "react-native";

import { MacrosRow } from "@/components/meal/macros-row";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import type { NutritionEstimate } from "@/types/meal";

type MealEstimateCardProps = Readonly<{
  estimate: NutritionEstimate;
  loading?: boolean;
  disabled?: boolean;
  onSave: () => void;
}>;

export function MealEstimateCard({
  estimate,
  loading = false,
  disabled = false,
  onSave,
}: MealEstimateCardProps) {
  if (!estimate.is_food) return null;

  return (
    <SurfaceCard style={styles.card}>
      <Text type="label" themeColor="textSecondary">
        Estimate
      </Text>
      <Text type="headline">{estimate.dish_name}</Text>
      {estimate.serving ? (
        <Text type="small" themeColor="textSecondary">
          Serving: {estimate.serving}
        </Text>
      ) : null}
      {estimate.items ? (
        <Text type="small" themeColor="textSecondary">
          {estimate.items}
        </Text>
      ) : null}

      <Text type="number" themeColor="primary" style={styles.calories}>
        {Math.round(estimate.calories_kcal)}
      </Text>
      <Text type="small" themeColor="textSecondary">
        kcal estimated
      </Text>

      <View style={styles.macros}>
        <MacrosRow
          proteinG={estimate.protein_g}
          carbohydratesG={estimate.carbohydrates_g}
          fatG={estimate.fat_g}
          fiberG={estimate.fiber_g}
          showFiber
        />
      </View>

      <Text type="small" themeColor="textSecondary">
        Confidence {Math.round(estimate.confidence * 100)}%
      </Text>

      <Button
        label="Save meal"
        loading={loading}
        disabled={disabled}
        onPress={onSave}
      />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
  },
  calories: {
    marginTop: Spacing.two,
  },
  macros: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
});
