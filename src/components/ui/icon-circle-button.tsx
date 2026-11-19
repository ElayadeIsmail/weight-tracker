import { Pressable, StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type IconCircleButtonProps = Readonly<{
  onPress: () => void;
  accessibilityLabel?: string;
  icon?: string;
}>;

export function IconCircleButton({
  onPress,
  accessibilityLabel = "Add",
  icon = "+",
}: IconCircleButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.primary,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text type="subtitle" style={styles.icon}>
        {icon}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#FFFFFF",
    lineHeight: 28,
    marginTop: -2,
  },
});
