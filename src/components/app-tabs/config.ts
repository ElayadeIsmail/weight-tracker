import type { AndroidSymbol } from "expo-symbols";
import { unstable_getMaterialSymbolSourceAsync } from "expo-symbols";
import type { ImageSourcePropType } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

type TabConfig = {
  name: string;
  label: string;
  /** iOS SF Symbol */
  sf: SFSymbol;
  /** Android Material Symbol */
  md: AndroidSymbol;
};

/** Must stay in sync with plugins/with-android-tab-icon-size.js */
export const ANDROID_TAB_ICON_SIZE = 32;

export const TABS: TabConfig[] = [
  {
    name: "today",
    label: "Today",
    sf: "house.fill",
    md: "home_filled",
  },
  {
    name: "calories",
    label: "Calories",
    sf: "flame.fill",
    md: "local_fire_department",
  },
  {
    name: "history",
    label: "History",
    sf: "clock.fill",
    md: "history",
  },
  {
    name: "settings",
    label: "Settings",
    sf: "gearshape.fill",
    md: "settings",
  },
];

const androidIconCache = new Map<
  AndroidSymbol,
  Promise<ImageSourcePropType | null>
>();

/**
 * Expo's built-in `md` prop rasterizes Material Symbols at 24px. Generate a
 * larger source so icons stay sharp after the native itemIconSize override.
 */
export function getAndroidTabIconSource(name: AndroidSymbol) {
  let source = androidIconCache.get(name);
  if (!source) {
    source = unstable_getMaterialSymbolSourceAsync(
      name,
      ANDROID_TAB_ICON_SIZE,
      "white",
    );
    androidIconCache.set(name, source);
  }
  return source as unknown as ImageSourcePropType;
}
