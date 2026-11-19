import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";
import type { ThemeColor } from "@/constants/theme";

type InlineTextButtonProps = Readonly<{
  label: string;
  onPress: () => void;
  tone?: ThemeColor;
}>;

export function InlineTextButton({
  label,
  onPress,
  tone = "textSecondary",
}: InlineTextButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
    >
      <Text type="small" themeColor={tone}>
        {label}
      </Text>
    </Pressable>
  );
}
