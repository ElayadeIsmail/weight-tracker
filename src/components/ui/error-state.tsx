import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";

type ErrorStateProps = Readonly<{
  error?: Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
}>;

export function ErrorState({
  error,
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  style,
  flex = false,
}: ErrorStateProps) {
  const description = message ?? error?.message ?? "Please try again.";

  return (
    <View style={[flex ? styles.flex : styles.centered, style]}>
      <Text type="subtitle" style={styles.title}>
        {title}
      </Text>
      <Text type="small" themeColor="textSecondary" style={styles.description}>
        {description}
      </Text>
      {onRetry ? (
        <Button
          label={retryLabel}
          variant="secondary"
          size="sm"
          onPress={onRetry}
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
