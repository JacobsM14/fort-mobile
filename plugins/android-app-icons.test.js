/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { AndroidConfig } from "expo/config-plugins";

import withAndroidAppIcons from "./android-app-icons";

const MAIN = "android.intent.action.MAIN";
const VIEW = "android.intent.action.VIEW";

function namedItems(names) {
  return names.map((name) => ({ $: { "android:name": name } }));
}

// The parts of the manifest prebuild generates that the plugin touches.
function generatedManifest() {
  return {
    manifest: {
      application: [
        {
          $: { "android:name": ".MainApplication" },
          activity: [
            {
              $: { "android:name": ".MainActivity" },
              "intent-filter": [
                {
                  action: namedItems([MAIN]),
                  category: namedItems(["android.intent.category.LAUNCHER"]),
                },
                {
                  action: namedItems([VIEW]),
                  category: namedItems([
                    "android.intent.category.DEFAULT",
                    "android.intent.category.BROWSABLE",
                  ]),
                  data: [{ $: { "android:scheme": "fortapp" } }],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

// Runs the plugin's manifest mod the way prebuild does, on the manifest given.
async function applyManifestMod(manifest) {
  const config = withAndroidAppIcons(
    { name: "Fort", slug: "fort", android: { package: "com.example.fort" } },
    { icons: ["blue"] },
  );
  const result = await config.mods.android.manifest({
    ...config,
    modResults: manifest,
    modRequest: {
      projectRoot: "/project",
      platformProjectRoot: "/project/android",
      platform: "android",
      modName: "manifest",
      introspect: true,
    },
  });
  return AndroidConfig.Manifest.getMainApplicationOrThrow(result.modResults);
}

function filterActions(component) {
  return (component["intent-filter"] ?? []).map(
    (filter) => filter.action[0].$["android:name"],
  );
}

describe("android-app-icons", () => {
  it("moves the launcher and link filters from MainActivity to every alias", async () => {
    const app = await applyManifestMod(generatedManifest());

    expect(filterActions(app.activity[0])).toEqual([]);
    expect(
      app["activity-alias"].map((alias) => alias.$["android:name"]),
    ).toEqual([
      "com.example.fort.MainActivityDefault",
      "com.example.fort.MainActivityBlue",
    ]);
    for (const alias of app["activity-alias"]) {
      expect(filterActions(alias)).toEqual([MAIN, VIEW]);
    }
  });

  it("keeps the filters when it runs again on a manifest it already changed", async () => {
    const once = await applyManifestMod(generatedManifest());
    const twice = await applyManifestMod({ manifest: { application: [once] } });

    for (const alias of twice["activity-alias"]) {
      expect(filterActions(alias)).toEqual([MAIN, VIEW]);
    }
  });

  it("fails instead of leaving the app without a launcher entry", async () => {
    const manifest = generatedManifest();
    delete manifest.manifest.application[0].activity[0]["intent-filter"];

    await expect(applyManifestMod(manifest)).rejects.toThrow(
      "no launcher intent filters",
    );
  });
});
