import { router, useLocalSearchParams } from "expo-router";

import { EditMealForm } from "@/components/meal";
import { QueryBoundary } from "@/components/query-boundary";
import { Screen, ScreenHeader } from "@/components/ui";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { useMeal } from "@/hooks/use-meals";

function resolveIdParam(id: string | string[] | undefined): string | undefined {
  return Array.isArray(id) ? id[0] : id;
}

export default function EditMealScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const mealId = resolveIdParam(id);
  const mealQuery = useMeal(mealId);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Edit"
        title="Edit meal"
        description="Fix calories or macros if the estimate was off."
        action={
          <InlineTextButton
            label="Back"
            tone="primary"
            onPress={() => router.back()}
          />
        }
      />

      <QueryBoundary query={mealQuery}>
        {(meal) => (
          <EditMealForm meal={meal} onSaved={() => router.back()} />
        )}
      </QueryBoundary>
    </Screen>
  );
}
