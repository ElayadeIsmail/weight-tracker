import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { AddMealForm } from "@/components/meal";
import { Screen, ScreenHeader } from "@/components/ui";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { formatLongDate, toDateKey } from "@/utils/date";

function resolveDateParam(date: string | string[] | undefined): string {
  const value = Array.isArray(date) ? date[0] : date;
  return value || toDateKey();
}

export default function AddMealScreen() {
  const { date } = useLocalSearchParams<{ date?: string | string[] }>();
  const [entryDate, setEntryDate] = useState(() => resolveDateParam(date));

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Log"
        title="Track meal"
        description={`Log a meal for ${formatLongDate(entryDate)} with a photo or enter details manually.`}
        action={
          <InlineTextButton
            label="Back"
            tone="primary"
            onPress={() => router.back()}
          />
        }
      />

      <AddMealForm
        entryDate={entryDate}
        onDateChange={setEntryDate}
        onSaved={() => router.back()}
      />
    </Screen>
  );
}
