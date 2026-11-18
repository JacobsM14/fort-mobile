const {
  AndroidConfig,
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("fs"); // FILES
const path = require("path"); // PATH UTILITIES

const RES_SOURCE = "assets/app-icons/android/res";

// Detect and copy Android icon resources to the appropriate res directory
function withIconResources(config) {
  return withDangerousMod(config, [
    "android",
    (config) => {
      fs.cpSync(
        path.join(config.modRequest.projectRoot, RES_SOURCE),
        path.join(config.modRequest.platformProjectRoot, "app/src/main/res"),
        { recursive: true },
      );
      return config;
    },
  ]);
}

// Generate activity aliases for the Android app icons
function withIconAliases(config, icons) {
  return withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    const main = app.activity.find(
      (activity) => activity.$["android:name"] === ".MainActivity",
    );
    const aliases = [
      { name: "Default", icon: "ic_launcher" },
      ...icons.map((icon) => ({
        name: icon.charAt(0).toUpperCase() + icon.slice(1),
        icon: `ic_launcher_${icon}`,
      })),
    ];

    // Only the aliases can open the app, so the icon library never disables
    // MainActivity: AppCompat keeps recreating it when it's disabled.
    const filters = main["intent-filter"];
    delete main["intent-filter"];
    app["activity-alias"] = aliases.map(({ name, icon }) => ({
      $: {
        "android:name": `${config.android.package}.MainActivity${name}`,
        "android:targetActivity": ".MainActivity",
        "android:icon": `@mipmap/${icon}`,
        "android:roundIcon": `@mipmap/${icon}_round`,
        "android:enabled": name === "Default" ? "true" : "false",
        "android:exported": "true",
      },
      "intent-filter": filters,
    }));
    return config;
  });
}

module.exports = (config, { icons }) =>
  withIconAliases(withIconResources(config), icons);
