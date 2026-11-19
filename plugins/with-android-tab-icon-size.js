const {
  withDangerousMod,
  createRunOncePlugin,
} = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/** Must stay in sync with ANDROID_TAB_ICON_SIZE in src/components/app-tabs/config.ts */
const DEFAULT_SIZE_DP = 32;

/**
 * Material BottomNavigationView defaults to 24dp icons. Native Tabs wraps a
 * Material3 theme context, so app theme styles won't reach it — override the
 * library dimens instead.
 */
function withAndroidTabIconSize(config, props = {}) {
  const size = props.size ?? DEFAULT_SIZE_DP;

  return withDangerousMod(config, [
    "android",
    async (config) => {
      const valuesDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values",
      );
      await fs.promises.mkdir(valuesDir, { recursive: true });
      await fs.promises.writeFile(
        path.join(valuesDir, "native_tabs_icon_size.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
  <dimen name="design_bottom_navigation_icon_size" tools:override="true">${size}dp</dimen>
  <dimen name="mtrl_navigation_bar_item_default_icon_size" tools:override="true">${size}dp</dimen>
</resources>
`,
      );
      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withAndroidTabIconSize,
  "with-android-tab-icon-size",
  "1.0.0",
);
