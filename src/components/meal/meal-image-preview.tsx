import { Image, StyleSheet } from "react-native";

import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type MealImagePreviewProps = Readonly<{
  uri?: string | null;
  isEstimating?: boolean;
  error?: string | null;
}>;

export function MealImagePreview({
  uri,
  isEstimating = false,
  error,
}: MealImagePreviewProps) {
  const theme = useTheme();

  if (!uri) {
    return (
      <SurfaceCard muted style={styles.placeholder}>
        <Text type="subtitle">No photo yet</Text>
        <Text type="small" themeColor="textSecondary">
          Use your camera or photo library. Images should be under 2MB.
        </Text>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard style={styles.previewCard}>
      <Image source={{ uri }} style={styles.preview} />
      {isEstimating ? (
        <Text type="small" themeColor="textSecondary">
          Estimating nutrition…
        </Text>
      ) : null}
      {error ? (
        <Text type="small" style={{ color: theme.accent }}>
          {error}
        </Text>
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    minHeight: 160,
    justifyContent: "center",
    gap: Spacing.one,
  },
  previewCard: {
    gap: Spacing.two,
    padding: Spacing.two,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: Radius.md,
  },
});
