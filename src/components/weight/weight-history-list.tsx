import type { ListRenderItem } from "@shopify/flash-list";
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ListItemSeparator, ScreenList } from "@/components/ui/screen-list";
import { Text } from "@/components/ui/text";
import { WeightEntryRow } from "@/components/weight/weight-entry-row";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Weight } from "@/types/weight";

type WeightHistoryListProps = Readonly<{
  entries: Weight[];
  header: ReactNode;
  onEdit?: (date: string) => void;
  onDelete?: (date: string) => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  isPending?: boolean;
  pendingFallback?: ReactNode;
}>;

export function WeightHistoryList({
  entries,
  header,
  onEdit,
  onDelete,
  onEndReached,
  isLoadingMore = false,
  isPending = false,
  pendingFallback,
}: WeightHistoryListProps) {
  const theme = useTheme();

  const renderItem: ListRenderItem<Weight> = ({ item }) => (
    <WeightEntryRow entry={item} onEdit={onEdit} onDelete={onDelete} />
  );

  return (
    <ScreenList
      data={isPending ? [] : entries}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onEndReached={onEndReached}
      ItemSeparatorComponent={ListItemSeparator}
      header={
        <>
          {header}
          {isPending ? pendingFallback : null}
          {!isPending ? <Text type="subtitle">By day</Text> : null}
        </>
      }
      empty={
        isPending ? null : (
          <Text type="small" themeColor="textSecondary">
            No entries yet. Log your weight on the Today tab.
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
