import { useEffect, useRef, type ReactNode } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type DimensionValue,
  type ViewStyle,
} from "react-native";

import { SurfaceCard } from "@/components/ui/surface-card";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SkeletonProps = Readonly<{
  width?: DimensionValue;
  height?: number;
  radius?: keyof typeof Radius;
  style?: ViewStyle;
}>;

export function Skeleton({
  width = "100%",
  height = 14,
  radius = "sm",
  style,
}: SkeletonProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: Radius[radius],
          backgroundColor: theme.backgroundSelected,
          opacity,
        },
        style,
      ]}
    />
  );
}

type SkeletonCardProps = Readonly<{
  children: ReactNode;
  gap?: number;
}>;

export function SkeletonCard({
  children,
  gap = Spacing.two,
}: SkeletonCardProps) {
  return <SurfaceCard style={{ gap }}>{children}</SurfaceCard>;
}

export function SkeletonRowCard() {
  return (
    <SkeletonCard>
      <View style={styles.row}>
        <View style={styles.rowCopy}>
          <Skeleton width="42%" height={14} />
          <Skeleton width="28%" height={12} />
        </View>
        <Skeleton width={64} height={14} />
      </View>
    </SkeletonCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  rowCopy: {
    flex: 1,
    gap: Spacing.one,
  },
});
