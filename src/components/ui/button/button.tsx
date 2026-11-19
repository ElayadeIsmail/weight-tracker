import { ActivityIndicator, Pressable } from "react-native";

import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";

import { sizeStyles, styles } from "./styles";
import type { ButtonProps } from "./types";
import { getVariantStyles } from "./variants";

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "default",
  size = "default",
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const { container, labelColor } = getVariantStyles(variant, theme);
  const resolvedLabelColor =
    labelColor === "#FFFFFF" ? "#FFFFFF" : theme[labelColor];

  const opacityForState = (pressed: boolean) => {
    if (isDisabled) return 0.5;
    if (pressed) return 0.85;
    return 1;
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        container,
        { opacity: opacityForState(pressed) },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={resolvedLabelColor} />
      ) : (
        <Text type="smallBold" style={{ color: resolvedLabelColor }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
