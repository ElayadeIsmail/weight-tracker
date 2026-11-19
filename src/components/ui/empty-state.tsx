import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";

type EmptyStateProps = Readonly<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
}>;

export function EmptyState({
  title = "Nothing here yet",
  description = "When you have data, it will show up here.",
  actionLabel,
  onAction,
  style,
  flex = false,
}: EmptyStateProps) {
  return (
    <View style={[flex ? styles.flex : styles.centered, style]}>
      <Text type="subtitle" style={styles.title}>
        {title}
      </Text>
      <Text type="small" themeColor="textSecondary" style={styles.description}>
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          variant="secondary"
          size="sm"
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
  },
  action: {
    marginTop: Spacing.two,
    alignSelf: "center",
  },
});
