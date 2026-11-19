const { withAndroidManifest } = require("expo/config-plugins");

const PORTRAIT = "android.hardware.screen.portrait";

module.exports = (config) =>
  withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest["uses-feature"] = [
      ...(manifest["uses-feature"] ?? []).filter(
        (feature) => feature.$["android:name"] !== PORTRAIT,
      ),
      { $: { "android:name": PORTRAIT, "android:required": "false" } },
    ];
    return config;
  });
