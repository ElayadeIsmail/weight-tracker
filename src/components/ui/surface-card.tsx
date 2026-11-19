import type { ReactNode } from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SurfaceCardProps = Readonly<{
  children: ReactNode;
  muted?: boolean;
  radius?: "md" | "lg";
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

export function SurfaceCard({
  children,
  muted = false,
  radius = "lg",
  style,
  onLayout,
}: SurfaceCardProps) {
  const theme = useTheme();

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.card,
        {
          borderRadius: radius === "md" ? Radius.md : Radius.lg,
          backgroundColor: muted ? theme.primaryMuted : theme.backgroundElement,
          borderColor: theme.border,
          borderWidth: muted ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
