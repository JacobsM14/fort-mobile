// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".expo/*"],
  },
  {
    rules: {
      // The import groups of CLAUDE.md, with a blank line between them:
      // packages, components, hooks, services (features, db, modules and
      // constants, then the feature's own files by relative path), types,
      // utils, and styles last. The "@/" aliases aren't resolved here, so
      // they count as "unknown".
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            ["internal", "unknown"],
            ["parent", "sibling", "index"],
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/components/**",
              group: "unknown",
              position: "before",
            },
            {
              pattern: "@/{hooks/**,i18n}",
              group: "unknown",
              position: "before",
            },
            { pattern: "@/utils/**", group: "type", position: "after" },
            { pattern: "@/constants/theme", group: "type", position: "after" },
          ],
          // Type imports stay in their own group, whatever their path.
          pathGroupsExcludedImportTypes: ["builtin", "external", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
]);
