import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import type { ThemeColor } from "@/constants/theme";
import { Spacing } from "@/constants/theme";

type ScreenHeaderProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  eyebrowColor?: ThemeColor;
  action?: ReactNode;
}>;

export function ScreenHeader({
  eyebrow,
  title,
  description,
  eyebrowColor = "primary",
  action,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text type="label" themeColor={eyebrowColor}>
            {eyebrow}
          </Text>
          <Text type="title">{title}</Text>
        </View>
        {action}
      </View>
      <Text themeColor="textSecondary">{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
});
