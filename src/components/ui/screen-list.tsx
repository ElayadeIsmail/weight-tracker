import { FlashList, type FlashListProps, type ListRenderItem } from "@shopify/flash-list";
import type { ReactElement, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getScreenContentPadding } from "@/utils/layout";

type ScreenListProps<T> = Readonly<{
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  header?: ReactNode;
  footer?: ReactNode;
  empty?: ReactNode;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  contentStyle?: StyleProp<ViewStyle>;
  ItemSeparatorComponent?: FlashListProps<T>["ItemSeparatorComponent"];
}>;

export function ScreenList<T>({
  data,
  renderItem,
  keyExtractor,
  header,
  footer,
  empty,
  onEndReached,
  onEndReachedThreshold = 0.4,
  contentStyle,
  ItemSeparatorComponent = ListItemSeparator,
}: ScreenListProps<T>) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ThemedView style={[styles.screen, { paddingTop: insets.top }]}>
      <FlashList
        data={data as T[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          header ? <View style={styles.header}>{header}</View> : undefined
        }
        ListFooterComponent={footer ? <>{footer}</> : undefined}
        ListEmptyComponent={empty ? <>{empty}</> : undefined}
        ItemSeparatorComponent={ItemSeparatorComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          getScreenContentPadding(insets),
          { backgroundColor: theme.background },
          contentStyle,
        ]}
        style={[styles.list, { backgroundColor: theme.background }]}
      />
    </ThemedView>
  );
}

export function ListItemSeparator(): ReactElement {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  header: {
    gap: Spacing.five,
    marginBottom: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
});
