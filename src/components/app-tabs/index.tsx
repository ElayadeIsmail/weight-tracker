import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { TABS, getAndroidTabIconSource } from "./config";

export default function AppTabs() {
  const colors = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.primaryMuted}
      iconColor={{
        default: colors.textSecondary,
        selected: colors.primary,
      }}
      labelStyle={{
        default: { color: colors.textSecondary },
        selected: { color: colors.primary },
      }}
    >
      {TABS.map(({ name, label, sf, md }) => (
        <NativeTabs.Trigger key={name} name={name}>
          <NativeTabs.Trigger.Label>{label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={sf}
            {...(Platform.OS === "android"
              ? { src: getAndroidTabIconSource(md) }
              : { md })}
          />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
