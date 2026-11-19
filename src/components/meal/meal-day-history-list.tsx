import type { ListRenderItem } from "@shopify/flash-list";
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { MealDayRow } from "@/components/meal/meal-day-row";
import { ListItemSeparator, ScreenList } from "@/components/ui/screen-list";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { MealDaySummary } from "@/types/meal";

type MealDayHistoryListProps = Readonly<{
  days: MealDaySummary[];
  header: ReactNode;
  onPressDay: (entryDate: string) => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  isPending?: boolean;
  pendingFallback?: ReactNode;
}>;

export function MealDayHistoryList({
  days,
  header,
  onPressDay,
  onEndReached,
  isLoadingMore = false,
  isPending = false,
  pendingFallback,
}: MealDayHistoryListProps) {
  const theme = useTheme();

  const renderItem: ListRenderItem<MealDaySummary> = ({ item }) => (
    <MealDayRow summary={item} onPress={onPressDay} />
  );

  return (
    <ScreenList
      data={isPending ? [] : days}
      keyExtractor={(item) => item.entryDate}
      renderItem={renderItem}
      onEndReached={onEndReached}
      ItemSeparatorComponent={ListItemSeparator}
      header={
        <>
          {header}
          {isPending ? pendingFallback : null}
          {!isPending ? (
            <Text type="subtitle">By day</Text>
          ) : null}
        </>
      }
      empty={
        isPending ? null : (
          <Text type="small" themeColor="textSecondary">
            No meals yet. Log a photo to start tracking calories.
          </Text>
        )
      }
      footer={
        isLoadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
});
