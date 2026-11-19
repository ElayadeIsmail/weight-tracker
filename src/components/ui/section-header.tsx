import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";

type SectionHeaderProps = Readonly<{
  title: string;
  description?: string;
}>;

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text type="subtitle">{title}</Text>
      {description ? (
        <Text type="small" themeColor="textSecondary">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
});
