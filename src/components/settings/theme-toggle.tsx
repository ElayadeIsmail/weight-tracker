import { StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Spacing } from "@/constants/theme";
import { useThemeStore } from "@/store/theme-store";
import type { ThemePreference } from "@/types/profile";

const OPTIONS: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  return (
    <SurfaceCard>
      <Text type="subtitle">Appearance</Text>
      <Text type="small" themeColor="textSecondary">
        Choose light, dark, or follow your device setting.
      </Text>

      <SegmentedControl
        options={OPTIONS}
        value={preference}
        onChange={setPreference}
        equalWidth
        style={styles.control}
      />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  control: {
    marginTop: Spacing.one,
  },
});
