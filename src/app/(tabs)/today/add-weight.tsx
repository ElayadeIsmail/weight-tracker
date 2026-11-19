import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { Screen, ScreenHeader } from "@/components/ui";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { WeightForm } from "@/components/weight/weight-form";
import { useSaveWeight, useWeightEntries } from "@/hooks/use-weight";
import { toDateKey } from "@/utils/date";
import { findEntryByDate, getWeightStats } from "@/utils/weight";

function resolveDateParam(date: string | string[] | undefined): string {
  const value = Array.isArray(date) ? date[0] : date;
  return value || toDateKey();
}

export default function AddWeightScreen() {
  const { date } = useLocalSearchParams<{ date?: string | string[] }>();
  const { data } = useWeightEntries();
  const { mutateAsync: saveWeight } = useSaveWeight();
  const [selectedDate, setSelectedDate] = useState(() =>
    resolveDateParam(date),
  );

  const entries = data ?? [];
  const stats = getWeightStats(data);
  const existingEntry = findEntryByDate(entries, selectedDate) ?? null;
  const isEditing = existingEntry != null;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Log"
        title={isEditing ? "Edit weight" : "Add weight"}
        description={
          isEditing
            ? "Update this day's weight log. Your data syncs to your account."
            : "Pick a date and log your weight. Your data syncs to your account."
        }
        action={
          <InlineTextButton
            label="Back"
            tone="primary"
            onPress={() => router.back()}
          />
        }
      />

      <WeightForm
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        existingEntry={existingEntry}
        fallbackWeightKg={stats.latest?.weight_kg}
        onSave={async ({ date: entryDate, weightKg, note }) => {
          await saveWeight({
            entry_date: entryDate,
            weight_kg: weightKg,
            note: note ?? null,
          });
          router.back();
        }}
      />
    </Screen>
  );
}
