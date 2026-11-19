import { router } from "expo-router";
import { useMemo } from "react";
import { Alert } from "react-native";

import { ScreenHeader } from "@/components/ui/screen-header";
import { WeightChart } from "@/components/weight/weight-chart";
import { WeightHistoryList } from "@/components/weight/weight-history-list";
import { WeightHistorySkeleton } from "@/components/weight/weight-history-skeleton";
import { useDeleteWeight, useWeightHistory } from "@/hooks/use-weight";
import { sortEntriesByDateDesc, toChartPoints } from "@/utils/weight";

export default function HistoryScreen() {
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWeightHistory();
  const { mutate } = useDeleteWeight();
  const entries = data ?? [];

  const chartPoints = useMemo(() => toChartPoints(entries, 90), [entries]);
  const historyEntries = useMemo(
    () => sortEntriesByDateDesc(entries),
    [entries],
  );

  const handleDelete = (date: string) => {
    Alert.alert("Delete entry", "Remove this day's weight log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void mutate(date);
        },
      },
    ]);
  };

  const handleEdit = (date: string) => {
    router.push({
      pathname: "/today/add-weight",
      params: { date },
    });
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <WeightHistoryList
      entries={historyEntries}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onEndReached={handleEndReached}
      isLoadingMore={isFetchingNextPage}
      isPending={isPending}
      pendingFallback={<WeightHistorySkeleton />}
      header={
        <>
          <ScreenHeader
            eyebrow="Progress"
            title="History"
            description="Switch chart range, tap a day to edit, or delete a log."
            eyebrowColor="accent"
          />
          {!isPending ? <WeightChart points={chartPoints} /> : null}
        </>
      }
    />
  );
}
