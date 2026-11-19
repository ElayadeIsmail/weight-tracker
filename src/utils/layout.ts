import type { EdgeInsets } from "react-native-safe-area-context";

import { BottomTabInset, Spacing } from "@/constants/theme";

/** Padding inside the scrollable content (status bar is handled outside). */
export function getScreenContentPadding(insets: EdgeInsets) {
  return {
    paddingTop: Spacing.four,
    paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
    paddingHorizontal: Spacing.four,
  };
}
