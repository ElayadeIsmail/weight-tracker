import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { useThemeStore } from "@/store/theme-store";

export function useResolvedColorScheme() {
  const preference = useThemeStore((state) => state.preference);
  const systemScheme = useColorScheme();

  if (preference === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }

  return preference;
}

export function useTheme() {
  const scheme = useResolvedColorScheme();
  return Colors[scheme];
}
