import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Spacing } from "@/constants/theme";
import type { Weight } from "@/types/weight";
import { formatDisplayDate, isToday } from "@/utils/date";
import { formatWeight } from "@/utils/weight";

type WeightEntryRowProps = Readonly<{
  entry: Weight;
  onEdit?: (date: string) => void;
  onDelete?: (date: string) => void;
}>;

export function WeightEntryRow({
  entry,
  onEdit,
  onDelete,
}: WeightEntryRowProps) {
  return (
    <SurfaceCard radius="md" style={styles.row}>
      <View style={styles.copy}>
        <Text type="smallBold">
          {formatDisplayDate(entry.entry_date)}
          {isToday(entry.entry_date) ? " · Today" : ""}
        </Text>
        <Text type="small" themeColor="textSecondary" numberOfLines={1}>
          {entry.note ?? "No feeling logged"}
        </Text>
      </View>

      <View style={styles.actions}>
        <Text type="smallBold" themeColor="primary">
          {formatWeight(entry.weight_kg)}
        </Text>
        <View style={styles.actionRow}>
          {onEdit ? (
            <InlineTextButton
              label="Edit"
              onPress={() => onEdit(entry.entry_date)}
            />
          ) : null}
          {onDelete ? (
            <InlineTextButton
              label="Delete"
              tone="accent"
              onPress={() => onDelete(entry.entry_date)}
            />
          ) : null}
        </View>
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
  copy: {
    flex: 1,
    gap: 2,
  },
  actions: {
    alignItems: "flex-end",
    gap: Spacing.one,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "center",
  },
});
